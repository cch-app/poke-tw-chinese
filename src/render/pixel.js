// ===== 掌機像素風：低解析度繪製 → 四色調色盤 → 整數倍放大 =====
// art.js 的向量美術照常畫，只是先畫在每格 16 點的小畫布上，再把顏色收成四個綠色階。
// 畫布上的文字（招牌、標音）不跟著變成像素，而是記下來、放大後再用清楚的字畫上去，
// 學生才看得清楚中文。

/** 由亮到暗：底色、淺、深、輪廓 */
export const PALETTE = ['#e3efc4', '#9cc27a', '#4e7d55', '#1c3328'];
const RGB = PALETTE.map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
/** 美術的一格是 16 點 */
export const ART_TILE = 16;

// 亮度（加權），藍色系再暗一點，這樣水和草地不會變成同一個顏色
function level(r, g, b) {
  let l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (b > g + 15 && b > r + 30) l -= 0.18;
  if (r > g + 60 && r > b + 40) l -= 0.08;   // 紅屋頂、紅柱子比同亮度的綠色深一階
  return l;
}
const STEPS = [0.80, 0.55, 0.30];
const shadeOf = l => l > STEPS[0] ? 0 : l > STEPS[1] ? 1 : l > STEPS[2] ? 2 : 3;

const OUTLINE = [42, 34, 56];  // art.js 的輪廓色
const isOutline = (r, g, b) => Math.abs(r - OUTLINE[0]) + Math.abs(g - OUTLINE[1]) + Math.abs(b - OUTLINE[2]) < 60;

/**
 * 原地把畫布收成四色，半透明一律變成全透明或全不透明。
 * adaptive：依這張圖自己的明暗排序分配三個淺色階（輪廓固定最暗），
 * 人物、動物這種顏色偏暗的小圖才不會整片變黑。
 */
export function quantize(cv, adaptive = false) {
  const g = cv.getContext('2d'), img = g.getImageData(0, 0, cv.width, cv.height), d = img.data;
  let cut = null;
  if (adaptive) {
    const ls = [];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] >= 128) { const a = d[i + 3] / 255, r = d[i] / a, gg = d[i + 1] / a, b = d[i + 2] / a; if (!isOutline(r, gg, b)) ls.push(level(r, gg, b)) }
    ls.sort((x, y) => x - y);
    if (ls.length > 8) cut = [ls[Math.floor(ls.length * .62)], ls[Math.floor(ls.length * .25)]];
  }
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) { d[i + 3] = 0; continue }
    const a = d[i + 3] / 255, r = d[i] / a, gg = d[i + 1] / a, b = d[i + 2] / a, l = level(r, gg, b);
    const k = cut ? (isOutline(r, gg, b) || l < .12 ? 3 : l >= cut[0] ? 0 : l >= cut[1] ? 1 : 2) : shadeOf(l);
    const s = RGB[k];
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
// 文字顏色也收進調色盤；描邊用來襯底，所以一律用最淺色
function inkFor(css, stroke) {
  if (stroke) return PALETTE[0];
  const m = String(css).match(/\d+/g);
  if (!m) return PALETTE[3];
  const [r, g, b] = String(css).startsWith('#') ? [1, 3, 5].map(i => parseInt(String(css).slice(i, i + 2), 16)) : m.map(Number);
  return level(r, g, b) > 0.55 ? PALETTE[0] : PALETTE[3];
}
function drawTexts(g, texts, k) {
  for (const t of texts) {
    g.save();
    g.setTransform(t.m[0] * k, t.m[1] * k, t.m[2] * k, t.m[3] * k, t.m[4] * k, t.m[5] * k);
    g.font = t.font; g.textAlign = t.align; g.textBaseline = t.base;
    if (t.stroke) { g.lineWidth = t.lw; g.strokeStyle = inkFor(t.color, true); g.lineJoin = 'round'; g.strokeText(t.text, t.x, t.y) }
    else { g.fillStyle = inkFor(t.color, false); g.fillText(t.text, t.x, t.y) }
    g.restore();
  }
}

/** 低解析度畫布 + 攔截文字 */
function lowCanvas(w, h) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h));
  const g = cv.getContext('2d', { willReadFrequently: true });
  return { cv, g, texts: captureText(g) };
}
/** 把低解析度畫布放大 k 倍（最近鄰），再補上文字 */
function upscale(low, texts, k) {
  const out = document.createElement('canvas');
  out.width = low.width * k; out.height = low.height * k;
  const g = out.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(low, 0, 0, out.width, out.height);
  drawTexts(g, texts, k);
  return out;
}

/**
 * 把一個 art.js 的貼圖產生器變成像素版。
 * make(arg, u, dpr) 照原本的寫法；回傳的產生器簽名一樣，放大倍數由畫面上的格子大小決定。
 */
export function pixelMaker(make, { adaptive = false } = {}) {
  return (arg, U, DPR) => {
    const k = Math.max(1, Math.round(U * DPR / ART_TILE));
    const { cv, texts } = withCapture(() => make(arg, ART_TILE, 1));
    return upscale(quantize(cv, adaptive), texts, k);
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
  const k = Math.max(1, Math.round(U * gd / ART_TILE));
  const { cv, texts } = withCapture(() => paint(ART_TILE, 1));
  return upscale(native ? cv : quantize(cv), texts, k);
}

/**
 * 直接畫在畫面上的畫布（對戰場景、過場動畫、預覽圖）：
 * draw(g, w, h) 用 CSS 像素座標作畫；實際先畫在 1/px 大小的小畫布上。
 */
export function renderPixel(target, cssW, cssH, dpr, px, draw, { adaptive = false } = {}) {
  const lw = Math.ceil(cssW / px), lh = Math.ceil(cssH / px);
  const { cv, g, texts } = lowCanvas(lw, lh);
  g.setTransform(1 / px, 0, 0, 1 / px, 0, 0);
  draw(g, cssW, cssH);
  quantize(cv, adaptive);
  const W = Math.round(cssW * dpr), H = Math.round(cssH * dpr);
  if (target.width !== W || target.height !== H) { target.width = W; target.height = H }
  const out = target.getContext('2d');
  out.setTransform(1, 0, 0, 1, 0, 0);
  out.imageSmoothingEnabled = false;
  out.clearRect(0, 0, W, H);
  out.drawImage(cv, 0, 0, lw * px * dpr, lh * px * dpr);
  drawTexts(out, texts, px * dpr);
}

/** HTML 裡的 SVG（徽章、地圖選單）：把每個顏色換成調色盤裡最接近的色階 */
export function paletteMarkup(markup) {
  return markup
    .replace(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, h => {
      const x = h.length === 4 ? h.slice(1).split('').map(c => c + c).join('') : h.slice(1);
      const [r, g, b] = [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16));
      return PALETTE[shadeOf(level(r, g, b))];
    })
    .replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (_, r, g, b) => PALETTE[shadeOf(level(+r, +g, +b))]);
}
