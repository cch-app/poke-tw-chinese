// ===== 對話框與選項 =====
import { $, esc } from '../core/util.js';
import { LI, Z, rb, rbTw } from '../i18n.js';
import { baseMode, mode, setMode } from '../scene.js';
import { S } from '../state.js';

let dq=[],dcb=null,dwho='';
export function dialog(lines,cb,who){dq=lines.slice();dcb=cb||null;dwho=who||'';setMode('dialog');nextLine()}
export let tw=null;
export function showLine(l,who){const box=$('#dlg');box.innerHTML=`${who?`<span class="who">${rb(who)}</span>`:''}<div class="dtext">${rbTw(l[0])}</div>${l[LI()]?`<span class="tl twh">${esc(l[LI()])}</span>`:''}<span class="more twh"></span>`;box.hidden=false;
 const els=[...box.querySelectorAll('.dtext > .twh')];let n=0;return new Promise(res=>{const fin=()=>{clearInterval(t);box.querySelectorAll('.twh').forEach(e=>e.classList.remove('twh'));tw=null;res()};
  const t=setInterval(()=>{if(n<els.length){els[n].classList.remove('twh');n++}else fin()},26);tw={fin}})}
export const say=(lines,who)=>new Promise(r=>dialog(lines,r,who));
export async function ask(line,who,items,opt){setMode('dialog');await showLine(line,who);const i=await choice(items,opt);$('#dlg').hidden=true;setMode(baseMode());return i}
export let CH=null;
export function choice(items,opt={}){if(CH)CH.cancel();return new Promise(res=>{const box=document.createElement('div');box.className='gb choice '+(opt.cls||'');
 box.innerHTML=(opt.title?`<div class="chtitle">${opt.title}</div>`:'')+items.map((it,i)=>`<button class="chi" data-i="${i}">${it}</button>`).join('');
 document.body.appendChild(box);const prev=mode;setMode('choice');
 const close=i=>{box.remove();CH=null;setMode((prev==='choice'||prev==='dialog')?(baseMode()):prev);res(i)};
 CH={box,close,cancel:()=>close(-1)};box.querySelectorAll('.chi').forEach(b=>b.onclick=()=>close(+b.dataset.i));box.querySelector('.chi').focus()})}
export function qtyBox(title,price){return new Promise(res=>{const max=Math.max(0,Math.min(99,Math.floor(S.money/price)));if(!max){res(0);return}let q=1;
 const box=document.createElement('div');box.className='gb choice qty';document.body.appendChild(box);const prev=mode;setMode('choice');
 const close=v=>{box.remove();CH=null;setMode(prev==='choice'||prev==='dialog'?(baseMode()):prev);res(v)};
 const draw=()=>{box.innerHTML=`<div class="chtitle">${title}</div><div class="qrow"><button class="qb" data-d="-1" aria-label="-1">▼</button><span class="qn">×${String(q).padStart(2,'0')}</span><button class="qb" data-d="1" aria-label="+1">▲</button></div><div class="qt">NT$${q*price}</div><div class="qbtns"><button class="chi" id="qOk">${Z('ok')}</button><button class="chi" id="qNo">${Z('cancel')}</button></div>`;
  box.querySelectorAll('.qb').forEach(b=>b.onclick=()=>adj(+b.dataset.d));box.querySelector('#qOk').onclick=()=>close(q);box.querySelector('#qNo').onclick=()=>close(0);box.querySelector('#qOk').focus()};
 const adj=d=>{q=Math.max(1,Math.min(max,q+d));if(q<1)q=max;draw()};
 CH={box,close:()=>close(q),cancel:()=>close(0),adj};draw()})}
export async function healFx(){const f=document.createElement('div');f.className='heal';document.body.appendChild(f);await new Promise(r=>setTimeout(r,900));f.remove()}
export function nextLine(){if(tw){tw.fin();return}const box=$('#dlg');if(!dq.length){box.hidden=true;if(mode==='dialog')setMode(baseMode());const f=dcb;dcb=null;if(f)f();return}
 showLine(dq.shift(),dwho)}
export function initDialog(){$('#dlg').addEventListener('click',()=>{if(mode==='dialog')nextLine();else if(tw)tw.fin()});}
