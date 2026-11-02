// ===== 對戰畫面：出題、計分、昏倒 =====
import { drawAnimal, drawChar, ell, lg, shade } from '../art.js';
import { cityLv } from '../content.js';
import { $, esc, pick } from '../core/util.js';
import { ANIMALS, CITIES } from '../data/index.js';
import { T, Z, rb, tr } from '../i18n.js';
import { dmgFor, gainMoney, gainXP, markSeen, xpFor } from '../progress.js';
import { makeQ } from '../quiz.js';
import { hush, speak, ttsOK } from '../speech.js';
import { MAP, S, TOWN, has, innFee, maxFat, petLv, save, setMap } from '../state.js';
import { hud } from '../ui/hud.js';
import { btn, openPanel } from '../ui/panel.js';
import { playerLook } from '../world/looks.js';
import { showMap } from '../world/overworld.js';

export let B=null;
export function startBattle(foe){B={foe,cut:has('cat')?1+Math.floor((petLv('cat')-1)/5):0,done:0,total:foe.total||3,hits:0};
 openPanel(`<div class="arena"><canvas id="arenaCv"></canvas>
  <div class="card bcard foe"><div class="nm">${rb(foe.zh)}<span class="tl">${esc(foe.sub)}</span><span class="lv">Lv ${foe.lv}</span></div><div class="segs" id="foeSeg"></div></div>
  <div class="card bcard mine"><div class="nm">${esc(S.name)} <span class="lv">Lv ${S.lv}</span></div><div class="lbl">${Z('fatigue')} <span id="bFatN"></span></div><div class="bar st" id="bFatBar"><i id="bFat"></i></div></div></div>
  <div class="pbody" id="bbody"></div>`,'battle');
 requestAnimationFrame(drawArena);segs();fatBar()}
function drawArena(){const c=$('#arenaCv');if(!c||!B)return;const w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);c.width=w*d;c.height=h*d;const g=c.getContext('2d');g.scale(d,d);
 const city=CITIES[S.city];g.fillStyle=lg(g,0,0,0,h,['#9fd6ff','#e8f6ff']);g.fillRect(0,0,w,h);
 g.fillStyle=shade(city.roof,.55);g.beginPath();g.moveTo(0,h*.55);for(let x=0;x<=w;x+=w/8)g.lineTo(x,h*.42+Math.sin(x*.02)*h*.06);g.lineTo(w,h);g.lineTo(0,h);g.fill();
 g.fillStyle=lg(g,0,h*.55,0,h,['#9fdc7a','#6cbf55']);g.fillRect(0,h*.6,w,h*.4);
 ell(g,w*.72,h*.58,Math.min(w*.2,170),h*.09);g.fillStyle='#7ccb62';g.fill();g.lineWidth=3;g.strokeStyle='rgba(27,35,64,.35)';g.stroke();
 ell(g,w*.24,h*1.02,Math.min(w*.22,190),h*.1);g.fillStyle='#7ccb62';g.fill();g.stroke();
 const s=Math.min(h*.42,w*.26);
 if(B.foe.kind==='person')drawChar(g,w*.72,h*.6,s,B.foe.look,'down',0,true);else drawAnimal(g,B.foe.kind,w*.72,h*.61,s*1.1);
 drawChar(g,w*.2,h*1.22,s*1.05,playerLook(),'up',0,true)}
export function segs(){const el=$('#foeSeg');if(!el)return;if(B.love!=null){el.style.cssText='display:grid;grid-template-columns:auto 1fr;gap:3px 6px;align-items:center';el.innerHTML=`<span class="lbl">${Z('affection')}</span><span class="segs" style="margin:0">${Array.from({length:3},(_,i)=>`<i class="${i<B.love?'love':'empty'}"></i>`).join('')}</span><span class="lbl">${Z('fatigue')}</span><span class="segs" style="margin:0">${Array.from({length:B.total},(_,i)=>`<i class="${i<B.hits?'gone':''}"></i>`).join('')}</span>`;return}
 el.innerHTML=Array.from({length:B.total},(_,i)=>`<i class="${i<B.hits?'gone':''}"></i>`).join('')}
function fatBar(){const f=S.fat/maxFat();const b=$('#bFat');if(b){b.style.width=Math.round(100*f)+'%';$('#bFatBar').classList.toggle('low',f<.25);$('#bFatBar').classList.toggle('mid',f>=.25&&f<.5);$('#bFatN').textContent=`${S.fat}/${maxFat()}`}hud()}
export function askQ(q,next,onAnswer){const body=$('#bbody');const listen=!!q.audio,can=ttsOK();
 let h=`<div class="q">`;
 if(q.passage)h+=`<div class="passage">${rb(q.passage)}</div>`;
 h+=`<div class="qlabel">${Z(q.label)}<span class="tl">${T(q.label)}</span></div>`;
 if(q.qzh)h+=`<div class="qprompt sm">${rb(q.qzh)}</div>`;
 if(q.zh)h+=`<div class="qprompt">${rb(q.zh)}</div>`;
 if(q.tl)h+=`<div class="qprompt tlp">${esc(q.tl)}</div>`;
 if(listen){if(can)h+=`<div class="row"><button class="play" id="playBtn" data-autofocus>▶ ${Z('play')}<span class="tl">${T('play')}</span></button>${has('bird')?`<button class="play" id="slowBtn" style="background:#4a5478">▶ ${Z('slow')}<span class="tl">${T('slow')}</span></button>`:''}</div>`;
  else h+=`<div class="note">${Z('noVoice')}<br>${T('noVoice')}</div>${q.hideText?'':`<div class="qprompt sm">${rb(q.audio)}</div>`}`}
 h+=`<div class="opts">${q.opts.map((o,i)=>`<button class="opt ${q.optZh?'':'tlo'}" data-i="${i}"><span class="k">${i+1}</span><span>${q.optZh?rb(o):esc(o)}</span></button>`).join('')}</div>`;
 if(B.cut)h+=`<div class="row"><button class="btn alt" id="cutBtn">🐾 ${rb('貓的直覺')}<span class="tl">${esc(tr(['',ANIMALS[0].ab[0],ANIMALS[0].ab[1]]))}</span></button></div>`;
 h+=`<div class="fb" id="fb"></div></div>`;body.innerHTML=h;
 if(listen&&!can&&q.hideText){/* 沒有臺灣語音時，選項本身就是文字，改用意思題 */}
 const pb=$('#playBtn');if(pb){pb.onclick=()=>speak(q.audio);setTimeout(()=>speak(q.audio),400)}
 const sb=$('#slowBtn');if(sb)sb.onclick=()=>speak(q.audio,.6);
 const cb=$('#cutBtn');if(cb)cb.onclick=()=>{const wr=[...body.querySelectorAll('.opt')].filter(b=>+b.dataset.i!==q.ci&&!b.disabled);if(wr.length){const w=pick(wr);w.classList.add('cut');w.disabled=true}B.cut--;if(B.cut<=0)cb.remove()};
 let done=false;
 body.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const ok=+b.dataset.i===q.ci;
  body.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.i===q.ci)x.classList.add('right')});if(!ok)b.classList.add('wrong');
  const msg=onAnswer(ok,listen&&!can);let fb=ok?`<span class="good">${Z('correct')}</span> <span class="tl" style="display:inline">${T('correct')}</span> `:`<span class="bad">${Z('wrong')}</span> <span class="tl" style="display:inline">${T('wrong')}</span> `;
  fb+=`<div>${msg}</div>`;if(q.exZh&&(q.it.t!=='v'||q.toneQ))fb+=`<div>${rb(q.exZh)}</div>`;if(q.exTl)fb+=`<span class="tl">${esc(q.exTl)}</span>`;
  $('#fb').innerHTML=fb+`<div class="row" style="margin-top:8px">${btn('nextBtn','next')}</div>`;const nb=$('#nextBtn');nb.focus({preventScroll:true});nb.scrollIntoView?.({block:'nearest'});nb.onclick=()=>{hush();next()}})}
export function score(it,ok,textOnly){const lv=it.lv??cityLv(S.city);
 if(!ok){const d=dmgFor(lv);S.fat=Math.max(0,S.fat-d);fatBar();return d?`<span class="bad">${Z('fatigue')} −${d}</span>`:`🍀 ${rb('好運！這次不會累。')}`}
 let{g,mult}=xpFor(lv);if(textOnly)g=Math.ceil(g/2);const m=gainMoney(4+Math.round(lv/2));gainXP(g);fatBar();
 const note=mult<.6?` · ${Z('tooEasy')}<span class="tl" style="display:inline"> ${T('tooEasy')}</span>`:mult>1.3?` · ${Z('bonus')}<span class="tl" style="display:inline"> ${T('bonus')}</span>`:'';
 return`<b>+${g} EXP · +NT$${m}</b>${note}`}
export function endCard(lines,btns){$('#bbody').innerHTML=`<div class="q">${lines}<div class="row">${btns}</div></div>`;const b=$('#bbody button');if(b)b.focus()}
export const toMapBtn=()=>`<button class="btn" data-close>${Z('toMap')}<span class="tl">${T('toMap')}</span></button>`;
export function runSeries(items,opts){let i=0;
 const step=()=>{if(S.fat<=0)return faint();
  if(i>=items.length)return opts.end();
  const it=items[i];askQ(opts.make?opts.make(it):makeQ(it),()=>{i++;step()},(ok,textOnly)=>{markSeen(it,ok);if(ok){B.hits++;segs()}opts.onAns&&opts.onAns(ok);return score(it,ok,textOnly)})};
 step()}
export function faint(){const fee=Math.min(S.money,innFee());S.money-=fee;S.fat=maxFat();if(MAP.kind==='in'){setMap(TOWN);showMap()}S.x=MAP.inn.x;S.y=MAP.inn.y;S.dir='down';save();hud();
 endCard(`<div class="qprompt">${Z('faint')}</div><div class="qprompt tlp">${T('faint')}</div><div class="note">${Z('faintMsg')} ${T('faintMsg')} · ${Z('fee')} NT$${fee}</div>`,toMapBtn())}
