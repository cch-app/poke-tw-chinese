// Regional border rules shared by town maps and the inter-city route system.
// The global map uses west/east as x, so every town gets an explicit local
// coastline and mountain side instead of a generic wall of trees.

const EASTERN_CITIES = new Set(['taitung', 'hualien', 'yilan']);
const NORTHERN_CITIES = new Set(['keelung', 'newtaipei', 'taipei']);

export function geographyFor(city) {
  if (!city) return { west: 'mountain', east: 'mountain', north: 'forest', south: 'forest' };
  if (city.island) return { west: 'coast', east: 'coast', north: 'coast', south: 'coast' };
  if (city.id === 'nantou') return { west: 'mountain', east: 'mountain', north: 'forest', south: 'forest' };
  if (EASTERN_CITIES.has(city.id)) return { west: 'mountain', east: 'coast', north: 'forest', south: 'coast' };
  if (NORTHERN_CITIES.has(city.id)) return { west: 'mountain', east: 'coast', north: 'coast', south: 'mountain' };
  // Taiwan's western corridor: the sea is to the west and the central range
  // is immediately beyond the eastern edge of each city district.
  return { west: 'coast', east: 'mountain', north: 'forest', south: 'forest' };
}

export const boundaryLabel = (city, side) => geographyFor(city)[side] || 'forest';
