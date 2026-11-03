// ===== 遭遇：草叢裡的動物與路人、訓練家 =====
import { POOLS, cityLv, norm } from '../content.js';
import { $, esc, pick, shuffle } from '../core/util.js';
import { ANIMALS, TRAINERS } from '../data/index.js';
import { LI, T, Z, rb, tr } from '../i18n.js';
import { gainMoney, gainXP, markSeen, xpFor } from '../progress.js';
import { makeQ } from '../quiz.js';
import { S, has, maxFat, petName, save } from '../state.js';
import { btn, closePanel } from '../ui/panel.js';
import { lookFromTrainer, tdata, trainerLook } from '../world/looks.js';
import { B, askQ, endCard, faint, runSeries, score, segs, startBattle, toMapBtn } from './battle.js';

function poolFor(ci){let p=POOLS[ci].slice();if(ci>0)p=p.concat(shuffle(POOLS[ci-1]).slice(0,4));
 [...new Set(S.pets.map(p=>p.sp))].forEach(id=>{const a=ANIMALS.find(x=>x.id===id);p=p.concat(a.items.map(i=>norm(i,cityLv(ci)+1)))});return p}
export function startEncounter(){const ci=S.city;const ok=ANIMALS.filter(a=>a.minCity<=ci);
 if(Math.random()<.32){let tot=ok.reduce((s,a)=>s+a.w,0),r=Math.random()*tot,a=ok[0];for(const x of ok){r-=x.w;if(r<=0){a=x;break}}animalEncounter(a)}
 else{const d=pick(TRAINERS);personBattle(d,lookFromTrainer(d),cityLv(ci),'wildPerson',d.hi,d.lose,3,null)}}
export function trainerBattle(t){const d=tdata(t);personBattle(d,trainerLook(t),t.lv,t.guard?'guard':'trainer',d.hi,d.lose,t.guard?3:4,t)}
function personBattle(d,look,lv,titleKey,hi,lose,n,trainer){const items=shuffle(poolFor(S.city)).slice(0,n);
 startBattle({kind:'person',zh:d.zh,sub:tr(['',d.en,d.ja]),look,lv,total:n});
 endCard(`<div class="qlabel">${Z(titleKey)}<span class="tl">${T(titleKey)}</span></div><div class="qprompt sm">${rb(hi[0])}</div><div class="tl">${esc(hi[LI()])}</div>`,
  btn('goBtn','start','','data-autofocus')+(trainer?'':btn('runBtn','run','alt')));
 $('#goBtn').onclick=()=>runSeries(items,{end:()=>{const win=B.hits>=Math.ceil(n/2);
   if(win&&trainer){S.beaten[trainer.id]=1;const m=gainMoney(40+trainer.lv*6);gainXP(Math.round(xpFor(trainer.lv).g*1.5));save();
    endCard(`<div class="qprompt">${Z('won')}</div><div class="tl">${T('won')} +NT$${m}</div><div class="qprompt sm">${rb(lose[0])}</div><div class="tl">${esc(lose[LI()])}</div>`,toMapBtn());return}
   endCard(`<div class="qprompt">${Z(win?'won':'lost')}</div><div class="tl">${T(win?'won':'lost')} · ${B.hits}/${n}</div>`,toMapBtn())}});
 const rb2=$('#runBtn');if(rb2)rb2.onclick=closePanel}
function animalEncounter(a){const name=tr(['',a.en,a.ja]);const MAXT=6;let turns=0;
 startBattle({kind:a.id,zh:'野生的'+a.zh,sub:name,lv:cityLv(S.city),total:4});B.love=0;segs();
 const menu=(msgZh,msgTl)=>{if(S.fat<=0)return faint();
  endCard(`<div class="qlabel">${Z('wildAnimal')}<span class="tl">${T('wildAnimal')}</span></div><div class="qprompt sm">${rb(msgZh)}</div><div class="tl">${esc(msgTl)}</div>
   <div class="note">${rb('答對問題或餵零食，好感滿三顆就能馴養！牠累了就會跑回草叢。')}<br>${esc(tr(['',"Answer correctly or feed a snack: three hearts and it joins you. When it runs out of stamina, it heads back into the grass.","正解するかおやつをあげて、ハート3つで仲間に。スタミナが尽きると草むらに帰ってしまう。"]))}${has(a.id)?`<br>${rb('你已經有'+S.pets.filter(p=>p.sp===a.id).length+'隻'+a.zh+'了，還可以再馴養。')}`:''}</div>`,
   btn('tQ','answer','','data-autofocus')+btn('tS','feed','sun',S.bag.snack<1?'disabled':'')+` <span class="note">${Z('snack')} ×${S.bag.snack}</span>`+btn('tR','leave','alt'));
  $('#tR').onclick=closePanel;
  $('#tS').onclick=()=>{S.bag.snack--;B.love++;turns++;segs();after(`${a.zh}吃了零食，很開心！`,tr(['',`The ${a.en.toLowerCase()} loved the snack!`,`${a.ja}はおやつを喜んだ！`]))};
  $('#tQ').onclick=()=>{const src=Math.random()<.5?a.items.map(i=>norm(i,cityLv(S.city)+1)):poolFor(S.city);const it=pick(src);
   askQ(makeQ(it),()=>after(B.lastOk?`${a.zh}好像比較喜歡你了。`:`${a.zh}有一點緊張……`,B.lastOk?tr(['',"It seems to like you more.","少しなついたみたい。"]):tr(['',"It looks a little nervous…","ちょっと警戒している……"])),
    (ok,textOnly)=>{B.lastOk=ok;turns++;markSeen(it,ok);if(ok){B.love++;B.hits++;segs()}const m=score(it,ok,textOnly);if(!ok&&Math.random()<.3)B.fled=true;return m})}};
 const after=(z,t)=>{if(B.love>=3){const pet={sp:a.id,nick:'',lv:1,xp:0};S.pets.push(pet);if(a.id==='leopard')S.fat=maxFat();gainXP(30+cityLv(S.city)*3);save();
   endCard(`<div class="qprompt">${Z('tamed')}</div><div class="qprompt sm">${rb(a.zh+'加入了旅程。')}</div><div class="tl">${esc(name)} · ${esc(tr(['',...a.ab]))}</div>
    <div class="qlabel" style="margin-top:6px">${Z('nickQ')}<span class="tl">${T('nickQ')}</span></div><input type="text" id="nickIn" maxlength="8" placeholder="${esc(a.zh)}" autocomplete="off">`,
    btn('nickOk','nickBtn','sun')+btn('nickNo','noNick','alt'));
   const fin=()=>{save();endCard(`<div class="qprompt">${rb(petName(pet))}</div><div class="tl">${esc(name)} Lv 1</div>`,toMapBtn())};
   $('#nickOk').onclick=()=>{pet.nick=($('#nickIn').value||'').trim().slice(0,8);fin()};$('#nickNo').onclick=fin;$('#nickIn').onkeydown=e=>{if(e.key==='Enter')$('#nickOk').click()};return}
  if(B.fled)return endCard(`<div class="qprompt">${rb(a.zh+'跑走了！')}</div><div class="tl">${T('fled')}</div>`,toMapBtn());
  if(B.hits>=B.total||turns>=MAXT){gainXP(Math.round(xpFor(cityLv(S.city)).g/2));save();
   return endCard(`<div class="qprompt">${rb(a.zh+'累了，跑回草叢休息了。')}</div><div class="tl">${esc(tr(['',`The ${a.en.toLowerCase()} got tired and went back into the grass.`,`${a.ja}は疲れて草むらへ帰っていった。`]))}</div>`,toMapBtn())}
  menu(z,t)};
 menu(`野生的${a.zh}看著你。`,tr(['',`A wild ${a.en.toLowerCase()} is watching you.`,`野生の${a.ja}がこっちを見ている。`]))}
