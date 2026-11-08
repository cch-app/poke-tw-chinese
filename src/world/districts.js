// District connectors beyond a city's west and east side gates.
// Each side has its own district, laid out outward from the city edge, so
// walking west always leads further west: the coastal side ends at a beach or
// harbor on the sea, the mountain side climbs into a village and mountain
// trails. Where a real road crosses to a neighbouring city (see geography.js),
// the mountain trail keeps going and arrives in that city's facing district.
import { BLD, GT, rng } from '../art.js';
import { cityLv } from '../content.js';
import { CITIES, TRAINERS } from '../data/index.js';
import { LOCAL_SHOPS, STORE_BRANDS } from '../data/stores.js';
import { districtKind, linkFor } from './geography.js';

export const DISTRICT_W = 30;
export const DISTRICT_H = 20;
export const DISTRICT_GATE_Y = 9;

export const DISTRICT_PLACES = {
  beach: ['海水浴場', 'Beach', '海水浴場'],
  harbor: ['漁港', 'Fishing Harbor', '漁港'],
  mountain: ['山城', 'Mountain Village', '山あいの村'],
};

// Commercial pool: what can line the district's main street. Weights favour
// what fits the setting, so mountain villages get small independent shops.
const POOL = {
  beach: [['mall', 2], ['dept', 2], ['chain', 3], ['local', 2]],
  harbor: [['mall', 2], ['dept', 2], ['chain', 3], ['local', 3]],
  mountain: [['dept', 1], ['chain', 2], ['local', 5], ['house', 4]],
};
const pickBrand = (r, list) => list[Math.floor(r() * list.length)].id;

export const districtLink = (ci, side) => linkFor(CITIES, ci, side);

export function genDistrict(ci, side = 'east') {
  const city = CITIES[ci], kind = districtKind(city, side), link = districtLink(ci, side);
  const W = DISTRICT_W, H = DISTRICT_H, GY = DISTRICT_GATE_Y;
  const r = rng(ci * 9127 + (side === 'west' ? 301 : 733));
  const g = Array.from({ length: H }, () => Array(W).fill(GT.G));
  const blocked = Array.from({ length: H }, () => Array(W).fill(false));
  const keep = Array.from({ length: H }, () => Array(W).fill(false));
  const objs = [], doors = {}, trainers = [];

  // The layout is written in "u" = tiles outward from the city edge.
  // X(u, w) turns that into a map x, mirrored for the west district.
  const X = (u, w = 1) => side === 'east' ? u : W - u - w;
  const tile = (u, y) => g[y]?.[X(u)];
  const set = (u, y, t) => { const x = X(u); g[y][x] = t; if (t === GT.WA || t === GT.RK) blocked[y][x] = true };
  const pave = (u, y, t = GT.PB) => { const x = X(u); g[y][x] = t; blocked[y][x] = false; keep[y][x] = true };
  const free = (u, y) => { const x = X(u); return u > 0 && u < W - 1 && y > 0 && y < H - 1 && !blocked[y][x] && !keep[y][x] && g[y][x] !== GT.WA };
  const solid = (u, y, o) => { const x = X(u); objs.push({ ...o, x, y }); blocked[y][x] = true };
  const tree = (u, y, k) => { if (free(u, y)) solid(u, y, { type: 'tree', kind: k || (r() < .25 ? 'broad' : city.tree) }) };
  const sign = (u, y, o) => { const x = X(u); objs.push({ type: 'sign', x, y, ...o }); blocked[y][x] = true; keep[y][x] = true };
  const road = (u0, u1, t) => { for (let u = u0; u <= u1; u++) { pave(u, GY, t); pave(u, GY + 1, t) } };

  // Buildings line the north side of the main street, doors opening onto it.
  const building = (bk, u, brand) => {
    const b = BLD[bk], x = X(u, b.w), y = GY - b.h, o = { type: 'bld', kind: bk, x, y, w: b.w, h: b.h, ...(brand && { brand }) };
    for (let yy = y; yy < y + b.h; yy++) for (let xx = x; xx < x + b.w; xx++) blocked[yy][xx] = true;
    const dx = x + Math.floor(b.w / 2), dy = y + b.h - 1;
    blocked[dy][dx] = false; keep[dy][dx] = true; o.door = [dx, dy]; doors[dx + ',' + dy] = brand ? { kind: bk, brand } : bk;
    objs.push(o);
  };
  const street = (u0, u1) => {
    const pool = POOL[kind], total = pool.reduce((a, [, w]) => a + w, 0);
    let u = u0, last = null, shops = 0;
    while (true) {
      const room = u1 - u + 1;
      let pickK = null;
      for (let tries = 0; tries < 8 && !pickK; tries++) {
        let t = r() * total, k = pool[0][0];
        for (const [name, w] of pool) { if ((t -= w) < 0) { k = name; break } }
        const bk = k === 'chain' || k === 'local' ? 'store' : k;
        if (BLD[bk].w <= room && k !== last) pickK = k;
      }
      if (!pickK) break;
      const bk = pickK === 'chain' || pickK === 'local' ? 'store' : pickK;
      building(bk, u, pickK === 'chain' ? pickBrand(r, STORE_BRANDS) : pickK === 'local' ? pickBrand(r, LOCAL_SHOPS) : null);
      if (bk !== 'house') shops++;
      last = pickK; u += BLD[bk].w + 1;
    }
    // Never leave a district without somewhere to shop.
    if (!shops) {
      const o = objs.filter(o => o.type === 'bld').pop();
      if (o && o.kind === 'house') {
        objs.splice(objs.indexOf(o), 1); delete doors[o.door.join(',')];
        for (let yy = o.y; yy < o.y + o.h; yy++) for (let xx = o.x; xx < o.x + o.w; xx++) { blocked[yy][xx] = false; keep[yy][xx] = false }
      }
      building('store', u0, pickBrand(r, LOCAL_SHOPS));
    }
  };
  const lamps = (us, y) => us.forEach(u => { if (free(u, y)) solid(u, y, { type: 'lamp' }) });
  // A trail lamp goes on the first free tile around a 2×2 bend of the path.
  const trailLamps = [];
  const AROUND = [[-1, -1], [2, -1], [-1, 2], [2, 2], [-1, 0], [2, 0], [-1, 1], [2, 1], [0, -1], [1, -1], [0, 2], [1, 2]];
  const lampBy = (u, y, taken) => { for (const [du, dy] of AROUND) { const uu = u + du, yy = y + dy;
    if (free(uu, yy) && !taken.has(X(uu) + ',' + yy)) { set(uu, yy, GT.G); solid(uu, yy, { type: 'lamp' }); return } } };

  if (kind === 'beach' || kind === 'harbor') {
    // The coastline wanders a little; everything past it is sea.
    const shore = [];
    for (let y = 0; y < H; y++) shore[y] = y ? Math.max(19, Math.min(21, shore[y - 1] + (r() < .3 ? (r() < .5 ? -1 : 1) : 0))) : 20;
    if (kind === 'harbor') shore.fill(19);
    for (let y = 0; y < H; y++) for (let u = shore[y]; u < W; u++) set(u, y, GT.WA);
    const s0 = Math.min(...shore);
    if (kind === 'beach') {
      for (let y = 0; y < H; y++) for (let u = shore[y] - 5; u < shore[y]; u++) set(u, y, GT.SA);
      road(0, 13);
      for (let u = 14; u < shore[GY]; u++) { pave(u, GY, GT.PR); pave(u, GY + 1, GT.PR) }
      // A fishing pier runs out over the water from the end of the boardwalk.
      for (let u = shore[GY]; u <= shore[GY] + 4; u++) { pave(u, GY, GT.PR); pave(u, GY + 1, GT.PR) }
      sign(shore[GY] - 1, GY - 1, { what: 'lookout' });
      street(2, s0 - 7);
      // Beach umbrellas on the sand, dunes of tall grass behind the beach.
      for (let k = 0; k < 9; k++) { const y = 2 + Math.floor(r() * (H - 4)), u = shore[y] - 1 - Math.floor(r() * 4); if (Math.abs(y - GY - .5) > 1.5 && tile(u, y) === GT.SA && free(u, y)) solid(u, y, { type: 'parasol', hue: k % 3 }) }
      for (let k = 0; k < 5; k++) { const y = 1 + Math.floor(r() * (H - 2)), u = shore[y] - 5 + Math.floor(r() * 2); tree(u, y, 'palm') }
    } else {
      // Harbor: a paved quay along the water and two piers with moored boats.
      road(0, s0 - 1);
      for (let y = 2; y < H - 2; y++) { pave(s0 - 2, y); pave(s0 - 1, y) }
      const piers = [4, 14];
      piers.forEach((py, i) => {
        for (let u = s0; u <= s0 + 5; u++) { pave(u, py, GT.PR); pave(u, py + 1, GT.PR) }
        [[py - 1, s0 + 1], [py + 2, s0 + 2]].forEach(([y, u]) => objs.push({ type: 'boat', x: X(u, 2), y, w: 2, hue: (i * 2 + y) % 3 }));
      });
      solid(s0 + 5, piers[0], { type: 'lighthouse' });
      sign(s0 - 3, GY - 1, { what: 'lookout' });
      street(2, s0 - 4);
      lamps([s0 - 3], 3); lamps([s0 - 3], 16);
    }
    lamps([3, 7, 11], GY + 2);
    // South of the street: a seaside park with tall grass where animals hide.
    for (let k = 0; k < 3; k++) { const u = 2 + Math.floor(r() * 9), y = GY + 4 + Math.floor(r() * 4); for (let yy = y; yy < Math.min(H - 1, y + 2 + Math.floor(r() * 2)); yy++) for (let uu = u; uu < u + 3 + Math.floor(r() * 2); uu++) if (free(uu, yy) && tile(uu, yy) === GT.G) set(uu, yy, GT.TG) }
    for (let k = 0; k < 8; k++) tree(2 + Math.floor(r() * (s0 - 8)), GY + 3 + Math.floor(r() * 6));
    for (let k = 0; k < 6; k++) { const u = 2 + Math.floor(r() * (s0 - 8)), y = GY + 3 + Math.floor(r() * 6); if (free(u, y) && tile(u, y) === GT.G) set(u, y, GT.FL) }
    // Edges: a hedge on the city side and along the top and bottom, the sea beyond the shore.
    for (let y = 0; y < H; y++) if (!keep[y][X(0)]) solid(0, y, { type: 'tree', kind: city.tree });
    for (let u = 1; u < W; u++) [0, H - 1].forEach(y => { if (tile(u, y) !== GT.WA && !keep[y][X(u)]) solid(u, y, { type: 'tree', kind: tile(u, y) === GT.SA ? 'palm' : city.tree }) });
  } else {
    // Mountain side: a village street, tea terraces, then switchback trails up the slope.
    road(0, 11, GT.PD);
    street(2, 11);
    for (let y = GY + 3; y < H - 2; y += 2) for (let u = 2; u <= 10; u++) if (free(u, y)) set(u, y, GT.TG);
    const top = 2 + Math.floor(r() * 3), bottom = 14 + Math.floor(r() * 3), a = 13 + Math.floor(r() * 2), b = 19 + Math.floor(r() * 2), c = 24 + Math.floor(r() * 2);
    const vert = (u, y0, y1) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1) + 1; y++) { pave(u, y, GT.PD); pave(u + 1, y, GT.PD) } };
    const horiz = (u0, u1, y) => { for (let u = Math.min(u0, u1); u <= Math.max(u0, u1) + 1; u++) { pave(u, y, GT.PD); pave(u, y + 1, GT.PD) } };
    horiz(11, a, GY); vert(a, GY, top); horiz(a, b, top); vert(b, top, bottom); horiz(b, c, bottom); vert(c, bottom, GY);
    trailLamps.push([a, GY], [a, top], [b, top], [b, bottom], [c, bottom]);
    if (link) { horiz(c, W - 2, GY); sign(W - 3, GY - 1, { what: 'link' }) }
    else { for (let y = GY - 1; y <= GY + 2; y++) for (let u = c + 1; u <= c + 3; u++) pave(u, y, GT.PD); sign(c + 3, GY - 1, { what: 'lookout' }) }
    sign(12, GY + 2, { what: 'trail' });
    // Everything off the trail is steep: rock faces and pines, with grassy clearings beside the path.
    for (let y = 1; y < H - 1; y++) for (let u = 12; u < W; u++) {
      if (!free(u, y) && !(u === W - 1 && !keep[y][X(u)])) continue;
      const x = X(u), nearPath = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => keep[y + dy]?.[x + dx] && g[y + dy][x + dx] === GT.PD);
      if (u < W - 1 && nearPath && r() < .38) set(u, y, GT.TG);
      else if (u === W - 1 || r() < .5) set(u, y, GT.RK);
      else if (r() < .8) solid(u, y, { type: 'tree', kind: r() < .75 ? 'pine' : 'broad' });
    }
    for (let k = 0; k < 6; k++) tree(1 + Math.floor(r() * 10), GY + 2 + Math.floor(r() * 7), r() < .5 ? 'pine' : city.tree);
    for (let y = 0; y < H; y++) if (!keep[y][X(0)]) solid(0, y, { type: 'tree', kind: city.tree });
    for (let u = 1; u < W; u++) [0, H - 1].forEach(y => { if (!keep[y][X(u)]) { if (u < 12) solid(u, y, { type: 'tree', kind: 'pine' }); else set(u, y, GT.RK) } });
  }

  // Trainers wait beside the paths, looking at them.
  const spots = [];
  for (let y = 2; y < H - 2; y++) for (let u = 3; u < W - 3; u++) {
    if (!free(u, y) || ![GT.G, GT.TG, GT.SA, GT.FL].includes(tile(u, y))) continue;
    const x = X(u);
    for (const [dx, dy, dir] of [[1, 0, 'right'], [-1, 0, 'left'], [0, 1, 'down'], [0, -1, 'up']])
      if (keep[y + dy][x + dx] && !blocked[y + dy][x + dx] && !doors[(x + dx) + ',' + (y + dy)]) { spots.push([x, y, dir]); break }
  }
  const picked = [];
  // Seeded shuffle, so the same district always has its trainers in the same places.
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]] }
  for (const s of spots) {
    if (picked.length >= 2 + (ci % 2)) break;
    if (picked.some(p => Math.abs(p[0] - s[0]) + Math.abs(p[1] - s[1]) < 7)) continue;
    picked.push(s);
  }
  picked.forEach(([x, y, dir], k) => {
    if (g[y][x] === GT.TG) g[y][x] = GT.G;
    trainers.push({ id: `d${ci}${side[0]}-${k}`, x, y, dir, home: dir, cls: Math.floor(r() * TRAINERS.length), lv: cityLv(ci) + 1 + k, turnT: 1700 + r() * 2400 });
  });
  // Lamps at the trail's bends so climbers can see the path at night. Placed last,
  // so the trees, rocks and trainers already generated stay exactly where they were.
  const taken = new Set(trainers.map(t => t.x + ',' + t.y));
  trailLamps.forEach(([u, y]) => lampBy(u, y, taken));

  return {
    kind: 'district', ci, side, place: kind, link, w: W, h: H, g, blocked, objs,
    doors, trainers, npcs: [], gateY: GY,
  };
}

/** Is map x the district's city-side edge (true) or its far edge (false)? */
export const innerEdge = (map, x) => map.side === 'east' ? x < 0 : x >= map.w;
