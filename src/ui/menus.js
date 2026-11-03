// ===== 選單 =====
import { badgeSVG, drawAnimal } from '../art.js';
import { leagueTier } from '../battle/league.js';
import { ALLV } from '../content.js';
import { $, esc } from '../core/util.js';
import { ANIMALS, CITIES, LEAGUE, TW_PTS, UI } from '../data/index.js';
import { LI, T, Z, itemTr, rb, tr } from '../i18n.js';
import { mode } from '../scene.js';
import { bootBackdrop, titleScreen } from '../scenes/title.js';
import { speak, twVoices } from '../speech.js';
import { S, clearSave, has, maxFat, petName, petNeed, save, xpNeed } from '../state.js';
import { refreshView, travel } from '../world/overworld.js';
import { choice, say } from './dialog.js';
import { hud, toast } from './hud.js';
import { backBtn, btn, head, openPanel, wireBack } from './panel.js';
import { renderPixel } from '../render/pixel.js';

export async function mainMenu(){if(mode!=='world')return;const keys=['map','party','bag','badges','dex','save','settings','close'];
 const stats=`${Z('fatigue')} ${S.fat}/${maxFat()} · EXP ${S.xp}/${xpNeed(S.lv)} · NT$${S.money} · ★${S.badges}/22`;
 const i=await choice(keys.map(k=>`${Z(k)} <span class="tl" style="display:inline">${T(k)}</span>`),{cls:'start',title:`${esc(S.name)} · Lv ${S.lv}<span class="tl menuStats">${stats}</span>`});
 if(i<0||keys[i]==='close')return;
 if(keys[i]==='save'){save();return say([UI.savedLong])}
 ({map:mapMenu,party:partyMenu,bag:bagMenu,badges:badgeMenu,dex:dexMenu,settings:settingsMenu})[keys[i]]()}
function mapMenu(){const open=ci=>ci<=Math.min(S.badges,21);
 let svg=`<svg class="mapsvg" viewBox="-32 -8 134 172" role="img" aria-label="Taiwan map"><rect x="-32" y="-8" width="134" height="172" rx="8" fill="#c9ecff"/>
 <polygon points="${TW_PTS}" fill="#8bd36b" stroke="#1b2340" stroke-width="1.4"/><path d="M60 40 Q66 70 58 100 Q52 118 48 130" fill="none" stroke="#4fae54" stroke-width="5" stroke-linecap="round" opacity=".6"/>
 <g fill="#8bd36b" stroke="#1b2340" stroke-width=".8"><circle cx="-14" cy="84" r="3"/><circle cx="-10" cy="88" r="2"/><circle cx="-17" cy="89" r="1.6"/></g>
 <g fill="none" stroke="#1b2340" stroke-width=".6" stroke-dasharray="2 1.5"><rect x="-29" y="-4" width="26" height="22" rx="3"/><rect x="-29" y="34" width="26" height="22" rx="3"/></g>
 <g fill="#8bd36b" stroke="#1b2340" stroke-width=".8"><ellipse cx="-16" cy="7" rx="4" ry="2.5"/><ellipse cx="-11" cy="3" rx="2" ry="1.5"/><path d="M-24 44 Q-18 38 -10 42 Q-8 48 -16 49 Q-22 50 -24 44Z"/></g>
 <polyline points="${CITIES.map(c=>c.x+','+c.y).join(' ')}" fill="none" stroke="#ff5b4a" stroke-width="1" stroke-dasharray="2.5 2" opacity=".8"/>`;
 CITIES.forEach((c,i)=>{const got=S.badges>i,here=i===S.city,u=open(i);svg+=`<g><circle cx="${c.x}" cy="${c.y}" r="${here?4.6:3.6}" fill="${got?'#ff5b4a':u?'#fffaf0':'#c9ecff'}" stroke="${here?'#ffc93c':'#1b2340'}" stroke-width="${here?1.8:1}"/><text x="${c.x}" y="${c.y+1.4}" font-size="3.6" font-weight="800" text-anchor="middle" fill="${got?'#fffaf0':'#1b2340'}" font-family="sans-serif">${i+1}</text></g>`});
 svg+=`<g transform="translate(78 4)"><path d="M0 -4 L3 2 L-3 2Z" fill="${S.badges>=22?'#ffc93c':'#c9ecff'}" stroke="#1b2340" stroke-width=".6"/></g></svg>`;
 const list=CITIES.map((c,i)=>`<button data-ci="${i}" ${open(i)?'':'disabled'} class="${i===S.city?'here':''} ${S.badges>i?'got':''}"><span class="n">${i+1}</span><span>${rb(c.zh)}<span class="tl">${esc(LI()===2?c.ja:c.en)}</span></span></button>`).join('');
 const lg2=LEAGUE.map((L,t)=>`<button data-lg="${t}" ${S.badges>=22&&t<=S.league?'':'disabled'} class="${t<S.league?'got':''}"><span class="n">${t+1}</span><span>${rb(L.zh)}<span class="tl">${esc(tr(['',L.en,L.ja]))}</span></span></button>`).join('');
 openPanel(head('map',backBtn())+`<div class="pbody"><div class="mapwrap"><div>${svg}</div><div>
  <div class="note">${rb('拿到徽章的城市之間可以自由來去。')} ${esc(tr(['',"Travel freely between any cities you have unlocked.","開放した町の間は自由に移動できます。"]))}</div><div class="clist" style="margin-top:8px">${list}</div>
  <div class="note" style="margin-top:12px">${Z('league')} · ${esc(tr(['',"Six tiers, matching TOCFL","6段階、TOCFLに対応"]))} ${S.badges<22?'· '+T('needAll'):''}</div><div class="clist" style="margin-top:6px">${lg2}</div></div></div></div>`);wireBack();
 $('#panel').querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>travel(+b.dataset.ci,'inn'));
 $('#panel').querySelectorAll('[data-lg]').forEach(b=>b.onclick=()=>leagueTier(+b.dataset.lg))}
function partyMenu(){const pets=S.pets||[];
 const card=(p,i)=>{const a=ANIMALS.find(x=>x.id===p.sp);const need=petNeed(p.lv);return`<div class="tile pet"><span data-an="${a.id}"></span><div style="flex:1;min-width:0">
  <div class="t">${rb(petName(p))} <span class="lv">Lv ${p.lv}</span></div><div class="d">${rb(a.zh)} · ${esc(tr(['',a.en,a.ja]))}</div>
  <div class="bar xp" style="margin:4px 0"><i style="width:${Math.round(100*p.xp/need)}%"></i></div><div class="d">EXP ${p.xp}/${need} · ${esc(tr(['',...a.ab]))}</div>
  <div class="row" style="margin-top:6px"><button class="btn sun" data-feed="${i}">${Z('feed')} <span class="tl">×${S.bag.snack}</span></button><button class="btn alt" data-ren="${i}">${Z('rename')}</button></div><div data-renbox="${i}"></div></div></div>`};
 const unseen=ANIMALS.filter(a=>!has(a.id)).map(a=>`<div class="tile dim"><span data-an="${a.id}" data-dim="1"></span><div><div class="t">？？？</div><div class="d">${a.minCity>0?rb(CITIES[a.minCity].zh)+'+':''}</div></div></div>`).join('');
 openPanel(head('party',backBtn())+`<div class="pbody"><div class="note">${rb('用寵物零食餵牠，牠就會累積經驗、提升等級，能力也會變強。')}<br>${esc(tr(['',"Feed pet treats to give your companions EXP. As they level up, their abilities get stronger.","おやつをあげると仲間に経験値が入り、レベルが上がると能力も強くなります。"]))}</div>
 <div class="grid">${pets.map(card).join('')||`<div class="note">${rb('還沒有夥伴。')}</div>`}</div>${unseen?`<div class="grid">${unseen}</div>`:''}</div>`);wireBack();
 $('#panel').querySelectorAll('[data-an]').forEach(s=>{const id=s.dataset.an;const c=document.createElement('canvas');c.width=120;c.height=120;c.style.cssText='width:60px;height:60px;flex:none'+(s.dataset.dim?';filter:brightness(0) opacity(.25)':'');renderPixel(c,60,60,2,3,g=>drawAnimal(g,id,30,56,46));s.replaceWith(c)});
 $('#panel').querySelectorAll('[data-feed]').forEach(b=>b.onclick=()=>{const p=pets[+b.dataset.feed];if(S.bag.snack<1)return toast(UI.noTreat);S.bag.snack--;p.xp+=15;let up=false;while(p.xp>=petNeed(p.lv)){p.xp-=petNeed(p.lv);p.lv++;up=true}
  if(up)toast([`${petName(p)}升到Lv ${p.lv}了！`,`${petName(p)} grew to Lv ${p.lv}!`,`${petName(p)}はLv ${p.lv}になった！`]);else toast(UI.petFed);save();hud();partyMenu()});
 $('#panel').querySelectorAll('[data-ren]').forEach(b=>b.onclick=()=>{const i=+b.dataset.ren,box=$(`[data-renbox="${i}"]`);box.innerHTML=`<div class="row" style="margin-top:6px"><input type="text" maxlength="8" value="${esc(pets[i].nick)}" style="flex:1;min-width:0"><button class="btn teal">${Z('ok')}</button></div>`;
  const inp=box.querySelector('input');inp.focus();const ok=()=>{pets[i].nick=inp.value.trim().slice(0,8);save();partyMenu()};box.querySelector('button').onclick=ok;inp.onkeydown=e=>{if(e.key==='Enter')ok()}})}
function bagMenu(){const row=(k,desc,usable)=>`<div class="tile"><div style="flex:1;min-width:0"><div class="t">${Z(k)} ×${S.bag[k]}</div><div class="d">${T(k)} · ${esc(desc)}</div></div>${usable?`<button class="btn teal" data-use="${k}" ${S.bag[k]<1?'disabled':''}>${Z('use')}</button>`:''}</div>`;
 openPanel(head('bag',backBtn())+`<div class="pbody"><div class="grid">${row('snack',tr(['',"Tames wild animals; feed it to companions in the Companions menu","野生の動物を仲間にしたり、仲間にあげたりできる"]),false)}${row('drink',tr(['',"Restores 50% stamina","スタミナを50%回復"]),true)}${row('bubble',tr(['',"Restores 35% stamina","スタミナを35%回復"]),true)}${row('coffee',tr(['',"Restores 25% stamina and grants luck for the next mistake","スタミナを25%回復し、次の間違いを1回無効にする"]),true)}</div><div class="note">${Z('fatigue')} ${S.fat}/${maxFat()} · NT$${S.money}</div></div>`);wireBack();
 $('#panel').querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{const k=b.dataset.use;if(S.bag[k]<1)return;S.bag[k]--;S.fat=Math.min(maxFat(),S.fat+Math.round(maxFat()*(k==='drink'?.5:k==='bubble'?.35:.25)));if(k==='coffee')S.luck=Math.max(S.luck,1);hud();toast(UI.recovered);bagMenu()})}
function badgeMenu(){openPanel(head('badges',backBtn())+`<div class="pbody"><div class="badges">${CITIES.map((c,i)=>`<div class="badge">${badgeSVG(i,S.badges>i)}<span>${rb(c.zh)}</span><span class="tl">${S.badges>i?esc(c.leader):''}</span></div>`).join('')}</div>
 <div class="note">${Z('league')} ${S.league}/6 ${S.champion?'· '+Z('champion'):''}</div></div>`);wireBack()}
function dexMenu(){const n=Object.keys(S.seen).length;openPanel(head('dex',backBtn())+`<div class="pbody"><div class="note">${n}/${ALLV.length} ${T('words')} · ${esc(tr(['',"Words you meet in battle are recorded here (correct / seen).","バトルで出会った単語がここに記録されます（正解数／出会った数）。"]))}</div>
 <div class="dex">${ALLV.map(v=>{const s=S.seen[v.w];return s?`<div>${rb(v.w)}<small>${esc(itemTr(v))} · ${s.ok}/${s.n}</small></div>`:`<div class="unk">？？？<small>&nbsp;</small></div>`}).join('')}</div></div>`);wireBack()}
function settingsMenu(){const st=S.settings;
 const vs=twVoices.map(v=>`<option value="${esc(v.voiceURI)}" ${v.voiceURI===st.voice?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
 openPanel(head('settings',backBtn())+`<div class="pbody">
 <div class="field"><span class="flbl">${Z('ruby')} <span class="tl">${T('ruby')}</span></span><span class="seg">${['pinyin','zhuyin','off'].map(k=>`<button data-ruby="${k}" aria-pressed="${st.ruby===k}">${Z(k)}</button>`).join('')}</span></div>
 <div class="field"><span class="flbl">${Z('lang')} <span class="tl">${T('lang')}</span></span><span class="seg"><button data-lang="en" aria-pressed="${st.lang==='en'}">English</button><button data-lang="ja" aria-pressed="${st.lang==='ja'}">日本語</button></span></div>
 <label class="field" for="voiceSel"><span class="flbl">${Z('voice')} <span class="tl">${T('voice')}</span></span>${vs?`<select id="voiceSel">${vs}</select>`:`<span class="note">${Z('noVoice')}<br>${T('noVoice')}</span>`}</label>
 <label class="field" for="rateSel"><span class="flbl">${Z('speed')} <span class="tl">${T('speed')}</span></span><select id="rateSel">${[.7,.8,.9,1].map(v=>`<option value="${v}" ${st.rate==v?'selected':''}>${v}×</option>`).join('')}</select></label>
 ${vs?`<div class="row"><button class="btn alt" id="testV">▶ ${rb('你好，歡迎來到臺灣！')}</button></div>`:''}
 <div class="row">${btn('resetBtn','reset','alt')}<span class="note" id="resetNote"></span></div></div>`);wireBack();
 $('#panel').querySelectorAll('[data-ruby]').forEach(b=>b.onclick=()=>{st.ruby=b.dataset.ruby;save();refreshView();hud();settingsMenu()});
 $('#panel').querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{st.lang=b.dataset.lang;save();hud();settingsMenu()});
 const v=$('#voiceSel');if(v)v.onchange=()=>{st.voice=v.value;save()};$('#rateSel').onchange=e=>{st.rate=+e.target.value;save()};
 const tv=$('#testV');if(tv)tv.onclick=()=>speak('你好，歡迎來到臺灣！');
 let armed=false;$('#resetBtn').onclick=()=>{if(!armed){armed=true;$('#resetNote').textContent=tr(['',"Tap again to erase all progress.","もう一度押すと進行状況が消えます。"]);return}clearSave();$('#ov').hidden=true;$('#hud').hidden=true;bootBackdrop();titleScreen()}}
