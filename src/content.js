// ===== 題庫整理 =====
import { ANIMALS, CITIES, LEAGUE } from './data/index.js';

export function norm(a,lv){const t=a[0];
 if(t==='v')return{t,w:a[1],en:a[2],ja:a[3],lv:lv??a[4]};
 if(t==='g')return{t,s:a[1],a:a[2],d:a[3].split('|'),en:a[4],ja:a[5],lv:lv??a[6]};
 return{t,s:a[1],en:a[2],ja:a[3],lv:lv??a[4]}}
export const POOLS=CITIES.map(c=>c.pool.map(x=>norm(x)));
export const cityLv=ci=>1+ci*3;
export const ALLV=POOLS.flat().filter(i=>i.t==='v').concat(ANIMALS.flatMap(a=>a.items.filter(i=>i[0]==='v').map(i=>norm(i,30))),LEAGUE[5].pool.filter(i=>i[0]==='v').map(i=>norm(i)));
export const ALLL=POOLS.flat().filter(i=>i.t==='l').concat(ANIMALS.flatMap(a=>a.items.filter(i=>i[0]==='l').map(i=>norm(i,30))));
