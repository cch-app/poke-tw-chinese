// ===== 遊戲狀態：玩家存檔（S）與目前地圖（MAP、TOWN） =====
// 其他模組只能讀這些變數；要換掉整個物件時呼叫 setPlayer／setMap／setTown。
import { ANIMALS } from './data/index.js';

const KEY='formosa-quest-v2';
export let S=null;
export let MAP=null,TOWN=null;
export const setPlayer=s=>{S=s};
export const setMap=m=>{MAP=m};
export const setTown=m=>{TOWN=m};
/** 還沒有玩家時（標題畫面）也能讀的設定 */
export const settings=()=>S&&S.settings||{ruby:'pinyin',lang:'en'};
/** 暫時換成另一份設定來畫畫面（標題畫面用），畫完換回來 */
export function withSettings(st,fn){const keep=S;S={settings:st};try{return fn()}finally{S=keep}}

/* ---------- 存檔 ---------- */
export function fresh(name){const ja=(navigator.language||'').toLowerCase().startsWith('ja');
 return{v:2,name,gender:'m',lv:1,xp:0,fat:45,money:300,bag:{snack:1,drink:1,bubble:0},badges:0,city:0,x:11,y:2,dir:'down',pets:[],seen:{},beaten:{},league:0,champion:false,luck:0,
  settings:{ruby:'pinyin',lang:ja?'ja':'en',rate:.9,voice:''}}}
export function save(){try{const o=Object.assign({},S);if(MAP&&MAP.kind==='in'&&MAP.ret){o.x=MAP.ret.x;o.y=MAP.ret.y}localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
export function load(){try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):null}catch(e){return null}}
export function clearSave(){try{localStorage.removeItem(KEY)}catch(e){}}
export function migrate(){if(!S.pets){S.pets=(S.comps||[]).map(sp=>({sp,nick:'',lv:1,xp:0}))}delete S.comps}

/* ---------- 由存檔算出的數值 ---------- */
export const has=id=>(S.pets||[]).some(p=>p.sp===id);
export const petLv=id=>Math.max(0,...(S.pets||[]).filter(p=>p.sp===id).map(p=>p.lv));
export const petNeed=lv=>10+lv*6;
export const petName=p=>p.nick||ANIMALS.find(a=>a.id===p.sp).zh;
export const maxFat=()=>40+S.lv*5+(has('leopard')?15+3*(petLv('leopard')-1):0);
export const xpNeed=L=>Math.round(15*Math.pow(L,1.3));
export const innFee=()=>20+S.lv*10;
