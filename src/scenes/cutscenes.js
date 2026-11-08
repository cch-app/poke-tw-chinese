// ===== 過場動畫：開場飛機、搭計程車 =====
import { OUT, canvasRuby, circ, drawChar, drawEuroLamp, ell, fs, lg, rr } from '../art.js';
import { $, esc } from '../core/util.js';
import { CITIES, TW_PEAKS, TW_PTS, TW_RANGES } from '../data/index.js';
import { LI, T, Z, rb } from '../i18n.js';
import { playerLook } from '../world/looks.js';
import { renderPixel } from '../render/pixel.js';

// 客機（俯視）：後掠翼、翼下發動機、平尾與紅色垂直尾翼，機身用漸層做出圓柱立體感；陰影依高度偏移落在海面上
function planeTop(g,x,y,s,ang){const lw=Math.max(1.2,s*.035);
 const wing=sg=>{g.beginPath();g.moveTo(s*.28,sg*s*.1);g.lineTo(-s*.32,sg*s*1.0);g.lineTo(-s*.5,sg*s*1.02);g.lineTo(-s*.32,sg*s*.1);g.closePath()};
 const stab=sg=>{g.beginPath();g.moveTo(-s*1.05,sg*s*.06);g.lineTo(-s*1.36,sg*s*.42);g.lineTo(-s*1.48,sg*s*.42);g.lineTo(-s*1.36,sg*s*.05);g.closePath()};
 const body=()=>{g.beginPath();g.moveTo(s*1.12,0);g.bezierCurveTo(s*1.1,-s*.1,s*.95,-s*.15,s*.75,-s*.15);g.lineTo(-s*1.0,-s*.15);g.quadraticCurveTo(-s*1.4,-s*.12,-s*1.6,-s*.03);g.lineTo(-s*1.6,s*.03);g.quadraticCurveTo(-s*1.4,s*.12,-s*1.0,s*.15);g.lineTo(s*.75,s*.15);g.bezierCurveTo(s*.95,s*.15,s*1.1,s*.1,s*1.12,0);g.closePath()};
 g.save();g.translate(x+s*.3,y+s*.55);g.rotate(ang);g.fillStyle='rgba(11,42,74,.22)';[1,-1].forEach(sg=>{wing(sg);g.fill();stab(sg);g.fill()});body();g.fill();g.restore();
 g.save();g.translate(x,y);g.rotate(ang);
 [1,-1].forEach(sg=>{const gr=g.createLinearGradient(-s*2.4,0,-s*.1,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(255,255,255,.55)');g.strokeStyle=gr;g.lineWidth=s*.06;g.beginPath();g.moveTo(-s*.1,sg*s*.42);g.lineTo(-s*2.4,sg*s*.42);g.stroke()});
 [1,-1].forEach(sg=>{rr(g,-s*.05,sg*s*.42-s*.07,s*.37,s*.14,s*.06);fs(g,lg(g,0,sg*s*.42-s*.07,0,sg*s*.42+s*.07,['#f4f6fa','#9aa4b8']),lw*.8);ell(g,s*.32,sg*s*.42,s*.025,s*.06);g.fillStyle='#2b2e35';g.fill()});
 [1,-1].forEach(sg=>{wing(sg);fs(g,lg(g,0,0,0,sg*s,sg<0?['#ffffff','#d6dde8']:['#e9edf3','#b5bfcd']),lw);
  g.strokeStyle='rgba(120,130,150,.5)';g.lineWidth=Math.max(1,s*.015);g.beginPath();g.moveTo(-s*.28,sg*s*.18);g.lineTo(-s*.46,sg*s*.9);g.stroke();
  circ(g,-s*.42,sg*s*1.01,s*.035);g.fillStyle=sg<0?'#ff4a3a':'#3ad17a';g.fill()});
 [1,-1].forEach(sg=>{stab(sg);fs(g,lg(g,0,0,0,sg*s*.42,['#f4f6fa','#c9d1dc']),lw*.8)});
 body();fs(g,lg(g,0,-s*.15,0,s*.15,['#ffffff','#f5f7fa','#c3ccd9']),lw);
 g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=s*.03;g.beginPath();g.moveTo(s*.8,-s*.06);g.lineTo(-s*1.1,-s*.06);g.stroke();
 rr(g,-s*1.58,-s*.035,s*.58,s*.07,s*.03);fs(g,lg(g,0,-s*.035,0,s*.035,['#ff7a68','#c8372d']),lw*.6);
 g.beginPath();g.moveTo(s*.98,-s*.09);g.quadraticCurveTo(s*1.07,0,s*.98,s*.09);g.lineTo(s*.93,s*.08);g.quadraticCurveTo(s*1.0,0,s*.93,-s*.08);g.closePath();g.fillStyle='#1b2340';g.fill();
 g.restore()}
// 客機（側視）：與俯視同一套塗裝。(x,y) 是機身中心；PLANE_GEAR 是主輪著地點相對機身中心的位置（乘上 s）
const PLANE_GEAR=[-.2,.435];
function planeSide(g,x,y,s,pitch,gear,spoiler){g.save();g.translate(x,y);g.rotate(pitch);const lw=Math.max(1.2,s*.03);
 const body=()=>{g.beginPath();g.moveTo(-s*1.66,-s*.16);g.lineTo(-s*1.1,-s*.2);g.lineTo(s*1.1,-s*.2);g.bezierCurveTo(s*1.38,-s*.2,s*1.58,-s*.08,s*1.6,s*.02);g.bezierCurveTo(s*1.6,s*.12,s*1.45,s*.2,s*1.2,s*.2);g.lineTo(-s*.9,s*.2);g.bezierCurveTo(-s*1.2,s*.2,-s*1.45,s*.02,-s*1.66,-s*.1);g.closePath()};
 g.beginPath();g.moveTo(-s*.95,-s*.19);g.lineTo(-s*1.48,-s*.84);g.lineTo(-s*1.72,-s*.84);g.lineTo(-s*1.62,-s*.15);g.closePath();fs(g,lg(g,0,-s*.84,0,-s*.15,['#ff7a68','#c8372d']),lw);
 g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=s*.04;g.beginPath();g.moveTo(-s*1.22,-s*.3);g.quadraticCurveTo(-s*1.4,-s*.55,-s*1.62,-s*.64);g.stroke();
 if(gear){g.strokeStyle='#5c6270';g.lineWidth=s*.04;g.beginPath();g.moveTo(s*1.12,s*.15);g.lineTo(s*1.12,s*.38);g.moveTo(-s*.2,s*.15);g.lineTo(-s*.2,s*.35);g.moveTo(-s*.3,s*.35);g.lineTo(-s*.1,s*.35);g.stroke();
  circ(g,s*1.12,s*.375,s*.06);fs(g,'#2b2d47',lw*.7);[-.28,-.12].forEach(a=>{circ(g,a*s,s*.36,s*.075);fs(g,'#2b2d47',lw*.7);circ(g,a*s,s*.36,s*.03);g.fillStyle='#9aa4b8';g.fill()})}
 body();fs(g,lg(g,0,-s*.2,0,s*.2,['#ffffff','#f1f4f8','#c3ccd9']),lw);
 g.save();body();g.clip();g.fillStyle='#c8372d';g.fillRect(-s*1.7,s*.02,s*3.4,s*.05);g.fillStyle='#1b2340';g.fillRect(-s*1.7,s*.07,s*3.4,s*.02);g.restore();
 g.fillStyle='#2b4a66';for(let k=0;k<25;k++)rr(g,-s*.98+k*s*.085,-s*.1,s*.04,s*.055,s*.02),g.fill();
 g.strokeStyle='#9aa4b8';g.lineWidth=Math.max(1,s*.012);[s*1.08,-s*1.1].forEach(dx=>{rr(g,dx,-s*.14,s*.07,s*.2,s*.02);g.stroke()});
 g.beginPath();g.moveTo(s*1.3,-s*.12);g.lineTo(s*1.46,-s*.08);g.lineTo(s*1.5,-s*.03);g.lineTo(s*1.3,-s*.05);g.closePath();g.fillStyle='#1b2340';g.fill();
 g.beginPath();g.moveTo(-s*1.18,-s*.05);g.lineTo(-s*1.62,-s*.16);g.lineTo(-s*1.74,-s*.14);g.lineTo(-s*1.5,-s*.0);g.closePath();fs(g,lg(g,0,-s*.16,0,0,['#f4f6fa','#c9d1dc']),lw*.8);
 if(gear){g.beginPath();g.moveTo(-s*.3,s*.12);g.lineTo(-s*.86,s*.3);g.lineTo(-s*.88,s*.37);g.lineTo(-s*.3,s*.18);g.closePath();fs(g,'#c3ccd9',lw*.7)}
 g.beginPath();g.moveTo(s*.4,s*.1);g.lineTo(-s*.3,s*.12);g.lineTo(-s*.86,s*.3);g.lineTo(-s*.62,s*.31);g.lineTo(s*.25,s*.17);g.closePath();fs(g,lg(g,0,s*.1,0,s*.31,['#eef1f6','#aeb8c8']),lw);
 if(spoiler)[0,1,2].forEach(i=>{const bx=-s*(.12+i*.18),by=s*(.13+i*.05);g.beginPath();g.moveTo(bx,by);g.lineTo(bx-s*.16,by+s*.05);g.lineTo(bx-s*.2,by-s*.06);g.lineTo(bx-s*.04,by-s*.11);g.closePath();fs(g,'#dfe5ee',lw*.6)});
 g.beginPath();g.moveTo(s*.12,s*.21);g.lineTo(s*.06,s*.13);g.lineTo(s*.32,s*.13);g.lineTo(s*.42,s*.21);g.closePath();fs(g,'#c9d1dc',lw*.6);
 rr(g,s*.02,s*.2,s*.58,s*.2,s*.1);fs(g,lg(g,0,s*.2,0,s*.4,['#f4f6fa','#9aa4b8']),lw);
 ell(g,s*.59,s*.3,s*.035,s*.095);g.fillStyle='#2b2e35';g.fill();
 g.beginPath();g.moveTo(s*.03,s*.24);g.lineTo(-s*.12,s*.3);g.lineTo(s*.03,s*.36);g.closePath();fs(g,'#7a8496',lw*.6);
 if(gear){const gr=g.createRadialGradient(s*1.05,s*.16,0,s*1.05,s*.16,s*.5);gr.addColorStop(0,'rgba(255,250,220,.7)');gr.addColorStop(1,'rgba(255,250,220,0)');g.fillStyle=gr;g.beginPath();g.moveTo(s*1.05,s*.16);g.lineTo(s*1.9,s*.0);g.lineTo(s*1.9,s*.4);g.closePath();g.fill();circ(g,s*1.05,s*.16,s*.03);g.fillStyle='#fffbe6';g.fill()}
 g.restore()}
function cloudsDraw(g,w,h,cl,t,yMax){cl.forEach(c=>{const x=((c.x+t*c.v)%1.3-.15)*w,y=c.y*h*yMax,s=c.s*Math.min(w,h)*.08;g.fillStyle='rgba(255,255,255,.85)';[[0,0,1],[s*.9,s*.1,.8],[-s*.9,s*.15,.75],[s*.3,-s*.4,.7]].forEach(([dx,dy,k])=>{ell(g,x+dx,y+dy,s*k,s*k*.7);g.fill()})})}
// 臺灣輪廓的外框（用來把島放在畫面中央）
const TW_BOX=TW_PTS.split(' ').map(pt=>pt.split(',').map(Number)).reduce((b,[x,y])=>[Math.min(b[0],x),Math.min(b[1],y),Math.max(b[2],x),Math.max(b[3],y)],[1e9,1e9,-1e9,-1e9]);
// 從高空往下看的積雲：每朵雲由一團柔邊圓球疊成，先畫偏右下的灰藍底色做出體積，再疊上偏左上的白色亮面；
// 海面上有一塊偏移的雲影。雲的形狀第一次畫時隨機產生並記在雲物件上
function cloudPuffs(c){if(!c.pf){const n=10+Math.floor(Math.random()*6);c.pf=Array.from({length:n},()=>{const dx=(Math.random()-.5)*2.4,dy=(Math.random()-.5)*.9;return[dx,dy,(.3+Math.random()*.35)*(1.15-Math.abs(dx)*.35)]}).sort((a,b)=>a[1]-b[1])}return c.pf}
function puff(g,x,y,r,inner,outer){const gr=g.createRadialGradient(x-r*.25,y-r*.3,r*.1,x,y,r);gr.addColorStop(0,inner);gr.addColorStop(.65,inner);gr.addColorStop(1,outer);g.fillStyle=gr;circ(g,x,y,r);g.fill()}
function cloudsAerial(g,w,h,cl,t,near){const m=Math.min(w,h);cl.forEach(c=>{const s=c.s*m*(near?.22:.085),x=((c.x+t*c.v)%1.3-.15)*w,y=c.y*h,pf=cloudPuffs(c);
 if(!near)pf.forEach(([dx,dy,r])=>puff(g,x+dx*s+s*.7,y+dy*s+s*1.0,r*s*1.1,'rgba(8,40,80,.07)','rgba(8,40,80,0)'));
 pf.forEach(([dx,dy,r])=>puff(g,x+dx*s+r*s*.12,y+dy*s+r*s*.18,r*s,'rgba(176,195,220,.9)','rgba(176,195,220,0)'));
 pf.forEach(([dx,dy,r])=>puff(g,x+dx*s-r*s*.1,y+dy*s-r*s*.12,r*s*.88,'rgba(255,255,255,.97)','rgba(240,246,252,0)'))})}
function cirrus(g,w,h,t){g.save();g.globalAlpha=.22;[[.15,.12,.5],[.55,.3,.4],[.25,.7,.45],[.7,.85,.35]].forEach(([fx,fy,len])=>{const x=((fx+t*.01)%1.2-.1)*w,y=fy*h;
 for(let k=0;k<5;k++){const gr=g.createLinearGradient(x-len*w/2,0,x+len*w/2,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.8)');gr.addColorStop(1,'rgba(255,255,255,0)');
  g.strokeStyle=gr;g.lineWidth=Math.max(1,h*.004);g.beginPath();g.moveTo(x-len*w/2,y+k*h*.008);g.quadraticCurveTo(x,y+k*h*.008-h*.02,x+len*w/2,y+k*h*.008+h*.01);g.stroke()}});g.restore()}
function mapScene(g,w,h,p,cl,t){g.fillStyle=lg(g,0,0,w,h,['#1f6fbf','#4aa8ea']);g.fillRect(0,0,w,h);
 g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=2;for(let y=h*.1;y<h;y+=h*.08){g.beginPath();for(let x=0;x<=w;x+=20)g.lineTo(x,y+Math.sin(x*.02+t/600+y)*4);g.stroke()}
 g.beginPath();g.moveTo(0,h*.05);g.quadraticCurveTo(w*.12,h*.12,w*.1,h*.32);g.quadraticCurveTo(w*.16,h*.45,0,h*.55);g.closePath();fs(g,'#7fbf6a',2);
 const bw=TW_BOX[2]-TW_BOX[0],bh=TW_BOX[3]-TW_BOX[1],k=Math.min(h*.74/bh,w*.4/bw),ox=w*.55-(TW_BOX[0]+bw/2)*k,oy=h*.5-(TW_BOX[1]+bh/2)*k;
 g.beginPath();TW_PTS.split(' ').forEach((pt,i)=>{const[a,b]=pt.split(',').map(Number);i?g.lineTo(ox+a*k,oy+b*k):g.moveTo(ox+a*k,oy+b*k)});g.closePath();fs(g,'#8bd36b',2.5);
 g.lineCap='round';g.lineJoin='round';const line=pts=>{g.beginPath();pts.split(' ').forEach((pt,i)=>{const[a,b]=pt.split(',').map(Number);i?g.lineTo(ox+a*k,oy+b*k):g.moveTo(ox+a*k,oy+b*k)})};
 Object.entries(TW_RANGES).forEach(([id,pts])=>{const big=id==='central';line(pts);g.strokeStyle='rgba(60,130,60,.55)';g.lineWidth=k*(big?7:4.5);g.stroke();line(pts);g.strokeStyle='rgba(122,106,62,.75)';g.lineWidth=k*(big?2:1.4);g.stroke()});
 TW_PEAKS.forEach(([id,a,b])=>{const px=ox+a*k,py=oy+b*k,r=k*(id==='yushan'?3.4:2.6);g.beginPath();g.moveTo(px-r,py+r*.7);g.lineTo(px,py-r*.9);g.lineTo(px+r,py+r*.7);g.closePath();fs(g,id==='yushan'?'#f4f1e8':'#8a7a4e',1.5)});
 const tx=ox+CITIES[0].x*k,ty=oy+CITIES[0].y*k,pr=(t/500)%1;circ(g,tx,ty,6+pr*20);g.strokeStyle=`rgba(255,91,74,${1-pr})`;g.lineWidth=3;g.stroke();circ(g,tx,ty,6);fs(g,'#ff5b4a',2);
 {const fz=Math.max(16,Math.min(26,w*.04));canvasRuby(g,'桃園',tx-fz*1.6,ty+fz*1.9,fz,'#ffffff','#1b2340')}
 cirrus(g,w,h,t/1000);cloudsAerial(g,w,h,cl.slice(0,7),t/1000,false);
 const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,P=t2=>{const a=[-w*.08,h*.82],c=[w*.35,h*.02],b=[tx,ty];const u=1-t2;return[u*u*a[0]+2*u*t2*c[0]+t2*t2*b[0],u*u*a[1]+2*u*t2*c[1]+t2*t2*b[1]]};
 g.setLineDash([8,8]);g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=3;g.beginPath();for(let q=0;q<=e;q+=.01){const[x,y]=P(q);q?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();g.setLineDash([]);
 const[x,y]=P(e),[x2,y2]=P(Math.min(1,e+.01));planeTop(g,x,y,Math.min(w,h)*.06*(1-.35*e),Math.atan2(y2-y,x2-x)||0);
 // 一開始飛機剛穿出雲層：近處的大片雲從鏡頭前散開，越接近臺灣越淡
 if(p<.4){g.save();g.globalAlpha=1-p/.4;cloudsAerial(g,w,h,cl.slice(7),.4+p*2,true);g.restore()}}
// 降落：沿下滑道直線進場（機頭微仰、起落架與襟翼放下、落地燈亮），接近地面時拉平（flare）減緩下沉，
// 主輪先著地冒出輪胎煙、擾流板升起，接著機頭放下讓鼻輪著地，最後減速滑行停下
function airportMountains(g,w,h,t){
  const layers=[{base:.62,color:'#a9c5c2',alpha:.72,seed:0},{base:.68,color:'#789b9b',alpha:.86,seed:1},{base:.73,color:'#4d6f73',alpha:.94,seed:2}];
  layers.forEach(layer=>{g.save();g.globalAlpha=layer.alpha;g.fillStyle=layer.color;g.beginPath();g.moveTo(0,h);const step=w/14;
    for(let x=0;x<=w+step;x+=step){const peak=h*(layer.base-.08-Math.abs(Math.sin(x*.0031+layer.seed*1.7+t*.00008))*.07);const shoulder=h*(layer.base-.01-Math.abs(Math.sin(x*.0062+layer.seed))*.035);g.lineTo(x-step*.24,shoulder);g.lineTo(x,peak);g.lineTo(x+step*.28,shoulder)}
    g.lineTo(w,h);g.closePath();g.fill();g.restore()});
  g.strokeStyle='rgba(235,247,242,.32)';g.lineWidth=Math.max(1,h*.006);g.beginPath();for(let x=0;x<=w;x+=w/18)g.lineTo(x,h*(.57-Math.abs(Math.sin(x*.003+t*.00006))*.045));g.stroke();
}
function landScene(g,w,h,p,cl,t){g.fillStyle=lg(g,0,0,0,h,['#7cc6ff','#cfeeff','#ffe9c7']);g.fillRect(0,0,w,h);
 circ(g,w*.82,h*.2,Math.min(w,h)*.07);g.fillStyle='#fff3b0';g.fill();cloudsDraw(g,w,h,cl,t/1000,.45);
 airportMountains(g,w,h,t);
 const gy=h*.72,ry=h*.82;g.fillStyle='#8bd36b';g.fillRect(0,gy,w,h-gy);
 // 現代航廈：整面玻璃帷幕加波浪形白色屋頂，旁邊是細長的錐形塔台
 const bx=w*.55,bw=Math.min(w*.42,520),bh=Math.min(h*.12,bw*.35);
 rr(g,bx-4,gy-6,bw+8,6,2);fs(g,'#c9ced6',2);
 rr(g,bx,gy-bh,bw,bh-6,3);fs(g,lg(g,0,gy-bh,0,gy,['#e6f5ff','#7fb2da','#3e78a8']),2);
 g.strokeStyle='rgba(235,242,250,.85)';g.lineWidth=2;for(let x=bx+bw/14;x<bx+bw;x+=bw/14){g.beginPath();g.moveTo(x,gy-bh);g.lineTo(x,gy-6);g.stroke()}
 g.beginPath();g.moveTo(bx,gy-bh*.45);g.lineTo(bx+bw,gy-bh*.45);g.stroke();
 g.fillStyle='rgba(255,255,255,.3)';[.12,.62].forEach(k=>{const x=bx+bw*k;g.beginPath();g.moveTo(x,gy-6);g.lineTo(x+bh*.5,gy-bh);g.lineTo(x+bh*.75,gy-bh);g.lineTo(x+bh*.25,gy-6);g.fill()});
 g.beginPath();g.moveTo(bx-bw*.06,gy-bh*.98);g.bezierCurveTo(bx+bw*.25,gy-bh*1.6,bx+bw*.6,gy-bh*1.05,bx+bw*1.06,gy-bh*1.42);
 g.lineTo(bx+bw*1.06,gy-bh*1.1);g.lineTo(bx+bw,gy-bh);g.lineTo(bx,gy-bh);g.lineTo(bx-bw*.06,gy-bh*.9);g.closePath();fs(g,lg(g,0,gy-bh*1.6,0,gy-bh,['#ffffff','#d6dde8']),2);
 g.fillStyle='rgba(255,211,90,.6)';g.fillRect(bx+4,gy-bh+2,bw-8,3);
 const tw=bx-w*.06,tb=bh*.42,tt=bh*.22,th=bh*2.4;g.beginPath();g.moveTo(tw-tb/2,gy);g.lineTo(tw-tt/2,gy-th);g.lineTo(tw+tt/2,gy-th);g.lineTo(tw+tb/2,gy);g.closePath();fs(g,lg(g,tw-tb/2,0,tw+tb/2,0,['#ffffff','#cfd6e2']),2);
 g.beginPath();g.moveTo(tw-bh*.22,gy-th);g.lineTo(tw-bh*.32,gy-th-bh*.32);g.lineTo(tw+bh*.32,gy-th-bh*.32);g.lineTo(tw+bh*.22,gy-th);g.closePath();fs(g,lg(g,0,gy-th-bh*.32,0,gy-th,['#5f8fb5','#2b4a66']),2);
 rr(g,tw-bh*.34,gy-th-bh*.42,bh*.68,bh*.1,3);fs(g,'#eef2f8',2);
 g.strokeStyle=OUT;g.lineWidth=2;g.beginPath();g.moveTo(tw,gy-th-bh*.42);g.lineTo(tw,gy-th-bh*.7);g.stroke();circ(g,tw,gy-th-bh*.72,3);g.fillStyle='#ff4a3a';g.fill();
 canvasRuby(g,'桃園機場',bx+bw/2,gy-bh*.6,Math.max(14,Math.min(26,bw*.07)),'#1b2340','#ffffff');
 g.fillStyle='#b9bfca';g.fillRect(bx-w*.04,gy,bw+w*.08,h*.025);
 [bx-w*.02,bx+bw*.3,bx+bw*.65,bx+bw+w*.02].forEach(x=>drawEuroLamp(g,x,gy+h*.02,h*.12));
 const thr=w*.12,rt=ry-h*.03,rb=ry+h*.04;g.fillStyle='#5b6178';g.fillRect(thr-w*.01,rt,w,rb-rt);
 g.fillStyle='#ffffff';for(let k=0;k<5;k++)g.fillRect(thr,rt+h*.008+k*h*.012,w*.045,h*.005);
 g.save();g.translate(thr+w*.075,ry+h*.012);g.scale(1,.5);g.font=`900 ${h*.05}px sans-serif`;g.textAlign='center';g.fillText('05',0,0);g.restore();
 [[.3,.05],[.44,.025],[.56,.025],[.68,.025]].forEach(([fx,fw])=>{g.fillRect(w*fx,rt+h*.01,w*fw,h*.008);g.fillRect(w*fx,rb-h*.018,w*fw,h*.008)});
 for(let x=thr+w*.13;x<w;x+=60)g.fillRect(x,ry+h*.002,30,h*.006);
 for(let x=thr+20;x<w;x+=40)[rt,rb].forEach(yy=>{circ(g,x,yy,2.5);g.fillStyle='#fffbe6';g.fill()});
 for(let k=0;k<4;k++){circ(g,thr-w*.004,rt+h*.012+k*h*.016,2.5);g.fillStyle='#3ad17a';g.fill()}
 const nA=8,rab=Math.floor(t/70)%nA;for(let k=0;k<nA;k++){const x=thr-w*.02-(nA-1-k)*w*.013;g.fillStyle='#6b7280';g.fillRect(x-1,ry-h*.005,2,h*.02);circ(g,x,ry-h*.007,k===rab?4.5:2.5);g.fillStyle=k===rab?'#ffffff':'#fff1b8';g.fill()}
 [0,1,2,3].forEach(k=>{const x=w*.27+k*w*.012;rr(g,x,rb+h*.012,w*.009,h*.012,2);fs(g,'#2b2e35',1);circ(g,x+w*.0045,rb+h*.018,2.5);g.fillStyle=k<2?'#ff4a3a':'#ffffff';g.fill()});
 const s=Math.min(w*.14,h*.1),A=.5,x0=-w*.3,TX=w*.32,H=h*.32,f=.85,af=H*.0811,ground=ry+h*.01;
 let cx,alt=0,pitch;
 if(p<A){const u=p/A;cx=x0+(TX-x0)*u;
  if(u<f){alt=af+(H-af)*(1-u/f);pitch=-.05}else{const v=(u-f)/(1-f);alt=af*(-.2*v*v*v+1.2*v*v-2*v+1);pitch=-.05-.07*v}}
 else{const q=Math.min(1,(p-A)/(.9-A)),D=(TX-x0)/A*(.9-A)/2,d=Math.min(1,(p-A)/.1);cx=TX+D*(1-(1-q)*(1-q));pitch=-.12*(1-d*d*(3-2*d))}
 const cy=ground-alt;
 if(alt>0){const a=alt/H;ell(g,cx-s*.1,ground,s*1.5*(1-a*.3),s*.08,0);g.fillStyle=`rgba(30,40,30,${.28*(1-a)})`;g.fill()}
 const c=Math.cos(pitch),sn=Math.sin(pitch),gx=PLANE_GEAR[0]*s,gyo=PLANE_GEAR[1]*s;
 planeSide(g,cx-(gx*c-gyo*sn),cy-(gx*sn+gyo*c),s,pitch,true,p>A&&p<.88);
 if(p>=A&&p<A+.16){const k=(p-A)/.16;[0,1,2,3].forEach(i=>{g.fillStyle=`rgba(240,240,240,${(1-k)*.85})`;ell(g,cx-s*(.15+k*(.5+i*.4)),ground-s*(.08+k*.14),s*(.18+k*.35)*(1+i*.25),s*(.1+k*.14),0);g.fill()})}
 if(p>.9){const q=(p-.9)/.1;const px=cx+s*1.95+q*s*1.6;drawChar(g,px,ry+s*.05,s*.75,playerLook(),'right',Math.floor(t/150)%2?1:-1)}}
export function flight(done){const ov=document.createElement('div');ov.className='fly';
 ov.innerHTML=`<canvas></canvas><div class="card flycap" id="flyCap"></div><button class="hbtn" id="flySkip">${Z('skip')} <span class="tl" style="display:inline">${T('skip')}</span></button>`;document.body.appendChild(ov);
 const c=ov.querySelector('canvas'),t0=performance.now(),DUR=10800,M=3800;let end=false,cs=-1;
 const cl=Array.from({length:10},()=>({x:Math.random(),y:Math.random(),s:.5+Math.random(),v:.03+Math.random()*.05}));
 const finish=()=>{if(end)return;end=true;ov.style.opacity=0;setTimeout(()=>{ov.remove();done()},450)};
 ov.querySelector('#flySkip').onclick=finish;ov.querySelector('#flySkip').focus();
 const caps=[['從國外飛往臺灣……',"Flying to Taiwan from abroad…","海外から台湾へ向かっています……"],['歡迎來到桃園國際機場！',"Welcome to Taoyuan International Airport!","桃園国際空港へようこそ！"]];
 const frame=now=>{if(end)return;const t=Math.max(0,now-t0),w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);
  renderPixel(c,w,h,d,4,g=>{if(t<M)mapScene(g,w,h,t/M,cl,t);else landScene(g,w,h,Math.min(1,(t-M)/(DUR-M-600)),cl,t)});
  const st=t<M?0:1;if(st!==cs){cs=st;$('#flyCap').innerHTML=`${rb(caps[st][0])}<span class="tl">${esc(caps[st][LI()])}</span>`}
  if(t>=DUR)return finish();requestAnimationFrame(frame)};requestAnimationFrame(frame)}
// 跑車版小黃（側視）：參考後置引擎雙門跑車的比例——車長約為車高 3.7 倍、前後懸短、輪子靠近四角並填滿輪拱，
// 低矮的引擎蓋從前葉子板隆起，斜背車頂一路順到鴨尾，車窗位在兩輪之間；車頂保留 TAXI 燈箱和小黃的方格條
function taxiDraw(g,x,y,s,t){const lw=Math.max(1.5,s*.01),bob=Math.sin(t/90)*s*.003,W=[-.3,.3],R=.078,A=.09,B=-.026;g.save();g.translate(x,y);
 const sh=g.createRadialGradient(0,0,s*.05,0,0,s*.58);sh.addColorStop(0,'rgba(0,0,0,.42)');sh.addColorStop(1,'rgba(0,0,0,0)');g.save();g.scale(1,.08);g.fillStyle=sh;circ(g,0,0,s*.58);g.fill();g.restore();
 g.translate(0,bob);
 g.save();g.beginPath();g.rect(-s,-s,2*s,s+B*s);g.clip();W.forEach(wx=>{circ(g,wx*s,-R*s,A*s);g.fillStyle='#14161a';g.fill()});g.restore();
 const body=()=>{g.beginPath();g.moveTo(s*.5,B*s);g.quadraticCurveTo(s*.528,B*s,s*.53,-s*.06);g.lineTo(s*.532,-s*.1);g.quadraticCurveTo(s*.53,-s*.13,s*.5,-s*.14);
  g.quadraticCurveTo(s*.41,-s*.16,s*.33,-s*.205);g.quadraticCurveTo(s*.26,-s*.2,s*.18,-s*.202);
  g.quadraticCurveTo(s*.08,-s*.245,s*.0,-s*.274);g.quadraticCurveTo(-s*.09,-s*.292,-s*.17,-s*.275);
  g.bezierCurveTo(-s*.3,-s*.25,-s*.4,-s*.2,-s*.48,-s*.178);g.lineTo(-s*.525,-s*.182);g.lineTo(-s*.528,-s*.165);
  g.quadraticCurveTo(-s*.535,-s*.1,-s*.52,-s*.05);g.quadraticCurveTo(-s*.515,B*s,-s*.49,B*s);
 const a=Math.asin((R+B)/A),ax=Math.cos(a)*A;W.forEach(wx=>{g.lineTo((wx-ax)*s,B*s);g.arc(wx*s,-R*s,A*s,Math.PI-a,a,false)});g.lineTo(s*.5,B*s);g.closePath()};
 body();fs(g,lg(g,0,-s*.29,0,B*s,['#fff47e','#ffd61f','#f6b900','#c48500']),lw);
 g.save();body();g.clip();
 g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(s*.5,-s*.132);g.quadraticCurveTo(s*.41,-s*.152,s*.33,-s*.193);g.quadraticCurveTo(s*.1,-s*.2,-s*.2,-s*.212);g.quadraticCurveTo(-s*.4,-s*.185,-s*.5,-s*.168);g.lineTo(-s*.5,-s*.156);g.quadraticCurveTo(-s*.4,-s*.173,-s*.2,-s*.2);g.quadraticCurveTo(s*.1,-s*.188,s*.33,-s*.181);g.quadraticCurveTo(s*.41,-s*.14,s*.5,-s*.12);g.fill();
 g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(-s*.02,-s*.27);g.quadraticCurveTo(-s*.09,-s*.288,-s*.17,-s*.272);g.bezierCurveTo(-s*.3,-s*.245,-s*.4,-s*.196,-s*.48,-s*.175);g.lineTo(-s*.48,-s*.168);g.bezierCurveTo(-s*.4,-s*.19,-s*.3,-s*.238,-s*.17,-s*.264);g.fill();
 g.fillStyle='rgba(110,60,0,.28)';g.fillRect(-s*.6,-s*.07,s*1.2,s*.06);
 g.fillStyle='#1d2026';g.fillRect(-s*.6,-s*.042,s*1.2,s*.02);
 for(let k=0;k<12;k++){g.fillStyle=k%2?'#ffffff':'#1d2026';g.fillRect(-s*.18+k*s*.03,-s*.1,s*.03,s*.014);g.fillStyle=k%2?'#1d2026':'#ffffff';g.fillRect(-s*.18+k*s*.03,-s*.086,s*.03,s*.014)}
 g.restore();
 const glass=()=>{g.beginPath();g.moveTo(s*.14,-s*.208);g.quadraticCurveTo(s*.06,-s*.24,s*.0,-s*.26);g.quadraticCurveTo(-s*.09,-s*.28,-s*.17,-s*.264);g.quadraticCurveTo(-s*.26,-s*.242,-s*.31,-s*.214);g.quadraticCurveTo(-s*.1,-s*.212,s*.14,-s*.208);g.closePath()};
 glass();fs(g,lg(g,0,-s*.28,0,-s*.18,['#3c4c5e','#18202b']),lw*.8);
 g.save();glass();g.clip();
 circ(g,-s*.03,-s*.232,s*.026);fs(g,'#ffd9b8',lw*.5);g.fillStyle='#20201f';g.beginPath();g.arc(-s*.03,-s*.241,s*.028,Math.PI,0);g.fill();
 circ(g,-s*.15,-s*.232,s*.026);fs(g,'#ffd9b8',lw*.5);g.beginPath();g.arc(-s*.15,-s*.242,s*.03,Math.PI,0);g.closePath();fs(g,'#ff5b4a',lw*.4);
 g.fillStyle='rgba(195,228,255,.35)';g.beginPath();g.moveTo(-s*.27,-s*.212);g.lineTo(-s*.18,-s*.27);g.lineTo(-s*.13,-s*.27);g.lineTo(-s*.21,-s*.212);g.fill();g.beginPath();g.moveTo(s*.03,-s*.21);g.lineTo(s*.07,-s*.245);g.lineTo(s*.1,-s*.23);g.lineTo(s*.07,-s*.209);g.fill();
 g.restore();
 g.strokeStyle='#1d2026';g.lineWidth=s*.014;g.beginPath();g.moveTo(-s*.205,-s*.212);g.lineTo(-s*.185,-s*.267);g.stroke();
 g.strokeStyle='rgba(110,60,0,.5)';g.lineWidth=Math.max(1,s*.005);g.beginPath();g.moveTo(s*.145,-s*.2);g.quadraticCurveTo(s*.15,-s*.11,s*.13,-s*.045);g.moveTo(-s*.215,-s*.207);g.quadraticCurveTo(-s*.225,-s*.1,-s*.205,-s*.045);g.stroke();
 rr(g,-s*.17,-s*.19,s*.045,s*.01,s*.005);fs(g,lg(g,0,-s*.19,0,-s*.18,['#fff8d0','#b38a10']),lw*.4);
 g.beginPath();g.moveTo(s*.11,-s*.215);g.quadraticCurveTo(s*.14,-s*.235,s*.165,-s*.225);g.lineTo(s*.16,-s*.208);g.lineTo(s*.12,-s*.205);g.closePath();fs(g,'#f2c200',lw*.6);
 ell(g,s*.47,-s*.143,s*.036,s*.011);fs(g,lg(g,s*.39,0,s*.48,0,['#dfe8f0','#ffffff']),lw*.6);
 {const bm=g.createLinearGradient(s*.52,0,s*.9,0);bm.addColorStop(0,'rgba(255,248,200,.45)');bm.addColorStop(1,'rgba(255,248,200,0)');g.fillStyle=bm;g.beginPath();g.moveTo(s*.53,-s*.12);g.lineTo(s*.9,-s*.17);g.lineTo(s*.9,-s*.04);g.lineTo(s*.53,-s*.1);g.fill()}
 g.beginPath();g.moveTo(-s*.527,-s*.163);g.lineTo(-s*.47,-s*.17);g.lineTo(-s*.472,-s*.155);g.lineTo(-s*.53,-s*.148);g.closePath();fs(g,lg(g,0,-s*.17,0,-s*.148,['#ff6b5a','#a8201a']),lw*.6);
 rr(g,-s*.505,-s*.05,s*.03,s*.018,s*.009);fs(g,lg(g,0,-s*.05,0,-s*.032,['#e3e7ee','#6c7480']),lw*.4);
 g.beginPath();g.moveTo(-s*.15,-s*.275);g.lineTo(-s*.14,-s*.312);g.lineTo(-s*.03,-s*.312);g.lineTo(-s*.02,-s*.282);g.closePath();fs(g,lg(g,0,-s*.312,0,-s*.278,['#ffffff','#e3e8ef']),lw*.7);
 g.fillStyle='#1b2340';g.font=`900 ${s*.026}px sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText('TAXI',-s*.085,-s*.294);
 W.forEach(wx=>{const cx=wx*s,cy=-R*s;circ(g,cx,cy,R*s);fs(g,'#1b1d22',lw);circ(g,cx,cy,R*s*.9);g.strokeStyle='#2c2f36';g.lineWidth=s*.006;g.stroke();
  circ(g,cx,cy,R*s*.72);fs(g,lg(g,cx,cy-R*s*.72,cx,cy+R*s*.72,['#eef1f5','#aab2be','#6c7480']),lw*.5);
  circ(g,cx,cy,R*s*.6);g.fillStyle='#2a2d33';g.fill();
  g.fillStyle='#d92b23';rr(g,cx+R*s*.18,cy-R*s*.42,R*s*.2,R*s*.45,R*s*.08);g.fill();
  g.save();g.translate(cx,cy);g.rotate(t/60);for(let k=0;k<5;k++){g.rotate(Math.PI*2/5);g.beginPath();g.moveTo(-R*s*.08,R*s*.1);g.lineTo(-R*s*.1,R*s*.62);g.lineTo(R*s*.1,R*s*.62);g.lineTo(R*s*.08,R*s*.1);g.closePath();fs(g,lg(g,0,0,0,R*s*.62,['#f4f6f9','#a9b1bd']),Math.max(1,lw*.4))}g.restore();
  circ(g,cx,cy,R*s*.15);fs(g,'#c9ced6',lw*.5)});
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=lw*1.2;g.lineCap='round';[0,1,2].forEach(k=>{const yy=-s*(.07+k*.065),ll=s*(.16+((t/50+k*7)%10)*.015);g.beginPath();g.moveTo(-s*.6,yy);g.lineTo(-s*.6-ll,yy);g.stroke()});
 g.restore()}
// 街景建築：每一棟依編號決定類型、寬度、高度和顏色，捲過去的時候不會每棟都一樣。
// 五種類型：有鐵窗、冷氣機和頂樓水塔的老公寓；玻璃帷幕辦公大樓；一樓有騎樓和直式招牌的街屋；
// 紅磚透天厝；有一層層陽台的新式住宅大樓。右側面和屋頂各畫一個斜面，看起來有立體感
const bgRand=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v)};
// 相鄰兩棟不會是同一種類型
const bgTypes=new Map(),bgType=i=>{if(i<=-2)return 0;if(!bgTypes.has(i))bgTypes.set(i,(bgType(i-1)+1+Math.floor(bgRand(i,1)*4))%5);return bgTypes.get(i)};
function bgBuilding(g,x,gy,BW,h,i){const R=k=>bgRand(i,k),type=bgType(i),bw=BW*(.74+R(2)*.2),fh=h*.042,lw=1.5,d=bw*.09;
 const H={0:4+Math.floor(R(3)*3),1:9+Math.floor(R(3)*4),2:3+Math.floor(R(3)*2),3:3+Math.floor(R(3)*2),4:7+Math.floor(R(3)*4)}[type],bh=H*fh+h*.02,top=gy-bh;
 const wall=[['#e8e1d3','#cfc6b4'],['#9cc3e0','#4f7aa3'],['#f2d7b8','#d8b48c'],['#b8664a','#8e4a33'],['#eef0f2','#c9ced6']][type];
 const pal=type===0?[['#e8e1d3','#cfc6b4'],['#d5dde3','#b3bec8'],['#ece0c8','#d2c09e']][Math.floor(R(4)*3)]:type===2?[['#f2d7b8','#d8b48c'],['#f6e3e0','#d9b8b2'],['#e3ecd8','#bfcfae']][Math.floor(R(4)*3)]:wall;
 g.beginPath();g.moveTo(x+bw,gy);g.lineTo(x+bw+d,gy-d*.6);g.lineTo(x+bw+d,top-d*.6);g.lineTo(x+bw,top);g.closePath();fs(g,pal[1],lw);
 g.beginPath();g.moveTo(x,top);g.lineTo(x+d,top-d*.6);g.lineTo(x+bw+d,top-d*.6);g.lineTo(x+bw,top);g.closePath();fs(g,type===1?'#c9dff0':'#9aa4b0',lw);
 g.fillStyle=lg(g,x,0,x+bw,0,[pal[0],pal[1]]);g.fillRect(x,top,bw,bh);g.strokeStyle=OUT;g.lineWidth=lw;g.strokeRect(x,top,bw,bh);
 const glassW=(wx,wy,ww,wh)=>{g.fillStyle=lg(g,0,wy,0,wy+wh,['#cfe6f5','#6f9cc4']);g.fillRect(wx,wy,ww,wh);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(wx+ww*.15,wy+wh*.1,ww*.12,wh*.6)};
 if(type===0){for(let f=1;f<H;f++){const y=gy-(f+1)*fh;for(let c=0;c<3;c++){const wx=x+bw*(.08+c*.31),ww=bw*.24,wh=fh*.6;glassW(wx,y+fh*.2,ww,wh);
    g.strokeStyle='#4d5560';g.lineWidth=1;g.strokeRect(wx-1,y+fh*.15,ww+2,wh+fh*.1);for(let k=1;k<4;k++){g.beginPath();g.moveTo(wx+ww*k/4,y+fh*.15);g.lineTo(wx+ww*k/4,y+fh*.85);g.stroke()}
    if(bgRand(i*7+f,c)>.55){g.fillStyle='#f4f4f2';g.fillRect(wx+ww*.15,y+fh*.82,ww*.7,fh*.22);g.fillStyle='#9aa4b0';g.fillRect(wx+ww*.2,y+fh*.87,ww*.6,fh*.04)}}}
  g.fillStyle='#8a9099';g.fillRect(x+bw*.06,gy-fh*.85,bw*.88,fh*.85);g.strokeStyle='rgba(40,45,55,.35)';g.lineWidth=1;for(let y=gy-fh*.8;y<gy;y+=fh*.12){g.beginPath();g.moveTo(x+bw*.06,y);g.lineTo(x+bw*.94,y);g.stroke()}
  const tx=x+bw*(.55+R(5)*.15),tw=bw*.22;[tx+tw*.15,tx+tw*.85].forEach(lx=>{g.fillStyle='#4d5560';g.fillRect(lx-1,top-fh*.35,2,fh*.35)});rr(g,tx,top-fh*1.15,tw,fh*.85,tw*.3);fs(g,lg(g,tx,0,tx+tw,0,['#f4f6f8','#aeb6c0']),lw);
  if(R(6)>.5){g.fillStyle='#4f7fb5';g.beginPath();g.moveTo(x+bw*.05,top);g.lineTo(x+bw*.08,top-fh*.7);g.lineTo(x+bw*.45,top-fh*.7);g.lineTo(x+bw*.48,top);g.fill();g.strokeStyle=OUT;g.stroke()}}
 if(type===1){g.fillStyle=lg(g,x,top,x+bw,gy,['#d6ebf8','#7fa9cf','#3f668e']);g.fillRect(x+lw,top+lw,bw-2*lw,bh-2*lw);
  g.strokeStyle='rgba(235,242,250,.7)';g.lineWidth=1;for(let y=top+fh;y<gy;y+=fh){g.beginPath();g.moveTo(x,y);g.lineTo(x+bw,y);g.stroke()}for(let c=1;c<5;c++){g.beginPath();g.moveTo(x+bw*c/5,top);g.lineTo(x+bw*c/5,gy);g.stroke()}
  g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.moveTo(x+bw*.1,gy);g.lineTo(x+bw*.55,top);g.lineTo(x+bw*.75,top);g.lineTo(x+bw*.3,gy);g.fill();
  rr(g,x+bw*.3,top-fh*.9,bw*.4,fh*.9,2);fs(g,'#5f7f9e',lw);g.fillStyle='#ff4a3a';circ(g,x+bw*.5,top-fh*1.3,2.5);g.fill();g.strokeStyle=OUT;g.beginPath();g.moveTo(x+bw*.5,top-fh*.9);g.lineTo(x+bw*.5,top-fh*1.25);g.stroke()}
 if(type===2){for(let f=1;f<H;f++){const y=gy-(f+1)*fh-fh*.3;for(let c=0;c<2;c++){const wx=x+bw*(.12+c*.46),ww=bw*.3;glassW(wx,y+fh*.15,ww,fh*.6);g.strokeStyle='#5c4a3a';g.lineWidth=1;g.strokeRect(wx,y+fh*.15,ww,fh*.6)}
   g.strokeStyle='#5c4a3a';g.beginPath();g.moveTo(x,y+fh*.95);g.lineTo(x+bw,y+fh*.95);g.stroke()}
  const ah=fh*1.3;g.fillStyle='#3a3230';g.fillRect(x,gy-ah,bw,ah);g.fillStyle=lg(g,0,gy-ah,0,gy,['#ffe2a8','#e0a85a']);g.fillRect(x+bw*.04,gy-ah*.85,bw*.92,ah*.85);
  [0,.47,.94].forEach(k=>{g.fillStyle=pal[0];g.fillRect(x+bw*k-(k?bw*.06:0)+(k===.94?0:0),gy-ah,bw*.06,ah);g.strokeStyle=OUT;g.strokeRect(x+bw*k-(k?bw*.06:0),gy-ah,bw*.06,ah)});
  const SC=['#c8372d','#1f8a4c','#1d4f91','#d9772b','#7a5cc4','#e2366f'];[[.08,SC[Math.floor(R(11)*6)]],[.62,SC[Math.floor(R(12)*6)]]].slice(0,R(13)>.35?2:1).forEach(([k,col],n)=>{const sx=x+bw*k,sh=fh*(1.6+R(7+n));rr(g,sx,gy-ah-sh-fh*.2,bw*.15,sh,2);fs(g,col,lw);g.fillStyle='#fff6d6';for(let q=0;q<3;q++)g.fillRect(sx+bw*.04,gy-ah-sh-fh*.05+q*sh*.3,bw*.07,sh*.18)})}
 if(type===3){g.strokeStyle='rgba(70,30,20,.25)';g.lineWidth=1;for(let y=top+fh*.25;y<gy;y+=fh*.25){g.beginPath();g.moveTo(x,y);g.lineTo(x+bw,y);g.stroke()}
  for(let f=0;f<H;f++){const y=gy-(f+1)*fh;if(f===0){rr(g,x+bw*.35,y+fh*.15,bw*.3,fh*.85,2);fs(g,'#6b4a33',lw);continue}
   [.12,.6].forEach(k=>{const wx=x+bw*k,ww=bw*.28;g.fillStyle='#f4f1ea';g.fillRect(wx-2,y+fh*.1,ww+4,fh*.72);glassW(wx,y+fh*.16,ww,fh*.6)});
   g.fillStyle='#d9d4cc';g.fillRect(x-2,y+fh*.82,bw+4,fh*.08);g.strokeStyle='#4d5560';g.lineWidth=1;for(let k=0;k<=8;k++){g.beginPath();g.moveTo(x+bw*k/8,y+fh*.82);g.lineTo(x+bw*k/8,y+fh*.6);g.stroke()}
   g.beginPath();g.moveTo(x,y+fh*.6);g.lineTo(x+bw,y+fh*.6);g.stroke();if(bgRand(i+f,3)>.4)[.2,.75].forEach(k=>{circ(g,x+bw*k,y+fh*.6,fh*.16);g.fillStyle='#4fae54';g.fill()})}
  g.beginPath();g.moveTo(x-bw*.04,top);g.lineTo(x+bw*.5,top-fh*1.1);g.lineTo(x+bw*1.04,top);g.closePath();fs(g,'#7a4a33',lw)}
 if(type===4){for(let f=0;f<H;f++){const y=gy-(f+1)*fh;glassW(x+bw*.08,y+fh*.12,bw*.84,fh*.62);g.fillStyle='#3d4a58';for(let c=1;c<4;c++)g.fillRect(x+bw*(.08+c*.21),y+fh*.12,1.5,fh*.62);
   if(f>0){g.fillStyle='#f6f7f8';g.fillRect(x-bw*.03,y+fh*.74,bw*1.06,fh*.12);g.strokeStyle=OUT;g.lineWidth=1;g.strokeRect(x-bw*.03,y+fh*.74,bw*1.06,fh*.12);g.fillStyle='rgba(200,230,250,.45)';g.fillRect(x-bw*.03,y+fh*.5,bw*1.06,fh*.24)}
   if(f>0&&bgRand(i+f,4)>.6){circ(g,x+bw*(.15+bgRand(i,f)*.7),y+fh*.62,fh*.14);g.fillStyle='#4fae54';g.fill()}}
  g.fillStyle='#c9ced6';g.fillRect(x+bw*.1,top-fh*.5,bw*.8,fh*.5);g.strokeStyle=OUT;g.strokeRect(x+bw*.1,top-fh*.5,bw*.8,fh*.5)}
}
function taxiScene(g,w,h,p,t,city){g.fillStyle=lg(g,0,0,0,h,['#86c8ff','#dff3ff']);g.fillRect(0,0,w,h);circ(g,w*.85,h*.16,Math.min(w,h)*.06);g.fillStyle='#fff3b0';g.fill();
 const gy=h*.66;g.fillStyle='#a9d9a0';g.beginPath();g.moveTo(0,gy);for(let x=0;x<=w+40;x+=40){const X=x-((t*.03)%40);g.lineTo(X,gy-h*.18-Math.abs(Math.sin((X+t*.03)*.004))*h*.12)}g.lineTo(w,gy);g.fill();
 // 遠景：淡藍色的城市天際線，捲動得比較慢（視差）
 {const DW=Math.max(40,w*.07),o=t*.06,j0=Math.floor(o/DW)-1;g.fillStyle='#c4d3e2';
  for(let j=j0;j<j0+Math.ceil(w/DW)+2;j++){const x=j*DW-o,v=bgRand(j,9),bh=h*(.16+v*.22);g.fillRect(x,gy-bh,DW*.86,bh);
   g.fillStyle='#d7e2ec';for(let y=gy-bh+h*.02;y<gy-h*.02;y+=h*.035)g.fillRect(x+DW*.15,y,DW*.56,h*.008);g.fillStyle='#c4d3e2';
   if(v>.75){g.fillRect(x+DW*.38,gy-bh-h*.05,DW*.1,h*.05)}}}
 // 近景：各式各樣的臺灣街屋
 const BW=Math.max(80,w*.13),off=t*.18,i0=Math.floor(off/BW)-1;
 for(let i=i0;i<i0+Math.ceil(w/BW)+3;i++)bgBuilding(g,i*BW-off,gy,BW,h,i);
 g.fillStyle='#d6d0c4';g.fillRect(0,gy,w,h*.04);g.fillStyle='#5b6178';g.fillRect(0,gy+h*.04,w,h*.2);g.fillStyle='#8bd36b';g.fillRect(0,gy+h*.24,w,h);
 g.fillStyle='#fff';const o2=(t*.5)%80;for(let x=-o2;x<w;x+=80)g.fillRect(x,gy+h*.135,40,h*.008);
 const o3=(t*.5)%260;for(let x=-o3;x<w+260;x+=260)drawEuroLamp(g,x,gy,h*.18);
 if(p>.3&&p<.85){const q=(p-.3)/.55,sx=w*1.05-q*(w*1.5),sw=Math.min(w*.4,260),sh=sw*.42;g.fillStyle='#3d4766';g.fillRect(sx+sw*.15,gy-h*.05-sh-h*.05,5,sh+h*.1);g.fillRect(sx+sw*.8,gy-h*.05-sh-h*.05,5,sh+h*.1);
  rr(g,sx,gy-h*.05-sh-h*.12,sw,sh,8);fs(g,'#1f8a4c',2.5);canvasRuby(g,city.zh,sx+sw*.42,gy-h*.17-sh*.25,Math.min(sh*.34,30),'#ffffff');
  g.fillStyle='#fff';g.font=`900 ${sh*.3}px sans-serif`;g.textAlign='center';g.fillText('→',sx+sw*.85,gy-h*.17-sh*.25)}
 const s=Math.min(w*.42,h*.42);taxiDraw(g,w*.45,gy+h*.16,s,t)}
function skyScene(g,w,h,p,t,cl){g.fillStyle=lg(g,0,0,0,h,['#6fb8ff','#d8f0ff']);g.fillRect(0,0,w,h);cloudsDraw(g,w,h,cl,t/600,1);
 g.fillStyle='#2f86d6';g.fillRect(0,h*.82,w,h*.18);const s=Math.min(w*.18,h*.12);planeSide(g,w*.45,h*.42+Math.sin(t/400)*h*.02,s,-.03,false)}
export function travelAnim(ci,done){const city=CITIES[ci],island=!!city.island;const ov=document.createElement('div');ov.className='fly';
 ov.innerHTML=`<canvas></canvas><div class="card flycap" id="flyCap"></div><button class="hbtn" id="flySkip">${Z('skip')} <span class="tl" style="display:inline">${T('skip')}</span></button>`;document.body.appendChild(ov);
 const cap=island?[`先搭計程車，再坐${city.id==='penghu'?'船':'飛機'}前往${city.zh}……`,`Taxi, then ${city.id==='penghu'?'a ferry':'a flight'} to ${city.en}…`,`タクシーと${city.id==='penghu'?'フェリー':'飛行機'}で${city.ja}へ……`]:[`搭計程車前往${city.zh}……`,`Taking a taxi to ${city.en}…`,`タクシーで${city.ja}へ……`];
 $('#flyCap').innerHTML=`${rb(cap[0])}<span class="tl">${esc(cap[LI()])}</span>`;
 const c=ov.querySelector('canvas'),t0=performance.now(),DUR=6200;let end=false;const cl=Array.from({length:10},()=>({x:Math.random(),y:Math.random()*.7,s:.5+Math.random(),v:.03+Math.random()*.05}));
 const finish=()=>{if(end)return;end=true;ov.style.opacity=0;setTimeout(()=>{ov.remove();done()},450)};ov.querySelector('#flySkip').onclick=finish;ov.querySelector('#flySkip').focus();
 const frame=now=>{if(end)return;const t=Math.max(0,now-t0),w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);
  const p=Math.min(1,t/DUR);
  renderPixel(c,w,h,d,4,g=>{if(island&&p>.5)skyScene(g,w,h,p,t,cl);else taxiScene(g,w,h,island?p*2*.7:p,t,city);
   g.fillStyle='#ffffff';g.fillRect(w*.2,h-30,w*.6,12);g.fillStyle='#1b2340';g.fillRect(w*.2,h-30,w*.6*p,12)});
  if(t>=DUR)return finish();requestAnimationFrame(frame)};requestAnimationFrame(frame)}
