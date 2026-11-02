// ===== HUD、城市名稱、提示訊息 =====
import { $, clamp, esc } from '../core/util.js';
import { CITIES } from '../data/index.js';
import { LI, Z, rb } from '../i18n.js';
import { S, maxFat, xpNeed } from '../state.js';

export function hud(){if(!S)return;$('#hud').hidden=false;$('#hName').textContent=S.name;$('#hLv').textContent='Lv '+S.lv;
 S.fat=clamp(S.fat,0,maxFat());const f=S.fat/maxFat();$('#hFat').style.width=Math.round(100*f)+'%';$('#hFatBar').classList.toggle('low',f<.25);$('#hFatBar').classList.toggle('mid',f>=.25&&f<.5);
 $('#hFatL').innerHTML=Z('fatigue');$('#hFatN').textContent=`${S.fat}/${maxFat()}`;$('#hXp').style.width=Math.round(100*S.xp/xpNeed(S.lv))+'%';
 $('#hMoney').textContent='NT$'+S.money;$('#hBadge').textContent=`★ ${S.badges}/22`;
 $('#rubyBtn').innerHTML=Z(S.settings.ruby==='off'?'off':S.settings.ruby);$('#menuBtn').innerHTML=Z('menu')}
let tagT;
export function showCityTag(){const t=$('#cityTag');const c=CITIES[S.city];t.innerHTML=`${rb(c.zh)} <span class="tl">${S.city+1}/22 · ${esc(LI()===2?c.ja:c.en)}</span>`;t.style.opacity=1;clearTimeout(tagT);tagT=setTimeout(()=>t.style.opacity=0,2800)}
let toastT;
export function toast(l){const t=$('#toast');t.classList.toggle('top',!$('#ov').hidden);t.innerHTML=Array.isArray(l)?`${rb(l[0])}<span class="tl">${esc(l[LI()])}</span>`:esc(l);t.hidden=false;t.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.hidden=true,400)},2200)}
