// ===== 地圖產生：城鎮與室內 =====
import { BLD, GT, rng } from '../art.js';
import { cityLv } from '../content.js';
import { pick, shuffle } from '../core/util.js';
import { CITIES, TRAINERS, WALKER_LINES } from '../data/index.js';
import { STORE_BRANDS } from '../data/stores.js';
import { MAP } from '../state.js';
import { CLERK, guardLook, leaderLook, lookFromTrainer } from './looks.js';

const W=24;
export const H=34;
export function genMap(ci){const r=rng(ci*7919+13),city=CITIES[ci];const g=Array.from({length:H},()=>Array(W).fill(GT.G));const objs=[],doors={};
 const blocked=Array.from({length:H},()=>Array(W).fill(false));
 const block=(x,y)=>{if(blocked[y])blocked[y][x]=true};
 for(let x=1;x<=22;x++){g[7][x]=GT.PB;g[8][x]=GT.PB;g[13][x]=GT.PB;g[14][x]=GT.PB}
 for(let y=0;y<H;y++){g[y][11]=y<16?GT.PB:GT.PD;g[y][12]=y<16?GT.PB:GT.PD}
 const shopR=rng(ci*3571+101),primaryShop=STORE_BRANDS[Math.floor(shopR()*STORE_BRANDS.length)].id;
 const bl=[['gym',2,2],['inn',14,2],['store',1,9,primaryShop],['tea',6,10],['temple',13,9],['house',20,9]];
 const hasSecondShop=shopR()<.38;if(hasSecondShop){let second=STORE_BRANDS[Math.floor(shopR()*STORE_BRANDS.length)].id;if(second===primaryShop)second=STORE_BRANDS[(STORE_BRANDS.findIndex(b=>b.id===second)+1)%STORE_BRANDS.length].id;bl.push(['store',1,18,second])}
 bl.forEach(([kind,bx,by,brand])=>{const b=BLD[kind];const o={type:'bld',kind,x:bx,y:by,w:b.w,h:b.h,...(brand&&{brand})};objs.push(o);
  for(let y=by;y<by+b.h;y++)for(let x=bx;x<bx+b.w;x++)block(x,y);const dx=bx+Math.floor(b.w/2),dy=by+b.h-1;blocked[dy][dx]=false;doors[dx+','+dy]=brand?{kind,brand}:kind;o.door=[dx,dy]});
 g[7][9]=GT.PB;
 [[10,6],[13,6],[10,12],[19,15],[4,15]].forEach(([x,y])=>{objs.push({type:'lamp',x,y});block(x,y)});
 objs.push({type:'sign',x:9,y:6,what:'gym'});block(9,6);
 objs.push({type:'arch',x:10,y:1});block(10,1);block(13,1);
 // 邊界樹
 for(let y=0;y<H;y++){[0,23].forEach(x=>{objs.push({type:'tree',x,y,kind:city.tree});block(x,y)})}
 for(let x=1;x<23;x++){if(x===11||x===12)continue;if(!blocked[0][x]){objs.push({type:'tree',x,y:0,kind:city.tree});block(x,0)}objs.push({type:'tree',x,y:H-1,kind:city.tree});block(x,H-1)}
 // 鎮上的空地放花
 for(let i=0;i<14;i++){const x=1+Math.floor(r()*22),y=15+Math.floor(r()*2);if(g[y][x]===GT.G&&!blocked[y][x])g[y][x]=GT.FL}
 // 路線：高草叢
 const patches=[[2,18],[14,18],[3,23],[15,23],[2,28],[14,28],[7,31]];
 patches.forEach(([px,py])=>{const w=3+Math.floor(r()*4),h=2+Math.floor(r()*2);for(let y=py;y<Math.min(H-1,py+h);y++)for(let x=px;x<Math.min(px+w,23);x++)if(x!==11&&x!==12&&!blocked[y][x])g[y][x]=GT.TG});
 // 池塘
 const pond=hasSecondShop?[18,20]:(r()<.5?[18,20]:[3,20]);if(r()<.75)for(let y=pond[1];y<pond[1]+2;y++)for(let x=pond[0];x<pond[0]+3;x++){if(x>0&&x<23){g[y][x]=GT.WA;block(x,y)}}
 // 樹
 for(let i=0;i<16;i++){const x=1+Math.floor(r()*22),y=17+Math.floor(r()*15);if(x>=9&&x<=14)continue;if(g[y][x]===GT.G&&!blocked[y][x]){objs.push({type:'tree',x,y,kind:r()<.25?'broad':city.tree});block(x,y)}}
 for(let i=0;i<10;i++){const x=1+Math.floor(r()*22),y=17+Math.floor(r()*15);if(g[y][x]===GT.G&&!blocked[y][x])g[y][x]=GT.FL}
 // 訓練家
 const spots=shuffle([[10,19,'right'],[13,22,'left'],[10,26,'right'],[13,29,'left'],[8,16,'right'],[15,16,'left'],[10,31,'right']]);
 const trainers=[];const nT=3+(ci>8?1:0);
 for(let k=0;k<nT;k++){const[x,y,dir]=spots[k];g[y][x]=GT.G;blocked[y][x]=false;const cls=Math.floor(r()*TRAINERS.length);
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
  if(kind==='tea'){add('table',2,6);add('table',8,6);add('plant',1,3);add('plant',9,3)}
  if(kind==='temple'){add('burner',5,6);add('pillar',1,4);add('pillar',9,4);add('pillar',1,7);add('pillar',9,7);add('cushion',3,4);add('cushion',7,4)}
  const free=[];for(let y=4;y<h-1;y++)for(let x=1;x<w-1;x++)if(!blocked[y][x]&&!(x===5&&y>=h-2))free.push([x,y]);
  const R2=Math.random;for(let k=0;k<2+(R2()<.5?1:0);k++){const[x,y]=free.splice(Math.floor(R2()*free.length),1)[0];const d=pick(TRAINERS);
   walkers.push({x,y,dir:pick(['up','down','left','right']),look:lookFromTrainer(d),line:pick(WALKER_LINES),gift:R2()<.35?pick(['snack','drink','bubble']):null,wt:800+R2()*1500,who:d.zh})}}
 return{kind:'in',bk:kind,brand,ci,w,h,g,blocked,furn,npcs,trainers,walkers,objs:[],doors:{},exit:{x:5,y:h-1},ret}}
