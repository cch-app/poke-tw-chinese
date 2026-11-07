// Short, local district connectors. These are deliberately separate from
// inter-city routes: a player can cross the city from one edge to the other,
// but the connector never silently changes S.city.
import { GT, rng } from '../art.js';
import { cityLv } from '../content.js';
import { shuffle } from '../core/util.js';
import { CITIES, TRAINERS } from '../data/index.js';
import { geographyFor } from './geography.js';

export const DISTRICT_W = 30;
export const DISTRICT_H = 20;
export const DISTRICT_GATE_Y = 9;

export function genDistrict(ci) {
  const city = CITIES[ci];
  const geo = geographyFor(city);
  const r = rng(ci * 9127 + 301);
  const g = Array.from({ length: DISTRICT_H }, () => Array(DISTRICT_W).fill(GT.G));
  const blocked = Array.from({ length: DISTRICT_H }, () => Array(DISTRICT_W).fill(false));
  const objs = [], trainers = [];
  const block = (x, y) => { if (blocked[y]) blocked[y][x] = true; };
  const pave = (x, y, t = GT.PB) => { if (g[y]?.[x] !== undefined) g[y][x] = t; };
  const tree = (x, y, kind = city.tree) => { if (x >= 0 && x < DISTRICT_W && y >= 0 && y < DISTRICT_H) { objs.push({ type: 'tree', x, y, kind }); block(x, y); } };

  // A two-tile boulevard is the district spine. Side lanes create a few
  // different neighborhoods instead of another straight copy of the town.
  for (let x = 0; x < DISTRICT_W; x++) { pave(x, DISTRICT_GATE_Y); pave(x, DISTRICT_GATE_Y + 1); }
  for (const y of [4, 15]) for (let x = 3; x < DISTRICT_W - 3; x++) if (r() < .82) pave(x, y, GT.PD);
  for (const x of [7, 15, 23]) for (let y = 3; y < DISTRICT_H - 2; y++) if (r() < .75) pave(x, y, GT.PD);

  // Small landmarks make this feel like a district connector rather than a
  // loading screen. They remain decorative and do not create new services.
  const plazaX = 4 + Math.floor(r() * 20);
  for (let y = 5; y < 8; y++) for (let x = plazaX; x < plazaX + 4; x++) pave(x, y, GT.PB);
  for (let k = 0; k < 18; k++) {
    const x = 2 + Math.floor(r() * (DISTRICT_W - 4));
    const y = 2 + Math.floor(r() * (DISTRICT_H - 4));
    if (Math.abs(y - DISTRICT_GATE_Y) <= 1 || g[y][x] === GT.PB || g[y][x] === GT.PD) continue;
    if (r() < .45) g[y][x] = GT.FL; else tree(x, y, r() < .25 ? 'broad' : city.tree);
  }

  // Localized boundary assets continue the same geography as the city map.
  const edge = (side, terrain) => {
    const x = side === 'west' ? 0 : DISTRICT_W - 1;
    for (let y = 0; y < DISTRICT_H; y++) {
      if (y === DISTRICT_GATE_Y || y === DISTRICT_GATE_Y + 1) { g[y][x] = GT.PD; continue; }
      if (terrain === 'coast') { g[y][x] = GT.WA; block(x, y); }
      else tree(x, y, terrain === 'mountain' ? 'pine' : city.tree);
    }
  };
  edge('west', geo.west); edge('east', geo.east);
  for (let x = 1; x < DISTRICT_W - 1; x++) {
    if (geo.north === 'coast') { g[0][x] = GT.WA; block(x, 0); }
    else tree(x, 0, geo.north === 'mountain' ? 'pine' : city.tree);
    if (geo.south === 'coast') { g[DISTRICT_H - 1][x] = GT.WA; block(x, DISTRICT_H - 1); }
    else tree(x, DISTRICT_H - 1, geo.south === 'mountain' ? 'pine' : city.tree);
  }

  const spots = shuffle([[5, 8, 'right'], [12, 12, 'left'], [19, 8, 'right'], [25, 12, 'left']]);
  spots.slice(0, 2 + (ci % 2)).forEach(([x, y, dir], k) => {
    if (!blocked[y][x]) {
      trainers.push({ id: `d${ci}-${k}`, x, y, dir, home: dir, cls: Math.floor(r() * TRAINERS.length), lv: cityLv(ci) + 1 + k, turnT: 1700 + r() * 2400 });
    }
  });

  return {
    kind: 'district', ci, w: DISTRICT_W, h: DISTRICT_H, g, blocked, objs,
    doors: {}, trainers, npcs: [], walkers: [], gateY: DISTRICT_GATE_Y,
  };
}
