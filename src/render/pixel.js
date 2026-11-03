// ===== 像素風：低解析度繪製 → 有限調色盤 → 整數倍放大 =====
// art.js 的向量美術照常畫，只是先畫在每格 16 點的小畫布上，再把每個顏色換成調色盤裡最接近的一色。
// 畫布上的文字（招牌、標音）不跟著變成像素，而是記下來、放大後再用清楚的字畫上去，
// 學生才看得清楚中文。

/** 調色盤：每種色相一組由深到淺的色階，像素畫才有明暗又不會糊成漸層 */
export const COLORS = {
  ink: ['#1b2340', '#3d4766', '#6b7596', '#a9b3cc', '#e6eaf2', '#fffaf0'],
  green: ['#1f5a32', '#2f8a3e', '#4fae54', '#8bd36b', '#c6ec9a'],
  blue: ['#1d4f91', '#3a8fd9', '#7cc6f0', '#c9ecff'],
  teal: ['#0e7c74', '#14b3a4'],
  red: ['#8a1f24', '#c8372d', '#ff5b4a', '#ff9f8a'],
  yellow: ['#d9772b', '#ffc93c', '#fff1a8'],
  brown: ['#4a2e1f', '#7a5230', '#b07a4a', '#e2c08d', '#f3e3c3'],
  pink: ['#e2366f', '#ff8fb6'],
  purple: ['#7a5cc4'],
  skin: ['#ffd9b8'],
};
export const PALETTE = Object.values(COLORS).flat();
const RGB = PALETTE.map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
/** 美術的一格是 16 點 */
export const ART_TILE = 16;
// The main branch renders vector art at display resolution. Keep the pixel
// pipeline available for comparison with ?renderStyle=pixel, but make smooth
// rendering the default so outlines are anti-aliased like the baseline game.
export const SMOOTH_RENDER = typeof location === 'undefined'
  || new URLSearchParams(location.search).get('renderStyle') !== 'pixel';

// 最接近的顏色：依人眼對紅綠藍的敏感度加權（redmean），色相比較不會跑掉
const cache = new Map();
function nearest(r, g, b) {
  const key = (r >> 2) << 12 | (g >> 2) << 6 | (b >> 2);
  let i = cache.get(key);
  if (i === undefined) {
    let best = Infinity;
    for (let k = 0; k < RGB.length; k++) {
      const [pr, pg, pb] = RGB[k], rm = (r + pr) / 2, dr = r - pr, dg = g - pg, db = b - pb;
      const d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
      if (d < best) { best = d; i = k }
    }
    cache.set(key, i);
  }
  return i;
}
const nearestCss = (r, g, b) => PALETTE[nearest(r, g, b)];

/** 原地把畫布換成調色盤顏色，半透明一律變成全透明或全不透明 */
export function quantize(cv) {
  const g = cv.getContext('2d'), img = g.getImageData(0, 0, cv.width, cv.height), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) { d[i + 3] = 0; continue }
    const a = d[i + 3] / 255, s = RGB[nearest(Math.min(255, d[i] / a), Math.min(255, d[i + 1] / a), Math.min(255, d[i + 2] / a))];
    d[i] = s[0]; d[i + 1] = s[1]; d[i + 2] = s[2]; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return cv;
}

/* ---------- 攔截文字：小畫布上不畫字，只記下位置 ---------- */
function captureText(g) {
  const texts = [];
  const rec = (stroke) => function (text, x, y) {
    const t = this.getTransform();
    texts.push({ text, x, y, stroke, m: [t.a, t.b, t.c, t.d, t.e, t.f], font: this.font, align: this.textAlign, base: this.textBaseline,
      color: stroke ? this.strokeStyle : this.fillStyle, lw: this.lineWidth });
  };
  g.fillText = rec(false); g.strokeText = rec(true);
  return texts;
}
// 文字顏色也換成調色盤裡最接近的一色
function inkFor(css) {
  const c = String(css);
  if (c.startsWith('#')) {
    const x = c.length === 4 ? c.slice(1).split('').map(ch => ch + ch).join('') : c.slice(1, 7);
    return nearestCss(...[0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16)));
  }
  const m = c.match(/[\d.]+/g);
  return m ? nearestCss(+m[0], +m[1], +m[2]) : COLORS.ink[0];
}
function drawTexts(g, texts, k) {
  for (const t of texts) {
    g.save();
    g.setTransform(t.m[0] * k, t.m[1] * k, t.m[2] * k, t.m[3] * k, t.m[4] * k, t.m[5] * k);
    g.font = t.font; g.textAlign = t.align; g.textBaseline = t.base;
    if (t.stroke) { g.lineWidth = t.lw; g.strokeStyle = inkFor(t.color); g.lineJoin = 'round'; g.strokeText(t.text, t.x, t.y) }
    else { g.fillStyle = inkFor(t.color); g.fillText(t.text, t.x, t.y) }
    g.restore();
  }
}

/**
 * 先畫成 SS 倍大，再用最近鄰縮回來：每一點只會取到「輪廓」或「填色」其中之一，
 * 不會出現反鋸齒混出來的雜色邊。
 */
const SS = 4;
function shrink(big, w, h) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, w); cv.height = Math.max(1, h);
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.imageSmoothingEnabled = false;
  g.drawImage(big, 0, 0, cv.width, cv.height);
  return cv;
}

/** 低解析度畫布 + 攔截文字 */
function lowCanvas(w, h) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h));
  const g = cv.getContext('2d', { willReadFrequently: true });
  return { cv, g, texts: captureText(g) };
}
/** 把低解析度畫布放大 k 倍（最近鄰），再補上文字（文字座標乘上 tk） */
function upscale(low, texts, tk, k) {
  const out = document.createElement('canvas');
  out.width = low.width * k; out.height = low.height * k;
  const g = out.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(low, 0, 0, out.width, out.height);
  drawTexts(g, texts, tk);
  return out;
}

/**
 * 把一個 art.js 的貼圖產生器變成像素版。
 * make(arg, u, dpr) 照原本的寫法；回傳的產生器簽名一樣，放大倍數由畫面上的格子大小決定。
 */
export function pixelMaker(make) {
  return (arg, U, DPR) => {
    if (SMOOTH_RENDER) return make(arg, U, DPR);
    const k = Math.max(1, Math.round(U * DPR / ART_TILE));
    const { cv, texts } = withCapture(() => make(arg, ART_TILE * SS, 1));
    return upscale(quantize(shrink(cv, Math.round(cv.width / SS), Math.round(cv.height / SS))), texts, k / SS, k);
  };
}
// 產生器自己建立畫布，所以在建立期間暫時攔截 getContext('2d')
function withCapture(fn) {
  const proto = HTMLCanvasElement.prototype, orig = proto.getContext, all = [];
  proto.getContext = function (type, opts) {
    const c = orig.call(this, type, type === '2d' ? { ...opts, willReadFrequently: true } : opts);
    if (type === '2d' && c && !c.__captured) { c.__captured = true; all.push(captureText(c)) }
    return c;
  };
  let cv;
  try { cv = fn() } finally { proto.getContext = orig }
  return { cv, texts: all.flat() };
}

/** 地面：整張地圖一起處理；倍數 k 由 view 給的解析度決定 */
export function pixelGround(paint, U, gd, { native = false } = {}) {
  if (SMOOTH_RENDER) {
    if (!native) return paint(U, gd);
    const cv = paint(ART_TILE, 1);
    const scale = U * gd / ART_TILE;
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(cv.width * scale));
    out.height = Math.max(1, Math.round(cv.height * scale));
    const g = out.getContext('2d');
    g.imageSmoothingEnabled = true;
    g.drawImage(cv, 0, 0, out.width, out.height);
    return out;
  }
  const k = Math.max(1, Math.round(U * gd / ART_TILE));
  if (native) { const { cv, texts } = withCapture(() => paint(ART_TILE, 1)); return upscale(cv, texts, k, k) }
  const { cv, texts } = withCapture(() => paint(ART_TILE * SS, 1));
  return upscale(quantize(shrink(cv, Math.round(cv.width / SS), Math.round(cv.height / SS))), texts, k / SS, k);
}

/**
 * 直接畫在畫面上的畫布（對戰場景、過場動畫、預覽圖）：
 * draw(g, w, h) 用 CSS 像素座標作畫；實際先畫在 1/px 大小的小畫布上。
 */
export function renderPixel(target, cssW, cssH, dpr, px, draw) {
  if (SMOOTH_RENDER) {
    const W = Math.round(cssW * dpr), H = Math.round(cssH * dpr);
    if (target.width !== W || target.height !== H) { target.width = W; target.height = H }
    const out = target.getContext('2d');
    out.setTransform(dpr, 0, 0, dpr, 0, 0);
    out.imageSmoothingEnabled = true;
    out.clearRect(0, 0, cssW, cssH);
    draw(out, cssW, cssH);
    return;
  }
  const lw = Math.ceil(cssW / px), lh = Math.ceil(cssH / px);
  const { cv: big, g, texts } = lowCanvas(lw * SS, lh * SS);
  g.setTransform(SS / px, 0, 0, SS / px, 0, 0);
  draw(g, cssW, cssH);
  const cv = quantize(shrink(big, lw, lh));
  const W = Math.round(cssW * dpr), H = Math.round(cssH * dpr);
  if (target.width !== W || target.height !== H) { target.width = W; target.height = H }
  const out = target.getContext('2d');
  out.setTransform(1, 0, 0, 1, 0, 0);
  out.imageSmoothingEnabled = false;
  out.clearRect(0, 0, W, H);
  out.drawImage(cv, 0, 0, lw * px * dpr, lh * px * dpr);
  drawTexts(out, texts, px * dpr / SS);
}

/** HTML 裡的 SVG（徽章）：把每個顏色換成調色盤裡最接近的一色 */
export function paletteMarkup(markup) {
  if (SMOOTH_RENDER) return markup;
  return markup
    .replace(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, h => inkFor(h))
    .replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (_, r, g, b) => nearestCss(+r, +g, +b));
}
