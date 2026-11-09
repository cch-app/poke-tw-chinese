import { BASE_CITIES, LEAGUE, ANIMALS, TRAINERS, INTRO, UI, FORTUNES, UNIT, WALKER_LINES } from './cities.js';
import { EXTRA } from './extra.js';

// 每個城市加上擴充題庫與第二篇閱讀（不改動原始資料）
export const CITIES = BASE_CITIES.map((c, i) => ({ ...c, pool: [...c.pool, ...EXTRA[i].pool], read2: EXTRA[i].read2 }));

export { LEAGUE, ANIMALS, TRAINERS, INTRO, UI, FORTUNES, UNIT, WALKER_LINES };
export { TW_PEAKS, TW_PTS, TW_RANGES } from './taiwan.js';
