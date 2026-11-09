// ===== 出題 =====
import { ALLL, ALLV } from './content.js';
import { pick, shuffle } from './core/util.js';
import { itemTr } from './i18n.js';
import { ttsOK } from './speech.js';
import { S } from './state.js';
import { parseSyl, segment, toMark, toZhu } from './text.js';

function near(pool,it,n,key){return shuffle(pool.filter(o=>o!==it&&o[key]!==it[key]&&itemTr(o)!==itemTr(it)).sort((a,b)=>Math.abs(a.lv-it.lv)-Math.abs(b.lv-it.lv)).slice(0,8)).slice(0,n)}
export function makeQ(it){
 if(it.t==='v'&&ttsOK()&&S.settings.ruby!=='off'&&Math.random()<.3){const q=toneQ(it);if(q)return q}
 if(it.t==='v'){const ds=near(ALLV,it,3,'w');
  if(Math.random()<.55)return build({label:'whatMean',zh:it.w,opts:[itemTr(it),...ds.map(itemTr)],optZh:false,it});
  return build({label:'whichOne',tl:itemTr(it),opts:[it.w,...ds.map(d=>d.w)],optZh:true,it})}
 if(it.t==='g')return build({label:'fill',zh:it.s,opts:[it.a,...it.d.slice(0,3)],optZh:true,exZh:it.s.replace('＿＿',it.a),exTl:itemTr(it),it});
 if(it.t==='l'){const ds=near(ALLL,it,3,'s');
  if(!ttsOK()||S.lv<20||Math.random()<.6)return build({label:'whatHear',audio:it.s,opts:[itemTr(it),...ds.map(itemTr)],optZh:false,exZh:it.s,exTl:itemTr(it),it});
  return build({label:'whichHeard',audio:it.s,opts:[it.s,...ds.map(d=>d.s)],optZh:true,exTl:itemTr(it),it,hideText:true})}
 if(it.t==='r')return build({label:'reading',passage:it.p,qzh:it.q,opts:[it.a,...it.d],optZh:true,it})}
const SWAPS=[['zh','z'],['ch','c'],['sh','s'],['n','l'],['b','p'],['d','t'],['g','k'],['j','q']],FSWAPS=[['ang','an'],['ing','in'],['eng','en'],['ong','eng']];
function swapSound(syl){const p=parseSyl(syl);if(!p)return syl;let[s,t]=p;const opts=[];
 SWAPS.forEach(([a,b])=>{if(s.startsWith(a)&&!(a==='z'&&s.startsWith('zh'))&&!(a==='c'&&s.startsWith('ch'))&&!(a==='s'&&s.startsWith('sh')))opts.push(b+s.slice(a.length));if(s.startsWith(b)&&!(b.length===1&&s.startsWith(b+'h')))opts.push(a+s.slice(b.length))});
 FSWAPS.forEach(([a,b])=>{if(s.endsWith(a))opts.push(s.slice(0,-a.length)+b);else if(s.endsWith(b)&&!s.endsWith(a))opts.push(s.slice(0,-b.length)+a)});
 return opts.length?pick(opts)+t:null}
function toneQ(it){const syls=segment(it.w).map(x=>x[1]);if(!syls.length||syls.some(x=>!x))return null;const key=a=>a.join(' ');const base=key(syls);const out=new Set();let n=0;
 while(out.size<3&&n<80){n++;const v=syls.slice();const k=Math.floor(Math.random()*v.length);
  if(Math.random()<.65){const p=parseSyl(v[k]);let nt;do{nt=1+Math.floor(Math.random()*4)}while(nt===p[1]);v[k]=p[0]+nt;if(v.length>1&&Math.random()<.3){const j=(k+1)%v.length,q=parseSyl(v[j]);let t2;do{t2=1+Math.floor(Math.random()*4)}while(t2===q[1]);v[j]=q[0]+t2}}
  else{const sw=swapSound(v[k]);if(!sw)continue;v[k]=sw}
  if(key(v)!==base)out.add(key(v))}
 if(out.size<3)return null;const zy=S.settings.ruby==='zhuyin';const fmt=s=>s.split(' ').map(x=>zy?toZhu(x):toMark(x)).join(zy?' ':' ');
 return build({label:zy?'whichZhuyin':'whichPinyin',audio:it.w,opts:[fmt(base),...[...out].map(fmt)],optZh:false,exZh:it.w,exTl:itemTr(it),it,hideText:true,toneQ:true})}
function build(o){const c=o.opts[0];const opts=shuffle(o.opts.slice(0,4));return{...o,opts,ci:opts.indexOf(c)}}
