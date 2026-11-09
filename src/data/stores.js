// 臺灣常見連鎖超商。地圖只儲存 id；色彩與招牌集中在這裡，避免生成邏輯綁死美術。
export const STORE_BRANDS = [
  { id: 'seven', name: '7-ELEVEN', sign: '7-ELEVEN', primary: '#168447', secondary: '#f58220', stripes: ['#168447', '#f58220', '#d9272e'] },
  { id: 'family', name: '全家 FamilyMart', sign: '全家 FamilyMart', primary: '#168b4b', secondary: '#2680c2', stripes: ['#2680c2', '#ffffff', '#168b4b'] },
  { id: 'hilife', name: '萊爾富 Hi-Life', sign: '萊爾富 Hi-Life', primary: '#df2638', secondary: '#243f8f', stripes: ['#243f8f', '#ffffff', '#df2638'] },
  { id: 'ok', name: 'OK mart', sign: 'OK mart', primary: '#d9272e', secondary: '#245393', stripes: ['#245393', '#ffffff', '#d9272e'] },
];

// 不是連鎖店的雜貨店：老街的柑仔店、山上的小商店。只出現在分區和道路上，城裡還是連鎖超商。
export const LOCAL_SHOPS = [
  { id: 'kamtsa', name: '柑仔店', sign: '柑仔店', primary: '#a8432c', secondary: '#e8c873', stripes: ['#e8c873', '#a8432c', '#5b3525'] },
  { id: 'grocer', name: '雜貨店', sign: '雜貨店', primary: '#2f6b4f', secondary: '#f0b43c', stripes: ['#f0b43c', '#ffffff', '#2f6b4f'] },
  { id: 'fresh', name: '生鮮超市', sign: '生鮮超市', primary: '#1f6fb2', secondary: '#ff9f2e', stripes: ['#ff9f2e', '#ffffff', '#1f6fb2'] },
];
export const ALL_SHOPS = [...STORE_BRANDS, ...LOCAL_SHOPS];
export const storeBrand = id => ALL_SHOPS.find(brand => brand.id === id) || STORE_BRANDS[0];
