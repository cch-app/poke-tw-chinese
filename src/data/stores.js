// 臺灣常見連鎖超商。地圖只儲存 id；色彩與招牌集中在這裡，避免生成邏輯綁死美術。
export const STORE_BRANDS = [
  { id: 'seven', name: '7-ELEVEN', sign: '7-ELEVEN', primary: '#168447', secondary: '#f58220', stripes: ['#168447', '#f58220', '#d9272e'] },
  { id: 'family', name: '全家 FamilyMart', sign: '全家 FamilyMart', primary: '#168b4b', secondary: '#2680c2', stripes: ['#2680c2', '#ffffff', '#168b4b'] },
  { id: 'hilife', name: '萊爾富 Hi-Life', sign: '萊爾富 Hi-Life', primary: '#df2638', secondary: '#243f8f', stripes: ['#243f8f', '#ffffff', '#df2638'] },
  { id: 'ok', name: 'OK mart', sign: 'OK mart', primary: '#d9272e', secondary: '#245393', stripes: ['#245393', '#ffffff', '#d9272e'] },
];

export const storeBrand = id => STORE_BRANDS.find(brand => brand.id === id) || STORE_BRANDS[0];
