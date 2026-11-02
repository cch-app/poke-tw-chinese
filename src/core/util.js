// ===== 共用小工具 =====
export const $=s=>document.querySelector(s);
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
export const pick=a=>a[Math.floor(Math.random()*a.length)];
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
export const OPPOSITE={up:'down',down:'up',left:'right',right:'left'};
