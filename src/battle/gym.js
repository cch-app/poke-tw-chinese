// ===== 道館 =====
import { badgeSVG } from '../art.js';
import { POOLS, cityLv } from '../content.js';
import { $, esc, pick, shuffle } from '../core/util.js';
import { CITIES, UI } from '../data/index.js';
import { T, Z, rb, tr } from '../i18n.js';
import { gainMoney, gainXP } from '../progress.js';
import { MAP, S, maxFat, save } from '../state.js';
import { dialog } from '../ui/dialog.js';
import { hud } from '../ui/hud.js';
import { btn } from '../ui/panel.js';
import { leaderLook } from '../world/looks.js';
import { endCard, runSeries, startBattle, toMapBtn } from './battle.js';

export function leaderTalk(){const ci=S.city,c=CITIES[ci];
 if(S.badges>ci){dialog([[`你已經拿到${c.zh}的徽章了！繼續往下一站吧。`,`You already have the ${c.en} badge. Head on to the next city!`,`${c.ja}のバッジはもう持っているね。次の町へ進もう！`]],null,c.leader);return}
 const left=MAP.trainers.filter(t=>t.guard&&!S.beaten[t.id]).length;
 if(left){dialog([[`要先打敗所有道館守護人員，才能挑戰館主喔！還有${['零','一','兩','三'][left]}位。`,`Defeat all the gym guards before challenging the leader! ${left} left.`,`ジムトレーナーを全員倒してから挑戦してね！あと${left}人。`]],null,c.leader);return}
 dialog([...c.hello,UI.trialRule],()=>gymTrial(ci),c.leader)}
function gymTrial(ci){const c=CITIES[ci];const lv=cityLv(ci)+2;
 startBattle({kind:'person',zh:'館主 '+c.leader,sub:tr(['',...c.role]),look:leaderLook(ci),lv,total:6});
 const rd=pick([c.read,c.read2].filter(Boolean));const reads=shuffle(rd.qs).map(q=>({t:'r',p:rd.p,q:q[0],a:q[1],d:q[2].split('|'),lv}));
 const lis=shuffle(POOLS[ci].filter(x=>x.t==='l')).slice(0,3).map(x=>({...x,lv}));
 let phase=0,okc=0;
 const intro=(k,go)=>endCard(`<div class="qlabel">${Z('gym')} · ${rb(c.zh)}</div><div class="qprompt">${Z(k)}</div><div class="tl">${T(k)} · ${T('trialRule')}</div>`,btn('goT','start','','data-autofocus')),
  wire=go=>{$('#goT').onclick=go};
 const run=list=>runSeries(list,{onAns:ok=>{if(ok)okc++},end:()=>{
   if(okc<2)return endCard(`<div class="qprompt sm">${rb(c.leader+'：再去草叢修練一下吧！')}</div><div class="tl">${T('trainMore')} (${okc}/3)</div>`,toMapBtn());
   if(phase===0){phase=1;okc=0;intro('trialListen');wire(()=>run(lis));return}
   winGym(ci)}});
 intro('trialRead');wire(()=>run(reads))}
function winGym(ci){const c=CITIES[ci];S.badges=Math.max(S.badges,ci+1);const g=60+ci*25;gainXP(g);const m=gainMoney(300+ci*80);S.fat=maxFat();save();hud();
 const nxt=ci<21?CITIES[ci+1]:null;
 endCard(`<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div style="width:110px">${badgeSVG(ci,true)}</div><div style="flex:1;min-width:200px">
  <div class="qprompt">${rb(c.zh+'徽章')}</div><div class="tl">${T('badgeGet')} +${g} EXP · +NT$${m}</div>
  <div class="note" style="margin-top:6px">${nxt?`${rb('下一站：'+nxt.zh)} · ${esc(tr(['',`Next: ${nxt.en}, through the gate at the bottom of the map.`,`次は${nxt.ja}。マップ下のゲートから進もう。`]))}`:`${rb('二十二個徽章都到手了！')} ${esc(tr(['',"All 22 badges! Open the map to enter the Language League.","バッジ22個コンプリート！マップから言語大リーグへ。"]))}`}</div></div></div>`,
  `<button class="btn sun" data-close>${rb('太棒了！')}</button>`)}
