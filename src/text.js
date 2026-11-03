// ===== 拼音／注音 =====
import { PY_RAW, PY_WORDS } from './data/pinyin.js';

export const PY={};PY_RAW.split('|').forEach(g=>{const[syl,chars]=g.trim().split(' ');[...chars].forEach(c=>{if(!PY[c])PY[c]=syl})});
export const MARKS={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'};
export function parseSyl(syl){const m=syl.match(/^([a-zü]+)([1-5])$/);return m?[m[1].replace(/v/g,'ü'),+m[2]]:null}
export function toMark(syl){const p=parseSyl(syl);if(!p)return syl;const[s,t]=p;if(t===5)return s;let i;
 if(s.includes('a'))i=s.indexOf('a');else if(s.includes('e'))i=s.indexOf('e');else if(s.includes('ou'))i=s.indexOf('o');else{for(let k=s.length-1;k>=0;k--)if('iouü'.includes(s[k])){i=k;break}}
 return s.slice(0,i)+MARKS[s[i]][t-1]+s.slice(i+1)}
export const ZI={b:'ㄅ',p:'ㄆ',m:'ㄇ',f:'ㄈ',d:'ㄉ',t:'ㄊ',n:'ㄋ',l:'ㄌ',g:'ㄍ',k:'ㄎ',h:'ㄏ',j:'ㄐ',q:'ㄑ',x:'ㄒ',zh:'ㄓ',ch:'ㄔ',sh:'ㄕ',r:'ㄖ',z:'ㄗ',c:'ㄘ',s:'ㄙ'};
export const ZF={a:'ㄚ',o:'ㄛ',e:'ㄜ',ai:'ㄞ',ei:'ㄟ',ao:'ㄠ',ou:'ㄡ',an:'ㄢ',en:'ㄣ',ang:'ㄤ',eng:'ㄥ',er:'ㄦ',ong:'ㄨㄥ',i:'ㄧ',ia:'ㄧㄚ',ie:'ㄧㄝ',iao:'ㄧㄠ',iu:'ㄧㄡ',iou:'ㄧㄡ',ian:'ㄧㄢ',in:'ㄧㄣ',iang:'ㄧㄤ',ing:'ㄧㄥ',iong:'ㄩㄥ',u:'ㄨ',ua:'ㄨㄚ',uo:'ㄨㄛ',uai:'ㄨㄞ',ui:'ㄨㄟ',uei:'ㄨㄟ',uan:'ㄨㄢ',un:'ㄨㄣ',uen:'ㄨㄣ',uang:'ㄨㄤ',ueng:'ㄨㄥ','ü':'ㄩ','üe':'ㄩㄝ','üan':'ㄩㄢ','ün':'ㄩㄣ'};
export function toZhu(syl){const p=parseSyl(syl);if(!p)return syl;const[s,t]=p;let ini='',fin=s;
 if(s[0]==='y')fin=s.startsWith('yu')?'ü'+s.slice(2):s.startsWith('yi')?'i'+s.slice(2):'i'+s.slice(1);
 else if(s[0]==='w')fin=s.startsWith('wu')?'u'+s.slice(2):'u'+s.slice(1);
 else if(['zh','ch','sh'].includes(s.slice(0,2))){ini=s.slice(0,2);fin=s.slice(2)}
 else if(ZI[s[0]]&&s!=='er'){ini=s[0];fin=s.slice(1)}
 if(ini&&'jqx'.includes(ini)&&fin[0]==='u')fin='ü'+fin.slice(1);
 const fz=(fin==='i'&&['zh','ch','sh','r','z','c','s'].includes(ini))?'':(ZF[fin]??fin);const core=(ini?ZI[ini]:'')+fz;
 return t===5?'˙'+core:core+['','ˊ','ˇ','ˋ'][t-1]}
export function segment(text){const out=[],ch=[...text];let i=0;
 while(i<ch.length){let hit=null;for(let L=Math.min(4,ch.length-i);L>=2;L--){const w=ch.slice(i,i+L).join('');if(PY_WORDS[w]){hit=[w,PY_WORDS[w].split(' ')];break}}
  if(hit){[...hit[0]].forEach((c,k)=>out.push([c,hit[1][k]]));i+=[...hit[0]].length;continue}out.push([ch[i],PY[ch[i]]||null]);i++}return out}
