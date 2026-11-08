// ===== 城市之間的道路：離開城市後要走過好幾個地方才會到下一座城 =====
// 道路 i 連接第 i 座和第 i+1 座城（都在本島時才有；離島還是搭船或飛機）。
// 一條路由上往下分成四段，每段是一個不同的地方：稻田、溪邊、休息站、林道或花田。
// 鄉間小路彎彎曲曲地穿過這四段，兩端都接在城市大路（x 11–12）上。
import { BLD, GT, rng } from '../art.js';
import { cityLv } from '../content.js';
import { shuffle } from '../core/util.js';
import { CITIES, TRAINERS } from '../data/index.js';
import { ALL_SHOPS } from '../data/stores.js';
import { geographyFor } from './geography.js';

const W = 24, ZH = 14, ZONES = 4;
export const ROUTE_H = 1 + ZH * ZONES + 1;
export const ROAD_X = 11;

export const PLACES = {
  rice: ['稻田小路', 'Rice Paddy Lane', '田んぼの小道'],
  river: ['溪邊步道', 'Riverside Path', '川沿いの道'],
  rest: ['公路休息站', 'Roadside Rest Stop', '道の駅'],
  forest: ['山坡林道', 'Hillside Forest Trail', '丘の林道'],
  flower: ['花田', 'Flower Fields', '花畑'],
};

/** 兩座城都在本島才有道路 */
export const hasRoute = i => i >= 0 && i + 1 < CITIES.length && !CITIES[i].island && !CITIES[i + 1].island;

/** 兩城之間的大約距離（公里）：地圖座標 1 單位約 2.5 公里 */
export function routeKm(i) {
  const a = CITIES[i], b = CITIES[i + 1];
  return Math.max(5, Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 2.5));
}

export function genRoute(i) {
  const r = rng(i * 4561 + 77), from = CITIES[i], H = ROUTE_H;
  const g = Array.from({ length: H }, () => Array(W).fill(GT.G));
  const blocked = Array.from({ length: H }, () => Array(W).fill(false));
  const keep = Array.from({ length: H }, () => Array(W).fill(false));
  const objs = [], doors = {}, trainers = [];
  const inMap = (x, y) => x > 0 && x < W - 1 && y > 0 && y < H - 1;
  const free = (x, y) => inMap(x, y) && g[y][x] === GT.G && !blocked[y][x] && !keep[y][x];
  const pave = (x, y) => { g[y][x] = GT.PD; keep[y][x] = true };
  const block = (x, y) => { blocked[y][x] = true };
  const solid = o => { objs.push(o); block(o.x, o.y) };
  const tree = (x, y, kind) => { if (free(x, y)) solid({ type: 'tree', x, y, kind: kind || (r() < .3 ? 'broad' : from.tree) }) };

  // 四段的順序：第一段是稻田或花田，中間兩段是溪邊和休息站（順序隨機），最後一段是林道或花田
  const mid = r() < .5 ? ['river', 'rest'] : ['rest', 'river'];
  const kinds = [r() < .6 ? 'rice' : 'flower', ...mid, r() < .6 ? 'forest' : 'flower'];
  if (kinds[0] === 'flower' && kinds[3] === 'flower') kinds[3] = 'forest';

  // 鄉間小路：每段先往下走、在中間轉一個彎，再往下接到下一段
  const xs = [ROAD_X, ...Array.from({ length: ZONES - 1 }, () => 4 + Math.floor(r() * 14)), ROAD_X];
  const zones = kinds.map((key, z) => {
    const y0 = 1 + z * ZH, y1 = y0 + ZH - 1;
    const ym = key === 'river' ? y0 + 8 : key === 'rest' ? y0 + 9 : y0 + 4 + Math.floor(r() * 6);
    return { key, y0, y1, ym, xa: xs[z], xb: xs[z + 1] };
  });
  for (const zn of zones) {
    for (let y = zn.y0; y <= zn.ym + 1; y++) { pave(zn.xa, y); pave(zn.xa + 1, y) }
    for (let x = Math.min(zn.xa, zn.xb); x <= Math.max(zn.xa, zn.xb) + 1; x++) { pave(x, zn.ym); pave(x, zn.ym + 1) }
    for (let y = zn.ym; y <= zn.y1; y++) { pave(zn.xb, y); pave(zn.xb + 1, y) }
  }
  [0, H - 1].forEach(y => { pave(ROAD_X, y); pave(ROAD_X + 1, y) });

  const building = (kind, bx, by, brand) => {
    const b = BLD[kind], o = { type: 'bld', kind, x: bx, y: by, w: b.w, h: b.h, ...(brand && { brand }) };
    for (let y = by; y < by + b.h; y++) for (let x = bx; x < bx + b.w; x++) block(x, y);
    const dx = bx + Math.floor(b.w / 2), dy = by + b.h - 1;
    blocked[dy][dx] = false; keep[dy][dx] = true; o.door = [dx, dy]; doors[dx + ',' + dy] = brand ? { kind, brand } : kind;
    objs.push(o); return o;
  };
  const sign = (x, y, zone) => { if (!free(x, y)) return false; solid({ type: 'sign', x, y, what: 'route', zone }); keep[y][x] = true; return true };
  const patch = (x0, y0, w, h, t) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (free(x, y)) { g[y][x] = t; if (t === GT.WA) block(x, y) } };

  zones.forEach((zn, z) => {
    const { key, y0, y1, ym, xa } = zn;
    // 每段一開始的路邊有一塊告示牌，寫著這裡是哪裡、離下一座城還有多遠
    sign(xa - 1, y0 + 1, z) || sign(xa + 2, y0 + 1, z);

    if (key === 'river') {
      // 一條橫過整段的小溪，小路從橋上過去
      const ry = y0 + 4;
      for (let y = ry; y < ry + 2; y++) for (let x = 1; x < W - 1; x++) { if (keep[y][x]) continue; g[y][x] = GT.WA; block(x, y) }
      objs.push({ type: 'bridge', x: xa, y: ry, w: 2, h: 2 });
      for (let x = 1; x < W - 1; x++) { if (r() < .35 && free(x, ry - 1)) g[ry - 1][x] = GT.FL; if (r() < .35 && free(x, ry + 2)) g[ry + 2][x] = GT.FL }
      for (let k = 0; k < 7; k++) tree(1 + Math.floor(r() * (W - 2)), y0 + (r() < .5 ? 1 + Math.floor(r() * 2) : 7 + Math.floor(r() * 6)), 'broad');
      patch(1 + Math.floor(r() * 4), y1 - 4, 4 + Math.floor(r() * 3), 3, GT.TG);
      patch(W - 7 - Math.floor(r() * 3), y1 - 5, 5, 3, GT.TG);
    }
    if (key === 'rest') {
      // 公路休息站：一家超商、一間民宅，門口前面鋪好連到小路
      const left = xa >= 9, bx = left ? xa - 7 : xa + 4, brand = ALL_SHOPS[Math.floor(r() * ALL_SHOPS.length)].id;
      const st = building('store', bx, y0 + 1, brand);
      for (let x = Math.min(st.door[0], xa); x <= Math.max(st.door[0], xa + 1); x++) pave(x, y0 + 5);
      const hx = left ? xa + 3 : xa - 4;
      if (hx >= 1 && hx + 3 <= W - 1) { const hs = building('house', hx, y0 + 1); for (let x = Math.min(hs.door[0], xa); x <= Math.max(hs.door[0], xa + 1); x++) pave(x, y0 + 5) }
      [[st.door[0] - 2, y0 + 6], [st.door[0] + 2, y0 + 6]].forEach(([x, y]) => { if (free(x, y)) solid({ type: 'lamp', x, y }) });
      for (let k = 0; k < 6; k++) tree(1 + Math.floor(r() * (W - 2)), y0 + 7 + Math.floor(r() * 6));
      patch(1 + Math.floor(r() * 5), y1 - 3, 5, 3, GT.TG);
    }
    if (key === 'rice') {
      // 一格一格的稻田（高草叢，會遇到動物），田埂留成草地
      for (let fy = y0 + 1; fy < y1 - 1; fy += 4) for (let fx = 1; fx < W - 2; fx += 5) if (r() < .8) patch(fx, fy, 4, 3, GT.TG);
      if (r() < .7) { const hx = xa >= 12 ? 2 : W - 5; let ok = true; for (let y = y0 + 1; y < y0 + 5; y++) for (let x = hx; x < hx + 3; x++) if (keep[y][x] || blocked[y][x]) ok = false;
        if (ok) { for (let y = y0 + 1; y < y0 + 5; y++) for (let x = hx; x < hx + 3; x++) g[y][x] = GT.G; const hs = building('house', hx, y0 + 1);
        for (let x = Math.min(hs.door[0], xa); x <= Math.max(hs.door[0], xa + 1); x++) pave(x, y0 + 5) } }
      for (let k = 0; k < 4; k++) tree(1 + Math.floor(r() * (W - 2)), y0 + 1 + Math.floor(r() * (ZH - 2)), 'palm');
    }
    if (key === 'flower') {
      for (let k = 0; k < 5; k++) patch(1 + Math.floor(r() * (W - 6)), y0 + 1 + Math.floor(r() * (ZH - 4)), 3 + Math.floor(r() * 3), 2 + Math.floor(r() * 2), GT.FL);
      for (let k = 0; k < 3; k++) patch(1 + Math.floor(r() * (W - 6)), y0 + 1 + Math.floor(r() * (ZH - 4)), 4, 3, GT.TG);
      for (let k = 0; k < 6; k++) tree(1 + Math.floor(r() * (W - 2)), y0 + 1 + Math.floor(r() * (ZH - 2)));
    }
    if (key === 'forest') {
      for (let k = 0; k < 3; k++) patch(1 + Math.floor(r() * (W - 6)), y0 + 1 + Math.floor(r() * (ZH - 4)), 4, 3, GT.TG);
    }

    // 訓練家：站在小路旁邊、面向小路（休息站沒有）
    if (key !== 'rest') {
      const spots = shuffle([[xa - 1, 'right'], [xa + 2, 'left']].flatMap(([x, dir]) => [y0 + 3, y0 + 5, ym - 2].map(y => [x, y, dir])))
        .filter(([x, y]) => inMap(x, y) && (g[y][x] === GT.G || g[y][x] === GT.TG || g[y][x] === GT.FL) && !blocked[y][x] && !keep[y][x]);
      if (spots.length) { const [x, y, dir] = spots[0], k = trainers.length; g[y][x] = GT.G; keep[y][x] = true;
        trainers.push({ id: `r${i}-${k}`, x, y, dir, home: dir, cls: Math.floor(r() * TRAINERS.length), lv: cityLv(i) + 1 + Math.min(2, k), turnT: 1500 + r() * 2500 }) }
    }
    if (key === 'forest') for (let y = y0; y <= y1; y++) for (let x = 1; x < W - 1; x++) if (r() < .32) tree(x, y, r() < .5 ? 'pine' : from.tree);
  });

  // Route edges inherit the geography of the city they leave, so a western
  // route opens onto water on the west and a mountain ridge on the east.
  const geo = geographyFor(from);
  const edge = (x, terrain) => { for (let y = 0; y < H; y++) {
    if (terrain === 'coast') { g[y][x] = GT.WA; block(x, y); }
    else solid({ type: 'tree', x, y, kind: terrain === 'mountain' ? 'pine' : from.tree });
  } };
  edge(0, geo.west); edge(W - 1, geo.east);
  for (let x = 1; x < W - 1; x++) {
    if (!keep[0][x]) solid({ type: 'tree', x, y: 0, kind: geo.north === 'mountain' ? 'pine' : from.tree });
    if (!keep[H - 1][x]) solid({ type: 'tree', x, y: H - 1, kind: geo.south === 'mountain' ? 'pine' : from.tree });
  }

  return { kind: 'route', i, ci: i, w: W, h: H, g, objs, blocked, doors, trainers, npcs: [], zones };
}

/** 玩家在第幾段 */
export const zoneAt = (map, y) => Math.max(0, Math.min(ZONES - 1, Math.floor((y - 1) / ZH)));
