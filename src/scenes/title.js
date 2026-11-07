// ===== 標題、讀檔、開始遊戲 =====
import { badgeSVG, drawChar } from '../art.js';
import { $, clamp, esc } from '../core/util.js';
import { CITIES, INTRO } from '../data/index.js';
import { LI, T, Z, rb, tr } from '../i18n.js';
import { setMode } from '../scene.js';
import { S, fresh, load, maxFat, migrate, save, setMap, setPlayer, withSettings } from '../state.js';
import { dialog } from '../ui/dialog.js';
import { hud, showCityTag, showRouteTag } from '../ui/hud.js';
import { playerLook } from '../world/looks.js';
import { genMap } from '../world/maps.js';
import { showMap, worldMap } from '../world/overworld.js';
import { flight, travelAnim } from './cutscenes.js';
import { renderPixel } from '../render/pixel.js';

let titleLang=(navigator.language||'').toLowerCase().startsWith('ja')?'ja':'en',titleRuby='pinyin';
let titleTouched=false,titleGender='m';
export function titleScreen(){setMode('title');const saved=load();if(saved&&saved.settings&&!titleTouched){titleLang=saved.settings.lang||titleLang;titleRuby=saved.settings.ruby||titleRuby}
 const html=withSettings({ruby:titleRuby,lang:titleLang},()=>`<div class="title"><div class="eyebrow">TAIWAN MANDARIN</div><h1>${rb('臺灣華語')}</h1>
  <p>${esc(tr(['',"Start in Taoyuan and circle Taiwan counterclockwise. Beat 22 language gyms, battle trainers, and befriend animals along the way.","桃園から反時計回りに台湾を一周。22の言語ジムに挑み、トレーナーと勝負し、動物と仲よくなろう。"]))}</p>
  <div class="row" style="justify-content:center"><span class="seg"><button data-tl="en" aria-pressed="${titleLang==='en'}">English</button><button data-tl="ja" aria-pressed="${titleLang==='ja'}">日本語</button></span>
  <span class="seg">${['pinyin','zhuyin','off'].map(k=>`<button data-tr="${k}" aria-pressed="${titleRuby===k}">${Z(k)}</button>`).join('')}</span></div>
  <div class="row" style="justify-content:center;align-items:center"><span class="nmlbl" style="font-weight:800">${Z('gender')} <span class="tl" style="display:inline">${T('gender')}</span></span><span class="seg">${['m','f'].map(k=>`<button data-gd="${k}" aria-pressed="${titleGender===k}">${Z(k==='m'?'boy':'girl')} <span class="tl" style="display:inline">${T(k==='m'?'boy':'girl')}</span></button>`).join('')}</span><canvas id="gdPrev" width="120" height="150" style="width:60px;height:75px"></canvas></div>
  ${saved?`<button class="btn sun" id="cont" data-autofocus>${Z('cont')}<span class="tl">${T('cont')} · ${esc(saved.name)} Lv ${saved.lv} · ★${saved.badges}</span></button>`:''}
  <label class="field inline" for="nameIn"><span class="nmlbl">${Z('name')}<span class="tl">${T('name')}</span></span><input type="text" id="nameIn" maxlength="10" value="${saved?esc(saved.name):'旅人'}" autocomplete="off"></label>
  <button class="btn" id="newG" ${saved?'':'data-autofocus'}>${Z('newGame')}<span class="tl">${T('newGame')}</span></button></div>`);
 $('#panel').innerHTML='';$('#ov').hidden=false;const p=$('#panel');p.style.cssText='background:none;border:none;box-shadow:none;display:flex;justify-content:center';p.innerHTML=html;
 p.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{titleTouched=true;titleLang=b.dataset.tl;titleScreen()});p.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{titleTouched=true;titleRuby=b.dataset.tr;titleScreen()});
 p.querySelectorAll('[data-gd]').forEach(b=>b.onclick=()=>{titleGender=b.dataset.gd;titleScreen()});{const gc=$('#gdPrev');if(gc)renderPixel(gc,60,75,2,3,g=>drawChar(g,30,73,55,playerLook(titleGender),'down',0))}
 const c=$('#cont');if(c)c.onclick=()=>{restore(saved);begin(false)};
 $('#newG').onclick=()=>{setPlayer(fresh(($('#nameIn').value||'旅人').trim().slice(0,10)));S.settings.lang=titleLang;S.settings.ruby=titleRuby;S.gender=titleGender;$('#ov').hidden=true;$('#panel').innerHTML='';if(skipFly)begin(true);else flight(()=>begin(true))}}
function restore(saved){setPlayer(Object.assign(fresh(saved.name),saved));migrate();S.settings=Object.assign(fresh('').settings,saved.settings||{},{lang:titleLang,ruby:titleRuby});S.bag=Object.assign({snack:0,drink:0,bubble:0,coffee:0},saved.bag||{})}
let skipFly=false;
function begin(isNew){migrate();const p=$('#panel');p.style.cssText='';p.innerHTML='';$('#ov').hidden=true;
 setMap(worldMap());S.fat=clamp(S.fat,0,maxFat());showMap();hud();setMode('world');if(S.route)showRouteTag();else showCityTag();save();
 if(isNew){S.fat=maxFat();dialog(INTRO,null,'林老師')}}
// 標題畫面背景：先畫一座城鎮
export function bootBackdrop(){setPlayer({settings:{ruby:titleRuby,lang:titleLang},x:11,y:10,dir:'down',city:0,beaten:{},pets:[]});setMap(genMap(0));showMap()}
function askResume(sv){const c=CITIES[sv.city]||CITIES[0];const p=$('#panel');p.style.cssText='background:none;border:none;box-shadow:none;display:flex;justify-content:center';$('#ov').hidden=false;setMode('title');
 const L=[`歡迎回來，${sv.name}！要搭計程車到上次存檔的地方嗎？`,`Welcome back, ${sv.name}! Take a taxi to where you last saved?`,`おかえり、${sv.name}！前回セーブした場所までタクシーで行く？`];
 p.innerHTML=`<div class="title"><div class="eyebrow">TAIWAN MANDARIN</div><div class="qprompt sm">${rb(L[0])}</div><div class="tl">${esc(L[LI()])}</div>
  <div class="row" style="justify-content:center;gap:14px"><div style="width:72px">${badgeSVG(Math.max(0,sv.badges-1),sv.badges>0)}</div><div style="text-align:left"><div style="font-weight:900;font-size:20px;font-family:var(--f-zh);line-height:2">${rb(c.zh)}</div><div class="note">${esc(LI()===2?c.ja:c.en)} · ${esc(sv.name)} Lv ${sv.lv} · ★ ${sv.badges}/22</div></div></div>
  <div class="row" style="justify-content:center"><button class="btn sun" id="rYes">${rb('好，出發！')}<span class="tl">${esc(tr(['',"Yes, let's go","はい、行こう"]))}</span></button><button class="btn alt" id="rNo">${rb('不用，回到標題')}<span class="tl">${esc(tr(['',"No, back to the title","いいえ、タイトルへ"]))}</span></button></div></div>`;
 $('#rYes').focus();
 $('#rYes').onclick=()=>{restore(sv);$('#ov').hidden=true;p.innerHTML='';p.style.cssText='';travelAnim(S.city,()=>begin(false))};
 $('#rNo').onclick=()=>{skipFly=true;titleScreen()}}
/** 開機：有存檔就先播開場再問要不要繼續，沒有就到標題畫面 */
export function boot(){const sv=load();
 if(sv&&sv.settings){titleLang=sv.settings.lang||titleLang;titleRuby=sv.settings.ruby||titleRuby}
 bootBackdrop();if(sv)flight(()=>askResume(sv));else titleScreen()}
