// ===== HUD、城市名稱、提示訊息 =====
import { $, clamp, esc } from '../core/util.js';
import { CITIES } from '../data/index.js';
import { LI, Z, rb } from '../i18n.js';
import { S, maxFat } from '../state.js';

export function hud(){if(!S)return;$('#hud').hidden=false;
 S.fat=clamp(S.fat,0,maxFat());
 $('#rubyBtn').innerHTML=Z(S.settings.ruby==='off'?'off':S.settings.ruby);$('#menuBtn').innerHTML=Z('menu')}
let tagT;
export function showCityTag(){const t=$('#cityTag');const c=CITIES[S.city];t.innerHTML=`${rb(c.zh)} <span class="tl">${S.city+1}/22 · ${esc(LI()===2?c.ja:c.en)}</span>`;t.style.opacity=1;clearTimeout(tagT);tagT=setTimeout(()=>t.style.opacity=0,2800)}
/** 城市之間的道路：顯示「苗栗 → 臺中」 */
export function showRouteTag(){const t=$('#cityTag'),a=CITIES[S.route.i],b=CITIES[S.route.i+1];
 t.innerHTML=`${rb(a.zh+'→'+b.zh)} <span class="tl">${esc(LI()===2?`${a.ja} → ${b.ja}`:`${a.en} → ${b.en}`)}</span>`;t.style.opacity=1;clearTimeout(tagT);tagT=setTimeout(()=>t.style.opacity=0,2800)}
let toastT;
export function toast(l){const t=$('#toast');t.classList.toggle('top',!$('#ov').hidden);t.innerHTML=Array.isArray(l)?`${rb(l[0])}<span class="tl">${esc(l[LI()])}</span>`:esc(l);t.hidden=false;t.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.hidden=true,400)},2200)}
