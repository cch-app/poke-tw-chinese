// Regional border rules shared by town maps and the district connectors.
// The global map uses west/east as x, so every town gets an explicit local
// coastline and mountain side instead of a generic wall of trees.

const EASTERN_CITIES = new Set(['taitung', 'hualien', 'yilan']);
const NORTHERN_CITIES = new Set(['keelung', 'newtaipei']);
// Working ports get a harbor district on their coastal side; the rest of the coast is beach.
const HARBOR_CITIES = new Set(['keelung', 'taichung', 'kaohsiung', 'hualien', 'pingtung', 'penghu', 'kinmen', 'matsu']);

export function geographyFor(city) {
  if (!city) return { west: 'mountain', east: 'mountain', north: 'forest', south: 'forest' };
  if (city.island) return { west: 'coast', east: 'coast', north: 'coast', south: 'coast' };
  // Landlocked: Nantou sits inside the central range; Taipei is a basin ringed by hills.
  if (city.id === 'nantou') return { west: 'mountain', east: 'mountain', north: 'forest', south: 'forest' };
  if (city.id === 'taipei') return { west: 'mountain', east: 'mountain', north: 'forest', south: 'mountain' };
  // East coast and the northeast tip: mountains to the west, the Pacific to the east.
  if (NORTHERN_CITIES.has(city.id)) return { west: 'mountain', east: 'coast', north: 'coast', south: 'mountain' };
  if (EASTERN_CITIES.has(city.id)) return { west: 'mountain', east: 'coast', north: 'forest', south: 'coast' };
  // Taiwan's western corridor: the sea is to the west and the central range
  // is immediately beyond the eastern edge of each city district.
  return { west: 'coast', east: 'mountain', north: 'forest', south: 'forest' };
}

/** What the district beyond a side gate looks like: 'beach', 'harbor' or 'mountain'. */
export function districtKind(city, side) {
  if (geographyFor(city)[side] !== 'coast') return 'mountain';
  if (city.island) return side === 'west' ? 'harbor' : 'beach';
  return HARBOR_CITIES.has(city.id) ? 'harbor' : 'beach';
}

// Real cross-country roads between neighbouring cities. Each one leaves a
// mountain district and arrives in the facing district of the other city, so
// walking east always arrives on the other city's west side (and vice versa).
// Coastal sides never link: heading toward the sea always ends at the sea.
const LINKS = [
  ['taoyuan', 'taipei', ['林口台地', 'Linkou Plateau', '林口台地']],
  ['taipei', 'yilan', ['雪山隧道', 'Hsuehshan Tunnel', '雪山トンネル']],
  ['taichung', 'nantou', ['中投公路', 'Taichung–Nantou Highway', '中投公路']],
  ['nantou', 'hualien', ['中橫公路', 'Central Cross-Island Highway', '中部横貫公路']],
  ['kaohsiung', 'taitung', ['南橫公路', 'Southern Cross-Island Highway', '南部横貫公路']],
];

/** The road leaving city `ci` through its `side` district, or null. { to, toSide, name } */
export function linkFor(cities, ci, side) {
  const id = cities[ci]?.id;
  for (const [west, east, name] of LINKS) {
    const from = side === 'east' ? west : east, to = side === 'east' ? east : west;
    if (id === from) return { to: cities.findIndex(c => c.id === to), toSide: side === 'east' ? 'west' : 'east', name };
  }
  return null;
}

export const boundaryLabel = (city, side) => geographyFor(city)[side] || 'forest';
