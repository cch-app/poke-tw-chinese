// ===== 世界畫面：攝影機、貼圖快取、依深度排序的繪製清單 =====
// 和遊戲內容無關：地面怎麼畫由 setScene() 的 scene 決定，畫面上有什麼由每格的 describe() 決定。
//
// scene: { w, h（格數）, background（CSS 顏色）, tileSize(vw, vh) → 每格像素, paint(u, dpr) → 地面畫布 }
// describe(v, now, arg): 呼叫 v.sprite(...) 把東西放進清單；v.U、v.DPR、v.cam 可以讀。

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const byDepth = (a, b) => a.depth - b.depth || a.seq - b.seq;

export function createView(canvas, backend) {
  let scene = null, ground = null;
  let U = 48, DPR = 1, VW = 0, VH = 0;
  let sprites = new Map();
  const failed = new Set();

  /* ---------- 繪製清單：物件重複使用，每格不配置新物件 ---------- */
  const pool = [], list = [];
  const cam = { x: 0, y: 0, w: 0, h: 0 };
  const v = {
    U, DPR, cam,
    /** make(arg, U, DPR) 只在快取沒有 key 時呼叫一次，回傳畫布。x、y、w、h 是地圖像素。 */
    sprite(key, make, arg, x, y, w, h, depth, alpha = 1, effects = 0) {
      let tex = sprites.get(key);
      if (!tex) {
        if (failed.has(key)) return;
        try { tex = backend.createTexture(make(arg, U, DPR)) }
        catch (e) { failed.add(key); console.error(`sprite "${key}" failed`, e); return }
        sprites.set(key, tex);
      }
      let it = pool[list.length];
      if (!it) it = pool[list.length] = {};
      it.tex = tex; it.x = x; it.y = y; it.w = w; it.h = h; it.depth = depth;
      it.alpha = alpha; it.effects = effects; it.seq = list.length;
      list.push(it);
    },
  };

  /* ---------- 貼圖 ---------- */
  function clearSprites() { sprites.forEach(t => backend.destroyTexture(t)); sprites = new Map(); failed.clear() }
  function repaint() {
    if (ground) { backend.destroyTexture(ground); ground = null }
    clearSprites();
    if (!scene) return;
    const gd = Math.min(DPR, Math.sqrt(8e6 / (scene.w * U * scene.h * U)));
    ground = backend.createTexture(scene.paint(U, gd));
  }

  /* ---------- 尺寸 ---------- */
  function measure() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    VW = canvas.clientWidth; VH = canvas.clientHeight;
    backend.resize(VW, VH, DPR);
  }
  /** 視窗大小改變時呼叫；格子大小變了才重畫。 */
  function fit() {
    measure();
    if (!scene) return;
    const u = scene.tileSize(VW, VH);
    if (u !== U || !ground) { U = u; repaint() }
  }

  backend.onContextRestored(repaint);

  return {
    get backend() { return backend.name },
    fit,
    /** 換地圖：只畫一次地面。 */
    setScene(s) { scene = s; measure(); U = s.tileSize(VW, VH); repaint() },
    /** 設定或字型改變時重畫所有貼圖。 */
    invalidate: repaint,
    /** fx、fy 是攝影機要對準的格子座標（可以有小數）。 */
    frame(now, fx, fy, describe, arg) {
      const bg = scene ? scene.background : '#1b2340';
      if (!scene || !ground) { backend.begin(bg, 0, 0, VW, VH); backend.end(); return }
      const mw = scene.w * U, mh = scene.h * U;
      let cx = fx * U + U / 2 - VW / 2, cy = fy * U + U / 2 - VH / 2;
      cx = mw < VW ? (mw - VW) / 2 : clamp(cx, 0, mw - VW);
      cy = mh < VH ? (mh - VH) / 2 : clamp(cy, 0, mh - VH);
      cam.x = Math.round(cx); cam.y = Math.round(cy); cam.w = VW; cam.h = VH;
      v.U = U; v.DPR = DPR;

      list.length = 0;
      describe(v, now, arg);
      list.sort(byDepth);

      backend.begin(bg, cam.x, cam.y, VW, VH);
      backend.draw(ground, 0, 0, mw, mh, 1, 0);
      for (const it of list) backend.draw(it.tex, it.x, it.y, it.w, it.h, it.alpha, it.effects);
      backend.end();
    },
    start: backend.start,
  };
}
