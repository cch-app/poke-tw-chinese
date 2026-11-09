// ===== 繪圖：地面、樹、建築、人物、動物、徽章 =====
import { CITIES } from './data/index.js';
import { storeBrand } from './data/stores.js';
import { paletteMarkup } from './render/pixel.js';
import { settings } from './state.js';
import { segment, toMark, toZhu } from './text.js';


export const OUT='#2a2238';
export function rng(seed){return()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296)}
export function hex2rgb(h){if(h.startsWith('rgb'))return h.match(/\d+/g).slice(0,3).map(Number);h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
export function shade(h,a){const[r,g,b]=hex2rgb(h);const f=v=>Math.round(a>=0?v+(255-v)*a:v*(1+a));return`rgb(${f(r)},${f(g)},${f(b)})`}
export function rr(c,x,y,w,h,r){c.beginPath();if(w<0){x+=w;w=-w}if(h<0){y+=h;h=-h}r=Math.max(0,Math.min(r,w/2,h/2));c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
export function fs(c,fill,lw){if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineWidth=lw;c.strokeStyle=OUT;c.lineJoin='round';c.stroke()}}
export function circ(c,x,y,r){c.beginPath();c.arc(x,y,r,0,Math.PI*2)}
export function ell(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2)}
export function lg(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g}

/* 中文字在畫布上：依設定加拼音或注音 */
export function canvasRuby(c,text,cx,cy,size,color,stroke){const segs=segment(text);const mode=settings().ruby;
 c.save();c.textAlign='center';c.textBaseline='alphabetic';const n=segs.length,w=size*1.02;let x=cx-(n*w)/2+w/2;
 segs.forEach(([ch,syl])=>{c.font=`900 ${size}px "Noto Sans TC",sans-serif`;
  if(stroke){c.lineWidth=size*.18;c.strokeStyle=stroke;c.strokeText(ch,x,cy)}c.fillStyle=color;c.fillText(ch,x,cy);
  if(mode!=='off'&&syl){const t=mode==='zhuyin'?toZhu(syl):toMark(syl);c.font=`700 ${size*.36}px "Noto Sans TC",sans-serif`;
   if(stroke){c.lineWidth=size*.1;c.strokeText(t,x,cy-size*.95)}c.fillText(t,x,cy-size*.95)}
  x+=w});c.restore()}

/* ---------- 地面 ---------- */
export const GT={G:0,TG:1,PD:2,PB:3,WA:4,FL:5,SA:6,PR:7,RK:8};  // SA 沙灘、PR 碼頭木棧道、RK 山壁岩石（不能走）
export function paintGround(m,ci,u,dpr){const H=m.length,W=m[0].length;const cv=document.createElement('canvas');cv.width=Math.ceil(W*u*dpr);cv.height=Math.ceil(H*u*dpr);
 const g=cv.getContext('2d');g.scale(dpr,dpr);const r=rng(ci*977+5);
 g.fillStyle='#8bd36b';g.fillRect(0,0,W*u,H*u);
 for(let i=0;i<90;i++){const x=r()*W*u,y=r()*H*u,rad=u*(1.2+r()*3);const gr=g.createRadialGradient(x,y,0,x,y,rad);
  const col=r()<.5?'rgba(66,150,70,.16)':'rgba(214,246,150,.20)';gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2)}
 g.lineCap='round';
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(m[y][x]!==GT.G&&m[y][x]!==GT.FL)continue;for(let k=0;k<4;k++){const px=(x+r())*u,py=(y+r())*u;g.strokeStyle=r()<.5?'#68b956':'#a6e07f';g.lineWidth=u*.035;
  g.beginPath();g.moveTo(px-u*.05,py-u*.08);g.lineTo(px,py);g.lineTo(px+u*.05,py-u*.09);g.stroke()}}
 // dirt
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.PD){g.fillStyle='#ecd6a4';g.fillRect(x*u,y*u,u+.5,u+.5);
  for(let k=0;k<3;k++){ell(g,(x+r())*u,(y+r())*u,u*.05,u*.03);g.fillStyle='#d8bd86';g.fill()}}
 // bricks
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.PB){g.fillStyle='#ece3d3';g.fillRect(x*u,y*u,u+.5,u+.5);g.strokeStyle='#d6c9b1';g.lineWidth=1;
  for(let row=0;row<4;row++){const yy=y*u+row*u/4;g.beginPath();g.moveTo(x*u,yy);g.lineTo(x*u+u,yy);g.stroke();const off=(row%2)*u/4;
   for(let k=0;k<2;k++){const xx=x*u+off+k*u/2;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx,yy+u/4);g.stroke()}}}
 // edges of paths
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=m[y][x];if(t!==GT.PD&&t!==GT.PB)continue;const col=t===GT.PB?'#b7aa92':'#c9a86e';
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{const n=m[y+dy]?.[x+dx];if(n===undefined||n===GT.PD||n===GT.PB)return;
   g.fillStyle=col;const th=u*.07;if(dy===-1)g.fillRect(x*u,y*u,u,th);if(dy===1)g.fillRect(x*u,y*u+u-th,u,th);if(dx===-1)g.fillRect(x*u,y*u,th,u);if(dx===1)g.fillRect(x*u+u-th,y*u,th,u);
   g.strokeStyle='#5fb04f';g.lineWidth=u*.04;for(let k=0;k<3;k++){const f=r();let px,py;if(dy)px=(x+f)*u,py=(dy<0?y:y+1)*u;else px=(dx<0?x:x+1)*u,py=(y+f)*u;
    g.beginPath();g.moveTo(px,py);g.lineTo(px+(dx||(r()-.5))*u*.1,py+(dy||(r()-.5))*u*.1);g.stroke()}})}
 // water
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.WA){const gr=g.createLinearGradient(0,y*u,0,y*u+u);gr.addColorStop(0,'#5cc0f0');gr.addColorStop(1,'#3a9ed9');g.fillStyle=gr;g.fillRect(x*u,y*u,u+.5,u+.5);
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{if(m[y+dy]?.[x+dx]===GT.WA)return;g.fillStyle='#d7f3ff';const th=u*.09;
   if(dy===-1){g.fillStyle='#7b6a4f';g.fillRect(x*u,y*u,u,th*1.4);g.fillStyle='#d7f3ff';g.fillRect(x*u,y*u+th*1.4,u,th*.6)}
   if(dy===1)g.fillRect(x*u,y*u+u-th,u,th);if(dx===-1)g.fillRect(x*u,y*u,th,u);if(dx===1)g.fillRect(x*u+u-th,y*u,th,u)})}
 // flowers
 const FC=['#ffffff','#ffd84a','#ff8fb6','#ff6b5a'];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.FL)for(let k=0;k<3;k++){const px=(x+.2+r()*.6)*u,py=(y+.2+r()*.6)*u,col=FC[Math.floor(r()*4)];
  for(let p=0;p<5;p++){const a=p/5*Math.PI*2;circ(g,px+Math.cos(a)*u*.05,py+Math.sin(a)*u*.05,u*.045);g.fillStyle=col;g.fill()}circ(g,px,py,u*.03);g.fillStyle='#f2a12e';g.fill()}
 // tall grass
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x]===GT.TG)drawTallGrass(g,x*u,y*u,u,r,false);
 return cv}
export function drawTallGrass(g,x0,y0,u,r,front){if(!front){g.fillStyle='#3f9a44';rr(g,x0+u*.02,y0+u*.1,u*.96,u*.9,u*.18);g.fill()}
 const cols=['#2f8239','#46a84a','#5cbf55','#78d266'];g.lineCap='round';
 const rows=front?[.62,.86]:[.3,.55,.8];rows.forEach((ry,ri)=>{for(let k=0;k<5;k++){const bx=x0+(k+.5+(r()-.5)*.4)*u/5,by=y0+ry*u+u*.16,hgt=u*(.32+r()*.14),lean=(r()-.5)*u*.14;
  g.strokeStyle=cols[Math.min(3,ri+(r()<.4?1:0))];g.lineWidth=u*.085;g.beginPath();g.moveTo(bx,by);g.quadraticCurveTo(bx+lean*.3,by-hgt*.6,bx+lean,by-hgt);g.stroke();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=u*.025;g.beginPath();g.moveTo(bx-u*.01,by-hgt*.4);g.lineTo(bx+lean*.9,by-hgt*.95);g.stroke()}})}

/* ---------- 樹 ---------- */
export function spriteTree(kind,u,dpr){const W2=2*u,H2=2.5*u;const cv=mkc(W2,H2,dpr);const c=cv.getContext('2d');const cx=u,by=2.42*u,lw=Math.max(1.2,u*.035);
 ell(c,cx+u*.08,by-u*.08,u*.62,u*.2);c.fillStyle='rgba(20,40,20,.22)';c.fill();
 if(kind==='palm'){c.lineCap='round';c.strokeStyle=OUT;c.lineWidth=u*.24;c.beginPath();c.moveTo(cx,by-u*.1);c.quadraticCurveTo(cx+u*.25,by-u*.9,cx+u*.05,by-u*1.65);c.stroke();
  c.strokeStyle='#a8784a';c.lineWidth=u*.17;c.stroke();c.strokeStyle='#8c613a';c.lineWidth=u*.03;for(let k=1;k<7;k++){const t=k/7;const px=cx+u*.25*2*t*(1-t)+u*.05*t*t,py=by-u*.1-(u*1.55)*t;c.beginPath();c.moveTo(px-u*.08,py);c.lineTo(px+u*.08,py+u*.02);c.stroke()}
  const tx=cx+u*.05,ty=by-u*1.68;for(let k=0;k<8;k++){const a=-Math.PI/2+(k-3.5)*.48+(k%2?.1:0);const len=u*(.8+(k%3)*.12);const ex=tx+Math.cos(a)*len,ey=ty+Math.sin(a)*len*.75+u*.25;
   c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*len*.5,ty+Math.sin(a)*len*.5-u*.25,ex,ey);c.quadraticCurveTo(tx+Math.cos(a)*len*.45+u*.06,ty+Math.sin(a)*len*.45-u*.08,tx,ty);fs(c,k%2?'#3f9f4b':'#58b85a',lw)}
  [[-.08,.05],[.1,.07],[0,.14]].forEach(([dx,dy])=>{circ(c,tx+dx*u,ty+dy*u,u*.08);fs(c,'#7a5230',lw*.7)});return cv}
 if(kind==='pine'){c.fillStyle='#7a5230';rr(c,cx-u*.1,by-u*.5,u*.2,u*.45,u*.05);fs(c,'#86603a',lw);
  const tiers=[[by-u*.35,.78,'#2d7a58'],[by-u*.9,.62,'#348a63'],[by-u*1.45,.46,'#3f9a70'],[by-u*1.95,.28,'#4aa979']];
  tiers.forEach(([y,wid,col])=>{c.beginPath();c.moveTo(cx-wid*u,y);c.quadraticCurveTo(cx-wid*u*.4,y-u*.2,cx,y-u*.85);c.quadraticCurveTo(cx+wid*u*.4,y-u*.2,cx+wid*u,y);c.quadraticCurveTo(cx,y+u*.12,cx-wid*u,y);fs(c,col,lw);
   c.beginPath();c.moveTo(cx+u*.05,y-u*.7);c.quadraticCurveTo(cx+wid*u*.35,y-u*.2,cx+wid*u*.75,y-u*.03);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=u*.05;c.stroke()});return cv}
 c.fillStyle='#86603a';rr(c,cx-u*.12,by-u*.75,u*.24,u*.7,u*.06);fs(c,lg(c,cx-u*.12,0,cx+u*.12,0,['#8c643c','#6d4b2a']),lw);
 const blobs=[[0,-1.25,.62],[-.42,-1.05,.42],[.42,-1.02,.44],[-.22,-1.55,.42],[.24,-1.58,.4]];
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u,by+dy*u,rad*u+lw);c.fillStyle=OUT;c.fill()});
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u,by+dy*u,rad*u);c.fillStyle='#2f8a3e';c.fill()});
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u-rad*u*.15,by+dy*u-rad*u*.18,rad*u*.78);c.fillStyle='#46a84c';c.fill()});
 blobs.forEach(([dx,dy,rad])=>{circ(c,cx+dx*u-rad*u*.32,by+dy*u-rad*u*.36,rad*u*.36);c.fillStyle='#7cd36a';c.fill()});
 return cv}
export function mkc(w,h,dpr){const cv=document.createElement('canvas');cv.width=Math.ceil(w*dpr);cv.height=Math.ceil(h*dpr);const c=cv.getContext('2d');c.scale(dpr,dpr);c.lineJoin='round';c.lineCap='round';c.imageSmoothingEnabled=true;cv._w=w;cv._h=h;return cv}

/* ---------- 小物件 ---------- */
// 現代歐式路燈：深灰錐形燈柱、腰環、上寬下窄的玻璃燈籠，頂上平帽與尖頂（城鎮、計程車街景、機場共用）
export function drawEuroLamp(c,x,gy,H){const lw=Math.max(1,H*.022),pw=H*.05,col='#2b3236';
 rr(c,x-pw*1.5,gy-H*.07,pw*3,H*.07,pw*.4);fs(c,col,lw);
 c.beginPath();c.moveTo(x-pw*.85,gy-H*.07);c.lineTo(x-pw*.4,gy-H*.78);c.lineTo(x+pw*.4,gy-H*.78);c.lineTo(x+pw*.85,gy-H*.07);c.closePath();fs(c,lg(c,x-pw,0,x+pw,0,['#4a555c',col]),lw);
 rr(c,x-pw*.95,gy-H*.46,pw*1.9,H*.03,pw*.3);fs(c,'#3d474d',lw*.7);
 const ly=gy-H*.89,gr=c.createRadialGradient(x,ly,0,x,ly,H*.3);gr.addColorStop(0,'rgba(255,225,150,.5)');gr.addColorStop(1,'rgba(255,225,150,0)');c.fillStyle=gr;c.fillRect(x-H*.3,ly-H*.3,H*.6,H*.6);
 rr(c,x-pw*1.25,gy-H*.81,pw*2.5,H*.03,pw*.2);fs(c,col,lw*.7);
 c.beginPath();c.moveTo(x-pw*1.0,gy-H*.79);c.lineTo(x-pw*1.4,gy-H*.97);c.lineTo(x+pw*1.4,gy-H*.97);c.lineTo(x+pw*1.0,gy-H*.79);c.closePath();fs(c,lg(c,0,gy-H*.97,0,gy-H*.79,['#fff6d6','#ffd77a']),lw*.8);
 c.strokeStyle=col;c.lineWidth=Math.max(1,lw*.6);c.beginPath();c.moveTo(x,gy-H*.97);c.lineTo(x,gy-H*.79);c.stroke();
 c.beginPath();c.moveTo(x-pw*1.6,gy-H*.97);c.lineTo(x-pw*.6,gy-H*1.03);c.lineTo(x+pw*.6,gy-H*1.03);c.lineTo(x+pw*1.6,gy-H*.97);c.closePath();fs(c,col,lw*.8);
 circ(c,x,gy-H*1.05,pw*.3);fs(c,col,lw*.5)}
export function spriteLamp(u,dpr){const cv=mkc(u,2*u,dpr),c=cv.getContext('2d'),by=1.92*u;
 ell(c,u/2,by-u*.04,u*.22,u*.07);c.fillStyle='rgba(0,0,0,.2)';c.fill();
 drawEuroLamp(c,u/2,by,u*1.75);return cv}
export function spriteSign(u,dpr,col){const cv=mkc(u,1.2*u,dpr),c=cv.getContext('2d'),lw=Math.max(1.2,u*.035),by=1.12*u;
 ell(c,u/2,by-u*.03,u*.35,u*.08);c.fillStyle='rgba(0,0,0,.18)';c.fill();
 rr(c,u*.2,by-u*.5,u*.09,u*.48,u*.03);fs(c,'#8c643c',lw);rr(c,u*.71,by-u*.5,u*.09,u*.48,u*.03);fs(c,'#8c643c',lw);
 rr(c,u*.08,by-u*.98,u*.84,u*.56,u*.1);fs(c,'#f6e2b8',lw);rr(c,u*.16,by-u*.9,u*.68,u*.08,u*.04);c.fillStyle=col;c.fill();
 c.fillStyle='#c9a46a';for(let k=0;k<2;k++){rr(c,u*.2,by-u*(.74-k*.14),u*(.6-k*.18),u*.05,u*.02);c.fill()}return cv}
export function spriteArch(u,dpr,city){const w=4*u,h=2.6*u;const cv=mkc(w,h,dpr),c=cv.getContext('2d'),lw=Math.max(1.4,u*.04);const red='#c8372d';
 [[.35],[3.45]].forEach(([px])=>{ell(c,px*u+u*.1,h-u*.05,u*.32,u*.09);c.fillStyle='rgba(0,0,0,.2)';c.fill();rr(c,px*u,h-u*1.95,u*.2,u*1.9,u*.05);fs(c,lg(c,px*u,0,px*u+u*.2,0,[shade(red,.15),shade(red,-.25)]),lw);rr(c,px*u-u*.06,h-u*.22,u*.32,u*.18,u*.04);fs(c,'#8f8a80',lw)});
 rr(c,u*.15,h-u*2.05,w-u*.3,u*.22,u*.05);fs(c,red,lw);
 c.beginPath();c.moveTo(0,h-u*2.05);c.quadraticCurveTo(u*.4,h-u*2.2,u*.6,h-u*2.5);c.lineTo(w-u*.6,h-u*2.5);c.quadraticCurveTo(w-u*.4,h-u*2.2,w,h-u*2.05);c.closePath();fs(c,'#2f9a6a',lw);
 c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=u*.03;for(let k=1;k<10;k++){c.beginPath();c.moveTo(u*.6+k*(w-u*1.2)/10,h-u*2.45);c.lineTo(u*.4+k*(w-u*.8)/10,h-u*2.1);c.stroke()}
 rr(c,w/2-u*1.05,h-u*1.85,u*2.1,u*.62,u*.08);fs(c,'#ffd35a',lw);
 canvasRuby(c,city.zh,w/2,h-u*1.33,u*.36,OUT);return cv}

/* ---------- 建築 ---------- */
// 會冒煙／冒熱氣的出口（相對於建築貼圖左上角，單位是格）：木屋煙囪、茶壺壺嘴、咖啡杯口。
// 煙是地圖畫面每格即時畫的，不畫在建築貼圖上，才會一直冒出來
export const VENTS={inn:[{x:4.65,y:.8,kind:'smoke'}],tea:[{x:.34,y:1.62,kind:'steam'}],coffee:[{x:2.05,y:.95,kind:'steam'},{x:2.5,y:.9,kind:'steam'},{x:2.95,y:.95,kind:'steam'}]};
export const BLD={gym:{w:7,h:5,ex:1.3},inn:{w:6,h:5,ex:1.4},store:{w:5,h:4,ex:1},tea:{w:5,h:4,ex:1},coffee:{w:5,h:4,ex:1},temple:{w:6,h:4,ex:1.6},house:{w:3,h:4,ex:1.8},mall:{w:8,h:5,ex:1.3},dept:{w:6,h:5,ex:1.7}};
// 每種建築一眼就認得：屋頂形狀、顏色和大招牌各不相同（地圖上找路靠的就是這些地標）
function spriteBuildingLegacy(kind,u,dpr,city,emblemImg,brandId){
 const b=BLD[kind];const w=b.w*u,h=(b.h+b.ex)*u;const cv=mkc(w,h,dpr);const c=cv.getContext('2d');const lw=Math.max(1.4,u*.04);
 const door=(cx,dw,dh,col1,col2)=>{rr(c,cx-dw/2,h-dh,dw,dh,u*.06);fs(c,lg(c,0,h-dh,0,h,[col1,col2]),lw);c.beginPath();c.moveTo(cx,h-dh);c.lineTo(cx,h);c.strokeStyle=OUT;c.lineWidth=lw;c.stroke();
  c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.moveTo(cx-dw/2+u*.08,h-dh+u*.1);c.lineTo(cx-dw/2+u*.22,h-dh+u*.1);c.lineTo(cx-dw/2+u*.08,h-dh+u*.4);c.fill()};
 const win=(x,y,ww,wh,grille)=>{rr(c,x,y,ww,wh,u*.05);fs(c,lg(c,0,y,0,y+wh,['#bfe8ff','#6fb7e6']),lw);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(x+ww*.12,y+wh*.15,ww*.14,wh*.5);
  if(grille){c.strokeStyle='#5c6680';c.lineWidth=u*.025;for(let k=1;k<5;k++){c.beginPath();c.moveTo(x+ww*k/5,y);c.lineTo(x+ww*k/5,y+wh);c.stroke()}c.beginPath();c.moveTo(x,y+wh/2);c.lineTo(x+ww,y+wh/2);c.stroke()}};
 const plaque=(cx,cy,text,bg,fg,sz)=>{const pw=text.length*sz*1.08+sz*.6,ph=sz*(settings().ruby==='off'?1.3:1.75);rr(c,cx-pw/2,cy-ph/2,pw,ph,u*.08);fs(c,bg,lw);canvasRuby(c,text,cx,cy+ph/2-sz*.32,sz,fg)};
 if(kind==='gym'){const roofC=city.roof,top=u*1.75,gx0=u*1.6,gx1=w-u*1.6,base=h-u*.25;
  // 現代體育館：城市色的弧形金屬屋頂、中央整面玻璃帷幕配直向鋁鰭，徽章嵌在玻璃上，入口有懸挑雨遮
  c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.2,top,w-u*.4,h-top,u*.06);fs(c,lg(c,0,top,0,h,['#ffffff','#dfe4ec']),lw);
  [u*.2,gx1].forEach(px=>{const pw=gx0-u*.2;c.fillStyle=shade(roofC,.15);c.fillRect(px+pw*.42,top+u*.1,pw*.16,base-top-u*.1);
   [0,1].forEach(r=>{const wy=top+u*(.6+r*1.45);rr(c,px+u*.25,wy,pw-u*.5,u*.95,u*.03);fs(c,lg(c,0,wy,0,wy+u*.95,['#dff1fb','#5f8fb5']),lw*.7);c.fillStyle='rgba(255,255,255,.45)';c.fillRect(px+u*.35,wy+u*.1,u*.07,u*.5)})});
  rr(c,gx0,top+u*.15,gx1-gx0,base-top-u*.15,u*.03);fs(c,lg(c,0,top,0,base,['#e6f5ff','#8fc3e6','#3e78a8']),lw);
  c.strokeStyle='#cfd6e2';c.lineWidth=u*.06;for(let x=gx0+u*.32;x<gx1-u*.1;x+=u*.32){c.beginPath();c.moveTo(x,top+u*.15);c.lineTo(x,base);c.stroke()}
  c.fillStyle='rgba(255,255,255,.3)';[gx0+u*.3,gx1-u*1.1].forEach(x=>{c.beginPath();c.moveTo(x,base);c.lineTo(x+u*.6,top+u*.15);c.lineTo(x+u*.85,top+u*.15);c.lineTo(x+u*.25,base);c.fill()});
  rr(c,u*.1,base,w-u*.2,u*.25,u*.04);fs(c,'#b9bfca',lw);
  const arcY=t=>(1-t)*(1-t)*(top+u*.05)+2*t*(1-t)*(-u*.45)+t*t*(top+u*.05);
  c.beginPath();c.moveTo(-u*.05,top+u*.05);c.quadraticCurveTo(w/2,-u*.45,w+u*.05,top+u*.05);c.lineTo(w-u*.1,top+u*.32);c.lineTo(u*.1,top+u*.32);c.closePath();
  fs(c,lg(c,0,0,0,top,[shade(roofC,.35),roofC,shade(roofC,-.25)]),lw);
  c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=u*.035;for(let k=1;k<10;k++){const t=k/10,x=-u*.05+t*(w+u*.1);c.beginPath();c.moveTo(x,arcY(t)+u*.04);c.lineTo(x,top+u*.28);c.stroke()}
  c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=u*.04;c.beginPath();c.moveTo(u*.3,top-u*.08);c.quadraticCurveTo(w/2,-u*.32,w-u*.3,top-u*.08);c.stroke();
  c.fillStyle='rgba(255,211,90,.6)';c.fillRect(u*.2+lw/2,top+u*.32,w-u*.4-lw,u*.06);
  const ey=top+u*1.05;circ(c,w/2,ey,u*.8);fs(c,'#ffffff',lw);circ(c,w/2,ey,u*.8);c.strokeStyle=roofC;c.lineWidth=u*.08;c.stroke();
  if(emblemImg&&emblemImg.complete&&emblemImg.naturalWidth)c.drawImage(emblemImg,w/2-u*.7,ey-u*.7,u*1.4,u*1.4);
  const cy=h-u*1.6;rr(c,w/2-u*1.6,cy,u*3.2,u*.2,u*.04);fs(c,'#2b2e35',lw);c.fillStyle='rgba(255,211,90,.6)';c.fillRect(w/2-u*1.5,cy+u*.2,u*3.0,u*.05);
  rr(c,w/2-u*.8,h-u*1.35,u*1.6,u*1.1,u*.03);fs(c,'#2b2e35',lw*.8);
  [w/2-u*.74,w/2+u*.02].forEach(px=>{rr(c,px,h-u*1.29,u*.72,u*1.04,u*.02);fs(c,lg(c,0,h-u*1.3,0,h,['#e6f6ff','#8fc0dc']))});
  c.fillStyle='#c9ced6';[w/2-u*.12,w/2+u*.08].forEach(px=>c.fillRect(px,h-u*.95,u*.04,u*.35));
  plaque(w/2,cy-u*.28,'道館','#2b2e35','#ffffff',u*.3)}
 else if(kind==='inn'){const eave=u*2.45,apex=u*.8,x0=u*.35,x1=w-u*.35,base=h-u*.3,ink=Math.max(1,u*.04);c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  // 旅館是山中木屋：原木疊成的牆和山牆、轉角露出圓木頭，陡斜的木瓦屋頂、石砌煙囪，門前有附屋簷的門廊
  rr(c,w-u*1.65,u*.85,u*.6,u*1.3,u*.04);fs(c,'#9a958c',lw);c.strokeStyle='rgba(60,55,50,.45)';c.lineWidth=ink*.6;
  for(let y=u*.85+u*.22,r=0;y<u*2.1;y+=u*.22,r++){c.beginPath();c.moveTo(w-u*1.65,y);c.lineTo(w-u*1.05,y);c.stroke();const sx=w-u*1.65+(r%2?u*.2:u*.4);c.beginPath();c.moveTo(sx,y-u*.22);c.lineTo(sx,y);c.stroke()}
  rr(c,w-u*1.72,u*.78,u*.74,u*.14,u*.03);fs(c,'#6f6a62',lw*.7);
  const wall=()=>{c.beginPath();c.moveTo(x0,eave);c.lineTo(w/2,apex);c.lineTo(x1,eave);c.lineTo(x1,base);c.lineTo(x0,base);c.closePath()};
  c.save();wall();c.clip();for(let y=apex;y<base;y+=u*.3){rr(c,x0-u*.1,y,x1-x0+u*.2,u*.3,u*.14);fs(c,lg(c,0,y,0,y+u*.3,['#d49a5e','#a8693a','#7a4724']));
   c.strokeStyle='rgba(60,30,10,.25)';c.lineWidth=Math.max(1,u*.02);c.beginPath();c.moveTo(x0+u*((y/u*7)%1.3+.3),y+u*.15);c.lineTo(x0+u*((y/u*7)%1.3+.9),y+u*.15);c.stroke()}c.restore();
  wall();c.strokeStyle=OUT;c.lineWidth=lw;c.stroke();
  for(let y=eave+u*.15;y<base-u*.1;y+=u*.3)[x0,x1].forEach(px=>{circ(c,px,y,u*.15);fs(c,'#e6bd86',lw*.7);circ(c,px,y,u*.08);c.strokeStyle='rgba(120,70,30,.6)';c.lineWidth=Math.max(1,u*.02);c.stroke()});
  c.beginPath();c.moveTo(w/2,u*.3);c.lineTo(-u*.2,eave+u*.05);c.lineTo(u*.08,eave+u*.38);c.lineTo(w/2,apex+u*.08);c.lineTo(w-u*.08,eave+u*.38);c.lineTo(w+u*.2,eave+u*.05);c.closePath();
  fs(c,lg(c,0,u*.3,0,eave,['#5a6b4a','#3d4a33']),lw);
  c.strokeStyle='rgba(20,30,15,.35)';c.lineWidth=Math.max(1,u*.025);for(let k=1;k<6;k++){const t=k/6;c.beginPath();c.moveTo(w/2-(w/2+u*.2)*t,u*.3+(eave+u*.05-u*.3)*t);c.lineTo(w/2-(w/2-u*.08)*t,apex+u*.08+(eave+u*.38-apex-u*.08)*t);c.moveTo(w/2+(w/2+u*.2)*t,u*.3+(eave+u*.05-u*.3)*t);c.lineTo(w/2+(w/2-u*.08)*t,apex+u*.08+(eave+u*.38-apex-u*.08)*t);c.stroke()}
  circ(c,w/2,u*1.55,u*.34);fs(c,'#6b3f1f',lw);circ(c,w/2,u*1.55,u*.26);fs(c,lg(c,0,u*1.3,0,u*1.8,['#fff1cf','#e8b86a']),lw*.5);
  c.strokeStyle='#6b3f1f';c.lineWidth=u*.05;c.beginPath();c.moveTo(w/2-u*.26,u*1.55);c.lineTo(w/2+u*.26,u*1.55);c.moveTo(w/2,u*1.29);c.lineTo(w/2,u*1.81);c.stroke();
  [u*.75,w-u*1.85].forEach(px=>{const wy=u*3.25,ww=u*1.1,wh=u*.95;rr(c,px-u*.06,wy-u*.06,ww+u*.12,wh+u*.12,u*.03);fs(c,'#6b3f1f',lw);
   rr(c,px,wy,ww,wh,u*.02);fs(c,lg(c,0,wy,0,wy+wh,['#fff1cf','#e8b86a','#c98a3a']));c.strokeStyle='#6b3f1f';c.lineWidth=u*.06;c.beginPath();c.moveTo(px+ww/2,wy);c.lineTo(px+ww/2,wy+wh);c.moveTo(px,wy+wh/2);c.lineTo(px+ww,wy+wh/2);c.stroke();
   rr(c,px-u*.08,wy+wh+u*.04,ww+u*.16,u*.2,u*.03);fs(c,'#8a5634',lw*.7);['#ff5b4a','#ffc93c','#ff8fb6','#ff5b4a'].forEach((col,i)=>{circ(c,px+ww*(.12+i*.25),wy+wh+u*.02,u*.08);fs(c,col,lw*.4)})});
  const py=h-u*1.75,pl=w/2-u*1.35,pr=w/2+u*1.35;
  [pl,pr-u*.22].forEach(px=>{rr(c,px,py+u*.2,u*.22,base-py-u*.2,u*.05);fs(c,lg(c,px,0,px+u*.22,0,['#c98a4f','#7a4724']),lw*.8)});
  c.beginPath();c.moveTo(pl-u*.2,py+u*.3);c.lineTo(w/2,py-u*.25);c.lineTo(pr+u*.2,py+u*.3);c.closePath();fs(c,lg(c,0,py-u*.25,0,py+u*.3,['#5a6b4a','#3d4a33']),lw);
  const dw=u*.95,dh=u*1.25,dx=w/2-dw/2;rr(c,dx,base-dh,dw,dh,u*.06);fs(c,lg(c,dx,0,dx+dw,0,['#9a5e30','#6b3f1f']),lw);
  c.strokeStyle='rgba(40,20,5,.45)';c.lineWidth=Math.max(1,u*.025);for(let x=dx+dw/4;x<dx+dw-u*.05;x+=dw/4){c.beginPath();c.moveTo(x,base-dh+u*.05);c.lineTo(x,base);c.stroke()}
  rr(c,w/2-u*.22,base-dh+u*.15,u*.44,u*.3,u*.05);fs(c,lg(c,0,base-dh,0,base-dh+u*.45,['#fff1cf','#e8b86a']),lw*.5);
  circ(c,dx+dw-u*.17,base-dh*.45,u*.05);c.fillStyle='#e8c873';c.fill();
  rr(c,u*.15,base-u*.04,w-u*.3,u*.26,u*.03);fs(c,'#8a5634',lw);c.strokeStyle='rgba(40,20,5,.35)';c.lineWidth=Math.max(1,u*.02);for(let x=u*.6;x<w-u*.3;x+=u*.45){c.beginPath();c.moveTo(x,base-u*.02);c.lineTo(x,base+u*.2);c.stroke()}
  [pl+u*.11,pr-u*.11].forEach(px=>{const ly=py+u*.55;rr(c,px-u*.1,ly,u*.2,u*.28,u*.05);fs(c,'#2b2e35',lw*.6);rr(c,px-u*.06,ly+u*.05,u*.12,u*.18,u*.03);c.fillStyle='#ffd35a';c.fill()});
  [u*.45,w-u*.95].forEach(px=>{rr(c,px,base-u*.42,u*.5,u*.42,u*.08);fs(c,lg(c,px,0,px+u*.5,0,['#a8693a','#6b3f1f']),lw*.7);c.fillStyle='#3a2416';c.fillRect(px,base-u*.32,u*.5,u*.04);c.fillRect(px,base-u*.14,u*.5,u*.04);
   [.12,.25,.38].forEach(k=>{circ(c,px+u*k,base-u*.5,u*.13);fs(c,'#4fae54',lw*.5)})});
  plaque(w/2,u*2.62,'旅館','#7a4a26','#fff3d6',u*.3)}
 else if(kind==='store'){const fy=u*.78,brand=storeBrand(brandId);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(u*.22,h-u*.42,w-u*.08,u*.42);
  // Raised roof cap and illuminated chain sign make each shop read as a real storefront.
  c.beginPath();c.moveTo(u*.08,u*.28);c.lineTo(u*.32,u*.06);c.lineTo(w-u*.18,u*.06);c.lineTo(w-u*.04,u*.28);c.lineTo(w-u*.04,fy);c.lineTo(u*.08,fy);c.closePath();fs(c,lg(c,0,0,0,fy,['#f7f8fb','#c7ced9']),lw);
  rr(c,u*.42,u*.17,w-u*.84,u*.43,u*.07);fs(c,'rgba(255,255,255,.96)',lw*.75);
  const brandFont=(brand.id==='family'||brand.id==='hilife') ? 0.25 : 0.31;c.fillStyle=brand.primary;c.font=`900 ${u*brandFont}px system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(brand.sign,w/2,u*.39);
  rr(c,u*.1,fy,w-u*.2,h-fy,u*.06);fs(c,lg(c,0,fy,w,fy,[shade('#f8f8f6',.02),'#e8ecf1','#cfd5df']),lw);
  brand.stripes.forEach((col,i)=>{c.fillStyle=col;c.fillRect(u*.1+lw/2,fy+u*(.08+i*.14),w-u*.2-lw,u*(i===1?.1:.14))});
  rr(c,u*.35,fy+u*.68,w-u*.7,h-fy-u*.78,u*.05);fs(c,lg(c,0,fy+u*.68,0,h,['#d8f2ff','#78acd0','#356f9d']),lw);
  const sc=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'];for(let s=0;s<2;s++){c.fillStyle='rgba(27,35,64,.25)';c.fillRect(u*.45,fy+u*(1.25+s*.55),w-u*.9,u*.04);
   for(let k=0;k<12;k++){c.fillStyle=sc[(k+s*2)%5];c.fillRect(u*.5+k*(w-u*1)/12,fy+u*(1.05+s*.55),u*.12,u*.2)}}
  door(w/2,u*1.1,u*1.05,'rgba(214,240,255,.9)','rgba(140,200,240,.9)');
  c.fillStyle='rgba(255,255,255,.6)';c.fillRect(u*.45,fy+u*.77,u*.09,h-fy-u*.95);c.fillStyle=brand.secondary;c.fillRect(u*.16,h-u*.2,w-u*.32,u*.12)}
 else if(kind==='tea'){const fy=u*1.0;c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.15,fy,w-u*.3,h-fy,u*.06);fs(c,'#d9a066',lw);c.strokeStyle='rgba(120,70,30,.35)';c.lineWidth=1;for(let x=u*.15;x<w-u*.15;x+=u*.22){c.beginPath();c.moveTo(x,fy);c.lineTo(x,h);c.stroke()}
  c.beginPath();c.moveTo(0,fy+u*.1);c.lineTo(u*.3,u*.2);c.lineTo(w-u*.3,u*.2);c.lineTo(w,fy+u*.1);c.closePath();fs(c,'#8a5634',lw);
  c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=u*.03;for(let y=u*.35;y<fy;y+=u*.16){c.beginPath();c.moveTo(u*.2,y);c.lineTo(w-u*.2,y);c.stroke()}
  rr(c,u*.4,fy+u*.65,w-u*.8,u*.75,u*.06);fs(c,'#3a2a22',lw);rr(c,u*.4,fy+u*1.3,w-u*.8,u*.18,u*.04);fs(c,'#f6e2b8',lw);
  for(let k=0;k<3;k++){const px=u*.8+k*u*.9;rr(c,px,fy+u*.98,u*.26,u*.32,u*.05);fs(c,'#f3e6d0',lw*.7);ell(c,px+u*.13,fy+u*1.22,u*.1,u*.05);c.fillStyle='#3a2a22';c.fill()}
  const aw=fy+u*.35;for(let k=0;k<8;k++){c.beginPath();const x0=u*.1+k*(w-u*.2)/8,x1=x0+(w-u*.2)/8;c.moveTo(x0,aw);c.lineTo(x1,aw);c.lineTo(x1,aw+u*.22);c.arc((x0+x1)/2,aw+u*.22,(x1-x0)/2,0,Math.PI);c.closePath();fs(c,k%2?'#ffffff':'#ff5b4a',lw*.7)}
  rr(c,w/2-u*.45,fy-u*.5,u*.9,u*.7,u*.15);fs(c,'#fff6e0',lw);rr(c,w/2-u*.14,fy-u*.38,u*.28,u*.4,u*.06);fs(c,'#ffe0b0',lw*.7);c.fillStyle='#3a2a22';for(let k=0;k<3;k++){circ(c,w/2-u*.07+k*u*.07,fy-u*.06,u*.03);c.fill()}
  c.strokeStyle=OUT;c.lineWidth=lw*.8;c.beginPath();c.moveTo(w/2+u*.05,fy-u*.38);c.lineTo(w/2+u*.12,fy-u*.55);c.stroke();
  plaque(w-u*.75,h-u*.55,'茶','#1b2340','#ffffff',u*.3)}
 else if(kind==='temple'){const fy=h-2.3*u,red='#c8372d',gold='#e8c873';c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  // 現代廟宇：保留燕尾雙層屋頂和紅金配色，改成俐落的深色屋簷、整面暖光玻璃、細紅柱和圓筒燈籠
  const roof=(y,x0,x1,lift,th)=>{c.beginPath();c.moveTo(x0,y-lift);c.quadraticCurveTo(x0+u*.6,y-th,x0+u*1.0,y-th);c.lineTo(x1-u*1.0,y-th);c.quadraticCurveTo(x1-u*.6,y-th,x1,y-lift);
   c.lineTo(x1-u*.12,y-lift+u*.1);c.quadraticCurveTo(x1-u*.6,y,x1-u*1.0,y);c.lineTo(x0+u*1.0,y);c.quadraticCurveTo(x0+u*.6,y,x0+u*.12,y-lift+u*.1);c.closePath();
   fs(c,lg(c,0,y-lift,0,y,['#555a64','#2b2e35']),lw);c.fillStyle=gold;c.fillRect(x0+u*1.0,y-u*.08,x1-x0-u*2.0,u*.05);
   c.fillStyle='rgba(255,211,90,.35)';c.fillRect(x0+u*1.0,y+lw/2,x1-x0-u*2.0,u*.07)};
  rr(c,0,h-u*.32,w,u*.32,u*.04);fs(c,'#e6e2da',lw);rr(c,w/2-u*1.1,h-u*.18,u*2.2,u*.18,u*.03);fs(c,'#f3f0ea',lw);
  rr(c,u*.35,fy,w-u*.7,h-fy-u*.3,u*.04);fs(c,lg(c,0,fy,0,h,['#faf7f2','#e4ded3']),lw);
  const gx0=u*.95,gx1=w-u*.95,gy=fy+u*.62,gb=h-u*.32;rr(c,gx0,gy,gx1-gx0,gb-gy,u*.03);fs(c,lg(c,0,gy,0,gb,['#fff1cf','#e8b86a','#b8783a']),lw*.8);
  c.strokeStyle='#4a3a30';c.lineWidth=Math.max(1,u*.035);for(let x=gx0+u*.5;x<gx1-u*.1;x+=u*.5){c.beginPath();c.moveTo(x,gy);c.lineTo(x,gb);c.stroke()}
  c.beginPath();c.moveTo(gx0,gy+u*.42);c.lineTo(gx1,gy+u*.42);c.stroke();
  c.fillStyle='rgba(255,255,255,.3)';[gx0+u*.2,gx1-u*1.0].forEach(x=>{c.beginPath();c.moveTo(x,gb);c.lineTo(x+u*.4,gy);c.lineTo(x+u*.6,gy);c.lineTo(x+u*.2,gb);c.fill()});
  const dw=u*1.3,dh=u*1.25,dx=w/2-dw/2;rr(c,dx-u*.06,h-u*.3-dh-u*.06,dw+u*.12,dh+u*.06,u*.03);fs(c,'#2b2e35',lw);
  [dx,w/2].forEach(px=>{rr(c,px+u*.03,h-u*.3-dh,dw/2-u*.06,dh,u*.02);fs(c,lg(c,0,h-dh,0,h,[shade(red,.1),shade(red,-.2)]),lw*.6);
   rr(c,px+u*.12,h-u*.3-dh+u*.12,dw/2-u*.24,dh-u*.24,u*.02);c.strokeStyle=gold;c.lineWidth=Math.max(1,u*.025);c.stroke()});
  c.fillStyle=gold;[w/2-u*.12,w/2+u*.08].forEach(px=>c.fillRect(px,h-u*.3-dh*.6,u*.04,u*.3));
  [u*.42,w-u*.6,dx-u*.3,dx+dw+u*.12].forEach(px=>{rr(c,px,fy+u*.05,u*.18,h-fy-u*.35,u*.03);fs(c,lg(c,px,0,px+u*.18,0,['#e0473c','#9e2620']),lw*.8)});
  roof(fy+u*.1,-u*.15,w+u*.15,u*.55,u*.28);
  const cy0=fy-u*.72;rr(c,u*1.5,cy0,w-u*3.0,u*.65,u*.03);fs(c,'#f5f1ea',lw*.8);
  rr(c,u*1.7,cy0+u*.14,w-u*3.4,u*.36,u*.02);fs(c,lg(c,0,cy0,0,cy0+u*.5,['#fff1cf','#e8b86a']),lw*.6);
  c.strokeStyle='#4a3a30';c.lineWidth=Math.max(1,u*.03);for(let x=u*2.1;x<w-u*1.75;x+=u*.4){c.beginPath();c.moveTo(x,cy0+u*.14);c.lineTo(x,cy0+u*.5);c.stroke()}
  roof(cy0,u*.8,w-u*.8,u*.45,u*.22);
  rr(c,u*1.8,cy0-u*.36,w-u*3.6,u*.1,u*.05);fs(c,gold,lw*.7);
  circ(c,w/2,cy0-u*.55,u*.17);fs(c,lg(c,0,cy0-u*.72,0,cy0-u*.38,['#fff3b0','#e0a82e']),lw);
  [u*1.55,w-u*1.55].forEach(px=>{const ly=fy+u*.12;c.strokeStyle=OUT;c.lineWidth=lw*.6;c.beginPath();c.moveTo(px,ly);c.lineTo(px,ly+u*.16);c.stroke();
   rr(c,px-u*.13,ly+u*.16,u*.26,u*.46,u*.1);fs(c,lg(c,px-u*.13,0,px+u*.13,0,['#ff6b5a','#c8372d']),lw*.7);c.fillStyle=gold;c.fillRect(px-u*.13,ly+u*.16,u*.26,u*.05);c.fillRect(px-u*.13,ly+u*.57,u*.26,u*.05)});
  plaque(w/2,fy+u*.38,'廟','#2b2e35',gold,u*.3)}
 else if(kind==='house'){const fy=u*.95;c.fillStyle='rgba(0,0,0,.16)';c.fillRect(u*.25,h-u*.4,w,u*.4);
  rr(c,u*.1,fy,w-u*.2,h-fy,u*.04);fs(c,'#f3efe6',lw);c.strokeStyle='rgba(120,110,90,.22)';c.lineWidth=1;for(let y=fy;y<h;y+=u*.14){c.beginPath();c.moveTo(u*.1,y);c.lineTo(w-u*.1,y);c.stroke()}for(let x=u*.1;x<w;x+=u*.14){c.beginPath();c.moveTo(x,fy);c.lineTo(x,h-u*1.2);c.stroke()}
  rr(c,0,u*.55,w,u*.5,u*.05);fs(c,'#c8ccd6',lw);rr(c,u*.35,u*.05,u*.9,u*.6,u*.18);fs(c,lg(c,u*.35,0,u*1.25,0,['#f5f7fb','#9aa3b6']),lw);c.strokeStyle='#8a93a6';c.lineWidth=u*.03;c.beginPath();c.moveTo(u*.35,u*.3);c.lineTo(u*1.25,u*.3);c.stroke();
  circ(c,w-u*.6,u*.55,u*.22);fs(c,'#56b45a',lw);
  for(let f=0;f<2;f++){const y=fy+u*.3+f*u*1.05;win(u*.45,y,w-u*.9,u*.62,true);if(f===0){rr(c,u*.3,y+u*.66,w-u*.6,u*.1,u*.03);fs(c,'#9aa3b6',lw*.8)}}
  rr(c,u*.25,h-u*1.15,w-u*.5,u*1.15,u*.03);fs(c,'#9aa3b6',lw);c.strokeStyle='#7a8398';c.lineWidth=u*.025;for(let y=h-u*1.1;y<h-u*.45;y+=u*.08){c.beginPath();c.moveTo(u*.3,y);c.lineTo(w-u*.3,y);c.stroke()}
  rr(c,w/2-u*.38,h-u*.95,u*.76,u*.95,u*.04);fs(c,'#c4322a',lw);
  c.fillStyle='#ff4a3a';rr(c,w/2-u*.62,h-u*.95,u*.17,u*.85,u*.02);fs(c,'#ff4a3a',lw*.6);rr(c,w/2+u*.45,h-u*.95,u*.17,u*.85,u*.02);fs(c,'#ff4a3a',lw*.6);rr(c,w/2-u*.45,h-u*1.12,u*.9,u*.15,u*.02);fs(c,'#ff4a3a',lw*.6);
  circ(c,w/2+u*.22,h-u*.5,u*.04);c.fillStyle='#ffd35a';c.fill()}
 return cv}

/* ---------- 人物 ---------- */
export const SKIN='#ffd9b8';
export function drawChar(c,cx,fy,s,L,dir,step,noShadow){const lw=Math.max(1.2,s*.035);c.save();c.lineJoin='round';c.lineCap='round';
 if(!noShadow){ell(c,cx,fy-s*.03,s*.3,s*.09);c.fillStyle='rgba(20,30,20,.25)';c.fill()}
 const side=dir==='left'||dir==='right',flip=dir==='left'?-1:1;const bob=step?s*.025:0;
 // legs
 const legY=fy-s*.32,legH=s*.29;
 if(!side){[-1,1].forEach(k=>{const lift=step&&((k<0)===(step>0))?s*.05:0;rr(c,cx+k*s*.1-s*.07,legY-lift,s*.14,legH,s*.06);fs(c,L.bottom,lw);rr(c,cx+k*s*.1-s*.08,fy-s*.1-lift,s*.16,s*.09,s*.04);fs(c,L.shoes||'#2b2d47',lw)})}
 else{[-1,1].forEach(k=>{const off=step?k*step*s*.08:0;rr(c,cx+off-s*.07,legY,s*.14,legH,s*.06);fs(c,shade(L.bottom,k<0?-.15:0),lw);rr(c,cx+off-s*.07+flip*s*.02,fy-s*.1,s*.18,s*.09,s*.04);fs(c,L.shoes||'#2b2d47',lw)})}
 const ty=fy-s*.68-bob;
 if(L.pack&&dir!=='down'){rr(c,cx-(side?flip*s*.32:s*.2)-(side?s*.08:0),ty+s*.06,side?s*.18:s*.4,s*.34,s*.08);fs(c,L.pack,lw)}
 // arms back
 const armSwing=step?step*s*.04:0;
 if(side){rr(c,cx-flip*s*.02-s*.06,ty+s*.06-armSwing,s*.12,s*.3,s*.06);fs(c,shade(L.top,-.2),lw)}
 // torso
 rr(c,cx-(side?s*.17:s*.22),ty,side?s*.34:s*.44,s*.4,s*.13);fs(c,lg(c,cx-s*.22,0,cx+s*.22,0,[shade(L.top,.12),L.top,shade(L.top,-.15)]),lw);
 if(L.skirt){c.beginPath();c.moveTo(cx-s*.2,ty+s*.3);c.lineTo(cx+s*.2,ty+s*.3);c.lineTo(cx+s*.27,ty+s*.5);c.lineTo(cx-s*.27,ty+s*.5);c.closePath();fs(c,L.skirt,lw)}
 if(dir==='down'){c.beginPath();c.moveTo(cx-s*.09,ty+s*.01);c.lineTo(cx,ty+s*.1);c.lineTo(cx+s*.09,ty+s*.01);c.strokeStyle=L.trim||'#ffffff';c.lineWidth=s*.04;c.stroke();
  c.beginPath();c.moveTo(cx,ty+s*.1);c.lineTo(cx,ty+s*.38);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=s*.02;c.stroke()}
 if(L.pack&&dir==='down'){[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.14,ty+s*.02);c.lineTo(cx+k*s*.12,ty+s*.3);c.strokeStyle=L.pack;c.lineWidth=s*.05;c.stroke()})}
 // arms front
 if(!side){[-1,1].forEach(k=>{const sw=step?k*step*s*.04:0;rr(c,cx+k*s*.27-s*.06,ty+s*.04+sw,s*.12,s*.3,s*.06);fs(c,shade(L.top,-.08),lw);circ(c,cx+k*s*.27,ty+s*.36+sw,s*.055);fs(c,SKIN,lw)})}
 else{rr(c,cx+flip*s*.03-s*.06,ty+s*.06+armSwing,s*.12,s*.3,s*.06);fs(c,shade(L.top,-.05),lw);circ(c,cx+flip*s*.03,ty+s*.38+armSwing,s*.055);fs(c,SKIN,lw)}
 // head
 const hy=fy-s*.98-bob,hr=s*.29;
 if(L.style==='pony'&&dir!=='up'){circ(c,cx-(side?flip*s*.27:0),hy+(side?s*.05:-s*.02)+(dir==='down'?0:0),s*.13);if(dir!=='down')fs(c,L.hair,lw)}
 if(L.style==='long'&&dir!=='up'){rr(c,cx-hr*1.08-(side?flip*hr*.25:0),hy-hr*.3,hr*2.16,hr*1.65,hr*.55);fs(c,L.hair,lw)}
 circ(c,cx,hy,hr);fs(c,SKIN,lw);
 c.fillStyle=L.hair;c.strokeStyle=OUT;c.lineWidth=lw;
 if(dir==='up'){circ(c,cx,hy-s*.01,hr*1.03);fs(c,L.hair,lw);if(L.style==='pony'){circ(c,cx,hy+s*.12,s*.12);fs(c,shade(L.hair,-.1),lw)}if(L.style==='long'){rr(c,cx-hr*1.02,hy-hr*.1,hr*2.04,hr*1.5,hr*.5);fs(c,L.hair,lw)}}
 else{c.beginPath();if(side){c.moveTo(cx+flip*hr*.55,hy-hr*.75);c.quadraticCurveTo(cx-flip*hr*1.25,hy-hr*1.1,cx-flip*hr*1.02,hy+hr*.45);c.quadraticCurveTo(cx-flip*hr*.5,hy+hr*.25,cx-flip*hr*.15,hy-hr*.05);c.quadraticCurveTo(cx+flip*hr*.4,hy-hr*.25,cx+flip*hr*1.0,hy-hr*.25);c.quadraticCurveTo(cx+flip*hr*.95,hy-hr*.75,cx+flip*hr*.55,hy-hr*.75)}
  else{c.moveTo(cx-hr*1.04,hy+hr*.15);c.quadraticCurveTo(cx-hr*1.15,hy-hr*1.15,cx,hy-hr*1.08);c.quadraticCurveTo(cx+hr*1.15,hy-hr*1.15,cx+hr*1.04,hy+hr*.15);c.quadraticCurveTo(cx+hr*.75,hy-hr*.25,cx+hr*.4,hy-hr*.35);c.quadraticCurveTo(cx+hr*.15,hy-hr*.1,cx,hy-hr*.38);c.quadraticCurveTo(cx-hr*.2,hy-hr*.1,cx-hr*.5,hy-hr*.32);c.quadraticCurveTo(cx-hr*.8,hy-hr*.2,cx-hr*1.04,hy+hr*.15)}
  c.closePath();fs(c,L.hair,lw);
  c.beginPath();c.arc(cx-hr*.3,hy-hr*.7,hr*.25,Math.PI*1.1,Math.PI*1.6);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=s*.03;c.stroke()}
 if(L.ribbon&&dir!=='up'){const rx=cx+(side?-flip*hr*.55:hr*.72),ry=hy-hr*.78;[-1,1].forEach(k=>{c.beginPath();c.moveTo(rx,ry);c.lineTo(rx+k*s*.09,ry-s*.05);c.lineTo(rx+k*s*.09,ry+s*.05);c.closePath();fs(c,L.ribbon,lw*.8)});circ(c,rx,ry,s*.03);fs(c,shade(L.ribbon,-.2),lw*.6)}
 if(L.style==='bun'){circ(c,cx,hy-hr*1.05,s*.11);fs(c,L.hair,lw)}
 if(L.style==='pony'&&dir==='down'){circ(c,cx+hr*.95,hy-hr*.2,s*.08);fs(c,L.hair,lw)}
 if(L.style==='cap'){c.beginPath();c.arc(cx,hy-hr*.18,hr*1.02,Math.PI*1.02,Math.PI*1.98);c.closePath();fs(c,L.cap||'#ff5b4a',lw);
  if(dir==='down'){ell(c,cx,hy-hr*.22,hr*.95,hr*.2);fs(c,shade(L.cap||'#ff5b4a',-.15),lw)}else if(side){ell(c,cx+flip*hr*.85,hy-hr*.22,hr*.55,hr*.15);fs(c,shade(L.cap||'#ff5b4a',-.15),lw)}
  circ(c,cx,hy-hr*.85,s*.04);c.fillStyle='#fff';c.fill()}
 // face
 if(dir==='down'){[-1,1].forEach(k=>{ell(c,cx+k*hr*.38,hy+hr*.18,s*.045,s*.065);c.fillStyle='#2a2238';c.fill();circ(c,cx+k*hr*.38-s*.012,hy+hr*.12,s*.016);c.fillStyle='#fff';c.fill();ell(c,cx+k*hr*.62,hy+hr*.45,s*.05,s*.025);c.fillStyle='rgba(255,120,120,.4)';c.fill()});
  c.beginPath();c.arc(cx,hy+hr*.45,s*.04,.15*Math.PI,.85*Math.PI);c.strokeStyle='#8a3a3a';c.lineWidth=s*.025;c.stroke()}
 else if(side){ell(c,cx+flip*hr*.5,hy+hr*.15,s*.04,s*.062);c.fillStyle='#2a2238';c.fill();circ(c,cx+flip*hr*.5-s*.01,hy+hr*.1,s*.014);c.fillStyle='#fff';c.fill();ell(c,cx+flip*hr*.55,hy+hr*.45,s*.045,s*.022);c.fillStyle='rgba(255,120,120,.4)';c.fill()}
 if(L.pack&&dir==='up'){rr(c,cx-s*.2,ty+s*.04,s*.4,s*.34,s*.08);fs(c,L.pack,lw);rr(c,cx-s*.12,ty+s*.18,s*.24,s*.12,s*.04);fs(c,shade(L.pack,-.15),lw)}
 c.restore()}

/* ---------- 動物 ---------- */
export function drawAnimal(c,id,cx,fy,s){const lw=Math.max(1.4,s*.025);c.save();c.lineJoin='round';c.lineCap='round';
 ell(c,cx,fy-s*.02,s*.34,s*.07);c.fillStyle='rgba(20,30,20,.22)';c.fill();
 const eye=(x,y,r,col)=>{ell(c,x,y,r*.8,r);fs(c,col||'#2a2238');circ(c,x-r*.25,y-r*.35,r*.32);c.fillStyle='#fff';c.fill()};
 if(id==='cat'||id==='leopard'){const base=id==='cat'?'#f6a64a':'#c9a36b',dark=id==='cat'?'#d9772a':'#5a3a22';
  c.beginPath();c.moveTo(cx+s*.2,fy-s*.12);c.quadraticCurveTo(cx+s*.55,fy-s*.15,cx+s*.45,fy-s*.55);c.strokeStyle=OUT;c.lineWidth=s*.11;c.stroke();c.strokeStyle=base;c.lineWidth=s*.07;c.stroke();
  ell(c,cx,fy-s*.3,s*.26,s*.3);fs(c,base,lw);ell(c,cx,fy-s*.25,s*.13,s*.2);c.fillStyle='#fff3e0';c.fill();
  [-1,1].forEach(k=>{ell(c,cx+k*s*.1,fy-s*.05,s*.08,s*.05);fs(c,'#fff3e0',lw)});
  const hy=fy-s*.68;[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.08,hy-s*.18);c.lineTo(cx+k*s*.24,hy-s*.36);c.lineTo(cx+k*s*.26,hy-s*.08);c.closePath();fs(c,base,lw);c.beginPath();c.moveTo(cx+k*s*.12,hy-s*.18);c.lineTo(cx+k*s*.22,hy-s*.29);c.lineTo(cx+k*s*.22,hy-s*.12);c.fillStyle='#ffb4c4';c.fill()});
  ell(c,cx,hy,s*.27,s*.23);fs(c,base,lw);
  c.strokeStyle=dark;c.lineWidth=s*.03;if(id==='cat'){[-1,0,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.06,hy-s*.22);c.lineTo(cx+k*s*.06,hy-s*.14);c.stroke()});[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.24,fy-s*.36);c.lineTo(cx+k*s*.14,fy-s*.34);c.stroke()})}
  else{[[-.12,-.42],[.12,-.4],[-.18,-.25],[.17,-.22],[0,-.12],[-.1,-.32]].forEach(([dx,dy])=>{ell(c,cx+dx*s,fy+dy*s,s*.03,s*.022);c.fillStyle=dark;c.fill()});c.strokeStyle='#fff';c.lineWidth=s*.025;[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.04,hy-s*.2);c.lineTo(cx+k*s*.05,hy-s*.07);c.stroke()})}
  eye(cx-s*.1,hy+s*.01,s*.05,id==='cat'?'#3d7a3a':'#6a5a1a');eye(cx+s*.1,hy+s*.01,s*.05,id==='cat'?'#3d7a3a':'#6a5a1a');
  c.beginPath();c.moveTo(cx-s*.025,hy+s*.08);c.lineTo(cx+s*.025,hy+s*.08);c.lineTo(cx,hy+s*.11);c.closePath();c.fillStyle='#ff8fa6';c.fill();
  c.strokeStyle=OUT;c.lineWidth=s*.012;[-1,1].forEach(k=>{for(let j=0;j<2;j++){c.beginPath();c.moveTo(cx+k*s*.08,hy+s*(.1+j*.03));c.lineTo(cx+k*s*.3,hy+s*(.07+j*.06));c.stroke()}})}
 else if(id==='dog'){const base='#d9a463';
  c.beginPath();c.moveTo(cx+s*.2,fy-s*.2);c.quadraticCurveTo(cx+s*.42,fy-s*.4,cx+s*.3,fy-s*.55);c.strokeStyle=OUT;c.lineWidth=s*.12;c.stroke();c.strokeStyle=base;c.lineWidth=s*.08;c.stroke();
  ell(c,cx,fy-s*.3,s*.27,s*.3);fs(c,base,lw);ell(c,cx,fy-s*.3,s*.14,s*.22);c.fillStyle='#fff6e6';c.fill();[-1,1].forEach(k=>{ell(c,cx+k*s*.11,fy-s*.05,s*.09,s*.05);fs(c,'#fff6e6',lw)});
  const hy=fy-s*.7;[-1,1].forEach(k=>{c.beginPath();c.moveTo(cx+k*s*.1,hy-s*.15);c.lineTo(cx+k*s*.22,hy-s*.38);c.lineTo(cx+k*s*.27,hy-s*.06);c.closePath();fs(c,shade(base,-.1),lw)});
  ell(c,cx,hy,s*.26,s*.23);fs(c,base,lw);ell(c,cx,hy+s*.1,s*.14,s*.1);fs(c,'#fff6e6',lw);
  eye(cx-s*.1,hy-s*.02,s*.045);eye(cx+s*.1,hy-s*.02,s*.045);ell(c,cx,hy+s*.05,s*.05,s*.035);c.fillStyle=OUT;c.fill();
  c.beginPath();c.ellipse(cx,hy+s*.16,s*.04,s*.05,0,0,Math.PI);fs(c,'#ff7a8a',lw*.7)}
 else if(id==='bird'||id==='magpie'){const mag=id==='magpie';const body=mag?'#2f6fe0':'#a77748',head=mag?'#1b1d2a':'#7a4f2a';
  if(mag){c.beginPath();c.moveTo(cx+s*.1,fy-s*.3);c.quadraticCurveTo(cx+s*.5,fy-s*.15,cx+s*.62,fy+s*.0);c.lineTo(cx+s*.5,fy+s*.04);c.quadraticCurveTo(cx+s*.38,fy-s*.1,cx+s*.05,fy-s*.2);fs(c,body,lw);
   [.32,.45,.56].forEach(t=>{ell(c,cx+s*t,fy-s*(.12-t*.2),s*.03,s*.02);c.fillStyle='#fff';c.fill()})}
  [-1,1].forEach(k=>{c.strokeStyle=mag?'#e8402e':'#d98a3a';c.lineWidth=s*.03;c.beginPath();c.moveTo(cx+k*s*.06,fy-s*.12);c.lineTo(cx+k*s*.06,fy-s*.02);c.lineTo(cx+k*s*.1,fy);c.stroke()});
  ell(c,cx,fy-s*.32,s*.25,s*.23);fs(c,body,lw);ell(c,cx,fy-s*.25,s*.15,s*.13);c.fillStyle=mag?'#ffffff':'#f1e2c0';c.fill();
  ell(c,cx+s*.13,fy-s*.33,s*.12,s*.15);fs(c,shade(body,-.12),lw);
  const hy=fy-s*.58;circ(c,cx-s*.04,hy,s*.17);fs(c,head,lw);if(!mag){ell(c,cx-s*.1,hy+s*.06,s*.08,s*.06);c.fillStyle='#ffffff';c.fill();ell(c,cx-s*.04,hy+s*.16,s*.06,s*.04);c.fillStyle='#2a2238';c.fill()}
  eye(cx-s*.09,hy-s*.02,s*.035,mag?'#ffd35a':'#2a2238');
  c.beginPath();c.moveTo(cx-s*.2,hy+s*.0);c.lineTo(cx-s*.32,hy+s*.04);c.lineTo(cx-s*.2,hy+s*.07);c.closePath();fs(c,mag?'#e8402e':'#e0a040',lw*.7)}
 else if(id==='bear'){const base='#24242c';
  ell(c,cx,fy-s*.3,s*.32,s*.3);fs(c,base,lw);c.beginPath();c.moveTo(cx-s*.14,fy-s*.48);c.lineTo(cx,fy-s*.36);c.lineTo(cx+s*.14,fy-s*.48);c.lineTo(cx+s*.1,fy-s*.5);c.lineTo(cx,fy-s*.42);c.lineTo(cx-s*.1,fy-s*.5);c.closePath();c.fillStyle='#f5ecd2';c.fill();
  [-1,1].forEach(k=>{ell(c,cx+k*s*.14,fy-s*.05,s*.1,s*.06);fs(c,base,lw)});
  const hy=fy-s*.7;[-1,1].forEach(k=>{circ(c,cx+k*s*.2,hy-s*.16,s*.09);fs(c,base,lw)});circ(c,cx,hy,s*.25);fs(c,base,lw);
  ell(c,cx,hy+s*.08,s*.12,s*.09);fs(c,'#c99a6a',lw);ell(c,cx,hy+s*.04,s*.045,s*.03);c.fillStyle='#111';c.fill();
  eye(cx-s*.1,hy-s*.05,s*.035,'#111');eye(cx+s*.1,hy-s*.05,s*.035,'#111')}
 c.restore()}

/* ---------- 徽章 ---------- */
export const EMB={
 plane:'<path d="M50 20 L55 40 L78 53 L78 59 L55 51 L54 67 L61 73 L61 78 L50 74 L39 78 L39 73 L46 67 L45 51 L22 59 L22 53 L45 40 Z"/>',
 persimmon:'<circle cx="50" cy="56" r="19"/><path d="M36 40 Q43 32 50 38 Q57 32 64 40 Q57 44 50 41 Q43 44 36 40Z" fill-opacity=".85"/><rect x="48" y="28" width="4" height="10" rx="2"/>',
 wind:'<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M22 40 H58 a9 9 0 1 0 -9 -9"/><path d="M22 53 H70 a9 9 0 1 1 -9 9"/><path d="M28 66 H50"/></g>',
 strawberry:'<path d="M50 77 C33 68 27 53 31 43 C35 35 65 35 69 43 C73 53 67 68 50 77Z"/><path d="M35 40 L43 30 L50 37 L57 30 L65 40 Q50 46 35 40Z" fill-opacity=".8"/><g class="cut"><circle cx="42" cy="52" r="2"/><circle cx="56" cy="50" r="2"/><circle cx="48" cy="61" r="2"/><circle cx="60" cy="60" r="2"/><circle cx="44" cy="68" r="2"/><circle cx="54" cy="69" r="2"/></g>',
 suncake:'<g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M50 18v8M50 74v8M18 50h8M74 50h8M27 27l6 6M67 67l6 6M73 27l-6 6M33 67l-6 6"/></g><circle cx="50" cy="50" r="18"/><path class="cutS" d="M50 50 m-10 0 a10 10 0 1 1 10 10 a6 6 0 1 1 -6 -6" fill="none" stroke-width="3"/>',
 buddha:'<circle cx="50" cy="31" r="8"/><circle cx="50" cy="22" r="4"/><path d="M50 40 C38 41 34 52 36 60 C29 62 25 69 27 74 H73 C75 69 71 62 64 60 C66 52 62 41 50 40Z"/>',
 lake:'<circle cx="37" cy="40" r="10"/><path d="M60 29 a11 11 0 1 0 8 19 a9 9 0 1 1 -8 -19Z"/><g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M22 62 q7 -6 14 0 t14 0 t14 0 t14 0"/><path d="M28 73 q6 -5 11 0 t11 0 t11 0 t11 0"/></g>',
 peanut:'<path d="M50 22 C63 22 66 35 59 44 C68 51 67 67 50 76 C33 67 32 51 41 44 C34 35 37 22 50 22Z"/><g class="cutS" fill="none" stroke-width="2.5"><path d="M44 32 L56 32M42 56 L58 56M43 64 L57 64"/></g>',
 sunrise:'<circle cx="60" cy="38" r="10"/><g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M60 20v-4M74 26l3-3M46 26l-3-3M80 38h4"/></g><path d="M18 74 L38 44 L48 56 L60 40 L82 74Z"/>',
 ricebowl:'<path d="M31 50 C33 37 67 37 69 50Z" fill-opacity=".85"/><path d="M24 50 H76 C74 65 63 73 50 73 C37 73 26 65 24 50Z"/><g stroke="#fff" stroke-width="3.5" stroke-linecap="round"><path d="M60 22 L74 44M66 20 L78 42"/></g>',
 tower:'<path d="M20 50 Q50 38 80 50 L76 54 L24 54Z"/><rect x="32" y="54" width="36" height="20" rx="2"/><path d="M30 34 Q50 24 70 34 L66 38 L34 38Z"/><rect x="38" y="38" width="24" height="12"/><circle cx="50" cy="22" r="3"/>',
 anchor:'<g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><circle cx="50" cy="26" r="6"/><path d="M50 32 V74M38 42 H62M26 56 Q30 74 50 74 Q70 74 74 56"/></g>',
 hearts:'<g fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"><path d="M38 70 L22 52 a9 9 0 0 1 16 -10 a9 9 0 0 1 16 10Z"/><path d="M62 74 L46 56 a9 9 0 0 1 16 -10 a9 9 0 0 1 16 10Z"/></g>',
 lighthouse:'<path d="M42 76 L46 38 H54 L58 76Z"/><rect x="43" y="28" width="14" height="10" rx="2"/><path d="M41 28 L50 20 L59 28Z"/><g class="cut"><rect x="44" y="50" width="12" height="5"/><rect x="43" y="63" width="14" height="5"/></g><g fill="#fff" fill-opacity=".55"><path d="M57 31 L84 22 L84 40Z"/><path d="M43 31 L16 22 L16 40Z"/></g>',
 balloon:'<path d="M50 18 C30 18 24 38 32 50 C36 56 44 60 46 66 H54 C56 60 64 56 68 50 C76 38 70 18 50 18Z"/><g class="cutS" fill="none" stroke-width="2.5"><path d="M50 18 V66M40 22 Q36 44 46 66M60 22 Q64 44 54 66"/></g><rect x="44" y="70" width="12" height="9" rx="2"/><path d="M46 66 L45 70M54 66 L55 70" stroke="#fff" stroke-width="2"/>',
 gorge:'<path d="M18 26 H42 L44 50 L40 76 H18Z"/><path d="M82 26 H58 L56 52 L60 76 H82Z"/><path d="M42 68 q4 -4 8 0 t8 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
 turtle:'<path d="M20 62 C26 48 38 44 48 46 C54 34 66 33 72 42 C78 46 80 54 80 62Z"/><circle cx="70" cy="36" r="4"/><g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M18 72 q8 -6 16 0 t16 0 t16 0 t16 0"/></g>',
 umbrella:'<path d="M20 50 C20 30 80 30 80 50 C74 45 68 45 63 50 C58 45 54 45 50 50 C46 45 42 45 37 50 C32 45 26 45 20 50Z"/><path d="M50 50 V72 a5 5 0 0 1 -10 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><g fill="#fff"><circle cx="30" cy="62" r="2"/><circle cx="68" cy="66" r="2"/><circle cx="76" cy="58" r="2"/></g>',
 lantern:'<rect x="40" y="22" width="20" height="6" rx="2"/><rect x="40" y="70" width="20" height="6" rx="2"/><ellipse cx="50" cy="49" rx="20" ry="22"/><g class="cutS" fill="none" stroke-width="2.5"><path d="M50 27 V71M40 29 Q34 49 40 69M60 29 Q66 49 60 69"/></g><path d="M50 76 V84" stroke="#fff" stroke-width="3"/>',
 tower101:'<path d="M50 12 V22" stroke="#fff" stroke-width="3"/><path d="M44 22 H56 L54 28 H46Z"/><path d="M40 28 H60 L57 36 H43Z"/><path d="M40 36 H60 L57 44 H43Z"/><path d="M40 44 H60 L57 52 H43Z"/><path d="M40 52 H60 L57 60 H43Z"/><path d="M38 60 H62 L62 80 H38Z"/>',
 windlion:'<g>'+Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return`<circle cx="${(50+Math.cos(a)*19).toFixed(1)}" cy="${(42+Math.sin(a)*19).toFixed(1)}" r="7"/>`}).join('')+'</g><circle cx="50" cy="42" r="17"/><g class="cut"><circle cx="44" cy="39" r="3"/><circle cx="56" cy="39" r="3"/><path d="M44 50 Q50 55 56 50" fill="none" stroke-width="3"/></g><path d="M38 60 H62 L64 78 H36Z"/>',
 bluetears:'<path d="M18 58 q8 -10 16 0 t16 0 t16 0 t16 0 V78 H18Z"/><g fill="#bff3ff"><circle cx="28" cy="46" r="3"/><circle cx="44" cy="38" r="2.5"/><circle cx="60" cy="44" r="3.5"/><circle cx="74" cy="34" r="2.5"/><circle cx="36" cy="28" r="2"/><circle cx="66" cy="26" r="2"/></g>'
};
// 徽章出現在選單裡，顏色換成掌機調色盤
export const badgeSVG=(ci,got)=>paletteMarkup(badgeRaw(ci,got));
function badgeRaw(ci,got){const c=CITIES[ci];const col=got?c.roof:'#c9cfdd';const id='bg'+ci+(got?'g':'n');
 let e=EMB[c.emblem]||'';e=e.replace(/class="cut"/g,`fill="${col}" stroke="${col}"`).replace(/class="cutS"/g,`stroke="${col}"`);
 return`<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(col,.3)}"/><stop offset="1" stop-color="${shade(col,-.18)}"/></linearGradient></defs>
 <path d="M50 4 L88 22 L88 70 L50 96 L12 70 L12 22Z" fill="${got?'#ffc93c':'#e4e8f1'}" stroke="#1b2340" stroke-width="3"/><path d="M50 12 L81 27 L81 66 L50 88 L19 66 L19 27Z" fill="url(#${id})"/>
 <g fill="#fff" ${got?'':'opacity=".7"'}>${e}</g></svg>`}
export function emblemImage(ci){const c=CITIES[ci];const e=(EMB[c.emblem]||'').replace(/class="cut"/g,`fill="${c.roof}" stroke="${c.roof}"`).replace(/class="cutS"/g,`stroke="${c.roof}"`).replace(/#fff\b/g,c.roof).replace(/fill="#bff3ff"/g,`fill="${c.roof}"`);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 80 80"><g fill="${c.roof}">${e}</g></svg>`;const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return img}

/* ---------- 室內 ---------- */
export function paintInterior(M,u,dpr,city,emb){const w=M.w*u,h=M.h*u;const cv=document.createElement('canvas');cv.width=Math.ceil(w*dpr);cv.height=Math.ceil(h*dpr);const c=cv.getContext('2d');c.scale(dpr,dpr);
 const lw=Math.max(1.4,u*.04),k=M.bk,shop=storeBrand(M.brand);
 const FL={inn:['#d9a86c','#c8955a'],store:['#eef1f6','#dde3ec'],tea:['#c99a66','#b98a58'],coffee:['#d8b08a','#b77b4f'],temple:['#d8d0c0','#c6bca8'],gym:['#f4f6fb','#e3e8f2'],mall:['#f2f0ec','#e2ded6'],dept:['#efe6d6','#ddd0b8']}[k];
 c.fillStyle=FL[0];c.fillRect(0,0,w,h);
 if(k==='inn'||k==='tea'){const rr2=rng(7);for(let y=0;y<h;y+=u/3)for(let x=((y/(u/3))%2)*u*.7-u*1.4;x<w;x+=u*1.4){c.fillStyle=`rgba(${rr2()<.5?'255,255,255':'90,50,20'},${(rr2()*.08).toFixed(3)})`;c.fillRect(x,y,u*1.4,u/3)}c.strokeStyle=FL[1];c.lineWidth=2;for(let y=0;y<h;y+=u/3){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();for(let x=((y/(u/3))%2)*u*.7;x<w;x+=u*1.4){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+u/3);c.stroke()}}}
 else for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if((x+y)%2){c.fillStyle=FL[1];c.fillRect(x*u,y*u,u,u)}
 if(k==='gym'){c.fillStyle=shade(city.roof,.1);c.fillRect(4.6*u,2*u,1.8*u,h-2*u);c.fillStyle='#ffd35a';c.fillRect(4.6*u,2*u,u*.08,h-2*u);c.fillRect(6.32*u,2*u,u*.08,h-2*u);
  for(let y=4;y<M.h;y+=2){c.fillStyle='rgba(255,255,255,.18)';c.fillRect(4.7*u,y*u,1.6*u,u*.12)}}
 if(k==='inn'||k==='temple'){rr(c,3*u,5.2*u,5*u,2.6*u,u*.3);fs(c,k==='inn'?'#e86a3a':'#c8372d',lw);rr(c,3.25*u,5.45*u,4.5*u,2.1*u,u*.2);c.strokeStyle='#ffd35a';c.lineWidth=u*.05;c.stroke()}
 const WALL={inn:'#f6e7c8',store:'#ffffff',tea:'#7a5236',coffee:'#5b3525',temple:'#b8312a',gym:shade(city.roof,.6),mall:'#f4f5f7',dept:'#f3ead8'}[k];
 c.fillStyle=WALL;c.fillRect(0,0,w,2*u);c.fillStyle=shade(WALL,-.25);c.fillRect(0,2*u-u*.16,w,u*.16);
 // 牆面裝飾
 if(k==='inn'){rr(c,1.3*u,.35*u,1.6*u,1.1*u,u*.06);fs(c,'#8c643c',lw);rr(c,1.42*u,.47*u,1.36*u,.86*u,u*.04);fs(c,'#bfe6ff',lw*.6);c.beginPath();c.moveTo(1.42*u,1.33*u);c.lineTo(2*u,.75*u);c.lineTo(2.4*u,1.05*u);c.lineTo(2.78*u,.85*u);c.lineTo(2.78*u,1.33*u);c.closePath();fs(c,'#5fae4c');
  circ(c,8.8*u,.85*u,u*.42);fs(c,'#ffffff',lw);c.strokeStyle=OUT;c.lineWidth=lw;c.beginPath();c.moveTo(8.8*u,.85*u);c.lineTo(8.8*u,.6*u);c.moveTo(8.8*u,.85*u);c.lineTo(9*u,.95*u);c.stroke();
  rr(c,4*u,.25*u,3*u,1.1*u,u*.1);fs(c,'#ff5b4a',lw);canvasRuby(c,'櫃檯',5.5*u,1.15*u,u*.42,'#ffffff')}
 if(k==='store'){for(let r=0;r<2;r++){rr(c,.5*u,(.25+r*.8)*u,w-u,.6*u,u*.05);fs(c,'#e6eaf2',lw*.7);for(let i=0;i<26;i++){c.fillStyle=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'][(i+r)%5];c.fillRect(.65*u+i*(w-1.3*u)/26,(.33+r*.8)*u,(w-1.3*u)/26*.7,.42*u)}}
  rr(c,3.7*u,.05*u,3.6*u,.55*u,u*.1);fs(c,shop.primary,lw);c.fillStyle='#fff';c.font=`800 ${u*.25}px system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(shop.sign,5.5*u,.34*u)}
 if(k==='tea'){rr(c,1.2*u,.25*u,w-2.4*u,1.35*u,u*.1);fs(c,'#2a2d38',lw);const items=[['珍珠奶茶','60'],['紅茶','30'],['綠茶','30'],['冬瓜茶','35']];
  items.forEach(([n,p],i)=>{const x=(2+i*1.9)*u;canvasRuby(c,n,x+.6*u,1.25*u,u*.24,'#ffffff');c.fillStyle='#ffc93c';c.font=`800 ${u*.22}px sans-serif`;c.textAlign='center';c.fillText('$'+p,x+.6*u,1.52*u)})}
 // 購物中心是美食街：一排店家招牌；百貨公司是專櫃：品牌燈箱和電梯
 if(k==='mall'){const sc=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'];for(let i=0;i<5;i++){rr(c,(.7+i*2)*u,.3*u,1.6*u,.55*u,u*.06);fs(c,sc[i],lw*.7)}
  rr(c,3.4*u,1*u,4.2*u,.7*u,u*.1);fs(c,'#2b2f36',lw);canvasRuby(c,'美食街',5.5*u,1.55*u,u*.3,'#ffffff')}
 if(k==='dept'){[[.8],[8.2]].forEach(([x])=>{rr(c,x*u,.35*u,2*u,1.4*u,u*.05);fs(c,'#b9bfca',lw);c.fillStyle='#8f96a6';c.fillRect((x+.98)*u,.4*u,.04*u,1.3*u);circ(c,(x+1)*u,.22*u,u*.08);c.fillStyle='#ffd35a';c.fill()});
  rr(c,3.4*u,.25*u,4.2*u,1.2*u,u*.08);fs(c,'#8a1f24',lw);rr(c,3.5*u,.35*u,4*u,1*u,u*.05);c.strokeStyle='#e8c873';c.lineWidth=u*.04;c.stroke();canvasRuby(c,'百貨公司',5.5*u,1.2*u,u*.32,'#e8c873')}
 if(k==='temple'){rr(c,3*u,.1*u,5*u,1.6*u,u*.08);fs(c,'#6b1a14',lw);rr(c,3.3*u,.3*u,4.4*u,1.3*u,u*.06);fs(c,lg(c,0,.3*u,0,1.6*u,['#ffd35a','#e0902b']),lw);
  for(let i=0;i<7;i++){c.strokeStyle='rgba(120,50,10,.35)';c.lineWidth=u*.03;c.beginPath();c.moveTo((3.5+i*.65)*u,.35*u);c.lineTo((3.5+i*.65)*u,1.55*u);c.stroke()}
  rr(c,4.4*u,.0*u,2.2*u,.55*u,u*.08);fs(c,'#1b2340',lw);canvasRuby(c,'平安',5.5*u,.48*u,u*.3,'#ffd35a');
  [1.6,9.4].forEach(x=>{c.strokeStyle=OUT;c.lineWidth=lw*.7;c.beginPath();c.moveTo(x*u,0);c.lineTo(x*u,.4*u);c.stroke();ell(c,x*u,.8*u,u*.3,u*.4);fs(c,'#ff4a3a',lw);c.fillStyle='#ffd35a';c.fillRect((x-.18)*u,.4*u,.36*u,u*.07);c.fillRect((x-.18)*u,1.15*u,.36*u,u*.07)})}
 if(k==='gym'){rr(c,3.5*u,.1*u,4*u,1.7*u,u*.12);fs(c,city.roof,lw);circ(c,5.5*u,.95*u,.7*u);fs(c,'#ffffff',lw);if(emb&&emb.complete&&emb.naturalWidth)c.drawImage(emb,4.85*u,.3*u,1.3*u,1.3*u);
  [[1.5],[8.5]].forEach(([x])=>{rr(c,(x-.5)*u,.2*u,u,1.5*u,u*.1);fs(c,'#ffffff',lw);canvasRuby(c,'道館',x*u,1.25*u,u*.3,OUT)})}
 // 側牆與下牆
 c.fillStyle=shade(WALL,-.4);c.fillRect(0,0,u*.5,h);c.fillRect(w-u*.5,0,u*.5,h);c.fillRect(0,h-u*.45,4.9*u,u*.45);c.fillRect(6.1*u,h-u*.45,w-6.1*u,u*.45);
 c.fillStyle=shade(WALL,-.55);c.fillRect(u*.42,2*u,u*.08,h-2*u);c.fillRect(w-u*.5,2*u,u*.08,h-2*u);
 rr(c,4.95*u,h-u*.85,1.1*u,u*.75,u*.1);fs(c,'#ff5b4a',lw);c.fillStyle='#fff';c.beginPath();c.moveTo(5.5*u,h-u*.2);c.lineTo(5.3*u,h-u*.5);c.lineTo(5.7*u,h-u*.5);c.fill();
 M.furn.filter(f=>f.t==='platform').forEach(f=>{const x=f.x*u,y=f.y*u,fw=f.w*u,fh=f.h*u;rr(c,x,y-u*.1,fw,fh,u*.15);fs(c,shade(city.roof,.35),lw);rr(c,x+u*.15,y+u*.05,fw-u*.3,fh-u*.35,u*.1);c.strokeStyle='#ffd35a';c.lineWidth=u*.05;c.stroke()});
 return cv}

/* ---------- 室內家具（逐一繪製、依深度排序） ---------- */
export const FEX={counter:.75,shelf:1.35,sofa:.6,plant:1.05,table:.55,chair:.5,burner:1.05,pillar:1.75,dispenser:1,rack:.85,cushion:.15};
export function spriteFurn(f,k,u,dpr,city){const ex=FEX[f.t]||.5,fw=f.w*u,fh=f.h*u,H2=fh+ex*u;const cv=mkc(fw,H2,dpr),c=cv.getContext('2d');const lw=Math.max(1.3,u*.035);const y0=ex*u,yb=H2;
 const shadow=(x,w2)=>{ell(c,x+w2/2,yb-u*.08,w2*.5,u*.13);c.fillStyle='rgba(30,20,10,.22)';c.fill()};
 if(f.t==='counter'){const P={inn:['#c79a6a','#8a5a36','#6b4226'],store:['#e3e8f2','#f7f9fc','#14b3a4'],tea:['#f0d2a8','#d9a873','#a8743f'],coffee:['#c99a6a','#8a5a36','#5b3525'],temple:['#d8473a','#a3271f','#ffd35a'],mall:['#e3e8f2','#f7f9fc','#ff8fb6'],dept:['#f3e3c3','#d9c29a','#8a1f24']}[k];
  c.fillStyle='rgba(30,20,10,.2)';c.fillRect(u*.1,yb-u*.12,fw,u*.14);
  rr(c,0,y0+u*.36,fw,fh-u*.36+u*.0,u*.06);fs(c,lg(c,0,y0,0,yb,[shade(P[1],.05),shade(P[1],-.18)]),lw);
  if(k==='temple'){rr(c,u*.15,y0+u*.42,fw-u*.3,fh-u*.6,u*.04);fs(c,'#c8372d',lw*.7);c.strokeStyle='#ffd35a';c.lineWidth=u*.04;rr(c,u*.25,y0+u*.5,fw-u*.5,fh-u*.78,u*.04);c.stroke();
   for(let i=0;i<5;i++){circ(c,u*.6+i*(fw-u*1.2)/4,y0+u*.78,u*.08);c.fillStyle='#ffd35a';c.fill()}}
  else{const n=f.w;for(let i=0;i<n;i++){rr(c,i*u+u*.1,y0+u*.46,u*.8,fh-u*.66,u*.05);c.fillStyle=shade(P[1],-.08);c.fill();c.strokeStyle='rgba(0,0,0,.15)';c.lineWidth=1;c.stroke();c.fillStyle='rgba(255,255,255,.12)';c.fillRect(i*u+u*.14,y0+u*.5,u*.06,fh-u*.74)}
   if(k==='store'){c.fillStyle=P[2];c.fillRect(lw/2,y0+u*.36,fw-lw,u*.1)}}
  c.fillStyle='rgba(0,0,0,.25)';c.fillRect(lw/2,yb-u*.12,fw-lw,u*.1);
  rr(c,-u*.04,y0-u*.06,fw+u*.08,u*.48,u*.08);fs(c,lg(c,0,y0-u*.06,0,y0+u*.42,[shade(P[0],.18),P[0]]),lw);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(u*.1,y0,fw-u*.2,u*.05);
  const ty=y0+u*.12;
  if(k==='inn'){ell(c,fw*.8,ty+u*.1,u*.16,u*.06);fs(c,'#8a6a2a',lw*.7);c.beginPath();c.arc(fw*.8,ty+u*.08,u*.13,Math.PI,0);fs(c,lg(c,0,ty-u*.06,0,ty+u*.1,['#ffe7a0','#d9a52a']),lw*.8);circ(c,fw*.8,ty-u*.07,u*.03);fs(c,'#8a6a2a',lw*.5);
   c.save();c.translate(fw*.35,ty+u*.08);c.rotate(-.08);rr(c,-u*.32,-u*.12,u*.32,u*.24,u*.02);fs(c,'#fffaf0',lw*.6);rr(c,0,-u*.12,u*.32,u*.24,u*.02);fs(c,'#fffaf0',lw*.6);c.strokeStyle='#9aa4b8';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-u*.27,-u*.06+i*u*.06);c.lineTo(-u*.05,-u*.06+i*u*.06);c.moveTo(u*.05,-u*.06+i*u*.06);c.lineTo(u*.27,-u*.06+i*u*.06);c.stroke()}c.restore();
   rr(c,fw*.1,ty-u*.2,u*.16,u*.28,u*.05);fs(c,'#7fb8e6',lw*.6);circ(c,fw*.1+u*.08,ty-u*.28,u*.09);fs(c,'#ff8fb6',lw*.5)}
  if(k==='store'){rr(c,fw*.62,ty-u*.32,u*.62,u*.42,u*.06);fs(c,lg(c,0,ty-u*.32,0,ty+u*.1,['#5b6178','#3d4766']),lw);rr(c,fw*.62+u*.08,ty-u*.27,u*.46,u*.14,u*.03);fs(c,'#9fe8d8',lw*.5);
   for(let r=0;r<2;r++)for(let i=0;i<3;i++){rr(c,fw*.62+u*(.1+i*.15),ty-u*.08+r*u*.08,u*.11,u*.05,u*.01);c.fillStyle='#dfe5f2';c.fill()}
   rr(c,fw*.15,ty-u*.15,u*.7,u*.22,u*.04);fs(c,'#ffffff',lw*.7);for(let i=0;i<6;i++){circ(c,fw*.15+u*(.1+i*.1),ty-u*.04,u*.04);c.fillStyle=['#ff5b4a','#ffc93c','#14b3a4'][i%3];c.fill()}}
  if(k==='tea'){rr(c,fw*.7,ty-u*.42,u*.5,u*.5,u*.06);fs(c,lg(c,0,ty-u*.42,0,ty+u*.1,['#f4f6fb','#b9c1d6']),lw);rr(c,fw*.7+u*.12,ty-u*.2,u*.26,u*.22,u*.03);fs(c,'#2a2d38',lw*.6);c.strokeStyle=OUT;c.lineWidth=lw;c.beginPath();c.moveTo(fw*.7+u*.45,ty-u*.35);c.lineTo(fw*.7+u*.62,ty-u*.5);c.stroke();
   ['#c88a4a','#e8cfa8','#8fc06a','#e8cfa8'].forEach((col,i)=>{const x=fw*.12+i*u*.38;rr(c,x,ty-u*.32,u*.24,u*.4,u*.05);fs(c,'rgba(255,255,255,.85)',lw*.6);rr(c,x+u*.03,ty-u*.2,u*.18,u*.26,u*.03);c.fillStyle=col;c.fill();for(let p=0;p<3;p++){circ(c,x+u*(.07+p*.05),ty+u*.0,u*.022);c.fillStyle='#2a1a12';c.fill()}c.strokeStyle='#ff5b4a';c.lineWidth=u*.03;c.beginPath();c.moveTo(x+u*.14,ty-u*.32);c.lineTo(x+u*.18,ty-u*.46);c.stroke()})}
  if(k==='temple'){[.25,.75].forEach(p=>{rr(c,fw*p-u*.05,ty-u*.3,u*.1,u*.34,u*.02);fs(c,'#ff4a3a',lw*.6);ell(c,fw*p,ty-u*.36,u*.04,u*.07);c.fillStyle='#ffc93c';c.fill()});
   ell(c,fw*.5,ty+u*.05,u*.3,u*.08);fs(c,'#e9e2d0',lw*.7);[[-.12,-.02],[.1,-.02],[0,-.1],[-.04,.0],[.04,.0]].forEach(([dx,dy])=>{circ(c,fw*.5+dx*u,ty+dy*u,u*.08);fs(c,'#ff9f2e',lw*.5)})}}
 else if(f.t==='shelf'){shadow(0,fw);rr(c,0,y0-u*.2,fw,fh+u*.15,u*.05);fs(c,'#b8c0d0',lw);rr(c,u*.06,y0-u*.14,fw-u*.12,fh,u*.03);c.fillStyle='#eef1f6';c.fill();
  rr(c,0,y0-u*.32,fw,u*.16,u*.04);fs(c,'#d7dde8',lw*.8);
  const rows=3,rh=(fh+u*.2)/rows;const R=rng(f.x*13+f.y*7);
  for(let r=0;r<rows;r++){const sy=y0-u*.12+r*rh;let x=u*.1;while(x<fw-u*.2){const kind=R(),col=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6','#8fd36b','#fff'][Math.floor(R()*7)];
    if(kind<.35){const bw=u*.13,bh=rh*.7;rr(c,x,sy+rh-bh-u*.06,bw,bh,u*.04);fs(c,col,lw*.4);rr(c,x+bw*.25,sy+rh-bh-u*.1,bw*.5,u*.06,u*.01);c.fillStyle='#3d4766';c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x+bw*.2,sy+rh-bh,bw*.2,bh*.5);x+=bw+u*.03}
    else if(kind<.7){const bw=u*.22,bh=rh*.6;rr(c,x,sy+rh-bh-u*.06,bw,bh,u*.02);fs(c,col,lw*.4);c.fillStyle='rgba(255,255,255,.8)';c.fillRect(x+u*.03,sy+rh-bh*.6-u*.06,bw-u*.06,bh*.25);x+=bw+u*.03}
    else{const bw=u*.15,bh=rh*.45;rr(c,x,sy+rh-bh-u*.06,bw,bh,u*.03);fs(c,lg(c,x,0,x+bw,0,[shade(col,.3),col,shade(col,-.2)]),lw*.4);x+=bw+u*.03}}
   c.fillStyle='#9aa4b8';c.fillRect(u*.06,sy+rh-u*.06,fw-u*.12,u*.06);for(let t=0;t<3;t++){c.fillStyle='#ffd35a';c.fillRect(u*.2+t*fw/3,sy+rh-u*.05,u*.16,u*.06)}}}
 else if(f.t==='sofa'){shadow(0,fw);const col='#3a7bd5';rr(c,u*.05,y0-u*.05,fw-u*.1,u*.6,u*.18);fs(c,lg(c,0,y0,0,y0+u*.6,[shade(col,.15),shade(col,-.12)]),lw);
  rr(c,u*.02,y0+u*.35,u*.28,fh-u*.3,u*.12);fs(c,shade(col,-.08),lw);rr(c,fw-u*.3,y0+u*.35,u*.28,fh-u*.3,u*.12);fs(c,shade(col,-.08),lw);
  for(let i=0;i<2;i++){rr(c,u*.3+i*(fw-u*.6)/2,y0+u*.45,(fw-u*.6)/2,fh-u*.5,u*.1);fs(c,lg(c,0,y0+u*.45,0,yb,[shade(col,.3),col]),lw*.8)}
  [[.5,'#ffc93c'],[fw/u-.6,'#ff8fb6']].forEach(([px,pc])=>{c.save();c.translate(px*u,y0+u*.32);c.rotate(px<1?-.25:.25);rr(c,-u*.18,-u*.16,u*.36,u*.32,u*.1);fs(c,pc,lw*.7);c.restore()});
  c.fillStyle='#4a3020';c.fillRect(u*.15,yb-u*.1,u*.08,u*.08);c.fillRect(fw-u*.23,yb-u*.1,u*.08,u*.08)}
 else if(f.t==='plant'){shadow(u*.15,u*.7);const px=u*.5,pt=yb-u*.48;c.beginPath();c.moveTo(px-u*.25,pt);c.lineTo(px+u*.25,pt);c.lineTo(px+u*.19,yb-u*.08);c.lineTo(px-u*.19,yb-u*.08);c.closePath();fs(c,lg(c,px-u*.25,0,px+u*.25,0,['#ffffff','#d6d0c4']),lw);
  rr(c,px-u*.29,pt-u*.06,u*.58,u*.1,u*.04);fs(c,'#f4f0e8',lw*.8);ell(c,px,pt-u*.01,u*.22,u*.05);c.fillStyle='#5a3a22';c.fill();
  const leaves=[[-.9,.9],[-.45,1.05],[0,1.15],[.45,1.05],[.9,.9],[-.2,.8],[.25,.85]];leaves.forEach(([a2,len],i)=>{c.save();c.translate(px,pt);c.rotate(a2*.7);const L=len*u*.62;
   c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-u*.2,-L*.55,0,-L);c.quadraticCurveTo(u*.2,-L*.55,0,0);fs(c,lg(c,-u*.2,0,u*.2,0,[i%2?'#3f9a4a':'#4fb456','#2f7a3a']),lw*.7);
   c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=u*.02;c.beginPath();c.moveTo(0,-u*.05);c.lineTo(0,-L*.9);c.stroke();c.restore()})}
 else if(f.t==='table'){shadow(0,fw);[-1,1].forEach(s2=>{const cx2=fw/2+s2*u*.42;rr(c,cx2-u*.12,y0+u*.05,u*.24,u*.45,u*.06);fs(c,'#a8743f',lw*.8);ell(c,cx2,y0+u*.52,u*.17,u*.08);fs(c,'#c99060',lw*.8);c.fillStyle='#6b4226';c.fillRect(cx2-u*.1,y0+u*.58,u*.04,u*.3);c.fillRect(cx2+u*.06,y0+u*.58,u*.04,u*.3)});
  rr(c,fw/2-u*.05,y0+u*.45,u*.1,u*.42,u*.03);fs(c,'#6b4226',lw*.8);ell(c,fw/2,yb-u*.1,u*.2,u*.05);fs(c,'#6b4226',lw*.8);
  ell(c,fw/2,y0+u*.42,u*.36,u*.12);fs(c,'#8a5a36',lw);ell(c,fw/2,y0+u*.38,u*.36,u*.12);fs(c,lg(c,0,y0+u*.26,0,y0+u*.5,['#f3d9b0','#d9b07a']),lw);
  rr(c,fw/2-u*.06,y0+u*.08,u*.13,u*.26,u*.03);fs(c,'rgba(255,255,255,.85)',lw*.5);rr(c,fw/2-u*.045,y0+u*.16,u*.1,u*.16,u*.02);c.fillStyle='#d9a066';c.fill();c.strokeStyle='#ff5b4a';c.lineWidth=u*.025;c.beginPath();c.moveTo(fw/2,y0+u*.08);c.lineTo(fw/2+u*.04,y0-u*.03);c.stroke()}
 else if(f.t==='burner'){shadow(u*.1,u*.8);const cx2=fw/2,by2=yb-u*.12;[-.25,0,.25].forEach(d=>{rr(c,cx2+d*u-u*.04,by2-u*.18,u*.08,u*.2,u*.03);fs(c,'#6b4a1a',lw*.6)});
  ell(c,cx2,by2-u*.35,u*.38,u*.26);fs(c,lg(c,cx2-u*.38,0,cx2+u*.38,0,['#d9b04a','#a37a24','#6b4a1a']),lw);
  [-1,1].forEach(s2=>{c.beginPath();c.arc(cx2+s2*u*.42,by2-u*.45,u*.09,0,Math.PI*2);c.strokeStyle=OUT;c.lineWidth=lw*1.8;c.stroke();c.strokeStyle='#c99a3a';c.lineWidth=lw;c.stroke()});
  ell(c,cx2,by2-u*.58,u*.36,u*.08);fs(c,'#e0b84a',lw);c.fillStyle='#ffd35a';for(let i=0;i<6;i++){circ(c,cx2-u*.25+i*u*.1,by2-u*.32,u*.025);c.fill()}
  for(let i=0;i<5;i++){const x=cx2-u*.14+i*u*.07;c.strokeStyle='#8a5a36';c.lineWidth=u*.02;c.beginPath();c.moveTo(x,by2-u*.58);c.lineTo(x+(i-2)*u*.02,by2-u*.86);c.stroke();circ(c,x+(i-2)*u*.02,by2-u*.87,u*.018);c.fillStyle='#ff4a3a';c.fill()}
  c.strokeStyle='rgba(220,220,230,.75)';c.lineWidth=u*.05;c.lineCap='round';[-.06,.06].forEach(d=>{c.beginPath();c.moveTo(cx2+d*u,by2-u*.9);c.bezierCurveTo(cx2+d*u+u*.18,by2-u*1.0,cx2+d*u-u*.15,by2-u*1.1,cx2+d*u+u*.05,by2-u*1.25);c.stroke()})}
 else if(f.t==='pillar'){shadow(u*.1,u*.8);const tem=k==='temple';rr(c,u*.12,yb-u*.3,u*.76,u*.26,u*.04);fs(c,tem?'#8f8a80':'#d6dbe6',lw);
  rr(c,u*.24,y0-u*.6,u*.52,yb-u*.3-(y0-u*.6),u*.06);fs(c,lg(c,u*.24,0,u*.76,0,tem?['#e8524a','#c8372d','#8a1f18']:['#ffffff','#e6eaf2','#b9c1d6']),lw);
  if(tem){c.fillStyle='#ffd35a';[.25,.55].forEach(p=>{const yy=y0-u*.6+(yb-y0)*p;c.fillRect(u*.26,yy,u*.48,u*.06)});c.strokeStyle='#ffd35a';c.lineWidth=u*.03;c.beginPath();for(let t=0;t<=1;t+=.05){const yy=y0-u*.3+t*u*1.1,xx=u*.5+Math.sin(t*14)*u*.18;t?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke()}
  else{c.strokeStyle='rgba(120,130,160,.25)';c.lineWidth=1;[.38,.5,.62].forEach(p=>{c.beginPath();c.moveTo(p*u,y0-u*.5);c.lineTo(p*u,yb-u*.32);c.stroke()});c.fillStyle=city.roof;c.fillRect(u*.26,yb-u*.55,u*.48,u*.1)}
  rr(c,u*.14,y0-u*.72,u*.72,u*.16,u*.04);fs(c,tem?'#2f9a6a':'#eef1f6',lw)}
 else if(f.t==='dispenser'){shadow(u*.15,u*.7);rr(c,u*.22,y0+u*.1,u*.56,fh-u*.15,u*.08);fs(c,lg(c,u*.22,0,u*.78,0,['#ffffff','#d6dbe6']),lw);
  rr(c,u*.28,y0-u*.6,u*.44,u*.72,u*.18);fs(c,'rgba(120,190,240,.75)',lw);c.fillStyle='rgba(255,255,255,.6)';c.fillRect(u*.34,y0-u*.48,u*.06,u*.45);
  [['#ff5b4a',.38],['#3a7bd5',.62]].forEach(([col,p])=>{rr(c,p*u-u*.05,y0+u*.32,u*.1,u*.08,u*.02);fs(c,col,lw*.6)});rr(c,u*.3,y0+u*.52,u*.4,u*.05,u*.02);fs(c,'#9aa4b8',lw*.5)}
 else if(f.t==='rack'){shadow(u*.1,u*.8);rr(c,u*.12,y0-u*.2,u*.76,fh+u*.1,u*.05);fs(c,'#8a5a36',lw);for(let r=0;r<3;r++)for(let i=0;i<3;i++){rr(c,u*(.18+i*.22),y0-u*.12+r*u*.36,u*.18,u*.3,u*.02);fs(c,['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'][(r*3+i)%5],lw*.4);c.fillStyle='rgba(255,255,255,.75)';c.fillRect(u*(.2+i*.22),y0-u*.08+r*u*.36,u*.14,u*.05)}}
 else if(f.t==='cushion'){ell(c,fw/2,yb-u*.45,u*.36,u*.24);fs(c,lg(c,0,yb-u*.7,0,yb-u*.2,['#ff6b5a','#b8312a']),lw);ell(c,fw/2,yb-u*.47,u*.25,u*.15);c.strokeStyle='#ffd35a';c.lineWidth=u*.03;c.stroke()}
 return cv}
// 超商是俐落的現代歐式街屋：石材簷口、灰泥牆、上層窗，一樓整面玻璃店面
// 回傳圓招牌的位置（兩扇窗中間）
function storeFront(c,u,w,h,fy,lw,brand){
 const P={wall:'#eef0f2',trim:'#c9ced6',front:'#2b2f36'};
 c.fillStyle='rgba(20,30,40,.2)';c.fillRect(u*.18,h-u*.35,w-u*.36,u*.35);
 const top=fy-u*.35;
 rr(c,u*.12,top+u*.2,w-u*.24,h-top-u*.2,u*.04);fs(c,lg(c,0,top,0,h,[shade(P.wall,.2),P.wall]),lw);
 c.strokeStyle='rgba(120,130,150,.22)';c.lineWidth=Math.max(1,u*.02);for(let x=u*1.12;x<w-u*.2;x+=u){c.beginPath();c.moveTo(x,top+u*.3);c.lineTo(x,fy+u*1.36);c.stroke()}
 rr(c,u*.04,top,w-u*.08,u*.28,u*.04);fs(c,P.trim,lw);c.fillStyle='rgba(0,0,0,.14)';c.fillRect(u*.08,top+u*.2,w-u*.16,u*.06);
 const win=(x,y,ww,wh)=>{
  rr(c,x,y,ww,wh,u*.03);fs(c,'#3a404a',lw*.8);
  rr(c,x+u*.06,y+u*.06,ww-u*.12,wh-u*.12,u*.02);fs(c,lg(c,0,y,0,y+wh,['#dff1fb','#7fb0cf']));
  c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x+ww*.2,y+wh*.12,ww*.1,wh*.4);
  rr(c,x-u*.04,y+wh,ww+u*.08,u*.06,u*.02);fs(c,P.trim,lw*.5)};
 win(u*1.0,fy+u*.18,u*.62,u*.95);win(w-u*1.62,fy+u*.18,u*.62,u*.95);
 const sign=brand?.sign||'STORE';
 rr(c,u*.2,fy+u*1.36,w-u*.4,u*.44,u*.04);fs(c,brand.primary,lw);
 c.fillStyle='#ffffff';c.font=`900 ${u*(sign.length>7?.2:.26)}px system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(sign,w/2,fy+u*1.59);
 rr(c,u*.22,fy+u*1.8,w-u*.44,h-fy-u*1.8,u*.02);fs(c,P.front,lw);
 brand.stripes.forEach((col,i)=>{c.fillStyle=col;c.fillRect(u*.26,fy+u*(1.84+i*.05),w-u*.52,u*.05)});
 const dw=u*.88,dh=u*1.18,dx=w/2-dw/2,gt=fy+u*2.06,gb=h-u*.42;
 const pane=(x0,x1)=>{rr(c,x0,gt,x1-x0,gb-gt,u*.02);fs(c,lg(c,0,gt,0,gb,['#effaff','#a9d3ea','#5f97bd']),lw*.7);
  for(let s=0;s<2;s++){const sy=gt+(gb-gt)*(.42+s*.4);c.fillStyle='rgba(27,35,64,.3)';c.fillRect(x0+u*.06,sy,x1-x0-u*.12,u*.04);
   for(let k=0;k<6;k++){c.fillStyle=['#ff5b4a','#ffc93c','#14b3a4','#7a8cff','#ff8fb6'][(k+s*2)%5];c.fillRect(x0+u*.1+k*(x1-x0-u*.2)/6,sy-u*.18,u*.12,u*.18)}}
  c.strokeStyle=P.front;c.lineWidth=u*.05;c.beginPath();c.moveTo((x0+x1)/2,gt);c.lineTo((x0+x1)/2,gb);c.stroke();
  c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(x0+u*.15,gb);c.lineTo(x0+u*.45,gt);c.lineTo(x0+u*.6,gt);c.lineTo(x0+u*.3,gb);c.fill()};
 pane(u*.42,dx-u*.14);pane(dx+dw+u*.14,w-u*.42);
 rr(c,u*.22,gb,w-u*.44,h-gb,u*.02);fs(c,shade(P.front,.25),lw*.7);
 rr(c,dx,h-dh,dw,dh,u*.04);fs(c,P.front,lw);rr(c,dx+u*.08,h-dh+u*.08,dw-u*.16,dh-u*.1,u*.02);fs(c,lg(c,0,h-dh,0,h,['#e6f6ff','#8fc0dc']));
 c.strokeStyle=P.front;c.lineWidth=u*.04;c.beginPath();c.moveTo(w/2,h-dh);c.lineTo(w/2,h);c.stroke();
 const tx=w-u*.95,ty=gt+u*.12;rr(c,tx,ty,u*.42,u*.22,u*.05);fs(c,brand.secondary,lw*.5);c.fillStyle='#ffffff';c.font=`900 ${u*.14}px system-ui,sans-serif`;c.fillText('24H',tx+u*.21,ty+u*.115);
 return{bx:w/2,by:fy+u*.65,br:u*.4};
}
// 咖啡店整棟是一只放在碟子上的陶瓷馬克杯：右邊杯把、杯口一圈拿鐵拉花冒著熱氣，杯身一圈招牌，門開在杯底
function mugFront(c,u,w,h,lw){
 const cx=w/2,x0=u*.8,x1=w-u*.8,top=u*1.1,bot=h-u*.3,ink=Math.max(1,u*.05);
 ell(c,cx,h-u*.2,u*2.4,u*.2);fs(c,lg(c,0,h-u*.4,0,h,['#fbf5ea','#d9c7ae']),lw);
 c.strokeStyle=OUT;c.lineWidth=u*.34;c.beginPath();c.moveTo(x1-u*.1,top+u*.6);c.bezierCurveTo(w+u*.05,top+u*.5,w+u*.05,top+u*2.5,x1-u*.1,top+u*2.4);c.stroke();
 c.strokeStyle='#efe4d3';c.lineWidth=u*.24;c.stroke();
 rr(c,x0,top,x1-x0,bot-top,u*.45);fs(c,lg(c,x0,0,x1,0,['#fffaf2','#f1e6d6','#d4c0a4']),lw);
 c.fillStyle='rgba(255,255,255,.55)';rr(c,x0+u*.2,top+u*.45,u*.14,u*1.4,u*.07);c.fill();
 ell(c,cx,top,(x1-x0)/2,u*.3);fs(c,'#fbf5ea',lw);
 ell(c,cx,top+u*.02,(x1-x0)/2-u*.16,u*.2);fs(c,'#5b3525',lw*.6);
 ell(c,cx,top+u*.03,u*1.15,u*.14);c.fillStyle='#c98f5a';c.fill();
 c.fillStyle='#fff6e6';c.beginPath();c.moveTo(cx,top+u*.13);c.bezierCurveTo(cx-u*.32,top+u*.02,cx-u*.16,top-u*.12,cx,top-u*.03);c.bezierCurveTo(cx+u*.16,top-u*.12,cx+u*.32,top+u*.02,cx,top+u*.13);c.fill();
 [cx-u*1.0,cx+u*1.0].forEach(px=>{const py=top+u*.55,ww=u*.52,wh=u*.72;
  c.beginPath();c.moveTo(px-ww/2,py+wh);c.lineTo(px-ww/2,py+ww/2);c.arc(px,py+ww/2,ww/2,Math.PI,0);c.lineTo(px+ww/2,py+wh);c.closePath();fs(c,'#2a211c',lw*.8);
  c.beginPath();c.moveTo(px-ww/2+u*.06,py+wh-u*.06);c.lineTo(px-ww/2+u*.06,py+ww/2);c.arc(px,py+ww/2,ww/2-u*.06,Math.PI,0);c.lineTo(px+ww/2-u*.06,py+wh-u*.06);c.closePath();fs(c,lg(c,0,py,0,py+wh,['#fff1cf','#e0b77a']));
  c.strokeStyle='#2a211c';c.lineWidth=u*.035;c.beginPath();c.moveTo(px,py+u*.06);c.lineTo(px,py+wh);c.moveTo(px-ww/2,py+wh*.6);c.lineTo(px+ww/2,py+wh*.6);c.stroke()});
 const sy=top+u*1.45;rr(c,cx-u*1.62,sy,u*3.24,u*.42,u*.06);fs(c,'#2a211c',lw);
 rr(c,cx-u*1.54,sy+u*.06,u*3.08,u*.3,u*.03);c.strokeStyle='#e8c873';c.lineWidth=Math.max(1,u*.02);c.stroke();
 c.fillStyle='#e8c873';c.font=`700 ${u*.22}px Georgia,"Noto Serif TC",serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('CAFÉ · COFFEE',cx,sy+u*.22);
 c.fillStyle='#6b4226';[-1.25,-.85,.85,1.25].forEach(k=>{const bx=cx+u*k,by=sy+u*.72;c.save();c.translate(bx,by);c.rotate(k*.6);ell(c,0,0,u*.1,u*.065);c.fill();c.strokeStyle='#3a2416';c.lineWidth=Math.max(1,u*.02);c.beginPath();c.moveTo(-u*.08,0);c.quadraticCurveTo(0,u*.03,u*.08,0);c.stroke();c.restore()});
 const dw=u*.88,dh=u*1.18,dx=cx-dw/2;c.beginPath();c.moveTo(dx,h);c.lineTo(dx,h-dh+dw/2);c.arc(cx,h-dh+dw/2,dw/2,Math.PI,0);c.lineTo(dx+dw,h);c.closePath();fs(c,'#2a211c',lw);
 c.beginPath();c.moveTo(dx+u*.08,h-u*.08);c.lineTo(dx+u*.08,h-dh+dw/2);c.arc(cx,h-dh+dw/2,dw/2-u*.08,Math.PI,0);c.lineTo(dx+dw-u*.08,h-u*.08);c.closePath();fs(c,lg(c,0,h-dh,0,h,['#fff1cf','#c99a5c']));
 c.fillStyle='#e8c873';c.fillRect(dx+dw-u*.22,h-dh*.55,u*.05,u*.28);
 [dx-u*.42,dx+dw+u*.14].forEach(px=>{rr(c,px,h-u*.32,u*.28,u*.3,u*.04);fs(c,'#b8643a',lw*.6);circ(c,px+u*.14,h-u*.5,u*.2);fs(c,lg(c,0,h-u*.7,0,h-u*.3,['#6cc46f','#2f7a3a']),lw*.6)});
 return{bx:cx,by:top+u*.85,br:u*.34};
}
// 茶飲店整棟是一把青瓷茶壺：左邊壺嘴冒著熱氣、右邊壺把、頂上壺蓋，壺身一圈招牌，門開在壺底
function teapotFront(c,u,w,h,lw){
 const cx=w/2,cy=h-u*1.85,rx=u*1.85,ry=u*1.7,ink=Math.max(1,u*.05);
 ell(c,cx,h-u*.12,u*1.9,u*.14);c.fillStyle='rgba(20,30,40,.22)';c.fill();
 c.lineCap='round';c.strokeStyle=OUT;c.lineWidth=u*.34;c.beginPath();c.moveTo(cx+rx*.82,cy-ry*.6);c.bezierCurveTo(w+u*.05,cy-ry*.75,w+u*.05,cy+ry*.35,cx+rx*.85,cy+ry*.45);c.stroke();
 c.strokeStyle='#4f8a6c';c.lineWidth=u*.24;c.stroke();
 c.beginPath();c.moveTo(cx-rx*.8,cy-u*.05);c.quadraticCurveTo(u*.35,cy-u*.2,u*.18,cy-u*1.45);c.lineTo(u*.5,cy-u*1.5);c.quadraticCurveTo(u*.62,cy-u*.65,cx-rx*.72,cy+u*.65);c.closePath();fs(c,lg(c,0,cy-u*1.5,0,cy+u*.6,['#bfe0cb','#6fa88a']),lw);
 ell(c,u*.34,cy-u*1.47,u*.17,u*.06);fs(c,'#3f7a5c',lw*.6);
 ell(c,cx,cy,rx,ry);fs(c,lg(c,cx-rx,cy-ry,cx+rx*.6,cy+ry,['#e4f3e8','#9fcdb2','#5d9478']),lw);
 c.fillStyle='rgba(255,255,255,.45)';ell(c,cx-rx*.45,cy-ry*.5,rx*.22,ry*.12);c.fill();
 rr(c,cx-u*1.25,h-u*.34,u*2.5,u*.3,u*.08);fs(c,'#3f7a5c',lw);
 ell(c,cx,cy-ry+u*.08,u*1.05,u*.22);fs(c,'#3f7a5c',lw);
 c.beginPath();c.ellipse(cx,cy-ry+u*.02,u*.85,u*.5,0,Math.PI,0);c.closePath();fs(c,lg(c,0,cy-ry-u*.5,0,cy-ry,['#cfe8d6','#7fb596']),lw);
 circ(c,cx,cy-ry-u*.55,u*.17);fs(c,'#3f7a5c',lw);
 [cx-u*1.0,cx+u*1.0].forEach(px=>{const py=cy-u*.68;circ(c,px,py,u*.32);fs(c,'#f3ead6',lw);circ(c,px,py,u*.24);fs(c,lg(c,0,py-u*.24,0,py+u*.24,['#dff1fb','#7fb0cf']),lw*.6);
  c.strokeStyle='#f3ead6';c.lineWidth=u*.04;c.beginPath();c.moveTo(px-u*.24,py);c.lineTo(px+u*.24,py);c.moveTo(px,py-u*.24);c.lineTo(px,py+u*.24);c.stroke()});
 const sy=cy-u*.12;rr(c,cx-u*1.62,sy,u*3.24,u*.42,u*.06);fs(c,'#24493a',lw);
 rr(c,cx-u*1.54,sy+u*.06,u*3.08,u*.3,u*.03);c.strokeStyle='#e8c873';c.lineWidth=Math.max(1,u*.02);c.stroke();
 c.fillStyle='#e8c873';c.font=`700 ${u*.22}px Georgia,"Noto Serif TC",serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('茶飲 · TEA',cx,sy+u*.22);
 c.strokeStyle='rgba(36,73,58,.45)';c.lineWidth=ink*.6;for(let k=0;k<7;k++){const px=cx-u*1.2+k*u*.4;c.beginPath();c.arc(px,sy+u*.62,u*.12,Math.PI,0);c.stroke()}
 const dw=u*.88,dh=u*1.18,dx=cx-dw/2;c.beginPath();c.moveTo(dx,h);c.lineTo(dx,h-dh+dw/2);c.arc(cx,h-dh+dw/2,dw/2,Math.PI,0);c.lineTo(dx+dw,h);c.closePath();fs(c,'#24493a',lw);
 c.beginPath();c.moveTo(dx+u*.08,h-u*.08);c.lineTo(dx+u*.08,h-dh+dw/2);c.arc(cx,h-dh+dw/2,dw/2-u*.08,Math.PI,0);c.lineTo(dx+dw-u*.08,h-u*.08);c.closePath();fs(c,lg(c,0,h-dh,0,h,['#fff1cf','#c99a5c']));
 c.fillStyle='#e8c873';c.fillRect(dx+dw-u*.22,h-dh*.55,u*.05,u*.28);
 [dx-u*.42,dx+dw+u*.14].forEach(px=>{rr(c,px,h-u*.32,u*.28,u*.3,u*.04);fs(c,'#3f7a5c',lw*.6);circ(c,px+u*.14,h-u*.5,u*.2);fs(c,lg(c,0,h-u*.7,0,h-u*.3,['#6cc46f','#2f7a3a']),lw*.6)});
 return{bx:cx,by:cy-u*.68,br:u*.34};
}
function spriteSimpleShop(kind,u,dpr,city,brandId){
 const b=BLD[kind],w=b.w*u,h=(b.h+b.ex)*u,cv=mkc(w,h,dpr),c=cv.getContext('2d');
 const lw=Math.max(1.4,u*.035),fy=h-b.h*u,brand=kind==='store'?storeBrand(brandId):null;
 c.lineJoin='round';c.lineCap='round';
 const{bx,by,br}=kind==='tea'?teapotFront(c,u,w,h,lw):kind==='coffee'?mugFront(c,u,w,h,lw):storeFront(c,u,w,h,fy,lw,brand);
 // 兩扇窗中間的圓招牌：超商是購物籃、茶飲是珍奶杯、咖啡是冒煙的咖啡杯，遠遠就分得出來
 const ink=Math.max(1,u*.05);
 circ(c,bx,by,br);fs(c,kind==='store'?brand.primary:kind==='coffee'?'#5b3525':'#fff6e0',lw);
 circ(c,bx,by,br*.82);c.strokeStyle=kind==='store'?brand.secondary:kind==='coffee'?'#e2b889':'#8a5634';c.lineWidth=u*.04;c.stroke();
 const s=br/(u*.42);
 if(kind==='store'){c.strokeStyle='#ffffff';c.lineWidth=ink;c.beginPath();c.arc(bx,by-u*.02*s,u*.13*s,Math.PI,0);c.stroke();
  c.beginPath();c.moveTo(bx-u*.22*s,by-u*.02*s);c.lineTo(bx+u*.22*s,by-u*.02*s);c.lineTo(bx+u*.15*s,by+u*.2*s);c.lineTo(bx-u*.15*s,by+u*.2*s);c.closePath();c.fillStyle='#ffffff';c.fill();
  c.strokeStyle=brand.primary;c.lineWidth=ink*.6;[-.08,0,.08].forEach(k=>{c.beginPath();c.moveTo(bx+u*k*s,by+u*.04*s);c.lineTo(bx+u*k*.8*s,by+u*.16*s);c.stroke()})}
 else if(kind==='tea'){c.strokeStyle='#ff5b4a';c.lineWidth=ink;c.beginPath();c.moveTo(bx+u*.03*s,by-u*.12*s);c.lineTo(bx+u*.11*s,by-u*.3*s);c.stroke();
  c.beginPath();c.moveTo(bx-u*.16*s,by-u*.12*s);c.lineTo(bx+u*.16*s,by-u*.12*s);c.lineTo(bx+u*.12*s,by+u*.24*s);c.lineTo(bx-u*.12*s,by+u*.24*s);c.closePath();fs(c,lg(c,0,by-u*.12*s,0,by+u*.24*s,['#f3dcb6','#d9a066']),lw*.6);
  c.strokeStyle='#8a5634';c.lineWidth=ink*.6;c.beginPath();c.moveTo(bx-u*.16*s,by-u*.05*s);c.lineTo(bx+u*.16*s,by-u*.05*s);c.stroke();
  c.fillStyle='#3a2a22';[[-.06,.15],[.02,.17],[.08,.13],[-.02,.09]].forEach(([dx,dy])=>{circ(c,bx+u*dx*s,by+u*dy*s,u*.035*s);c.fill()})}
 else{c.strokeStyle='#fff1d0';c.lineWidth=ink*.7;[-.07,.03].forEach(k=>{c.beginPath();c.moveTo(bx+u*k*s,by-u*.06*s);c.quadraticCurveTo(bx+u*(k+.06)*s,by-u*.14*s,bx+u*k*s,by-u*.2*s);c.quadraticCurveTo(bx+u*(k-.05)*s,by-u*.26*s,bx+u*(k+.02)*s,by-u*.32*s);c.stroke()});
  c.strokeStyle='#ffffff';c.lineWidth=ink;c.beginPath();c.arc(bx+u*.14*s,by+u*.06*s,u*.07*s,-Math.PI/2,Math.PI/2);c.stroke();
  rr(c,bx-u*.18*s,by-u*.03*s,u*.32*s,u*.22*s,u*.06*s);c.fillStyle='#ffffff';c.fill();
  ell(c,bx-u*.02*s,by+u*.21*s,u*.24*s,u*.04*s);c.fill()}
 return cv;
}

// 招牌：底板加上有標音的中文
function rubyPlaque(c,u,cx,cy,text,bg,fg,sz,lw){const pw=text.length*sz*1.08+sz*.6,ph=sz*(settings().ruby==='off'?1.3:1.75);rr(c,cx-pw/2,cy-ph/2,pw,ph,u*.08);fs(c,bg,lw);canvasRuby(c,text,cx,cy+ph/2-sz*.32,sz,fg)}
// 購物中心：寬大低矮的白色量體，中央玻璃圓頂中庭，一樓整排櫥窗和綠色雨遮，門口是三扇玻璃門
function spriteMall(u,dpr){const b=BLD.mall,w=b.w*u,h=(b.h+b.ex)*u,cv=mkc(w,h,dpr),c=cv.getContext('2d'),lw=Math.max(1.4,u*.035),fy=h-b.h*u,dc=(Math.floor(b.w/2)+.5)*u;c.lineJoin='round';
 c.fillStyle='rgba(20,30,40,.2)';c.fillRect(u*.2,h-u*.35,w-u*.3,u*.35);
 c.beginPath();c.arc(dc,fy+u*.45,u*1.3,Math.PI,0);c.closePath();fs(c,lg(c,0,fy-u*.9,0,fy+u*.45,['#effaff','#9fcde8','#4f86b0']),lw);
 c.strokeStyle='#e6eaf0';c.lineWidth=u*.05;for(let k=1;k<6;k++){const a=Math.PI+k*Math.PI/6;c.beginPath();c.moveTo(dc,fy+u*.45);c.lineTo(dc+Math.cos(a)*u*1.3,fy+u*.45+Math.sin(a)*u*1.3);c.stroke()}
 c.beginPath();c.arc(dc,fy+u*.45,u*.75,Math.PI,0);c.stroke();
 rr(c,u*.12,fy+u*.4,w-u*.24,h-fy-u*.4,u*.05);fs(c,lg(c,0,fy,0,h,['#fbfbfc','#dfe3e9']),lw);
 rr(c,0,fy+u*.3,w,u*.62,u*.05);fs(c,'#2b2f36',lw);rubyPlaque(c,u,dc,fy+u*.61,'購物中心','#2b2f36','#ffffff',u*.3,0);
 c.fillStyle='#ffd35a';c.font=`900 ${u*.2}px system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('MALL',w-u*.75,fy+u*.61);c.fillText('MALL',u*.75,fy+u*.61);
 const gy=fy+u*1.15,gh=u*1.05;rr(c,u*.4,gy,w-u*.8,gh,u*.03);fs(c,lg(c,0,gy,0,gy+gh,['#e6f6ff','#8fc3e6','#3e78a8']),lw*.8);
 c.strokeStyle='#cfd6e2';c.lineWidth=u*.05;for(let x=u*.9;x<w-u*.45;x+=u*.5){c.beginPath();c.moveTo(x,gy);c.lineTo(x,gy+gh);c.stroke()}
 c.fillStyle='rgba(255,255,255,.35)';[u*.7,w-u*2.2].forEach(x=>{c.beginPath();c.moveTo(x,gy+gh);c.lineTo(x+u*.5,gy);c.lineTo(x+u*.75,gy);c.lineTo(x+u*.25,gy+gh);c.fill()});
 const ay=h-u*2.05;rr(c,u*.05,ay,w-u*.1,u*.26,u*.05);fs(c,lg(c,0,ay,0,ay+u*.26,['#2fc4b2','#0e7c74']),lw);
 const sc=['#ff5b4a','#ffc93c','#7a8cff','#ff8fb6','#8bd36b'];
 [[u*.35,dc-u*1.0],[dc+u*1.0,w-u*.35]].forEach(([x0,x1],side)=>{const ty=ay+u*.4,tb=h-u*.32;rr(c,x0,ty,x1-x0,tb-ty,u*.03);fs(c,lg(c,0,ty,0,tb,['#f4fbff','#b4d8ec','#6c9fc2']),lw*.8);
  for(let x=x0+u*.1,k=side*2;x<x1-u*.5;x+=u*.95,k++){rr(c,x,ty+u*.08,u*.8,u*.24,u*.03);fs(c,sc[k%5],lw*.4);c.strokeStyle='rgba(27,35,64,.25)';c.lineWidth=u*.04;c.beginPath();c.moveTo(x+u*.85,ty);c.lineTo(x+u*.85,tb);c.stroke()}
  for(let k=0;k<4;k++){const x=x0+u*.25+k*(x1-x0-u*.5)/3;ell(c,x,tb-u*.35,u*.09,u*.09);c.fillStyle=sc[(k+side)%5];c.fill();c.fillRect(x-u*.07,tb-u*.28,u*.14,u*.22)}});
 const dw=u*1.9,dh=u*1.45,dx=dc-dw/2;rr(c,dx-u*.08,h-dh-u*.08,dw+u*.16,dh+u*.08,u*.04);fs(c,'#2b2f36',lw);
 for(let k=0;k<3;k++){rr(c,dx+k*dw/3+u*.05,h-dh+u*.02,dw/3-u*.1,dh-u*.06,u*.02);fs(c,lg(c,0,h-dh,0,h,['#effaff','#9fcde8']))}
 c.fillStyle='#c9ced6';[dc-u*.12,dc+u*.08].forEach(x=>c.fillRect(x,h-dh*.6,u*.04,u*.32));
 [u*.15,w-u*.6].forEach(px=>{rr(c,px,h-u*.36,u*.45,u*.34,u*.05);fs(c,'#9aa3b6',lw*.6);circ(c,px+u*.22,h-u*.5,u*.22);fs(c,lg(c,0,h-u*.72,0,h-u*.3,['#6cc46f','#2f7a3a']),lw*.6)});
 return cv}
// 百貨公司：米色石材立面、頂上紅底金字的大招牌，三層整齊的窗，兩側直式布條，一樓是條紋雨遮、櫥窗和旋轉門
function spriteDept(u,dpr){const b=BLD.dept,w=b.w*u,h=(b.h+b.ex)*u,cv=mkc(w,h,dpr),c=cv.getContext('2d'),lw=Math.max(1.4,u*.035),fy=h-b.h*u-u*.3,dc=(Math.floor(b.w/2)+.5)*u,gold='#e8c873',red='#8a1f24';c.lineJoin='round';
 c.fillStyle='rgba(20,30,40,.2)';c.fillRect(u*.2,h-u*.35,w-u*.3,u*.35);
 rr(c,w/2-u*1.7,fy-u*1.2,u*3.4,u*.95,u*.06);fs(c,red,lw);rr(c,w/2-u*1.6,fy-u*1.1,u*3.2,u*.75,u*.04);c.strokeStyle=gold;c.lineWidth=u*.04;c.stroke();
 canvasRuby(c,'百貨公司',w/2,fy-u*.48,u*.3,gold);c.fillStyle='#5b6178';[w/2-u*1.2,w/2+u*1.1].forEach(x=>c.fillRect(x,fy-u*.25,u*.1,u*.3));
 rr(c,u*.15,fy,w-u*.3,h-fy,u*.04);fs(c,lg(c,0,fy,0,h,['#f6efe2','#e2d6c0']),lw);
 rr(c,0,fy-u*.08,w,u*.3,u*.04);fs(c,'#cdbb98',lw);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(u*.1,fy+u*.2,w-u*.2,u*.06);
 for(let f2=0;f2<3;f2++)for(let k=0;k<4;k++){const x=u*1.0+k*(w-u*2.0)/4+u*.08,y=fy+u*.42+f2*u*.85,ww=(w-u*2.0)/4-u*.16;
  rr(c,x,y,ww,u*.6,u*.03);fs(c,'#5a4a3a',lw*.6);rr(c,x+u*.05,y+u*.05,ww-u*.1,u*.5,u*.02);fs(c,lg(c,0,y,0,y+u*.6,f2===1&&k%2?['#fff1cf','#e8b86a']:['#dff1fb','#7fb0cf']));
  rr(c,x-u*.04,y+u*.6,ww+u*.08,u*.06,u*.02);fs(c,'#cdbb98',lw*.4)}
 [u*.3,w-u*.72].forEach(x=>{rr(c,x,fy+u*.4,u*.42,u*2.4,u*.04);fs(c,lg(c,x,0,x+u*.42,0,['#d8473a','#a3271f']),lw*.8);c.fillStyle=gold;c.font=`900 ${u*.28}px "Noto Serif TC",serif`;c.textAlign='center';c.textBaseline='middle';
  ['週','年','慶'].forEach((ch,i)=>c.fillText(ch,x+u*.21,fy+u*(.8+i*.7)))});
 const ay=h-u*1.75;for(let k=0;k<12;k++){const x0=u*.1+k*(w-u*.2)/12,x1=x0+(w-u*.2)/12;c.beginPath();c.moveTo(x0,ay);c.lineTo(x1,ay);c.lineTo(x1,ay+u*.22);c.arc((x0+x1)/2,ay+u*.22,(x1-x0)/2,0,Math.PI);c.closePath();fs(c,k%2?'#fff6e0':red,lw*.6)}
 [[u*.35,dc-u*.75],[dc+u*.75,w-u*.35]].forEach(([x0,x1],side)=>{const ty=ay+u*.55,tb=h-u*.3;rr(c,x0,ty,x1-x0,tb-ty,u*.03);fs(c,lg(c,0,ty,0,tb,['#fff8ea','#f0dcb8']),lw*.8);
  for(let k=0;k<2;k++){const mx=x0+(x1-x0)*(.3+k*.4),col=['#7a8cff','#ff8fb6','#14b3a4','#ffc93c'][side*2+k];circ(c,mx,ty+u*.2,u*.09);fs(c,'#e6e0d6',lw*.4);c.beginPath();c.moveTo(mx-u*.15,ty+u*.32);c.lineTo(mx+u*.15,ty+u*.32);c.lineTo(mx+u*.2,tb-u*.12);c.lineTo(mx-u*.2,tb-u*.12);c.closePath();fs(c,col,lw*.4)}});
 const dw=u*1.3,dh=u*1.3,dx=dc-dw/2;rr(c,dx-u*.08,h-dh-u*.08,dw+u*.16,dh+u*.08,u*.04);fs(c,'#b08a3a',lw);rr(c,dx,h-dh,dw,dh,u*.02);fs(c,lg(c,0,h-dh,0,h,['#effaff','#a9cde0']));
 c.strokeStyle='#b08a3a';c.lineWidth=u*.05;c.beginPath();c.moveTo(dc,h-dh);c.lineTo(dc,h);c.moveTo(dx+u*.15,h-dh*.5);c.lineTo(dx+dw-u*.15,h-dh*.5);c.stroke();
 rr(c,u*.1,h-u*.22,w-u*.2,u*.2,u*.03);fs(c,'#cdbb98',lw*.6);
 return cv}

export function spriteBuilding(kind,u,dpr,city,emblemImg,brandId){
 if(kind==='store'||kind==='tea'||kind==='coffee')return spriteSimpleShop(kind,u,dpr,city,brandId);
 if(kind==='mall')return spriteMall(u,dpr);
 if(kind==='dept')return spriteDept(u,dpr);
 return spriteBuildingLegacy(kind,u,dpr,city,emblemImg,brandId);
}

// Café furniture is intentionally one object per tile. The legacy table sprite
// included chairs in the same texture, so the map view uses these standalone
// generators for tea and coffee interiors.
export function spriteTable(u,dpr){
 const cv=mkc(u,u*1.55,dpr),c=cv.getContext('2d'),lw=Math.max(1.2,u*.035),y=u*.78;
 ell(c,u/2,u*1.48,u*.34,u*.08);c.fillStyle='rgba(30,20,10,.22)';c.fill();
 rr(c,u*.14,y,u*.72,u*.2,u*.05);fs(c,'#8a5a36',lw);
 rr(c,u*.22,y-u*.04,u*.56,u*.12,u*.04);fs(c,'#d9b07a',lw*.8);
 rr(c,u*.46,y+u*.2,u*.08,u*.4,u*.025);fs(c,'#6b4226',lw*.7);
 return cv;
}

export function spriteChair(u,dpr){
 const cv=mkc(u,u*1.5,dpr),c=cv.getContext('2d'),lw=Math.max(1.2,u*.035);
 ell(c,u/2,u*1.44,u*.3,u*.07);c.fillStyle='rgba(30,20,10,.2)';c.fill();
 rr(c,u*.23,u*.24,u*.54,u*.28,u*.06);fs(c,'#a8743f',lw);
 rr(c,u*.28,u*.5,u*.44,u*.16,u*.04);fs(c,'#c99060',lw*.8);
 c.strokeStyle='#6b4226';c.lineWidth=lw*.8;c.beginPath();c.moveTo(u*.32,u*.64);c.lineTo(u*.28,u*1.3);c.moveTo(u*.68,u*.64);c.lineTo(u*.72,u*1.3);c.stroke();
 return cv;
}
