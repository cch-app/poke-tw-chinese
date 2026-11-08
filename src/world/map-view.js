// ===== 地圖畫面：把地圖資料轉成 view.js 的繪製清單 =====
// 新的物件類型只要在 OBJECTS 加一個項目，不用改繪圖引擎。
import { CITIES } from '../data/index.js';
import {
  OUT, GT, BLD, FEX, VENTS, rr, mkc, paintInterior,
  spriteTree, spriteLamp, spriteSign, spriteArch, spriteBuilding, spriteFurn, spriteTable, spriteChair, drawChar, emblemImage,
} from '../art.js';
import { ART_TILE, COLORS, pixelGround, pixelMaker as px } from '../render/pixel.js';
import { paintPixelTown, tallGrass } from '../art/pixel-tiles.js';
import { weatherAt } from './weather.js';

// 美術一格 16 點；畫面上的格子取 16 的倍數，像素才會整齊
const tileStep = (v, a, b) => Math.max(a, Math.min(b, v));
const BG_TOWN = COLORS.green[1], BG_IN = COLORS.ink[0];

const PHASE_TINT={night:'rgba(10,20,62,.12)',dawn:'rgba(255,174,104,.12)',sunset:'rgba(255,103,47,.2)',dusk:'rgba(72,56,112,.3)',scorching:'rgba(255,155,44,.12)'};
const KIND_TINT={cloudy:'rgba(170,190,208,.12)',rain:'rgba(74,122,170,.08)',storm:'rgba(30,42,72,.15)'};
// 夜色：先偏藍（白天的配色換成夜裡的色調），再整體壓暗
const NIGHT_WASH=['rgba(25,42,92,.24)','rgba(5,13,38,.30)'];
/** 夜裡蓋在畫面上的所有半透明色層，依序；重畫燈光前面的東西時照樣蓋一次 */
const nightWash=weather=>[PHASE_TINT.night,...(KIND_TINT[weather.kind]?[KIND_TINT[weather.kind]]:[]),...NIGHT_WASH];
function makeWeatherOverlay(arg, _u, dpr){
  const {w,h,weather,frame}=arg;
  const cv=mkc(w,h,dpr),g=cv.getContext('2d');
  const tint=PHASE_TINT[weather.phase];
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
    g.fillStyle=KIND_TINT.cloudy;g.fillRect(0,0,w,h);
  }
  if(weather.kind==='rain'||weather.kind==='storm'){
    g.fillStyle=KIND_TINT[weather.kind];g.fillRect(0,0,w,h);
    g.strokeStyle=weather.kind==='storm'?'rgba(190,220,255,.62)':'rgba(210,238,255,.48)';
    g.lineWidth=Math.max(1,w*.0018);g.lineCap='round';
    const count=weather.kind==='storm'?Math.ceil(w/12):Math.ceil(w/20);
    for(let i=0;i<count;i++){
      const x=((i*47+frame*13)%(w+40))-20;
      const y=((i*71+frame*29)%(h+40))-20;
      g.beginPath();g.moveTo(x,y);g.lineTo(x-w*.018,y+h*.075);g.stroke();
    }
  }
  return cv;
}

/* ---------- 徽章圖（SVG 載入完要重畫道館） ---------- */
const emblems = [];
function emblem(ci, onLoad) {
  if (!emblems[ci]) { const img = emblemImage(ci); img.addEventListener('load', () => onLoad(ci)); emblems[ci] = img }
  return emblems[ci];
}

/* ---------- 當地時間與天氣：每分鐘算一次 ---------- */
function ambientOf(map) {
  const bucket = Math.floor(Date.now() / 60000);
  let a = map.ambientCache;
  if (!a || a.bucket !== bucket) {
    const date = new Date();
    a = map.ambientCache = { bucket, date, weather: weatherAt(date, map.ci) };
  }
  return a;
}

// 夜裡的路面：白天的石板、柏油顏色太亮，蓋一層偏藍的乘色，紋路保留、亮度壓下來
const NIGHT_STREET = '#7484b4';
const isStreet = t => t === GT.PB || t === GT.PD || t === GT.PR;
function nightStreets(cv, m) {
  const g = cv.getContext('2d');
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = NIGHT_STREET;
  for (let y = 0; y < m.length; y++) for (let x = 0; x < m[y].length; x++) if (isStreet(m[y][x])) g.fillRect(x * ART_TILE, y * ART_TILE, ART_TILE, ART_TILE);
  g.restore();
  return cv;
}
// 地面只在換地圖時畫一次；日夜交替時由 describeMap 排一次重畫
let repaintGround = null;

/** 地面與尺寸；onAsset 在非同步圖片載入後呼叫（應該重畫）。 */
export function sceneFor(map, onAsset) {
  const indoor = map.kind === 'in', city = CITIES[map.ci];
  const img = emblem(map.ci, onAsset);
  repaintGround = indoor ? null : () => onAsset(map.ci);
  const paintTown = () => {
    const cv = paintPixelTown(map.g, map.ci);
    map.groundNight = ambientOf(map).weather.phase === 'night';
    return map.groundNight ? nightStreets(cv, map.g) : cv;
  };
  return {
    w: map.w, h: map.h,
    background: indoor ? BG_IN : BG_TOWN,
    tileSize: (vw, vh) => indoor ? tileStep(Math.min(vw / 8.5, vh / 9.5), 48, 80) : tileStep(Math.min(vw / 12, vh / 9), 32, 64),
    // 城鎮地面直接用調色盤畫；室內有家具和招牌字，畫好再收成四色
    paint: (u, gd) => indoor ? pixelGround((t, d) => paintInterior(map, t, d, city, img), u, gd)
      : pixelGround(paintTown, u, gd, { native: true }),
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
function makeNightOverlay(arg, _u, dpr) {
  const { w, h, weather } = arg;
  const cv = mkc(w, h, dpr), g = cv.getContext('2d');
  const night = weather.phase === 'night';
  const twilight = weather.phase === 'dusk' || weather.phase === 'dawn';
  if (!night && !twilight) return cv;

  // Keep the existing weather effects, then add a dedicated lighting pass so
  // every town, route, and district receives the same local-time treatment.
  for (const c of night ? NIGHT_WASH : ['rgba(37, 27, 76, .16)']) { g.fillStyle = c; g.fillRect(0, 0, w, h) }
  // 俯視的地圖上看不到天空，所以不畫星星和月亮
  return cv;
}

// 夜裡亮燈的窗戶：把建築重畫一次，窗戶用的顏色（淡藍玻璃、暖黃窗紙）一律換成洋紅色當記號，
// 有記號的地方換成暖黃色燈光、其他地方透明，再加一圈柔光。這張蓋在夜色上面，窗戶才是真的亮著。
const MARK = '#ff00ff';
const isGlass = (r, g, b) => r >= 95 && g >= 150 && b >= 185 && b - r >= 25 && b >= g;
const rgbOf = css => { const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$|^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/i.exec(css);
  return !m ? null : m[1] ? [m[1], m[2], m[3]].map(h => parseInt(h, 16)) : [+m[4], +m[5], +m[6]] };
const isWindowColor = css => { if (typeof css !== 'string') return false; const c = rgbOf(css); return !!c && (isGlass(...c) || css.toLowerCase() === '#fff1cf') };
function windowMask(draw) {
  const G = CanvasGradient.prototype, addStop = G.addColorStop, C = CanvasRenderingContext2D.prototype, fill = Object.getOwnPropertyDescriptor(C, 'fillStyle');
  // 漸層看第一個色標：從玻璃色或窗紙色開始的就是窗戶
  G.addColorStop = function (o, c) { if (o === 0) this._win = isWindowColor(c); return addStop.call(this, o, this._win ? MARK : c) };
  Object.defineProperty(C, 'fillStyle', { ...fill, set(v) { fill.set.call(this, isWindowColor(v) ? MARK : v) } });
  try { return draw() } finally { G.addColorStop = addStop; Object.defineProperty(C, 'fillStyle', fill) }
}
function windowLight(src, u, dpr) {
  const W = src.width, H = src.height, img = src.getContext('2d').getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    // 洋紅色（含被窗上反光、窗框邊緣混到的）就是窗戶
    if (!d[i + 3] || d[i] < 180 || d[i + 2] < 180 || d[i + 1] > d[i] - 70) { d[i + 3] = 0; continue }
    const k = (d[i + 1] / (d[i] - 1)) || 0;  // 窗上原本有反光的地方燈光比較白
    d[i] = 255; d[i + 1] = 206 + 40 * k; d[i + 2] = 118 + 80 * k; d[i + 3] = 255;
  }
  const sharp = document.createElement('canvas'); sharp.width = W; sharp.height = H; sharp.getContext('2d').putImageData(img, 0, 0);
  const out = document.createElement('canvas'); out.width = W; out.height = H;
  const g = out.getContext('2d');
  g.filter = `blur(${Math.max(1, u * dpr * .07)}px)`; g.globalAlpha = .7; g.drawImage(sharp, 0, 0);
  g.filter = 'none'; g.globalAlpha = 1; g.drawImage(sharp, 0, 0);
  return out;
}
const makeBldLight = px((o, u, dpr) => windowLight(windowMask(() => spriteBuilding(o.kind, u, dpr, cur.city, cur.emblem, o.brand)), u, dpr));
// 同一張貼圖再蓋一次夜色：站在亮窗前面的人和東西要重畫在燈光上面，窗戶的光才不會透過去
const tinted = new WeakMap();
function nightTinted(make) {
  let t = tinted.get(make);
  if (!t) tinted.set(make, t = (a, u, dpr) => { const cv = make(a.arg, u, dpr), g = cv.getContext('2d');
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    for (const c of a.wash) { g.fillStyle = c; g.fillRect(0, 0, cv.width, cv.height) }
    g.restore(); return cv });
  return t;
}

// 路燈亮起來：燈頭一圈暖光、腳下一片橢圓光暈。貼圖寬 3 格、高 2.6 格，
// 燈柱在正中間，底邊往上 .5 格是燈柱腳（地面），燈頭在柱腳上方 1.64 格。
const LAMP_GLOW_W = 3, LAMP_GLOW_H = 2.6, LAMP_BASE = 2.1, LAMP_HEAD = LAMP_BASE - 1.64;
function makeLampGlow(_, u, dpr) {
  const cv = mkc(u * LAMP_GLOW_W, u * LAMP_GLOW_H, dpr), g = cv.getContext('2d'), cx = u * LAMP_GLOW_W / 2;
  const pr = u * 1.3, pool = g.createRadialGradient(0, 0, 0, 0, 0, pr);
  pool.addColorStop(0, 'rgba(255,214,140,.3)'); pool.addColorStop(.6, 'rgba(255,196,110,.12)'); pool.addColorStop(1, 'rgba(255,180,90,0)');
  g.save(); g.translate(cx, u * LAMP_BASE); g.scale(1, .38); g.fillStyle = pool; g.fillRect(-pr, -pr, pr * 2, pr * 2); g.restore();
  // A small warm core makes the fixture visibly switched on while the
  // surrounding halo remains restrained enough for a dense city block.
  const hy = u * LAMP_HEAD, hr = u * .85, halo = g.createRadialGradient(cx, hy, 0, cx, hy, hr);
  halo.addColorStop(0, 'rgba(255,224,150,.42)'); halo.addColorStop(.4, 'rgba(255,200,110,.16)'); halo.addColorStop(1, 'rgba(255,180,90,0)');
  g.fillStyle = halo; g.fillRect(cx - hr, hy - hr, hr * 2, hr * 2);
  g.fillStyle = 'rgba(255,240,190,.75)'; g.beginPath(); g.arc(cx, hy, u * .12, 0, Math.PI * 2); g.fill();
  return cv;
}

const drawn = [];
export function describeMap(v, now, st) {
  const map = st.map, U = v.U;
  cur.map = map; cur.city = CITIES[map.ci]; cur.emblem = emblems[map.ci]; v.now = now;
  const ambient = map.kind !== 'in' ? ambientOf(map) : null, night = ambient?.weather.phase === 'night';
  // 夜裡記下每一張貼圖，最後才知道哪些擋在亮著的窗戶前面
  const put = v.sprite;
  drawn.length = 0;
  if (night) v.sprite = (...a) => { drawn.push(a); put(...a) };

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
  v.sprite = put;
  if (ambient) {
    const { weather } = ambient;
    // 天黑或天亮了：這一格畫完再重畫地面（現在重畫會把清單裡的貼圖刪掉）
    if (map.groundNight !== undefined && map.groundNight !== night && repaintGround) { map.groundNight = night; queueMicrotask(repaintGround) }
    const frame = Math.floor(now / 180) % 8;
    const w = Math.max(1, Math.round(v.cam.w)), h = Math.max(1, Math.round(v.cam.h));
    const weatherFrame = weather.kind === 'rain' || weather.kind === 'storm' ? frame : 0;
    const key = `weather-${weather.kind}-${weather.phase}-${weatherFrame}-${w}x${h}`;
    v.sprite(key, makeWeatherOverlay, { w, h, weather, frame }, v.cam.x, v.cam.y, w, h, 1e9, 1, FX_NONE);
    v.sprite(`night-${weather.phase}-${w}x${h}`, makeNightOverlay, { w, h, weather }, v.cam.x, v.cam.y, w, h, 1e9 + 1, 1, FX_NONE);
    if (night) nightLights(v, map, weather);
  }
}

// 天黑以後：每棟建築的窗戶亮燈、路燈打開，都蓋在夜色上面
const lit = [];
function nightLights(v, map, weather) {
  const U = v.U, cx0 = v.cam.x, cy0 = v.cam.y, cx1 = cx0 + v.cam.w, cy1 = cy0 + v.cam.h;
  lit.length = 0;
  for (const o of map.objs) {
    if (o.type !== 'bld') continue;
    const b = BLD[o.kind], by = (o.y + b.h) * U, x = o.x * U, y = by - (b.h + b.ex) * U, w = b.w * U, h = (b.h + b.ex) * U;
    if (x > cx1 || x + w < cx0 || y > cy1 || y + h < cy0) continue;
    lit.push(x, y, w, h, by);
    v.sprite(keyOf(o, o => `bld-${o.kind}-${o.brand || 'local'}`) + '-lit', makeBldLight, o, x, y, w, h, 1e9 + 2, 1, FX_NONE);
  }
  // 站在亮窗前面的人、樹、路燈：蓋上同樣的夜色重畫一次，窗戶的光才不會透過去
  let wash = null;
  for (const [key, make, arg, x, y, w, h, depth, alpha] of drawn) {
    if (depth >= 1e9) continue;
    for (let i = 0; i < lit.length; i += 5) {
      if (depth <= lit[i + 4] || x >= lit[i] + lit[i + 2] || x + w <= lit[i] || y >= lit[i + 1] + lit[i + 3] || y + h <= lit[i + 1]) continue;
      v.sprite(`${key}~night-${weather.kind}`, nightTinted(make), { arg, wash: wash || (wash = nightWash(weather)) }, x, y, w, h, 1e9 + 3, alpha, FX_NONE);
      break;
    }
  }
  // 路燈天黑就亮（燈下的路和人會被照亮）
  const lamps = map.nightLamps || (map.nightLamps = map.objs.filter(o => o.type === 'lamp'));
  for (const lamp of lamps) v.sprite('lamp-glow', makeLampGlow, null, (lamp.x + .5 - LAMP_GLOW_W / 2) * U, (lamp.y + 1 - LAMP_BASE) * U, LAMP_GLOW_W * U, LAMP_GLOW_H * U, 1e9 + 4, 1, FX_NONE);
}
