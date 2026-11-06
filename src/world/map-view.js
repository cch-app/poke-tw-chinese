// ===== 地圖畫面：把地圖資料轉成 view.js 的繪製清單 =====
// 新的物件類型只要在 OBJECTS 加一個項目，不用改繪圖引擎。
import { CITIES } from '../data/index.js';
import {
  OUT, GT, BLD, FEX, VENTS, rr, mkc, paintInterior,
  spriteTree, spriteLamp, spriteSign, spriteArch, spriteBuilding, spriteFurn, spriteTable, spriteChair, drawChar, emblemImage,
} from '../art.js';
import { COLORS, pixelGround, pixelMaker as px } from '../render/pixel.js';
import { paintPixelTown, tallGrass } from '../art/pixel-tiles.js';

// 美術一格 16 點；畫面上的格子取 16 的倍數，像素才會整齊
const tileStep = (v, a, b) => Math.max(a, Math.min(b, v));
const BG_TOWN = COLORS.green[1], BG_IN = COLORS.ink[0];

/* ---------- 徽章圖（SVG 載入完要重畫道館） ---------- */
const emblems = [];
function emblem(ci, onLoad) {
  if (!emblems[ci]) { const img = emblemImage(ci); img.addEventListener('load', () => onLoad(ci)); emblems[ci] = img }
  return emblems[ci];
}

/** 地面與尺寸；onAsset 在非同步圖片載入後呼叫（應該重畫）。 */
export function sceneFor(map, onAsset) {
  const indoor = map.kind === 'in', city = CITIES[map.ci];
  const img = emblem(map.ci, onAsset);
  return {
    w: map.w, h: map.h,
    background: indoor ? BG_IN : BG_TOWN,
    tileSize: (vw, vh) => indoor ? tileStep(Math.min(vw / 8.5, vh / 9.5), 48, 80) : tileStep(Math.min(vw / 12, vh / 9), 32, 64),
    // 城鎮地面直接用調色盤畫；室內有家具和招牌字，畫好再收成四色
    paint: (u, gd) => indoor ? pixelGround((t, d) => paintInterior(map, t, d, city, img), u, gd)
      : pixelGround(() => paintPixelTown(map.g, map.ci), u, gd, { native: true }),
  };
}

/* ---------- 貼圖產生器（靜態函式，每格不建立閉包） ---------- */
const cur = { map: null, city: null, emblem: null };  // 這一格的地圖資訊（給上面的產生器用）
const makeTree = px((kind, u, dpr) => spriteTree(kind, u, dpr));
const makeBld = px((o, u, dpr) => spriteBuilding(o.kind, u, dpr, cur.city, cur.emblem, o.brand));
const makeLamp = px((_, u, dpr) => spriteLamp(u, dpr));
const makeSign = px((col, u, dpr) => spriteSign(u, dpr, col));
const makeArch = px((_, u, dpr) => spriteArch(u, dpr, cur.city));
const makeFurn = px((f, u, dpr) => spriteFurn(f, cur.map.bk, u, dpr, cur.city));
const makeTable = px((_, u, dpr) => spriteTable(u, dpr));
const makeChair = px((_, u, dpr) => spriteChair(u, dpr));
const makeGrass = px((_, u, dpr) => { const c = mkc(u, u, dpr); tallGrass(c.getContext('2d'), 0, 0, true); return c });
const makeShimmer = (_, u, dpr) => { const c = mkc(u * .34, u * .08, dpr), g = c.getContext('2d');
  g.strokeStyle = COLORS.blue[3]; g.lineWidth = u * .04; g.lineCap = 'round'; g.beginPath(); g.moveTo(u * .02, u * .04); g.lineTo(u * .32, u * .04); g.stroke(); return c };
const makeBubble = px((_, u, dpr) => { const c = mkc(u * .5, u * .54, dpr), g = c.getContext('2d'), m = u * .05;
  rr(g, m, m, u * .4, u * .44, u * .12); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 2; g.strokeStyle = OUT; g.stroke();
  g.fillStyle = '#ff5b4a'; g.font = `900 ${u * .36}px sans-serif`; g.textAlign = 'center'; g.fillText('!', m + u * .2, m + u * .34); return c });
// 煙和熱氣：一顆柔邊的圓，畫的時候改變大小和透明度
const makePuff = px((kind, u, dpr) => { const r = u * .5, c = mkc(r * 2, r * 2, dpr), g = c.getContext('2d'), gr = g.createRadialGradient(r * .8, r * .75, r * .1, r, r, r);
  const [a, m, b] = kind === 'smoke' ? ['rgba(246,247,249,1)', 'rgba(168,175,188,.9)', 'rgba(140,148,162,0)'] : ['rgba(255,255,255,1)', 'rgba(214,226,238,.85)', 'rgba(214,226,238,0)'];
  gr.addColorStop(0, a); gr.addColorStop(.5, a); gr.addColorStop(.82, m); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2); return c });
// 每個出口同時有好幾顆在往上飄：剛冒出來小而淡，往上越來越大、被風吹偏，最後散掉
function vent(v, now, x, y, kind, seed, depth) {
  const U = v.U, smoke = kind === 'smoke', n = smoke ? 10 : 7, life = smoke ? 3400 : 2600, rise = smoke ? 2.4 : 1.4;
  for (let i = 0; i < n; i++) {
    const p = ((now + seed * 977) / life + i / n) % 1, fade = p < .06 ? p / .06 : 1 - (p - .06) / .94;
    const r = U * (smoke ? .16 + p * .44 : .09 + p * .2), sway = Math.sin(p * 5 + i * 1.7 + seed) * U * (smoke ? .12 : .08);
    const cx = x + sway + p * U * (smoke ? .55 : .15), cy = y - p * U * rise;
    v.sprite('puff-' + kind, makePuff, kind, cx - r, cy - r, r * 2, r * 2, depth, Math.max(0, fade) * .95, FX_NONE);
  }
}
const makeStepDust = px((_, u, dpr) => { const cv = mkc(u, u * .32, dpr), g = cv.getContext('2d');
  g.lineCap = 'round'; g.strokeStyle = 'rgba(92,77,57,.52)'; g.lineWidth = Math.max(1, u * .035);
  [[.2,.2,.12],[.42,.12,.09],[.68,.18,.13],[.82,.1,.07]].forEach(([x,y,r]) => { g.beginPath(); g.arc(x*u,y*u,r*u,Math.PI*1.05,Math.PI*1.85); g.stroke() }); return cv });
const makeGrassKick = px((_, u, dpr) => { const cv = mkc(u, u * .46, dpr), g = cv.getContext('2d');
  g.lineCap = 'round'; [['#287a38',.22,-.16],['#45a64b',.42,.12],['#67c75a',.62,-.08],['#369342',.8,.15]].forEach(([col,x,lean]) => {
    g.strokeStyle = col; g.lineWidth = u * .06; g.beginPath(); g.moveTo(x*u,u*.43); g.quadraticCurveTo((x+lean*.4)*u,u*.22,(x+lean)*u,u*.06); g.stroke() }); return cv });

/* ---------- 人物：每種外觀×方向×步伐一張貼圖 ---------- */
const DIR_I = { up: 0, down: 1, left: 2, right: 3 };
const charSprites = new WeakMap();
let lookSeq = 0;
function charSprite(look, dir, step) {
  let a = charSprites.get(look);
  if (!a) { a = { id: ++lookSeq, v: [] }; charSprites.set(look, a) }
  const i = DIR_I[dir] * 3 + step + 1;
  return a.v[i] || (a.v[i] = { key: `char-${a.id}-${dir}${step}`, look, dir, step });
}
const makeChar = px((c, u, dpr) => { const s = u * 1.05, cv = mkc(s * 1.4, s * 1.85, dpr);
  drawChar(cv.getContext('2d'), s * .7, s * 1.75, s, c.look, c.dir, c.step, true); return cv });
function drawActor(v, tx, ty, look, dir, step, depth) {
  const U = v.U, s = U * 1.05, w = s * 1.4, top = s * 1.75, c = charSprite(look, dir, step);
  v.sprite(c.key, makeChar, c, (tx + .5) * U - w / 2, (ty + 1) * U - U * .06 - top, w, top + s * .1, depth);
}
// Lighting/shadow flags are interpreted by the WebGL backend. The Canvas fallback safely ignores them.
const FX_NONE = 0, FX_LIGHT = FX_NONE;  // 像素風不打光、不投影
function grassFront(v, x, y, depth) { v.sprite('tgf', makeGrass, null, x * v.U, y * v.U, v.U, v.U, depth, 1, FX_LIGHT) }
const stepOf = n => !n.mv || n.mv.t <= .18 || n.mv.t >= .82 ? 0 : n.mv.t < .5 ? -1 : 1;
const posX = n => n.mv ? n.mv.fx + (n.mv.tx - n.mv.fx) * n.mv.t : n.x;
const posY = n => n.mv ? n.mv.fy + (n.mv.ty - n.mv.fy) * n.mv.t : n.y;

/* ---------- 物件類型 ---------- */
const keys = new WeakMap();
const keyOf = (o, make) => keys.get(o) || (keys.set(o, make(o)), keys.get(o));
const OBJECTS = {
  tree(v, o) { const U = v.U, bx = o.x * U, by = (o.y + 1) * U;
    if (bx - v.cam.x < -2 * U || bx - v.cam.x > v.cam.w + U || by - v.cam.y < -U || by - v.cam.y > v.cam.h + 3 * U) return;
    v.sprite(keyOf(o, o => 'tree-' + o.kind), makeTree, o.kind, bx + U / 2 - U, by - 2.42 * U, 2 * U, 2.5 * U, by) },
  bld(v, o) { const U = v.U, b = BLD[o.kind], by = (o.y + b.h) * U;
    v.sprite(keyOf(o, o => `bld-${o.kind}-${o.brand || 'local'}`), makeBld, o, o.x * U, by - (b.h + b.ex) * U, b.w * U, (b.h + b.ex) * U, by);
    (VENTS[o.kind] || []).forEach((p, i) => vent(v, v.now, (o.x + p.x) * U, by - (b.h + b.ex - p.y) * U, p.kind, o.x * 7 + o.y * 13 + i, o.y * U)) },  // 排在建築最後一排：人物站在建築前面時不會被煙蓋住
  lamp(v, o) { const U = v.U, by = (o.y + 1) * U; v.sprite('lamp', makeLamp, null, o.x * U, by - 2 * U, U, 2 * U, by) },
  sign(v, o) { const U = v.U, by = (o.y + 1) * U;
    v.sprite(keyOf(o, o => 'sign-' + o.what), makeSign, o.what === 'gym' ? cur.city.roof : '#14b3a4', o.x * U, by - 1.12 * U, U, 1.2 * U, by) },
  arch(v, o) { const U = v.U, by = (o.y + 1) * U; v.sprite('arch', makeArch, null, o.x * U, by - 2.6 * U, 4 * U, 2.6 * U, by + U * .1) },
};

/**
 * 每格呼叫一次。
 * st: { map, player: { x, y, dir, step, moving }, look, trainerLook(t), bubble }
 */
export function describeMap(v, now, st) {
  const map = st.map, U = v.U;
  cur.map = map; cur.city = CITIES[map.ci]; cur.emblem = emblems[map.ci]; v.now = now;

  // 水面閃光
  const x0 = Math.max(0, Math.floor(v.cam.x / U)), y0 = Math.max(0, Math.floor(v.cam.y / U));
  const x1 = Math.min(map.w - 1, Math.ceil((v.cam.x + v.cam.w) / U)), y1 = Math.min(map.h - 1, Math.ceil((v.cam.y + v.cam.h) / U));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (map.g[y][x] === GT.WA) {
    const ph = (now / 500 + x * .7 + y * 1.3) % (Math.PI * 2);
    // 掌機沒有半透明：波光一閃一閃，位置對齊美術像素
    if (Math.sin(ph) < .2) continue;
    const p = U / 16, sx = Math.round((x * U + U * .23 + Math.cos(ph) * U * .08) / p) * p;
    v.sprite('shimmer', makeShimmer, null, sx, y * U + U * .44, U * .34, U * .08, -1e9, 1, FX_NONE);
  }

  for (const o of map.objs) { const f = OBJECTS[o.type]; if (f) f(v, o) }

  for (const t of map.trainers) {
    const tx = posX(t), ty = posY(t), depth = (ty + 1) * U;
    drawActor(v, tx, ty, st.trainerLook(t), t.dir, stepOf(t), depth);
    const gx = Math.round(tx), gy = Math.round(ty);
    if (map.g[gy]?.[gx] === GT.TG) grassFront(v, gx, gy, depth);
    if (st.bubble && st.bubble.t === t) v.sprite('bubble', makeBubble, null, (tx + .5) * U - U * .25, depth - U * 2.02, U * .5, U * .54, depth, 1, FX_NONE);
  }
  if (map.kind === 'in') {
    for (const f of map.furn) { if (f.t === 'platform') continue; const ex = FEX[f.t] || .5, by = (f.y + f.h) * U;
      const make = f.t === 'table' ? makeTable : f.t === 'chair' ? makeChair : makeFurn;
      v.sprite(keyOf(f, f => `f-${f.t}${f.w}x${f.h}-${f.x},${f.y}`), make, f, f.x * U, by - (f.h + ex) * U, f.w * U, (f.h + ex) * U, by - .5) }
    for (const n of map.walkers || []) { const ty = posY(n); drawActor(v, posX(n), ty, n.look, n.dir, stepOf(n), (ty + 1) * U) }
  }
  for (const n of map.npcs || []) drawActor(v, n.x, n.y, n.look, n.dir, 0, (n.y + 1) * U);

  const p = st.player, depth = (p.y + 1) * U + .5;
  if (p.moving && p.step) {
    const gx = Math.round(p.x), gy = Math.round(p.y), ground = map.g[gy]?.[gx];
    if (ground === GT.TG) v.sprite('grass-kick', makeGrassKick, null, (p.x + .5) * U - U * .5, depth - U * .34, U, U * .46, depth - 1, 1, FX_NONE);
    else if (ground === GT.PD || ground === GT.PB) v.sprite('step-dust', makeStepDust, null, (p.x + .5) * U - U * .5, depth - U * .13, U, U * .32, depth - 1, 1, FX_NONE);
  }
  drawActor(v, p.x, p.y, st.look, p.dir, p.step, depth);
  const gx = Math.round(p.x), gy = Math.round(p.y);
  if (!p.moving && map.g[gy]?.[gx] === GT.TG) grassFront(v, gx, gy, depth);
}
