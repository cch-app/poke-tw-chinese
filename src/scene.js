// ===== 遊戲模式 =====
// 同一時間只有一個模式，決定輸入要交給誰處理：
//   title 標題 · world 在地圖上走動 · dialog 對話 · choice 選項 · menu 面板 · battle 對戰 · cut 過場
// 只能透過 setMode() 切換；想在切換時做事（例如停止走路）用 onModeChange()。
const MODES=new Set(['title','world','dialog','choice','menu','battle','cut']);
export let mode='title';
const listeners=[];
export function setMode(m){if(!MODES.has(m))throw new Error(`unknown mode: ${m}`);if(m===mode)return;const prev=mode;mode=m;listeners.forEach(f=>f(m,prev))}
export const onModeChange=f=>{listeners.push(f)};
/** 關掉對話或選項後要回到的模式：面板開著就回到面板，否則回到地圖。 */
export const baseMode=()=>document.querySelector('#ov').hidden?'world':'menu';
