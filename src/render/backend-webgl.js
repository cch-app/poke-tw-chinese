// ===== 繪圖後端：WebGL（PlayCanvas） =====
// 每張貼圖畫成一個方塊；用正交攝影機，世界座標＝地圖像素（y 軸向上翻轉）。
import {
  AppBase, AppOptions, WebglGraphicsDevice, CameraComponentSystem, Color,
  FILLMODE_NONE, RESOLUTION_AUTO, PROJECTION_ORTHOGRAPHIC, GAMMA_NONE, TONEMAP_NONE,
  Entity, Layer, SORTMODE_MANUAL, Mesh, MeshInstance, GraphNode, ShaderMaterial, Texture,
  SEMANTIC_POSITION, SEMANTIC_TEXCOORD0, BLEND_PREMULTIPLIED, CULLFACE_NONE,
  PIXELFORMAT_RGBA8, FILTER_LINEAR, ADDRESS_CLAMP_TO_EDGE,
} from 'playcanvas';

/* ---------- 著色器：貼圖＋柔和的左上方日光（預乘 alpha） ---------- */
const SHADER = {
  uniqueName: 'worldSprite',
  attributes: { aPosition: SEMANTIC_POSITION, aUv0: SEMANTIC_TEXCOORD0 },
  vertexGLSL: `
    attribute vec3 aPosition;
    attribute vec2 aUv0;
    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;
    varying vec2 vUv;
    void main(void) {
      vUv = aUv0;
      gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);
    }`,
  fragmentGLSL: `
    uniform sampler2D uTex;
    uniform float uOpacity;
    uniform float uLit;
    varying vec2 vUv;
    void main(void) {
      vec4 texel = texture2D(uTex, vUv);
      float sun = clamp((1.0 - vUv.y) * 0.7 + (1.0 - vUv.x) * 0.3, 0.0, 1.0);
      float light = mix(1.0, mix(0.88, 1.08, sun), uLit);
      gl_FragColor = vec4(min(texel.rgb * light, vec3(texel.a)), texel.a) * uOpacity;
    }`,
};

/* 把原貼圖的輪廓壓扁在腳下，做成便宜但穩定的接觸陰影。 */
const SHADOW_SHADER = {
  uniqueName: 'worldSpriteShadow',
  attributes: { aPosition: SEMANTIC_POSITION, aUv0: SEMANTIC_TEXCOORD0 },
  vertexGLSL: SHADER.vertexGLSL,
  fragmentGLSL: `
    uniform sampler2D uTex;
    uniform float uOpacity;
    varying vec2 vUv;
    void main(void) {
      float alpha = texture2D(uTex, vUv).a * uOpacity;
      vec3 color = vec3(0.055, 0.075, 0.09) * alpha;
      gl_FragColor = vec4(color, alpha);
    }`,
};

/** 沒有 WebGL 時會丟出錯誤，由 createBackend() 改用 2D 後端。 */
export function createWebglBackend(canvas) {
  // 只載入需要的部分（攝影機），整包 Application 會多出好幾 MB
  const device = new WebglGraphicsDevice(canvas, { alpha: false, antialias: true, depth: false, stencil: false });
  if (!device.gl) throw new Error('WebGL unavailable');
  const opts = new AppOptions();
  opts.graphicsDevice = device;
  opts.componentSystems = [CameraComponentSystem];
  const app = new AppBase(canvas);
  app.init(opts);
  app.setCanvasFillMode(FILLMODE_NONE);
  app.setCanvasResolution(RESOLUTION_AUTO);

  // 所有東西都在同一個圖層，用 drawOrder 依呼叫順序畫（排序由 view.js 負責）
  const layer = new Layer({ name: 'World', opaqueSortMode: SORTMODE_MANUAL, transparentSortMode: SORTMODE_MANUAL });
  app.scene.layers.push(layer);

  const cam = new Entity('camera');
  cam.addComponent('camera', {
    projection: PROJECTION_ORTHOGRAPHIC, layers: [layer.id],
    gammaCorrection: GAMMA_NONE, toneMapping: TONEMAP_NONE, nearClip: .1, farClip: 100,
  });
  app.root.addChild(cam);

  // 單位方塊：左下角 (0,0)、右上角 (1,1)；畫布上緣對到 v=0
  const quad = new Mesh(device);
  quad.setPositions([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]);
  quad.setUvs(0, [0, 1, 1, 1, 1, 0, 0, 0]);
  quad.setIndices([0, 1, 2, 0, 2, 3]);
  quad.update();

  const mats = new Map(), shadowMats = new Map(), colors = new Map(), pool = [];
  let used = 0, pixelRatio = 1;
  const snap = value => Math.round(value * pixelRatio) / pixelRatio;

  function material(tex) {
    let m = mats.get(tex);
    if (!m) {
      m = new ShaderMaterial(SHADER);
      m.blendType = BLEND_PREMULTIPLIED; m.depthTest = false; m.depthWrite = false; m.cull = CULLFACE_NONE;
      m.setParameter('uTex', tex); m.update();
      mats.set(tex, m);
    }
    return m;
  }
  function shadowMaterial(tex) {
    let m = shadowMats.get(tex);
    if (!m) {
      m = new ShaderMaterial(SHADOW_SHADER);
      m.blendType = BLEND_PREMULTIPLIED; m.depthTest = false; m.depthWrite = false; m.cull = CULLFACE_NONE;
      m.setParameter('uTex', tex); m.update();
      shadowMats.set(tex, m);
    }
    return m;
  }
  function color(css) {
    let c = colors.get(css);
    if (!c) { c = new Color().fromString(css); colors.set(css, c) }
    return c;
  }

  return {
    name: 'webgl',
    createTexture(cv) {
      const tex = new Texture(device, {
        width: cv.width, height: cv.height, format: PIXELFORMAT_RGBA8, mipmaps: false, premultiplyAlpha: true,
        // Preserve authored edges when the orthographic camera lands between CSS pixels.
        minFilter: FILTER_LINEAR, magFilter: FILTER_LINEAR, addressU: ADDRESS_CLAMP_TO_EDGE, addressV: ADDRESS_CLAMP_TO_EDGE,
      });
      tex.setSource(cv);
      return tex;
    },
    destroyTexture(tex) {
      const m = mats.get(tex);
      if (m) { m.destroy(); mats.delete(tex) }
      const sm = shadowMats.get(tex);
      if (sm) { sm.destroy(); shadowMats.delete(tex) }
      tex.destroy();
    },
    resize(cssW, cssH, dpr) { pixelRatio = dpr; device.maxPixelRatio = dpr; app.updateCanvasSize() },
    begin(clear, cx, cy, w, h) {
      used = 0;
      cam.camera.clearColor = color(clear);
      cam.camera.orthoHeight = h / 2;
      cam.setLocalPosition(snap(cx + w / 2), snap(-(cy + h / 2)), 10);
    },
    draw(tex, x, y, w, h, alpha, effects = 0) {
      let q = pool[used];
      if (!q) {
        const node = new GraphNode();
        const mi = new MeshInstance(quad, material(tex), node);
        const shadowNode = new GraphNode();
        const shadowMi = new MeshInstance(quad, material(tex), shadowNode);
        mi.cull = false;
        shadowMi.cull = false;
        layer.addMeshInstances([shadowMi, mi]);
        q = pool[used] = { node, mi, shadowNode, shadowMi };
      }
      const order = used++ * 2;
      const castsShadow = (effects & 2) !== 0;
      q.mi.material = material(tex);
      q.mi.drawOrder = order + 1;
      q.mi.visible = true;
      q.mi.setParameter('uOpacity', alpha);
      q.mi.setParameter('uLit', effects & 1 ? 1 : 0);
      q.node.setLocalPosition(snap(x), snap(-(y + h)), 0);
      q.node.setLocalScale(snap(w), snap(h), 1);
      q.shadowMi.drawOrder = order;
      q.shadowMi.visible = castsShadow;
      if (castsShadow) {
        q.shadowMi.material = shadowMaterial(tex);
        q.shadowMi.setParameter('uOpacity', alpha * .22);
        q.shadowNode.setLocalPosition(snap(x + w * .08), snap(-(y + h)), 0);
        q.shadowNode.setLocalScale(snap(w * .92), snap(h * .18), 1);
      }
    },
    end() { for (let i = used; i < pool.length; i++) { pool[i].mi.visible = false; pool[i].shadowMi.visible = false } },
    // GPU 重置後貼圖要重畫；PlayCanvas 會自己恢復裝置
    onContextRestored(fn) { device.on('devicerestored', fn) },
    start(onFrame) { app.on('update', () => onFrame(performance.now())); app.start() },
  };
}
