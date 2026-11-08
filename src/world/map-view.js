// ===== 地圖畫面：把地圖資料轉成 view.js 的繪製清單 =====
// 新的物件類型只要在 OBJECTS 加一個項目，不用改繪圖引擎。
import { CITIES } from '../data/index.js';
import {
  OUT, GT, BLD, FEX, VENTS, rr, mkc, paintInterior,
  spriteTree, spriteLamp, spriteSign, spriteArch, spriteBuilding, spriteFurn, spriteTable, spriteChair, drawChar, emblemImage,
} from '../art.js';
import { COLORS, pixelGround, pixelMaker as px } from '../render/pixel.js';
import { paintPixelTown, tallGrass } from '../art/pixel-tiles.js';
import { weatherAt } from './weather.js';

// 美術一格 16 點；畫面上的格子取 16 的倍數，像素才會整齊
const tileStep = (v, a, b) => Math.max(a, Math.min(b, v));
const BG_TOWN = COLORS.green[1], BG_IN = COLORS.ink[0];

function makeWeatherOverlay(arg, dpr){
  const {w,h,weather,frame}=arg;
  const cv=mkc(w,h,dpr),g=cv.getContext('2d');
  const tint={night:'rgba(10,20,62,.62)',dawn:'rgba(255,174,104,.12)',sunset:'rgba(255,103,47,.2)',dusk:'rgba(72,56,112,.3)',scorching:'rgba(255,155,44,.12)'}[weather.phase];
  if(tint){g.fillStyle=tint;g.fillRect(0,0,w,h)}
  if(weather.phase==='dawn'||weather.phase==='sunset'){
    const warm=g.createLinearGradient(0,0,0,h);
    warm.addColorStop(0,weather.phase==='dawn'?'rgba(255,201,112,.18)':'rgba(255,106,56,.25)');
    warm.addColorStop(.55,'rgba(255,188,100,.06)');warm.addColorStop(1,'rgba(45,60,110,.12)');
    g.fillStyle=warm;g.fillRect(0,0,w,h);
  }
  if(weather.kind==='sunny'){
    const glow=g.createRadialGradient(w*.78,h*.12,0,w*.78,h*.12,Math.max(w,h)*.62);
    glow.addColorStop(0,'rgba(255,238,166,.22)');glow.addColorStop(1,'rgba(255,238,166,0)');g.fillStyle=glow;g.fillRect(0,0,w,h);
  }
  if(weather.kind==='cloudy'){
    g.fillStyle='rgba(170,190,208,.12)';g.fillRect(0,0,w,h);
  }
  if(weather.kind==='rain'||weather.kind==='storm'){
    g.fillStyle=weather.kind==='storm'?'rgba(30,42,72,.15)':'rgba(74,122,170,.08)';g.fillRect(0,0,w,h);
    g.strokeStyle=weather.kind==='storm'?'rgba(190,220,255,.62)':'rgba(210,238,255,.48)';
    g.lineWidth=Math.max(1,w*.0018);g.lineCap='round';
    const count=weather.kind==='storm'?Math.ceil(w/12):Math.ceil(w/20);
    for(let i=0;i<count;i++){
      const x=((i*47+frame*13)%(w+40))-20;
      const y=((i*71+frame*29)%(h+40))-20;
      g.beginPath();g.moveTo(x,y);g.lineTo(x-w*.018,y+h*.075);g.stroke();
    }
  }
  if(weather.phase==='night'){
    // Crescent moon and sparse stars make nighttime legible even when the
    // two-hour weather roll is cloudy. The cloud/rain overlay remains on top.
    const mx=w*.82,my=h*.16,mr=Math.max(11,Math.min(w,h)*.045);
    g.save();g.globalAlpha=(weather.kind==='cloudy'||weather.kind==='storm')?.58:.92;
    g.fillStyle='#fff4c2';g.beginPath();g.arc(mx,my,mr,0,Math.PI*2);g.fill();
    g.globalCompositeOperation='destination-out';g.beginPath();g.arc(mx+mr*.38,my-mr*.2,mr*.9,0,Math.PI*2);g.fill();g.restore();
    g.fillStyle='rgba(244,248,255,.7)';
    for(let i=0;i<Math.ceil(w/80);i++)g.fillRect((i*83+frame*2)%w,(i*47)%Math.max(1,h),Math.max(1,w*.002),Math.max(1,w*.002));
  }
  return cv;
}

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
const makeOceanWave = (arg, u, dpr) => { const c = mkc(u * .9, u * .58, dpr), g = c.getContext('2d');
  const shift = arg.phase * u * .16; g.lineCap = 'round';
  [[.16,.25,.2],[.48,.48,.28],[.76,.72,.17]].forEach(([x,y,len],i)=>{g.strokeStyle=i===1?'rgba(220,249,255,.66)':'rgba(164,225,246,.54)';g.lineWidth=Math.max(1,u*.035);g.beginPath();
    g.moveTo(x*u+shift-len*u,y*u);g.quadraticCurveTo(x*u+shift,y*u-u*.07,x*u+shift+len*u,y*u);g.stroke()});
  return c };
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
// 木橋：橫向木板加兩側欄杆，蓋在溪上的小路
const makeBridge = px((o, u, dpr) => { const w = o.w * u, h = o.h * u, pad = u * .14, c = mkc(w + pad * 2, h + pad * 2, dpr), g = c.getContext('2d'), lw = Math.max(1, u * .03);
  g.fillStyle = 'rgba(20,40,60,.25)'; g.fillRect(pad + u * .06, pad + u * .08, w, h);
  rr(g, pad, pad - u * .04, w, h + u * .08, u * .04); g.fillStyle = '#9a6a3e'; g.fill(); g.lineWidth = lw; g.strokeStyle = OUT; g.stroke();
  for (let y = 0; y < h; y += u * .25) { rr(g, pad + u * .06, pad + y + u * .02, w - u * .12, u * .2, u * .03); g.fillStyle = y / (u * .25) % 2 ? '#c4935e' : '#b8844f'; g.fill() }
  [pad - u * .02, pad + w - u * .1].forEach(x => { g.fillStyle = '#6b4226'; g.fillRect(x, pad - u * .12, u * .12, h + u * .24); g.strokeStyle = OUT; g.lineWidth = lw; g.strokeRect(x, pad - u * .12, u * .12, h + u * .24);
    for (let y = 0; y <= h; y += u * .5) { rr(g, x - u * .03, pad + y - u * .16, u * .18, u * .18, u * .04); g.fillStyle = '#4a2e1f'; g.fill() } });
  return c });
// 海邊的東西：條紋海灘傘、停在碼頭邊的漁船、碼頭盡頭紅白相間的燈塔
const HUES = [['#ff5b4a', '#fff6e0'], ['#3a8fd9', '#fff6e0'], ['#ffc93c', '#14b3a4']];
const makeParasol = px((hue, u, dpr) => { const c = mkc(u, u * 1.7, dpr), g = c.getContext('2d'), lw = Math.max(1, u * .03), by = u * 1.62, top = u * .45, [a, b] = HUES[hue % 3];
  g.fillStyle = 'rgba(80,60,30,.22)'; g.beginPath(); g.ellipse(u * .55, by - u * .04, u * .42, u * .1, 0, 0, Math.PI * 2); g.fill();
  rr(g, u * .12, by - u * .2, u * .5, u * .16, u * .04); g.fillStyle = b; g.fill(); g.fillStyle = a; g.fillRect(u * .12, by - u * .14, u * .5, u * .05);
  g.strokeStyle = '#6b4226'; g.lineWidth = u * .05; g.beginPath(); g.moveTo(u * .5, top); g.lineTo(u * .5, by - u * .05); g.stroke();
  for (let k = 0; k < 6; k++) { const a0 = Math.PI + k * Math.PI / 6, a1 = a0 + Math.PI / 6; g.beginPath(); g.moveTo(u * .5, top - u * .02); g.arc(u * .5, top + u * .18, u * .46, a0, a1); g.closePath(); g.fillStyle = k % 2 ? a : b; g.fill(); g.lineWidth = lw; g.strokeStyle = OUT; g.stroke() }
  g.beginPath(); g.arc(u * .5, top - u * .03, u * .05, 0, Math.PI * 2); g.fillStyle = a; g.fill(); g.stroke(); return c });
const makeBoat = px((hue, u, dpr) => { const w = u * 2, c = mkc(w, u * 1.5, dpr), g = c.getContext('2d'), lw = Math.max(1, u * .035), wl = u * 1.25, [a] = HUES[hue % 3];
  g.fillStyle = 'rgba(20,40,70,.25)'; g.beginPath(); g.ellipse(w / 2, wl + u * .05, u * .95, u * .12, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(u * .05, wl - u * .42); g.lineTo(w - u * .02, wl - u * .5); g.quadraticCurveTo(w - u * .2, wl, w - u * .45, wl); g.lineTo(u * .3, wl); g.quadraticCurveTo(u * .12, wl - u * .1, u * .05, wl - u * .42); g.closePath();
  g.fillStyle = '#f6f7fa'; g.fill(); g.lineWidth = lw; g.strokeStyle = OUT; g.stroke();
  g.fillStyle = a; g.fillRect(u * .2, wl - u * .2, w - u * .55, u * .1); g.fillStyle = '#c8372d'; g.fillRect(u * .25, wl - u * .08, w - u * .75, u * .06);
  rr(g, u * .55, wl - u * .95, u * .6, u * .5, u * .05); g.fillStyle = '#ffffff'; g.fill(); g.stroke(); rr(g, u * .63, wl - u * .85, u * .2, u * .16, u * .02); g.fillStyle = '#7cc6f0'; g.fill(); rr(g, u * .88, wl - u * .85, u * .2, u * .16, u * .02); g.fill();
  g.strokeStyle = '#4a2e1f'; g.lineWidth = u * .04; g.beginPath(); g.moveTo(u * 1.45, wl - u * .5); g.lineTo(u * 1.45, wl - u * 1.35); g.stroke();
  g.fillStyle = a; g.beginPath(); g.moveTo(u * 1.47, wl - u * 1.33); g.lineTo(u * 1.8, wl - u * 1.22); g.lineTo(u * 1.47, wl - u * 1.1); g.fill(); return c });
const makeLighthouse = px((_, u, dpr) => { const c = mkc(u, u * 3.2, dpr), g = c.getContext('2d'), lw = Math.max(1, u * .035), by = u * 3.1, cx = u / 2;
  g.fillStyle = 'rgba(20,40,70,.25)'; g.beginPath(); g.ellipse(cx, by - u * .04, u * .42, u * .1, 0, 0, Math.PI * 2); g.fill();
  const tw = y => u * (.2 + .14 * (y - u * .9) / (by - u * .9));
  g.save(); g.beginPath(); g.moveTo(cx - tw(u * .9), u * .9); g.lineTo(cx + tw(u * .9), u * .9); g.lineTo(cx + tw(by), by - u * .1); g.lineTo(cx - tw(by), by - u * .1); g.closePath(); g.fillStyle = '#ffffff'; g.fill(); g.clip();
  g.fillStyle = '#c8372d'; for (let y = u * 1.2; y < by; y += u * .7) g.fillRect(0, y, u, u * .35); g.restore();
  g.beginPath(); g.moveTo(cx - tw(u * .9), u * .9); g.lineTo(cx + tw(u * .9), u * .9); g.lineTo(cx + tw(by), by - u * .1); g.lineTo(cx - tw(by), by - u * .1); g.closePath(); g.lineWidth = lw; g.strokeStyle = OUT; g.stroke();
  rr(g, cx - u * .3, u * .82, u * .6, u * .1, u * .03); g.fillStyle = '#2b2f36'; g.fill(); g.stroke();
  rr(g, cx - u * .17, u * .4, u * .34, u * .42, u * .04); g.fillStyle = '#ffe58a'; g.fill(); g.stroke();
  g.beginPath(); g.moveTo(cx - u * .24, u * .42); g.lineTo(cx, u * .12); g.lineTo(cx + u * .24, u * .42); g.closePath(); g.fillStyle = '#c8372d'; g.fill(); g.stroke(); return c });
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
  bridge(v, o) { const U = v.U, pad = U * .14; v.sprite('bridge', makeBridge, o, o.x * U - pad, o.y * U - pad, o.w * U + pad * 2, o.h * U + pad * 2, o.y * U - U) },
  parasol(v, o) { const U = v.U, by = (o.y + 1) * U; v.sprite('parasol-' + o.hue, makeParasol, o.hue, o.x * U, by - 1.62 * U, U, 1.7 * U, by) },
  boat(v, o) { const U = v.U, by = (o.y + 1) * U; v.sprite('boat-' + o.hue, makeBoat, o.hue, o.x * U, by - 1.35 * U + Math.sin(v.now / 700 + o.x) * U * .03, 2 * U, 1.5 * U, by) },
  lighthouse(v, o) { const U = v.U, by = (o.y + 1) * U; v.sprite('lighthouse', makeLighthouse, null, o.x * U, by - 3.1 * U, U, 3.2 * U, by) },
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
    const waveFrame = Math.floor(now / 260 + x * .7 + y * .45) % 8;
    const variant = (x + y) % 3;
    v.sprite(`ocean-wave-${waveFrame}-${variant}`, makeOceanWave, { phase: (waveFrame + variant) / 8 }, x * U + U * .04, y * U + U * .16, U * .9, U * .58, -1e9, .9, FX_NONE);
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
  if (map.kind !== 'in') {
    const weather = weatherAt(new Date(), map.ci);
    const frame = Math.floor(now / 180) % 8;
    const w = Math.max(1, Math.round(v.cam.w)), h = Math.max(1, Math.round(v.cam.h));
    const key = `weather-${weather.kind}-${weather.phase}-${frame}-${w}x${h}`;
    v.sprite(key, makeWeatherOverlay, { w, h, weather, frame }, v.cam.x, v.cam.y, w, h, 1e9, 1, FX_NONE);
  }
}
