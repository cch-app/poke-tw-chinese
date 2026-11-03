// ===== 人物外觀 =====
// 外觀物件會當成貼圖快取的鍵，所以同一個人每次都要回傳同一個物件。
import { shade } from '../art.js';
import { CITIES, TRAINERS } from '../data/index.js';
import { S } from '../state.js';

const PLAYER={hair:'#3a2618',top:'#14b3a4',trim:'#ffffff',bottom:'#2b3a66',shoes:'#ff5b4a',style:'cap',cap:'#ff5b4a',pack:'#ffc93c'};
const PLAYER_F={hair:'#4a2a1a',top:'#ff7a6b',trim:'#ffffff',bottom:'#2b3a66',shoes:'#ffffff',style:'long',ribbon:'#ffc93c',pack:'#14b3a4',skirt:'#2b3a66'};
export function playerLook(gender=S&&S.gender){return gender==='f'?PLAYER_F:PLAYER}
const trainerLooks=new WeakMap();
/** TRAINERS 裡的一種訓練家 → 外觀 */
export function lookFromTrainer(d){let L=trainerLooks.get(d);if(!L){L={hair:d.hair,top:d.top,bottom:'#3d4766',style:d.style,cap:'#3a7bd5'};trainerLooks.set(d,L)}return L}
export const tdata=t=>t.guard?GUARD:TRAINERS[t.cls];
export function trainerLook(t){return t.look||lookFromTrainer(TRAINERS[t.cls])}
export const CLERK={inn:{hair:'#3b2a1a',top:'#ff5b4a',trim:'#fff',bottom:'#2b3a66',style:'bun'},store:{hair:'#141210',top:'#14b3a4',trim:'#ff9f2e',bottom:'#2b3a66',style:'short'},
 tea:{hair:'#5a3a22',top:'#d9a066',trim:'#fff',bottom:'#3d4766',style:'pony'},coffee:{hair:'#2a1b14',top:'#8a5a3b',trim:'#ffd35a',bottom:'#3d4766',style:'bun'},temple:{hair:'#a9a59a',top:'#f2b632',trim:'#c8372d',bottom:'#3d4766',style:'short'}};
const GUARD={zh:'道館守護人員',en:"Gym guard",ja:"ジムトレーナー",hi:['想挑戰館主？先過我這關！',"Want to face the leader? Get past me first!","ジムリーダーに挑戦したい？まずは私を倒して！"],lose:['你可以往前走了！',"You may go on ahead!","先へ進んでいいよ！"]};
export function guardLook(ci,k){const c=CITIES[ci];return{hair:['#141210','#3b2a1a','#2a1d18'][k%3],top:shade(c.roof,-.1),trim:'#ffd35a',bottom:'#1b2340',style:['short','pony','cap'][k%3],cap:'#1b2340'}}
export function leaderLook(ci){const c=CITIES[ci];return{hair:['#2a1d18','#3b2a1a','#141210','#5a3a22'][ci%4],top:c.roof,trim:'#ffd35a',bottom:'#2b3a66',style:['short','pony','cap','bun','short'][ci%5],cap:shade(c.roof,-.2)}}
