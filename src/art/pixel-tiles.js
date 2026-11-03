// ===== 像素地面：直接用調色盤畫 16×16 的地塊 =====
// 草地、花、石板路、泥土路、高草叢、水，各有固定的小花紋，整張地圖看起來像一格一格拼起來的。
import { GT, rng } from '../art.js';
import { COLORS as C } from '../render/pixel.js';

// 地塊用到的顏色（都在調色盤裡）
const GRASS = C.green[3], TUFT = C.green[2], TALL = C.green[1], BLADE_EDGE = C.green[0], BLADE = C.green[3];
const STONE = C.ink[4], JOINT = C.ink[3], DIRT = C.brown[3], PEBBLE = C.brown[2];
const WATER = C.blue[1], RIPPLE = C.blue[2], BANK = C.brown[1], FOAM = C.blue[3];
const PETALS = [C.ink[5], C.pink[1], C.yellow[1], C.red[2]], POLLEN = C.yellow[0];
const T = 16;
const isPath = t => t === GT.PB || t === GT.PD;

/* ---------- 單一地塊（x0、y0 是左上角像素） ---------- */
function px(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1) }
function grass(g, x0, y0, r) {
  g.fillStyle = GRASS; g.fillRect(x0, y0, T, T);
  // 兩三撮小草：「v」字
  const n = 1 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const x = x0 + 2 + Math.floor(r() * 11), y = y0 + 3 + Math.floor(r() * 10);
    px(g, x, y, TUFT); px(g, x + 1, y + 1, TUFT); px(g, x + 2, y, TUFT);
  }
}
function flowers(g, x0, y0, r) {
  grass(g, x0, y0, r);
  for (const [fx, fy] of [[3, 4], [10, 9]]) {
    const x = x0 + fx + Math.floor(r() * 2), y = y0 + fy, c = PETALS[Math.floor(r() * PETALS.length)];
    px(g, x + 1, y, c); px(g, x, y + 1, c); px(g, x + 2, y + 1, c); px(g, x + 1, y + 2, c); px(g, x + 1, y + 1, POLLEN);
  }
}
function pavement(g, x0, y0) {
  g.fillStyle = STONE; g.fillRect(x0, y0, T, T);
  // 錯開的石板縫
  g.fillStyle = JOINT;
  for (let row = 0; row < 2; row++) {
    const y = y0 + row * 8 + 7; g.fillRect(x0, y, T, 1);
    const off = row ? 4 : 12; g.fillRect(x0 + off, y0 + row * 8, 1, 7);
  }
}
function dirt(g, x0, y0, r) {
  g.fillStyle = DIRT; g.fillRect(x0, y0, T, T);
  for (let i = 0; i < 3; i++) px(g, x0 + 1 + Math.floor(r() * 14), y0 + 1 + Math.floor(r() * 14), PEBBLE);
}
/** 高草叢：深色底，四束草葉；front=true 時只畫下半部，蓋在人物腳上 */
export function tallGrass(g, x0, y0, front = false) {
  if (!front) { g.fillStyle = TALL; g.fillRect(x0, y0, T, T) }
  for (const [bx, by] of [[0, 0], [8, 0], [0, 8], [8, 8]]) {
    if (front && by === 0) continue;
    const x = x0 + bx, y = y0 + by;
    if (front) { g.fillStyle = TALL; g.fillRect(x, y + 2, 8, 6) }
    // 一束三片草葉：外框最暗、葉面淺色
    g.fillStyle = BLADE_EDGE;
    g.fillRect(x + 1, y + 2, 1, 5); g.fillRect(x + 3, y + 1, 1, 6); g.fillRect(x + 5, y + 2, 1, 5); g.fillRect(x + 1, y + 7, 6, 1);
    g.fillStyle = BLADE;
    g.fillRect(x + 2, y + 3, 1, 3); g.fillRect(x + 4, y + 2, 1, 4); g.fillRect(x + 6, y + 3, 1, 3);
  }
}
function water(g, x0, y0, t) {
  g.fillStyle = WATER; g.fillRect(x0, y0, T, T);
  g.fillStyle = RIPPLE;
  g.fillRect(x0 + 2, y0 + 4, 4, 1); g.fillRect(x0 + 6, y0 + 3, 2, 1);
  g.fillRect(x0 + 9, y0 + 11, 4, 1); g.fillRect(x0 + 13, y0 + 10, 2, 1);
  // 岸邊：上緣一條深色岸線
  if (t.top) { g.fillStyle = BANK; g.fillRect(x0, y0, T, 2) }
  g.fillStyle = FOAM;
  if (t.bottom) g.fillRect(x0, y0 + T - 1, T, 1);
  if (t.left) g.fillRect(x0, y0, 1, T);
  if (t.right) g.fillRect(x0 + T - 1, y0, 1, T);
}

/** 整張城鎮地面，16 點一格，直接用調色盤的顏色 */
export function paintPixelTown(m, ci) {
  const H = m.length, W = m[0].length, cv = document.createElement('canvas');
  cv.width = W * T; cv.height = H * T;
  const g = cv.getContext('2d'), r = rng(ci * 977 + 5);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = m[y][x], x0 = x * T, y0 = y * T, at = (dx, dy) => m[y + dy]?.[x + dx];
    if (t === GT.PB) pavement(g, x0, y0);
    else if (t === GT.PD) dirt(g, x0, y0, r);
    else if (t === GT.TG) tallGrass(g, x0, y0);
    else if (t === GT.WA) water(g, x0, y0, { top: at(0, -1) !== GT.WA, bottom: at(0, 1) !== GT.WA, left: at(-1, 0) !== GT.WA, right: at(1, 0) !== GT.WA });
    else if (t === GT.FL) flowers(g, x0, y0, r);
    else grass(g, x0, y0, r);
    // 草地和路的交界：路的那一側描一條深一點的路肩
    if (isPath(t)) {
      g.fillStyle = t === GT.PB ? JOINT : PEBBLE;
      if (!isPath(at(0, -1)) && at(0, -1) !== undefined) g.fillRect(x0, y0, T, 1);
      if (!isPath(at(0, 1)) && at(0, 1) !== undefined) g.fillRect(x0, y0 + T - 1, T, 1);
      if (!isPath(at(-1, 0)) && at(-1, 0) !== undefined) g.fillRect(x0, y0, 1, T);
      if (!isPath(at(1, 0)) && at(1, 0) !== undefined) g.fillRect(x0 + T - 1, y0, 1, T);
    }
  }
  return cv;
}
