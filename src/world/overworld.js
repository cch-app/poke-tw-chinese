// ===== 地圖上的遊戲：移動、遇敵、換地圖 =====
import { GT } from '../art.js';
import { startEncounter, trainerBattle } from '../battle/encounters.js';
import { cityLv } from '../content.js';
import { $, DIRS, OPPOSITE, pick } from '../core/util.js';
import { CITIES, UI } from '../data/index.js';
import { tr } from '../i18n.js';
import { mode, onModeChange, setMode } from '../scene.js';
import { MAP, S, TOWN, save, setMap, setTown } from '../state.js';
import { talkNpc, talkWalker } from '../town/services.js';
import { CH, dialog } from '../ui/dialog.js';
import { hud, showCityTag, showRouteTag, toast } from '../ui/hud.js';
import { closePanelQuiet } from '../ui/panel.js';
import { playerLook, tdata, trainerLook } from './looks.js';
import { describeMap, sceneFor } from './map-view.js';
import { H, SIDE_GATE_Y, genInterior, genMap, isWalk } from './maps.js';
import { DISTRICT_GATE_Y, genDistrict } from './districts.js';
import { PLACES, ROAD_X, ROUTE_H, genRoute, hasRoute, routeKm, zoneAt } from './routes.js';

let mv=null,held=null,last=performance.now(),cut=null,bubble=null,stepsSince=0;
let view=null;

/* ---------- 畫面 ---------- */
export function attachView(v){view=v}
/** 換地圖後呼叫：地面只畫一次 */
export function showMap(){view.setScene(sceneFor(MAP,ci=>{if(MAP&&MAP.ci===ci)view.invalidate()}))}
/** 拼音／注音設定改了：重畫招牌上的字 */
export const refreshView=()=>view.invalidate();
// 每格交給 map-view.js 的資料；重複使用同一個物件
const frameState={map:null,player:{x:0,y:0,dir:'down',step:0,moving:false},look:null,trainerLook,bubble:null};
const nothing=()=>{};
function drawFrame(now){if(!MAP||!S)return view.frame(now,0,0,nothing);const p=frameState.player;
  p.x=mv?mv.fx+(mv.tx-mv.fx)*mv.t:S.x;p.y=mv?mv.fy+(mv.ty-mv.fy)*mv.t:S.y;p.dir=S.dir;p.moving=!!mv;
  // A deterministic three-pose cycle (plant → pass → plant) reads clearly at any frame rate.
  p.step=!mv||mv.t<=.18||mv.t>=.82?0:mv.t<.5?-1:1;
 frameState.map=MAP;frameState.look=playerLook();frameState.bubble=bubble;view.frame(now,p.x,p.y,describeMap,frameState)}

/* ---------- 輸入：方向鍵按住就一直走 ---------- */
export function hold(dir){if(mode==='world')held=dir}
export function release(dir){if(held===dir)held=null}
onModeChange(m=>{if(m!=='world')held=null});

/* ---------- 遊戲迴圈 ---------- */
export function loop(now){try{update(now)}catch(e){console.error(e)}try{drawFrame(now)}catch(e){console.error(e)}}
function update(now){const dt=Math.min(50,now-last);last=now;
 if(mode==='world'&&MAP){
  if(mv){mv.t+=dt/170;if(mv.t>=1){S.x=mv.tx;S.y=mv.ty;mv=null;onStep()}}
  if(!mv&&held&&mode==='world')tryMove(held);
  (MAP.walkers||[]).forEach(n=>{if(n.mv){n.mv.t+=dt/260;if(n.mv.t>=1){n.x=n.mv.tx;n.y=n.mv.ty;n.mv=null}return}if(n.talk)return;n.wt-=dt;if(n.wt>0)return;n.wt=900+Math.random()*1800;const d=pick(['up','down','left','right']);n.dir=d;const[dx,dy]=DIRS[d],nx=n.x+dx,ny=n.y+dy;
   if(ny<4||(nx===MAP.exit.x&&ny>=MAP.h-2)||!isWalk(nx,ny)||(nx===S.x&&ny===S.y)||(mv&&mv.tx===nx&&mv.ty===ny))return;n.mv={fx:n.x,fy:n.y,tx:nx,ty:ny,t:0}});
  MAP.trainers.forEach(t=>{if(S.beaten[t.id]||cut)return;t.turnT-=dt;if(t.turnT<=0){t.turnT=1800+Math.random()*2600;t.dir=Math.random()<.5?t.home:pick(['up','down','left','right']);if(!mv)checkSight()}})}
 if(cut)cut(dt)}
function tryMove(dir){S.dir=dir;const[dx,dy]=DIRS[dir];const nx=S.x+dx,ny=S.y+dy;
 if(MAP.kind==='town'&&ny===SIDE_GATE_Y&&(nx===0||nx===MAP.w-1)){held=null;enterDistrict(nx===0?'west':'east');return}
 if(MAP.kind==='district'&&(ny===DISTRICT_GATE_Y||ny===DISTRICT_GATE_Y+1)&&(nx<0||nx>=MAP.w)){held=null;leaveDistrict(nx<0?'west':'east');return}
 if(ny<0||ny>=MAP.h){held=null;if(MAP.kind==='in'){if(ny>=MAP.h)leaveInterior();return}gate(ny<0?'top':'bottom');return}
 if(!isWalk(nx,ny))return;mv={fx:S.x,fy:S.y,tx:nx,ty:ny,t:0}}
function onStep(){stepsSince++;const k=S.x+','+S.y;
 if(MAP.kind==='in'&&S.x===MAP.exit.x&&S.y===MAP.exit.y){held=null;leaveInterior();return}
 if(MAP.doors[k]){held=null;const dest=MAP.doors[k],kind=typeof dest==='string'?dest:dest.kind;if(kind==='house'){S.y++;S.dir='down';dialog([UI.houseLocked]);return}enterInterior(kind,S.x,S.y,dest.brand);return}
 if(MAP.kind==='route'){const z=zoneAt(MAP,S.y);if(z!==MAP.here){MAP.here=z;placeToast()}}
 if(checkSight())return;
 if(MAP.g[S.y][S.x]===GT.TG&&stepsSince>2&&Math.random()<.13){stepsSince=0;held=null;startEncounter()}}
function sightHits(t){if(S.beaten[t.id])return false;const[dx,dy]=DIRS[t.dir];for(let k=1;k<=4;k++){const x=t.x+dx*k,y=t.y+dy*k;if(x===S.x&&y===S.y)return k;if(x<0||y<0||x>=MAP.w||y>=MAP.h||MAP.blocked[y][x])return false}return false}
function checkSight(){if(mode!=='world'||mv)return false;for(const t of MAP.trainers){const k=sightHits(t);if(k){spotted(t,k);return true}}return false}
function spotted(t,k){held=null;setMode('cut');bubble={t};let phase=0,timer=0,steps=k-1;
 cut=dt=>{timer+=dt;if(phase===0&&timer>700){bubble=null;phase=1;timer=0}
  if(phase===1){if(!t.mv){if(steps<=0){cut=null;S.dir=OPPOSITE[t.dir];setMode('world');
     const d=tdata(t);dialog([[d.hi[0],d.hi[1],d.hi[2]]],()=>trainerBattle(t),d.zh);return}
    const[dx,dy]=DIRS[t.dir];t.mv={fx:t.x,fy:t.y,tx:t.x+dx,ty:t.y+dy,t:0}}
   t.mv.t+=dt/170;if(t.mv.t>=1){t.x=t.mv.tx;t.y=t.mv.ty;t.mv=null;steps--}}}}
export function interact(){if(mode!=='world'||mv)return;const[dx,dy]=DIRS[S.dir];const fx=S.x+dx,fy=S.y+dy;const c=CITIES[S.city];
 if(MAP.kind==='in'){const wk=(MAP.walkers||[]).find(n=>!n.mv&&n.x===fx&&n.y===fy);if(wk){talkWalker(wk);return}const n=MAP.npcs.find(n=>n.x===fx&&n.y===fy)||(S.dir==='up'&&MAP.furn.some(f=>f.t==='counter'&&fy===f.y&&fx>=f.x&&fx<f.x+f.w)?MAP.npcs.find(n=>n.role==='clerk'):null);if(n){talkNpc(n);return}}
 const t=MAP.trainers.find(t=>t.x===fx&&t.y===fy);
 if(t){const d=tdata(t);t.dir=OPPOSITE[S.dir];
  if(S.beaten[t.id])dialog([d.lose],null,d.zh);else dialog([d.hi],()=>trainerBattle(t),d.zh);return}
 const o=MAP.objs.find(o=>o.x===fx&&o.y===fy);
 if(o&&o.type==='sign'&&o.what==='route'){routeSign(o.zone);return}
 if(o&&o.type==='sign'){if(o.what==='gym')dialog([[`${c.zh}語言道館・館主${c.leader}・${c.theme}`,`${c.en} Gym · Leader ${c.leader} · ${tr(c.role)}`,`${c.ja}ジム・ジムリーダー${c.leader}・${tr(c.role)}`],[`${UI.recLv[0]}：Lv ${cityLv(S.city)+2}`,`${UI.recLv[1]}: Lv ${cityLv(S.city)+2}`,`${UI.recLv[2]}：Lv ${cityLv(S.city)+2}`]],null,UI.sign[0]);
  else dialog([[`歡迎來到${c.zh}！`,`Welcome to ${c.en}!`,`${c.ja}へようこそ！`]],null,UI.sign[0]);return}
 if(MAP.g[fy]?.[fx]===GT.WA)dialog([['水很清，可以看到小魚。',"The water is clear; you can see little fish.","水が澄んでいて、小魚が見える。"]])}
function gate(side){const ci=S.city;
 // 在城市之間的道路上：往上走回北邊那座城，往下走到南邊那座城
 if(MAP.kind==='route'){const i=MAP.i;travel(side==='top'?i:i+1,side==='top'?'bottom':'top');return}
 if(side==='top'){if(ci===0){dialog([UI.airport]);return}if(hasRoute(ci-1))enterRoute(ci-1,'bottom');else travel(ci-1,'bottom')}
 else{if(ci===21){dialog([S.badges>=22?UI.leagueGate:UI.needBadge]);return}
  if(S.badges<=ci){dialog([UI.needBadge]);return}
  if(hasRoute(ci))enterRoute(ci,'top');else travel(ci+1,'top')}}
/** Enter a local district connector without changing the current city. */
function enterDistrict(side){
  const city=S.city;
  S.district={city,side};
  setMap(genDistrict(city));
  S.x=side==='west'?2:MAP.w-3;
  S.y=DISTRICT_GATE_Y;
  S.dir=side==='west'?'right':'left';
  mv=null;held=null;showMap();save();closePanelQuiet();
  toast([`${CITIES[city].zh}分區`,`${CITIES[city].en} district`,`${CITIES[city].ja}の地区`]);
}

/** Return to the same city's west/east district gate. */
function leaveDistrict(side){
  const city=S.city;
  S.district=null;
  setMap(genMap(city));
  S.x=side==='west'?1:MAP.w-2;
  S.y=SIDE_GATE_Y;
  S.dir=side==='west'?'right':'left';
  mv=null;held=null;showMap();save();showCityTag();
}

/** 走進城市之間的道路。S.city 維持在剛離開的城市（遇敵、昏倒回旅館都以它為準） */
function enterRoute(i,arrive){S.route={i};S.district=null;setMap(genRoute(i));
 if(arrive==='top'){S.x=ROAD_X;S.y=1;S.dir='down'}else{S.x=ROAD_X;S.y=ROUTE_H-2;S.dir='up'}
 MAP.here=zoneAt(MAP,S.y);mv=null;held=null;showMap();save();closePanelQuiet();showRouteTag();placeToast()}
/** 在道路上昏倒：回到剛離開的城市 */
export const onRoute=()=>!!MAP&&(MAP.kind==='route'||MAP.kind==='district'||(MAP.kind==='in'&&TOWN&&TOWN.kind==='route'));
export function returnToCity(){S.route=null;S.district=null;setMap(genMap(S.city));showMap();showCityTag()}
/** 道路要用的地圖：存檔在道路上時也用它重建 */
export const worldMap=()=>S.route?genRoute(S.route.i):S.district?genDistrict(S.city):genMap(S.city);
function placeToast(){const p=PLACES[MAP.zones[MAP.here].key];toast(p)}
function routeSign(z){const i=MAP.i,a=CITIES[i],b=CITIES[i+1],p=PLACES[MAP.zones[z].key],km=Math.max(1,Math.round(routeKm(i)*(1-z/MAP.zones.length)));
 dialog([[`這裡是${p[0]}。`,`This is the ${p[1]}.`,`ここは${p[2]}。`],[`往南到${b.zh}還有${km}公里，往北回${a.zh}。`,`${b.en} is ${km} km south; ${a.en} is back north.`,`南の${b.ja}まであと${km}キロ、北へ戻ると${a.ja}。`]],null,UI.sign[0])}
function transitLine(from,to){const a=CITIES[from],b=CITIES[to];
 if(a.island||b.island){const byAir=(a.id==='taipei'||b.id==='taipei'||a.id==='kinmen'&&b.id==='matsu'||a.id==='matsu'&&b.id==='kinmen');
  return byAir?[`坐飛機前往${b.zh}……`,`Flying to ${b.en}…`,`飛行機で${b.ja}へ……`]:[`坐船前往${b.zh}……`,`Taking the ferry to ${b.en}…`,`フェリーで${b.ja}へ……`]}
 return null}
export function travel(ci,arrive){const from=S.city;if(MAP&&MAP.kind==='in')setMap(TOWN);S.city=ci;S.route=null;S.district=null;setMap(genMap(ci));
 if(arrive==='top'){S.x=11;S.y=1;S.dir='down'}else if(arrive==='bottom'){S.x=11;S.y=H-2;S.dir='up'}else{S.x=MAP.inn.x;S.y=MAP.inn.y;S.dir='down'}
 mv=null;showMap();save();closePanelQuiet();showCityTag();hud();
 const t=transitLine(from,ci);if(t&&from!==ci)toast(t)}
function enterInterior(kind,dx,dy,brand=null){$('#cityTag').style.opacity=0;setTown(MAP);setMap(genInterior(kind,S.city,{x:dx,y:dy+1},brand));S.x=5;S.y=MAP.h-2;S.dir='up';mv=null;held=null;showMap();
 const nm=kind==='gym'?UI.gym:UI[kind];toast([CITIES[S.city].zh+nm[0],`${CITIES[S.city].en} ${nm[1]}`,`${CITIES[S.city].ja}の${nm[2]}`])}
function leaveInterior(){if(CH)CH.cancel();$('#dlg').hidden=true;const r=MAP.ret;setMap(TOWN);S.x=r.x;S.y=r.y;S.dir='down';mv=null;held=null;showMap();save()}
