// ===== 地圖畫面：把地圖資料轉成 view.js 的繪製清單 =====
// 新的物件類型只要在 OBJECTS 加一個項目，不用改繪圖引擎。
import { CITIES } from '../data/index.js';
import {
  OUT, GT, BLD, FEX, rng, rr, mkc, paintGround, paintInterior, drawTallGrass,
  spriteTree, spriteLamp, spriteSign, spriteArch, spriteBuilding, spriteFurn, drawChar, emblemImage,
} from '../art.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const BG_TOWN = '#2f7a3a', BG_IN = '#1b2340';

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
    tileSize: (vw, vh) => indoor ? clamp(Math.floor(Math.min(vw / 8.5, vh / 9.5)), 40, 72) : clamp(Math.floor(Math.min(vw / 12, vh / 9)), 34, 64),
    paint: (u, dpr) => indoor ? paintInterior(map, u, dpr, city, img) : paintGround(map.g, map.ci, u, dpr),
  };
}

/* ---------- 貼圖產生器（靜態函式，每格不建立閉包） ---------- */
const cur = { map: null, city: null, emblem: null };  // 這一格的地圖資訊（給上面的產生器用）
const makeTree = (kind, u, dpr) => spriteTree(kind, u, dpr);
const makeBld = (kind, u, dpr) => spriteBuilding(kind, u, dpr, cur.city, cur.emblem);
const makeLamp = (_, u, dpr) => spriteLamp(u, dpr);
const makeSign = (col, u, dpr) => spriteSign(u, dpr, col);
const makeArch = (_, u, dpr) => spriteArch(u, dpr, cur.city);
const makeFurn = (f, u, dpr) => spriteFurn(f, cur.map.bk, u, dpr, cur.city);
const makeGrass = (_, u, dpr) => { const c = mkc(u, u, dpr); drawTallGrass(c.getContext('2d'), 0, 0, u, rng(3), true); return c };
const makeShimmer = (_, u, dpr) => { const c = mkc(u * .34, u * .08, dpr), g = c.getContext('2d');
  g.strokeStyle = '#fff'; g.lineWidth = u * .04; g.lineCap = 'round'; g.beginPath(); g.moveTo(u * .02, u * .04); g.lineTo(u * .32, u * .04); g.stroke(); return c };
const makeBubble = (_, u, dpr) => { const c = mkc(u * .5, u * .54, dpr), g = c.getContext('2d'), m = u * .05;
  rr(g, m, m, u * .4, u * .44, u * .12); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 2; g.strokeStyle = OUT; g.stroke();
  g.fillStyle = '#ff5b4a'; g.font = `900 ${u * .36}px sans-serif`; g.textAlign = 'center'; g.fillText('!', m + u * .2, m + u * .34); return c };

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
const makeChar = (c, u, dpr) => { const s = u * 1.05, cv = mkc(s * 1.4, s * 1.85, dpr); drawChar(cv.getContext('2d'), s * .7, s * 1.75, s, c.look, c.dir, c.step); return cv };
function drawActor(v, tx, ty, look, dir, step, depth) {
  const U = v.U, s = U * 1.05, w = s * 1.4, top = s * 1.75, c = charSprite(look, dir, step);
  v.sprite(c.key, makeChar, c, (tx + .5) * U - w / 2, (ty + 1) * U - U * .06 - top, w, top + s * .1, depth);
}
function grassFront(v, x, y, depth) { v.sprite('tgf', makeGrass, null, x * v.U, y * v.U, v.U, v.U, depth) }
const stepOf = n => n.mv && n.mv.t > .25 && n.mv.t < .75 ? 1 : 0;
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
    v.sprite(keyOf(o, o => 'bld-' + o.kind), makeBld, o.kind, o.x * U, by - (b.h + b.ex) * U, b.w * U, (b.h + b.ex) * U, by) },
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
  cur.map = map; cur.city = CITIES[map.ci]; cur.emblem = emblems[map.ci];

  // 水面閃光
  const x0 = Math.max(0, Math.floor(v.cam.x / U)), y0 = Math.max(0, Math.floor(v.cam.y / U));
  const x1 = Math.min(map.w - 1, Math.ceil((v.cam.x + v.cam.w) / U)), y1 = Math.min(map.h - 1, Math.ceil((v.cam.y + v.cam.h) / U));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (map.g[y][x] === GT.WA) {
    const ph = (now / 500 + x * .7 + y * 1.3) % (Math.PI * 2);
    v.sprite('shimmer', makeShimmer, null, x * U + U * .23 + Math.sin(ph) * U * .08, y * U + U * .41, U * .34, U * .08, -1e9, .25 + .25 * Math.sin(ph));
  }

  for (const o of map.objs) { const f = OBJECTS[o.type]; if (f) f(v, o) }

  for (const t of map.trainers) {
    const tx = posX(t), ty = posY(t), depth = (ty + 1) * U;
    drawActor(v, tx, ty, st.trainerLook(t), t.dir, stepOf(t), depth);
    const gx = Math.round(tx), gy = Math.round(ty);
    if (map.g[gy]?.[gx] === GT.TG) grassFront(v, gx, gy, depth);
    if (st.bubble && st.bubble.t === t) v.sprite('bubble', makeBubble, null, (tx + .5) * U - U * .25, depth - U * 2.02, U * .5, U * .54, depth);
  }
  if (map.kind === 'in') {
    for (const f of map.furn) { if (f.t === 'platform') continue; const ex = FEX[f.t] || .5, by = (f.y + f.h) * U;
      v.sprite(keyOf(f, f => `f-${f.t}${f.w}x${f.h}-${f.x},${f.y}`), makeFurn, f, f.x * U, by - (f.h + ex) * U, f.w * U, (f.h + ex) * U, by - .5) }
    for (const n of map.walkers || []) { const ty = posY(n); drawActor(v, posX(n), ty, n.look, n.dir, stepOf(n), (ty + 1) * U) }
  }
  for (const n of map.npcs || []) drawActor(v, n.x, n.y, n.look, n.dir, 0, (n.y + 1) * U);

  const p = st.player, depth = (p.y + 1) * U + .5;
  drawActor(v, p.x, p.y, st.look, p.dir, p.step, depth);
  const gx = Math.round(p.x), gy = Math.round(p.y);
  if (!p.moving && map.g[gy]?.[gx] === GT.TG) grassFront(v, gx, gy, depth);
}
