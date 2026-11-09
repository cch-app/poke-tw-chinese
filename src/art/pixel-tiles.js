// ===== 像素地面：直接用調色盤畫 16×16 的地塊 =====
// 草地、花、路（每座城一種路面）、泥土地、高草叢、水，各有固定的小花紋，整張地圖看起來像一格一格拼起來的。
import { GT, rng } from '../art.js';
import { COLORS as C } from '../render/pixel.js';

// 地塊用到的顏色（都在調色盤裡）
const GRASS = C.green[3], GRASS_HIGHLIGHT = C.green[4], TUFT = C.green[2], TALL = C.green[1], BLADE_EDGE = C.green[0], BLADE = C.green[3];
const DIRT = C.brown[3], PEBBLE = C.brown[2];
const WATER = C.blue[1], RIPPLE = C.blue[2], BANK = C.brown[1], FOAM = C.blue[3];
const SAND = C.brown[4], SAND_DOT = C.brown[3], SHELL = C.ink[5];
// 山壁用偏暖的灰色，看起來是砂岩、頁岩而不是水泥
const PLANK = C.brown[2], PLANK_GAP = C.brown[1], ROCK = '#9c968a', ROCK_DARK = '#787264', ROCK_LIT = '#c4beb0', ROCK_EDGE = '#4e493e', MOSS = C.green[2];
const PETALS = [C.ink[5], C.pink[1], C.yellow[1], C.red[2]], POLLEN = C.yellow[0];
const T = 16;
const isPath = t => t === GT.PB || t === GT.PD || t === GT.PR;

/* ---------- 單一地塊（x0、y0 是左上角像素） ---------- */
function px(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1) }
function pixelBlade(g, x, baseY, height, lean, color) {
  for (let i = 0; i < height; i++) {
    const bx = x + Math.round((lean * i) / Math.max(1, height - 1));
    px(g, bx, baseY - i, color);
  }
}
function grass(g, x0, y0, r) {
  g.fillStyle = GRASS; g.fillRect(x0, y0, T, T);
  // Natural grass reads as uneven clumps: a little ground shadow, then
  // blades with different heights and lean instead of repeated symbols.
  const tufts = 2 + Math.floor(r() * 2);
  for (let i = 0; i < tufts; i++) {
    const x = x0 + 2 + Math.floor(r() * 11);
    const baseY = y0 + 13 - Math.floor(r() * 3);
    const height = 3 + Math.floor(r() * 3);
    px(g, x, baseY, TUFT);
    pixelBlade(g, x, baseY, height, -1, TUFT);
    pixelBlade(g, x + 1, baseY, Math.max(2, height - 1), 1, BLADE_EDGE);
    if (r() < .55) pixelBlade(g, x + 2, baseY, Math.max(2, height - 2), -1, GRASS_HIGHLIGHT);
  }
  // Sparse low blades break up large flat patches without making the tile noisy.
  if (r() < .7) {
    const x = x0 + 1 + Math.floor(r() * 14), y = y0 + 14 - Math.floor(r() * 3);
    pixelBlade(g, x, y, 2 + Math.floor(r() * 2), r() < .5 ? -1 : 1, TUFT);
  }
}
function flowers(g, x0, y0, r) {
  grass(g, x0, y0, r);
  for (const [fx, fy] of [[3, 4], [10, 9]]) {
    const x = x0 + fx + Math.floor(r() * 2), y = y0 + fy, c = PETALS[Math.floor(r() * PETALS.length)];
    px(g, x + 1, y, c); px(g, x, y + 1, c); px(g, x + 2, y + 1, c); px(g, x + 1, y + 2, c); px(g, x + 1, y + 1, POLLEN);
  }
}
// 路面：每座城一種，同一座城裡所有的路都長一樣
//   石板、紅磚、柏油、圓石、砂岩方磚、編籃紋磚
const ROADS = [
  { base: C.ink[4], joint: C.ink[3], draw: (g, x0, y0, j) => {
    for (let row = 0; row < 2; row++) { const y = y0 + row * 8 + 7; g.fillStyle = j; g.fillRect(x0, y, T, 1); g.fillRect(x0 + (row ? 4 : 12), y0 + row * 8, 1, 7) } } },
  { base: C.brown[2], joint: C.brown[1], draw: (g, x0, y0, j) => {
    g.fillStyle = j; for (let row = 0; row < 4; row++) { const y = y0 + row * 4 + 3; g.fillRect(x0, y, T, 1); const off = row % 2 ? 4 : 0; for (let x = off; x < T; x += 8) g.fillRect(x0 + x, y0 + row * 4, 1, 3) } } },
  { base: C.ink[2], joint: C.ink[4], draw: (g, x0, y0, j, r) => {
    for (let i = 0; i < 7; i++) px(g, x0 + Math.floor(r() * 16), y0 + Math.floor(r() * 16), i % 2 ? C.ink[1] : C.ink[3]) } },
  { base: C.ink[2], joint: C.ink[1], draw: (g, x0, y0, j) => {
    for (const [cx, cy] of [[1, 1], [9, 1], [5, 5], [13, 5], [1, 9], [9, 9], [5, 13], [13, 13]]) { g.fillStyle = C.ink[3]; g.fillRect(x0 + cx, y0 + cy, 6, 2); g.fillStyle = C.ink[4]; g.fillRect(x0 + cx + 1, y0 + cy, 4, 1) } } },
  { base: C.brown[3], joint: C.brown[2], draw: (g, x0, y0, j) => {
    g.fillStyle = j; g.fillRect(x0, y0 + 7, T, 1); g.fillRect(x0, y0 + 15, T, 1); g.fillRect(x0 + 7, y0, 1, T); g.fillRect(x0 + 15, y0, 1, T) } },
  { base: C.brown[4], joint: C.brown[2], draw: (g, x0, y0, j) => {
    g.fillStyle = j; for (let by = 0; by < T; by += 8) for (let bx = 0; bx < T; bx += 8) {
      g.fillRect(x0 + bx, y0 + by, 8, 1); g.fillRect(x0 + bx, y0 + by, 1, 8);
      if ((bx + by) % 16) g.fillRect(x0 + bx + 4, y0 + by, 1, 8); else g.fillRect(x0 + bx, y0 + by + 4, 8, 1) } } },
];
export const roadStyle = ci => ROADS[((ci % ROADS.length) + ROADS.length) % ROADS.length];
function pavement(g, x0, y0, road, r) {
  g.fillStyle = road.base; g.fillRect(x0, y0, T, T);
  road.draw(g, x0, y0, road.joint, r);
}
function dirt(g, x0, y0, r) {
  g.fillStyle = DIRT; g.fillRect(x0, y0, T, T);
  for (let i = 0; i < 3; i++) px(g, x0 + 1 + Math.floor(r() * 14), y0 + 1 + Math.floor(r() * 14), PEBBLE);
}
/** 高草叢：深色底，四束草葉；front=true 時只畫下半部，蓋在人物腳上 */
export function tallGrass(g, x0, y0, front = false) {
  if (!front) { g.fillStyle = TALL; g.fillRect(x0, y0, T, T) }
  const variant = ((x0 * 13 + y0 * 7) >>> 0) % 3;
  const clumps = [[0, 0], [8, 0], [0, 8], [8, 8]];
  clumps.forEach(([bx, by], index) => {
    if (front && by === 0) return;
    const x = x0 + bx, y = y0 + by;
    if (front) { g.fillStyle = TALL; g.fillRect(x, y + 3, 8, 5) }
    const baseY = y + 7;
    const lift = (variant + index) % 2;
    // Dark rear blades establish depth; the lighter blades sit in front.
    pixelBlade(g, x + 2, baseY, 5 + lift, -1, BLADE_EDGE);
    pixelBlade(g, x + 4, baseY, 6 - lift, 0, TUFT);
    pixelBlade(g, x + 6, baseY, 4 + lift, 1, BLADE_EDGE);
    pixelBlade(g, x + 4, baseY - 1, 3, 1, BLADE);
    if ((variant + index) % 3 === 0) pixelBlade(g, x + 1, baseY, 3, -1, GRASS_HIGHLIGHT);
    g.fillStyle = BLADE_EDGE; g.fillRect(x + 1, y + 7, 6, 1);
  });
}
// 沙灘：淺沙底，幾粒深一點的沙和小貝殼
function sand(g, x0, y0, r) {
  g.fillStyle = SAND; g.fillRect(x0, y0, T, T);
  for (let i = 0; i < 4; i++) px(g, x0 + 1 + Math.floor(r() * 14), y0 + 1 + Math.floor(r() * 14), SAND_DOT);
  if (r() < .2) { const x = x0 + 3 + Math.floor(r() * 9), y = y0 + 3 + Math.floor(r() * 9); px(g, x, y, SHELL); px(g, x + 1, y, SHELL); px(g, x, y + 1, SAND_DOT) }
}
// 碼頭木棧道：橫向木板，板縫錯開
function pier(g, x0, y0) {
  g.fillStyle = PLANK; g.fillRect(x0, y0, T, T); g.fillStyle = PLANK_GAP;
  for (let row = 0; row < 4; row++) { const y = y0 + row * 4 + 3; g.fillRect(x0, y, T, 1); g.fillRect(x0 + (row % 2 ? 5 : 11), y0 + row * 4, 1, 3) }
}
// 山壁：用不規則岩面、受光面、裂隙和下緣陰影組成，比單色磚塊更接近真實山壁。
function rock(g, x0, y0, r, t) {
  g.fillStyle = ROCK; g.fillRect(x0, y0, T, T);
  const facets = [
    [[0, 2], [6, 1], [10, 5], [7, 9], [1, 8]],
    [[8, 1], [15, 3], [14, 9], [9, 7], [6, 5]],
    [[2, 9], [8, 8], [14, 11], [12, 15], [1, 15]],
  ];
  facets.forEach((points, i) => {
    g.beginPath(); points.forEach(([px, py], n) => n ? g.lineTo(x0 + px, y0 + py) : g.moveTo(x0 + px, y0 + py)); g.closePath();
    g.fillStyle = [ROCK_LIT, ROCK, ROCK_DARK][i]; g.fill();
  });
  // Tiny chips make the faces feel weathered instead of perfectly tiled.
  const chips = 2 + Math.floor(r() * 2);
  for (let i = 0; i < chips; i++) {
    const x = x0 + 2 + Math.floor(r() * 12), y = y0 + 2 + Math.floor(r() * 12);
    px(g, x, y, i % 2 ? ROCK_DARK : ROCK_LIT);
    if (r() < .45) px(g, x + 1, y, i % 2 ? ROCK_DARK : ROCK);
  }
  // Broken horizontal strata and small diagonal cracks add scale without
  // changing the neighboring terrain tiles.
  for (let i = 0; i < 2; i++) {
    const y = y0 + 4 + Math.floor(r() * 8), x = x0 + Math.floor(r() * 5), len = 4 + Math.floor(r() * 6);
    g.strokeStyle = i ? ROCK_EDGE : ROCK_LIT; g.lineWidth = 1; g.beginPath();
    g.moveTo(x, y); g.lineTo(x + len, y - (i ? 1 : 0)); g.stroke();
    if (i) { g.beginPath(); g.moveTo(x + len * .55, y - 1); g.lineTo(x + len * .7, y - 3); g.stroke() }
  }
  if (r() < .32) { g.fillStyle = MOSS; const x = x0 + 2 + Math.floor(r() * 10), y = y0 + 2 + Math.floor(r() * 8); g.fillRect(x, y, 3, 1); g.fillRect(x + 1, y - 1, 2, 1) }
  g.fillStyle = ROCK_EDGE;
  if (t.top) { g.fillRect(x0, y0, T, 1); g.fillStyle = ROCK_LIT; g.fillRect(x0 + 1, y0 + 1, T - 2, 1); g.fillStyle = ROCK_EDGE }
  if (t.left) g.fillRect(x0, y0, 1, T);
  if (t.right) g.fillRect(x0 + T - 1, y0, 1, T);
  if (t.bottom) { g.fillStyle = ROCK_DARK; g.fillRect(x0, y0 + T - 5, T, 4); g.fillStyle = ROCK_EDGE; g.fillRect(x0, y0 + T - 1, T, 1) }
}
function water(g, x0, y0, t) {
  g.fillStyle = WATER; g.fillRect(x0, y0, T, T);
  g.fillStyle = RIPPLE;
  g.fillRect(x0 + 2, y0 + 4, 4, 1); g.fillRect(x0 + 6, y0 + 3, 2, 1);
  g.fillRect(x0 + 9, y0 + 11, 4, 1); g.fillRect(x0 + 13, y0 + 10, 2, 1);
  // 岸邊：上緣一條深色岸線（沙灘旁邊是淺色浪花）
  if (t.top) { g.fillStyle = t.beach ? FOAM : BANK; g.fillRect(x0, y0, T, 2) }
  g.fillStyle = FOAM;
  if (t.bottom) g.fillRect(x0, y0 + T - 1, T, 1);
  if (t.left) g.fillRect(x0, y0, 1, T);
  if (t.right) g.fillRect(x0 + T - 1, y0, 1, T);
}

/** 整張城鎮地面，16 點一格，直接用調色盤的顏色 */
export function paintPixelTown(m, ci) {
  const H = m.length, W = m[0].length, cv = document.createElement('canvas');
  cv.width = W * T; cv.height = H * T;
  const g = cv.getContext('2d'), r = rng(ci * 977 + 5), road = roadStyle(ci);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = m[y][x], x0 = x * T, y0 = y * T, at = (dx, dy) => m[y + dy]?.[x + dx];
    if (t === GT.PB) pavement(g, x0, y0, road, r);
    else if (t === GT.PD) dirt(g, x0, y0, r);
    else if (t === GT.TG) tallGrass(g, x0, y0);
    else if (t === GT.WA) water(g, x0, y0, { top: at(0, -1) !== GT.WA && at(0, -1) !== GT.PR && at(0, -1) !== undefined, bottom: at(0, 1) !== GT.WA, left: at(-1, 0) !== GT.WA, right: at(1, 0) !== GT.WA, beach: at(0, -1) === GT.SA });
    else if (t === GT.SA) sand(g, x0, y0, r);
    else if (t === GT.PR) pier(g, x0, y0);
    else if (t === GT.RK) rock(g, x0, y0, r, { top: at(0, -1) !== GT.RK && at(0, -1) !== undefined, bottom: at(0, 1) !== GT.RK && at(0, 1) !== undefined, left: at(-1, 0) !== GT.RK && at(-1, 0) !== undefined, right: at(1, 0) !== GT.RK && at(1, 0) !== undefined });
    else if (t === GT.FL) flowers(g, x0, y0, r);
    else grass(g, x0, y0, r);
    // 草地和路的交界：路的那一側描一條深一點的路肩
    if (isPath(t)) {
      g.fillStyle = t === GT.PB ? road.joint : t === GT.PR ? PLANK_GAP : PEBBLE;
      if (!isPath(at(0, -1)) && at(0, -1) !== undefined) g.fillRect(x0, y0, T, 1);
      if (!isPath(at(0, 1)) && at(0, 1) !== undefined) g.fillRect(x0, y0 + T - 1, T, 1);
      if (!isPath(at(-1, 0)) && at(-1, 0) !== undefined) g.fillRect(x0, y0, 1, T);
      if (!isPath(at(1, 0)) && at(1, 0) !== undefined) g.fillRect(x0 + T - 1, y0, 1, T);
    }
  }
  return cv;
}
