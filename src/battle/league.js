// ===== 語言大聯盟 =====
import { POOLS, norm } from '../content.js';
import { $, esc, shuffle } from '../core/util.js';
import { LEAGUE, UI } from '../data/index.js';
import { LI, T, Z, rb, tr } from '../i18n.js';
import { gainMoney, gainXP } from '../progress.js';
import { S, maxFat, save } from '../state.js';
import { btn } from '../ui/panel.js';
import { B, endCard, runSeries, startBattle, toMapBtn } from './battle.js';

export function leagueTier(t){const L=LEAGUE[t];let src=L.pool?L.pool.map(x=>norm(x)):[];if(L.from){for(let ci=L.from[0];ci<=L.from[1];ci++)src=src.concat(POOLS[ci].map(x=>({...x,lv:x.lv+10})))}
 const items=shuffle(src).slice(0,5);const lv=Math.max(...items.map(i=>i.lv));
 startBattle({kind:'person',zh:'評審 '+L.judge,sub:`${UI.league[LI()]} · ${tr(['',L.en,L.ja])}`,look:{hair:'#1b2340',top:'#ffc93c',trim:'#1b2340',bottom:'#1b2340',style:t%2?'short':'bun'},lv,total:5});
 endCard(`<div class="qlabel">${Z('league')} · ${rb(L.zh)}</div><div class="qprompt sm">${rb(L.judge+'：歡迎來到'+L.zh+'的考場。')}</div><div class="tl">${esc(tr(['',L.en,L.ja]))} · ${esc(tr(['',"5 questions, 4 correct to pass. Tiers follow the six TOCFL levels.","全5問、4問正解で合格。6段階はTOCFLの等級に対応。"]))}</div>`,btn('go','start','','data-autofocus')+`<button class="btn alt" data-close>${Z('leave')}</button>`);
 $('#go').onclick=()=>runSeries(items,{end:()=>{if(B.hits>=4){S.league=Math.max(S.league,t+1);const m=gainMoney(500+t*300);gainXP(150+t*80);S.fat=maxFat();if(t===5)S.champion=true;save();
   endCard(`<div class="qprompt">${t===5?rb('你是語言大聯盟的冠軍！'):Z('pass')}</div><div class="tl">${t===5?esc(tr(['',"You are the Language League Champion!","言語大リーグのチャンピオンだ！"])):T('pass')} +NT$${m}</div>`,(t<5?btn('nt','nextTier','sun'):'')+toMapBtn());const n=$('#nt');if(n)n.onclick=()=>leagueTier(t+1)}
  else endCard(`<div class="qprompt">${Z('fail')}</div><div class="tl">${T('fail')} · ${B.hits}/5</div>`,toMapBtn())}})}
