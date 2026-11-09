// ===== 地圖產生：城鎮與室內 =====
import { BLD, GT, rng } from '../art.js';
import { cityLv } from '../content.js';
import { pick, shuffle } from '../core/util.js';
import { CITIES, TRAINERS, WALKER_LINES } from '../data/index.js';
import { STORE_BRANDS } from '../data/stores.js';
import { MAP } from '../state.js';
import { CLERK, guardLook, leaderLook, lookFromTrainer } from './looks.js';
import { geographyFor } from './geography.js';

const W=24;
export const H=34;
export const SIDE_GATE_Y=13;  // 第二條街（13–14 列）兩端直接通出城，跟分區的兩格寬大路接在一起
/*
 * 城鎮配置：每座城鎮都用同一套整齊的格子。
 *   y 0      北邊地理邊界，只在大路（x 11–12）留入口；y 1 是牌樓
 *   y 2–6    道館、旅館        y 7–8   第一條街（門口都面向街道）
 *   y 9–12   超商、茶店、廟、民宅（超商、茶店、咖啡店同為 5×4）  y 13–14 第二條街
 *   y 15–32  南邊：小巷與空地、各城特色區、草叢（遇敵），大路一直通到南邊出口
 * 東西兩側的第二條街一路通出城（SIDE_GATE_Y 起兩列），走出去就是那一側的分區；邊界材質由城市地理位置決定。
 * 城市之間的差別放在南邊：第二家超商、民宅、特色區、池塘、樹和草叢的位置。
 */
const AVENUE=[11,12],STREETS=[7,8,13,14],LANE=20;
// Every city has the same essential services, plus both a drink stand and a coffee shop.
// Store, tea and coffee share one 5×4 footprint, so the tea shop fills x 6–10 beside the store.
// The coffee shop sits in the south district so its entrance has a dedicated approach.
const CORE=[['gym',2,2],['inn',14,2],['store',1,9],['tea',6,9],['temple',13,9],['coffee',6,15],['house',20,9]];
// 南邊空地（門口都在第 19 列，前面就是第 20 列的小巷）
const LOT_W=[1,16],LOT_E1=[15,16],LOT_E2=[19,16];
const AREAS=['plaza','waterfront','market','park','rice'];
export function genMap(ci){const r=rng(ci*7919+13),city=CITIES[ci];const g=Array.from({length:H},()=>Array(W).fill(GT.G));const objs=[],doors={};
 const blocked=Array.from({length:H},()=>Array(W).fill(false));
 const keep=Array.from({length:H},()=>Array(W).fill(false));  // 路、門口：之後的裝飾不能蓋上去
 const block=(x,y)=>{if(blocked[y])blocked[y][x]=true};
 const free=(x,y)=>x>0&&x<W-1&&y>0&&y<H-1&&g[y][x]===GT.G&&!blocked[y][x]&&!keep[y][x];
 const pave=(x,y,t=GT.PB)=>{g[y][x]=t;keep[y][x]=true};  // 同一座城所有的路都用同一種路面（樣式由城市決定，見 pixel-tiles.js）
 // 道路
 AVENUE.forEach(x=>{for(let y=0;y<H;y++)pave(x,y)});
 STREETS.forEach(y=>{for(let x=1;x<W-1;x++)pave(x,y)});
 // 建築：主要六棟固定位置，南邊空地依城市決定
 const shopR=rng(ci*3571+101),primaryShop=STORE_BRANDS[Math.floor(shopR()*STORE_BRANDS.length)].id;
 const bl=CORE.map(([k,x,y])=>k==='store'?[k,x,y,primaryShop]:[k,x,y]);
 if(shopR()<.38){let second=STORE_BRANDS[Math.floor(shopR()*STORE_BRANDS.length)].id;if(second===primaryShop)second=STORE_BRANDS[(STORE_BRANDS.findIndex(b=>b.id===second)+1)%STORE_BRANDS.length].id;bl.push(['store',...LOT_W,second])}
 if(ci%4===1||ci%4===3)bl.push(['house',...LOT_E1]);
 if(ci%4===0||ci%5===2)bl.push(['house',...LOT_E2]);
 bl.forEach(([kind,bx,by,brand])=>{const b=BLD[kind];const o={type:'bld',kind,x:bx,y:by,w:b.w,h:b.h,...(brand&&{brand})};objs.push(o);
  for(let y=by;y<by+b.h;y++)for(let x=bx;x<bx+b.w;x++)block(x,y);const dx=bx+Math.floor(b.w/2),dy=by+b.h-1;blocked[dy][dx]=false;keep[dy][dx]=true;doors[dx+','+dy]=brand?{kind,brand}:kind;o.door=[dx,dy];
  // 門口前面一定有路；南邊的房子再用小巷接回大路
  if(dy+1!==STREETS[0]&&dy+1!==STREETS[2]){const x0=Math.min(dx,AVENUE[0]),x1=Math.max(dx,AVENUE[1]);for(let x=x0;x<=x1;x++)pave(x,LANE)}});
 // 路燈、招牌、牌樓（都是實心的）
 const solid=(o)=>{objs.push(o);block(o.x,o.y)};
 [[10,6],[13,6],[13,15],[19,15],[4,15]].forEach(([x,y])=>solid({type:'lamp',x,y}));
 solid({type:'sign',x:9,y:6,what:'gym'});
 objs.push({type:'arch',x:10,y:1});block(10,1);block(13,1);
 // 各城特色區（第 22–26 列，避開小巷）
 const area=AREAS[ci%AREAS.length];
 const fillRect=(x,y,w,h,t)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(free(xx,yy)||(t===GT.PB&&keep[yy][xx]&&!blocked[yy][xx]))
  {if(t===GT.WA){g[yy][xx]=t;block(xx,yy)}else if(t===GT.PB||t===GT.PD)pave(xx,yy,t);else{g[yy][xx]=t;keep[yy][xx]=true}}};
 if(area==='plaza'){fillRect(7,22,10,3,GT.PB);[[7,22],[16,22],[7,24],[16,24]].forEach(([x,y])=>solid({type:'lamp',x,y}))}
 if(area==='waterfront'){for(let x=13;x<=21;x++)pave(x,22);fillRect(14,23,8,3,GT.WA);[[15,21],[18,21],[21,21]].forEach(([x,y])=>{if(free(x,y))solid({type:'lamp',x,y})})}
 if(area==='market'){fillRect(3,22,8,3,GT.PD);[[3,21],[6,21],[9,21]].forEach(([x,y])=>{if(free(x,y))solid({type:'lamp',x,y})})}
 if(area==='park'){fillRect(15,22,7,4,GT.FL);[16,18,20].forEach(x=>{keep[24][x]=false;solid({type:'tree',x,y:24,kind:city.tree});keep[24][x]=true})}
 if(area==='rice'){fillRect(2,22,7,4,GT.TG);fillRect(15,23,7,4,GT.TG)}
// 城市邊界跟著台灣地理：西部城市左側是海岸、右側是山；
// 花東／北部城市則反過來。海岸那一側是沙地上的防風椰子樹（海在外面的分區裡），
// 山那一側是松樹；入口保留一格小路，走出去就是那一側的分區。
const geography=geographyFor(city);
const paintBoundary=(side,x,terrain,gateY=null)=>{
  for(let y=0;y<H;y++){
    if(y===gateY||y===gateY+1){pave(x,y);continue}
    if(terrain==='coast'){g[y][x]=GT.SA;solid({type:'tree',x,y,kind:'palm'})}
    else solid({type:'tree',x,y,kind:terrain==='mountain'?'pine':city.tree});
  }
};
paintBoundary('west',0,geography.west,SIDE_GATE_Y);
paintBoundary('east',W-1,geography.east,SIDE_GATE_Y);
for(let x=1;x<W-1;x++){
  if(AVENUE.includes(x))continue;
  if(geography.north==='coast'){g[0][x]=GT.WA;block(x,0)}else solid({type:'tree',x,y:0,kind:geography.north==='mountain'?'pine':city.tree});
  if(geography.south==='coast'){g[H-1][x]=GT.WA;block(x,H-1)}else solid({type:'tree',x,y:H-1,kind:geography.south==='mountain'?'pine':city.tree});
}
// Explicit west/east district transition points. The inner tile is reserved
// so scenery generation can never seal the doorway.
for(const x of [0,1,W-2,W-1])for(const y of [SIDE_GATE_Y,SIDE_GATE_Y+1]){
  blocked[y][x]=false;
  for(let i=objs.length-1;i>=0;i--)if(objs[i].x===x&&objs[i].y===y)objs.splice(i,1);
  pave(x,y);
}
 // 街邊花圃
 for(let i=0;i<14;i++){const x=1+Math.floor(r()*22),y=15+Math.floor(r()*2);if(free(x,y))g[y][x]=GT.FL}
 // 路線：高草叢（只長在空草地上）
 const patches=[[2,17],[14,17],[3,27],[15,27],[2,30],[14,30],[6,31]];
 patches.forEach(([px,py])=>{const w=3+Math.floor(r()*4),h=2+Math.floor(r()*2);for(let y=py;y<Math.min(H-1,py+h);y++)for(let x=px;x<Math.min(px+w,W-1);x++)if(free(x,y))g[y][x]=GT.TG});
 // 被切成細條的草叢看起來像雜草，清掉（至少要和兩格草叢相連）
 for(let pass=0;pass<2;pass++)for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]===GT.TG&&!keep[y][x]){
  const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>g[y+dy][x+dx]===GT.TG).length;if(n<2)g[y][x]=GT.G}
 // 池塘：整塊都是空地才挖；水岸城市已經有湖了
 const pond=r()<.5?[18,28]:[3,28];
 if(r()<.75&&area!=='waterfront'){let ok=true;for(let y=pond[1];y<pond[1]+2;y++)for(let x=pond[0];x<pond[0]+3;x++)if(!(free(x,y)||g[y][x]===GT.TG))ok=false;
  if(ok)for(let y=pond[1];y<pond[1]+2;y++)for(let x=pond[0];x<pond[0]+3;x++){g[y][x]=GT.WA;block(x,y)}}
 // 樹：離大路遠一點，也不能擋在路上；樹冠有兩格高，不能種在建築正前方
 const shade=Array.from({length:H},()=>Array(W).fill(false));
 objs.filter(o=>o.type==='bld').forEach(o=>{for(let y=o.y+o.h;y<o.y+o.h+2&&y<H;y++)for(let x=o.x-1;x<=o.x+o.w;x++)if(shade[y]&&x>=0&&x<W)shade[y][x]=true});
 for(let i=0;i<16;i++){const x=1+Math.floor(r()*22),y=17+Math.floor(r()*15);if(x>=9&&x<=14||shade[y][x])continue;if(free(x,y))solid({type:'tree',x,y,kind:r()<.25?'broad':city.tree})}
 for(let i=0;i<10;i++){const x=1+Math.floor(r()*22),y=17+Math.floor(r()*15);if(free(x,y))g[y][x]=GT.FL}
 // 訓練家：站在大路旁、看著大路
 const spots=shuffle([[10,19,'right'],[13,22,'left'],[10,26,'right'],[13,29,'left'],[8,16,'right'],[15,16,'left'],[10,31,'right']]).filter(([x,y])=>!blocked[y][x]);
 const trainers=[];const nT=Math.min(spots.length,3+(ci>8?1:0));
 for(let k=0;k<nT;k++){const[x,y,dir]=spots[k];if(g[y][x]===GT.TG||g[y][x]===GT.FL)g[y][x]=GT.G;const cls=Math.floor(r()*TRAINERS.length);
  trainers.push({id:ci+'-'+k,x,y,dir,home:dir,cls,lv:cityLv(ci)+1+k,turnT:1500+r()*2500})}
 const innO=objs.find(o=>o.kind==='inn');
 const town={kind:'town',w:W,h:H,ci,g,objs,blocked,doors,trainers,npcs:[],inn:{x:innO.door[0],y:innO.door[1]+1}};return town}
export const isWalk=(x,y)=>x>=0&&y>=0&&x<MAP.w&&y<MAP.h&&!MAP.blocked[y][x]&&!MAP.trainers.some(t=>t.x===x&&t.y===y)&&!(MAP.npcs||[]).some(n=>n.x===x&&n.y===y)&&!(MAP.walkers||[]).some(n=>n.x===x&&n.y===y||(n.mv&&n.mv.tx===x&&n.mv.ty===y));
export function genInterior(kind,ci,ret,brand=null){const gym=kind==='gym',w=11,h=gym?16:10;const g=Array.from({length:h},()=>Array(w).fill(GT.G));
 const blocked=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||x===w-1||y<2||(y===h-1&&x!==5)));
 const furn=[],npcs=[],trainers=[],walkers=[];const add=(t,x,y,fw=1,fh=1)=>{furn.push({t,x,y,w:fw,h:fh});for(let yy=y;yy<y+fh;yy++)for(let xx=x;xx<x+fw;xx++)blocked[yy][xx]=true};
 if(gym){[[1,5],[9,5],[1,9],[9,9],[1,13],[9,13]].forEach(([x,y])=>add('pillar',x,y));furn.push({t:'platform',x:3,y:2,w:5,h:2});add('plant',2,2);add('plant',8,2);
  npcs.push({x:5,y:2,dir:'down',role:'leader',look:leaderLook(ci)});
  [[3,12,'right'],[7,9,'left'],[3,6,'right']].forEach(([x,y,dir],k)=>trainers.push({id:ci+'-g'+k,x,y,dir,home:dir,guard:true,lv:cityLv(ci)+1+k,turnT:2200+k*700,look:guardLook(ci,k)}))}
 else{for(let x=1;x<w-1;x++)blocked[2][x]=true;add('counter',3,3,5,1);npcs.push({x:5,y:2,dir:'down',role:'clerk',kind,look:CLERK[kind]});
  if(kind==='store'){add('shelf',1,5,2,1);add('shelf',1,7,2,1);add('shelf',8,5,2,1);add('shelf',8,7,2,1);add('plant',9,3);add('rack',1,3)}
  if(kind==='inn'){add('sofa',1,5,2,1);add('sofa',8,5,2,1);add('plant',1,3);add('plant',9,3);add('dispenser',9,8)}
  if(kind==='tea'||kind==='coffee'){
   // Each table and chair occupies its own tile so the seating reads as real furniture.
   [[2,6],[8,6]].forEach(([x,y])=>{add('table',x,y);add('chair',x,y-1);add('chair',x,y+1)});
   add('plant',1,3);add('plant',9,3)
  }
  if(kind==='mall'){[[2,6],[8,6]].forEach(([x,y])=>{add('table',x,y);add('chair',x,y-1);add('chair',x,y+1)});add('plant',1,3);add('plant',9,3)}
  if(kind==='dept'){add('rack',1,5);add('rack',1,7);add('rack',9,5);add('rack',9,7);add('shelf',7,5,1,1);add('shelf',3,5,1,1);add('plant',1,3);add('plant',9,3)}
  if(kind==='temple'){add('burner',5,6);add('pillar',1,4);add('pillar',9,4);add('pillar',1,7);add('pillar',9,7);add('cushion',3,4);add('cushion',7,4)}
  const free=[];for(let y=4;y<h-1;y++)for(let x=1;x<w-1;x++)if(!blocked[y][x]&&!(x===5&&y>=h-2))free.push([x,y]);
  const R2=Math.random;for(let k=0;k<2+(R2()<.5?1:0);k++){const[x,y]=free.splice(Math.floor(R2()*free.length),1)[0];const d=pick(TRAINERS);
   walkers.push({x,y,dir:pick(['up','down','left','right']),look:lookFromTrainer(d),line:pick(WALKER_LINES),gift:R2()<.35?pick(['snack','drink','bubble']):null,wt:800+R2()*1500,who:d.zh})}}
 return{kind:'in',bk:kind,brand,ci,w,h,g,blocked,furn,npcs,trainers,walkers,objs:[],doors:{},exit:{x:5,y:h-1},ret}}
