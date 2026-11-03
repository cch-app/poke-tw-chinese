// ===== 過場動畫：開場飛機、搭計程車 =====
import { OUT, canvasRuby, circ, drawChar, ell, fs, lg, rr } from '../art.js';
import { $, esc } from '../core/util.js';
import { CITIES, TW_PTS } from '../data/index.js';
import { LI, T, Z, rb } from '../i18n.js';
import { playerLook } from '../world/looks.js';
import { renderPixel } from '../render/pixel.js';

function planeTop(g,x,y,s,ang){g.save();g.translate(x,y);g.rotate(ang);const lw=Math.max(1.5,s*.05);
 g.save();g.translate(s*.25,s*.45);g.globalAlpha=.25;g.fillStyle='#0b2a4a';ell(g,0,0,s*1,s*.2);g.fill();g.beginPath();g.moveTo(-s*.1,0);g.lineTo(-s*.5,-s*.9);g.lineTo(-s*.25,-s*.9);g.lineTo(s*.3,0);g.lineTo(-s*.25,s*.9);g.lineTo(-s*.5,s*.9);g.closePath();g.fill();g.restore();
 g.beginPath();g.moveTo(-s*.1,0);g.lineTo(-s*.5,-s*.9);g.lineTo(-s*.25,-s*.9);g.lineTo(s*.3,0);g.lineTo(-s*.25,s*.9);g.lineTo(-s*.5,s*.9);g.closePath();fs(g,'#dfe6f2',lw);
 g.beginPath();g.moveTo(-s*.75,0);g.lineTo(-s*.95,-s*.35);g.lineTo(-s*.82,-s*.35);g.lineTo(-s*.6,0);g.lineTo(-s*.82,s*.35);g.lineTo(-s*.95,s*.35);g.closePath();fs(g,'#ff5b4a',lw);
 ell(g,0,0,s,s*.17);fs(g,'#ffffff',lw);ell(g,s*.72,0,s*.12,s*.08);g.fillStyle='#1b2340';g.fill();
 [[-.2,-.55],[-.2,.55]].forEach(([a,b])=>{ell(g,a*s,b*s,s*.13,s*.06);fs(g,'#9aa4b8',lw*.8)});g.restore()}
function planeSide(g,x,y,s,pitch,gear){g.save();g.translate(x,y);g.rotate(pitch);const lw=Math.max(1.5,s*.04);
 g.beginPath();g.moveTo(-s*1.25,-s*.1);g.lineTo(-s*1.55,-s*.75);g.lineTo(-s*1.25,-s*.75);g.lineTo(-s*.85,-s*.12);g.closePath();fs(g,'#ff5b4a',lw);
 if(gear){[[-.35],[.75]].forEach(([a])=>{g.strokeStyle=OUT;g.lineWidth=lw;g.beginPath();g.moveTo(a*s,s*.15);g.lineTo(a*s,s*.36);g.stroke();circ(g,a*s,s*.38,s*.08);fs(g,'#2b2d47',lw*.7)})}
 rr(g,-s*1.5,-s*.22,s*3,s*.44,s*.22);fs(g,lg(g,0,-s*.22,0,s*.22,['#ffffff','#dfe6f2']),lw);
 g.fillStyle='#ff5b4a';g.fillRect(-s*1.3,s*.04,s*2.6,s*.06);
 g.fillStyle='#5aa9ff';for(let k=0;k<11;k++){circ(g,-s*.95+k*s*.19,-s*.06,s*.045);g.fill()}
 g.beginPath();g.moveTo(s*1.18,-s*.16);g.quadraticCurveTo(s*1.42,-s*.14,s*1.46,-s*.02);g.lineTo(s*1.2,-s*.02);g.closePath();fs(g,'#1b2340',lw*.6);
 g.beginPath();g.moveTo(-s*.35,s*.05);g.lineTo(s*.35,s*.05);g.lineTo(-s*.15,s*.32);g.lineTo(-s*.55,s*.32);g.closePath();fs(g,'#c7cfdf',lw);
 ell(g,s*.0,s*.3,s*.28,s*.1);fs(g,'#9aa4b8',lw);
 g.beginPath();g.moveTo(-s*1.2,-s*.02);g.lineTo(-s*1.6,-s*.08);g.lineTo(-s*1.55,s*.04);g.lineTo(-s*1.15,s*.06);g.closePath();fs(g,'#ff5b4a',lw*.8);
 g.restore()}
function cloudsDraw(g,w,h,cl,t,yMax){cl.forEach(c=>{const x=((c.x+t*c.v)%1.3-.15)*w,y=c.y*h*yMax,s=c.s*Math.min(w,h)*.08;g.fillStyle='rgba(255,255,255,.85)';[[0,0,1],[s*.9,s*.1,.8],[-s*.9,s*.15,.75],[s*.3,-s*.4,.7]].forEach(([dx,dy,k])=>{ell(g,x+dx,y+dy,s*k,s*k*.7);g.fill()})})}
function mapScene(g,w,h,p,cl,t){g.fillStyle=lg(g,0,0,w,h,['#1f6fbf','#4aa8ea']);g.fillRect(0,0,w,h);
 g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=2;for(let y=h*.1;y<h;y+=h*.08){g.beginPath();for(let x=0;x<=w;x+=20)g.lineTo(x,y+Math.sin(x*.02+t/600+y)*4);g.stroke()}
 g.beginPath();g.moveTo(0,h*.05);g.quadraticCurveTo(w*.12,h*.12,w*.1,h*.32);g.quadraticCurveTo(w*.16,h*.45,0,h*.55);g.closePath();fs(g,'#7fbf6a',2);
 const k=Math.min(h*.62/160,w*.5/95),ox=w-95*k-w*.06,oy=h*.17;
 g.beginPath();TW_PTS.split(' ').forEach((pt,i)=>{const[a,b]=pt.split(',').map(Number);i?g.lineTo(ox+a*k,oy+b*k):g.moveTo(ox+a*k,oy+b*k)});g.closePath();fs(g,'#8bd36b',2.5);
 g.beginPath();g.moveTo(ox+60*k,oy+40*k);g.quadraticCurveTo(ox+66*k,oy+70*k,ox+50*k,oy+125*k);g.strokeStyle='rgba(60,140,60,.6)';g.lineWidth=k*6;g.lineCap='round';g.stroke();
 const tx=ox+63*k,ty=oy+18.5*k,pr=(t/500)%1;circ(g,tx,ty,6+pr*20);g.strokeStyle=`rgba(255,91,74,${1-pr})`;g.lineWidth=3;g.stroke();circ(g,tx,ty,6);fs(g,'#ff5b4a',2);
 {const fz=Math.max(16,Math.min(26,w*.04));canvasRuby(g,'桃園',tx-fz*1.6,ty+fz*1.9,fz,'#ffffff','#1b2340')}
 const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,P=t2=>{const a=[-w*.08,h*.82],c=[w*.35,h*.02],b=[tx,ty];const u=1-t2;return[u*u*a[0]+2*u*t2*c[0]+t2*t2*b[0],u*u*a[1]+2*u*t2*c[1]+t2*t2*b[1]]};
 g.setLineDash([8,8]);g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=3;g.beginPath();for(let q=0;q<=e;q+=.01){const[x,y]=P(q);q?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();g.setLineDash([]);
 const[x,y]=P(e),[x2,y2]=P(Math.min(1,e+.01));planeTop(g,x,y,Math.min(w,h)*.06*(1-.35*e),Math.atan2(y2-y,x2-x)||0);
 g.globalAlpha=.55;cloudsDraw(g,w,h,cl.slice(0,6),t/1000,.9);g.globalAlpha=1}
function landScene(g,w,h,p,cl,t){g.fillStyle=lg(g,0,0,0,h,['#7cc6ff','#cfeeff','#ffe9c7']);g.fillRect(0,0,w,h);
 circ(g,w*.82,h*.2,Math.min(w,h)*.07);g.fillStyle='#fff3b0';g.fill();cloudsDraw(g,w,h,cl,t/1000,.45);
 [['#a9d9a0',.62,.07],['#7fbf6a',.68,.05]].forEach(([col,base,amp],i)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=w/12)g.lineTo(x,h*base-Math.abs(Math.sin(x*.006+i*2))*h*amp*2);g.lineTo(w,h);g.fill()});
 const ry=h*.82;g.fillStyle='#8bd36b';g.fillRect(0,h*.72,w,h*.28);
 const bx=w*.55,bw=Math.min(w*.42,520),bh=Math.min(h*.12,bw*.35);rr(g,bx,h*.72-bh,bw,bh,8);fs(g,lg(g,0,h*.6,0,h*.72,['#d6f0ff','#8fc3e8']),2);
 g.beginPath();g.moveTo(bx-10,h*.72-bh);g.quadraticCurveTo(bx+bw/2,h*.72-bh*1.6,bx+bw+10,h*.72-bh);g.closePath();fs(g,'#eef2f8',2);
 g.strokeStyle='rgba(27,35,64,.25)';g.lineWidth=1;for(let x=bx+bw/10;x<bx+bw;x+=bw/10){g.beginPath();g.moveTo(x,h*.72-bh);g.lineTo(x,h*.72);g.stroke()}
 const tw=bx-w*.06;rr(g,tw,h*.72-bh*2.2,bh*.3,bh*2.2,4);fs(g,'#eef2f8',2);rr(g,tw-bh*.15,h*.72-bh*2.5,bh*.6,bh*.4,6);fs(g,'#5aa9ff',2);
 canvasRuby(g,'桃園機場',bx+bw/2,h*.72-bh*.35,Math.max(14,Math.min(26,bw*.07)),'#1b2340','#ffffff');
 g.fillStyle='#5b6178';g.fillRect(0,ry-h*.03,w,h*.07);g.fillStyle='#fff';const roll=p<.55?0:Math.min(1,(p-.55)/.3);
 for(let x=-((roll*200)%60);x<w;x+=60)g.fillRect(x,ry+h*.003,30,h*.006);
 for(let x=10;x<w;x+=40){circ(g,x,ry-h*.033,2.5);g.fillStyle='#ffd35a';g.fill();g.fillStyle='#fff'}
 const s=Math.min(w*.14,h*.1);let x,y,pitch=0;
 if(p<.55){const q=p/.55,e=1-Math.pow(1-q,2);x=-w*.2+(w*.5)*e;y=h*.2+(ry-s*.4-h*.2)*Math.pow(q,1.3);pitch=-.06*q+.14*(1-q)}
 else{const q=Math.min(1,(p-.55)/.3);x=w*.3+w*.2*(1-Math.pow(1-q,2));y=ry-s*.4;pitch=0;
  if(q<.4){const a=1-q/.4;g.fillStyle=`rgba(255,255,255,${a*.8})`;[0,1,2].forEach(i=>{ell(g,w*.3-i*s*.4-q*40,ry,s*.25*(1+q*2),s*.12*(1+q));g.fill()})}}
 planeSide(g,x,y,s,pitch,p>.25);
 if(p>.86){const q=(p-.86)/.14;const px=x+s*.9+q*s*1.6;drawChar(g,px,ry+s*.05,s*.75,playerLook(),'right',Math.floor(t/150)%2?1:-1)}}
export function flight(done){const ov=document.createElement('div');ov.className='fly';
 ov.innerHTML=`<canvas></canvas><div class="card flycap" id="flyCap"></div><button class="hbtn" id="flySkip">${Z('skip')} <span class="tl" style="display:inline">${T('skip')}</span></button>`;document.body.appendChild(ov);
 const c=ov.querySelector('canvas'),t0=performance.now(),DUR=8200,M=3800;let end=false,cs=-1;
 const cl=Array.from({length:10},()=>({x:Math.random(),y:Math.random(),s:.5+Math.random(),v:.03+Math.random()*.05}));
 const finish=()=>{if(end)return;end=true;ov.style.opacity=0;setTimeout(()=>{ov.remove();done()},450)};
 ov.querySelector('#flySkip').onclick=finish;ov.querySelector('#flySkip').focus();
 const caps=[['從國外飛往臺灣……',"Flying to Taiwan from abroad…","海外から台湾へ向かっています……"],['歡迎來到桃園國際機場！',"Welcome to Taoyuan International Airport!","桃園国際空港へようこそ！"]];
 const frame=now=>{if(end)return;const t=Math.max(0,now-t0),w=c.clientWidth,h=c.clientHeight,d=Math.min(2,window.devicePixelRatio||1);
  renderPixel(c,w,h,d,4,g=>{if(t<M)mapScene(g,w,h,t/M,cl,t);else landScene(g,w,h,Math.min(1,(t-M)/(DUR-M-600)),cl,t)});
  const st=t<M?0:1;if(st!==cs){cs=st;$('#flyCap').innerHTML=`${rb(caps[st][0])}<span class="tl">${esc(caps[st][LI()])}</span>`}
  if(t>=DUR)return finish();requestAnimationFrame(frame)};requestAnimationFrame(frame)}
function taxiDraw(g,x,y,s,t){const lw=Math.max(1.5,s*.018),bob=Math.sin(t/90)*s*.008;g.save();g.translate(x,y+bob);
 ell(g,0,s*.02,s*.5,s*.05);g.fillStyle='rgba(0,0,0,.25)';g.fill();
 g.beginPath();g.moveTo(-s*.28,-s*.2);g.quadraticCurveTo(-s*.22,-s*.36,-s*.1,-s*.37);g.lineTo(s*.12,-s*.37);g.quadraticCurveTo(s*.22,-s*.36,s*.3,-s*.2);g.closePath();fs(g,'#ffcc1a',lw);
 rr(g,-s*.48,-s*.22,s*.98,s*.2,s*.07);fs(g,lg(g,0,-s*.22,0,0,['#ffd94a','#f2b400']),lw);
 [[-s*.22,-s*.33,s*.15],[-s*.03,-s*.33,s*.16]].forEach(([wx,wy,ww])=>{rr(g,wx,wy,ww,s*.12,s*.03);fs(g,'#bfe8ff',lw*.8)});
 g.beginPath();g.moveTo(s*.16,-s*.33);g.lineTo(s*.27,-s*.21);g.lineTo(s*.16,-s*.21);g.closePath();fs(g,'#bfe8ff',lw*.8);
 circ(g,s*.06,-s*.26,s*.035);fs(g,'#ffd9b8',lw*.6);circ(g,s*.06,-s*.28,s*.035);g.fillStyle='#20201f';g.beginPath();g.arc(s*.06,-s*.27,s*.037,Math.PI,0);g.fill();
 circ(g,-s*.14,-s*.25,s*.035);fs(g,'#ffd9b8',lw*.6);g.beginPath();g.arc(-s*.14,-s*.27,s*.04,Math.PI,0);g.closePath();fs(g,'#ff5b4a',lw*.5);
 rr(g,-s*.1,-s*.45,s*.2,s*.08,s*.02);fs(g,'#ffffff',lw*.8);g.fillStyle='#1b2340';g.font=`900 ${s*.06}px sans-serif`;g.textAlign='center';g.fillText('TAXI',0,-s*.39);
 g.fillStyle='#1b2340';g.fillRect(-s*.46,-s*.12,s*.94,s*.025);
 ell(g,s*.47,-s*.14,s*.03,s*.025);g.fillStyle='#fff8c0';g.fill();g.fillStyle='rgba(255,248,192,.35)';g.beginPath();g.moveTo(s*.5,-s*.14);g.lineTo(s*.8,-s*.2);g.lineTo(s*.8,-s*.06);g.fill();
 ell(g,-s*.47,-s*.14,s*.025,s*.025);g.fillStyle='#ff4a3a';g.fill();
 [-s*.28,s*.3].forEach(wx=>{circ(g,wx,-s*.01,s*.085);fs(g,'#2b2d47',lw);circ(g,wx,-s*.01,s*.04);fs(g,'#c7cfdf',lw*.6);
  g.save();g.translate(wx,-s*.01);g.rotate(t/80);g.strokeStyle='#5b6178';g.lineWidth=lw;for(let k=0;k<3;k++){g.rotate(Math.PI*2/3);g.beginPath();g.moveTo(0,0);g.lineTo(s*.04,0);g.stroke()}g.restore()});
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=lw*1.2;g.lineCap='round';[0,1,2].forEach(k=>{const yy=-s*(.08+k*.07),ll=s*(.12+((t/60+k*7)%10)*.01);g.beginPath();g.moveTo(-s*.58,yy);g.lineTo(-s*.58-ll,yy);g.stroke()});
 g.restore()}
function taxiScene(g,w,h,p,t,city){g.fillStyle=lg(g,0,0,0,h,['#86c8ff','#dff3ff']);g.fillRect(0,0,w,h);circ(g,w*.85,h*.16,Math.min(w,h)*.06);g.fillStyle='#fff3b0';g.fill();
 const gy=h*.66;g.fillStyle='#a9d9a0';g.beginPath();g.moveTo(0,gy);for(let x=0;x<=w+40;x+=40){const X=x-((t*.03)%40);g.lineTo(X,gy-h*.18-Math.abs(Math.sin((X+t*.03)*.004))*h*.12)}g.lineTo(w,gy);g.fill();
 const BW=Math.max(70,w*.12),off=t*.18,i0=Math.floor(off/BW)-1,cols=['#f3efe6','#fbe3c3','#dfe7f2','#f6d4cf','#e5f0d8'];
 for(let i=i0;i<i0+Math.ceil(w/BW)+3;i++){const x=i*BW-off,hs=Math.abs(Math.sin(i*12.9898)*43758.5453)%1,bh=h*(.14+hs*.2),bw2=BW*.86;
  rr(g,x,gy-bh,bw2,bh,3);fs(g,cols[Math.floor(hs*5)],2);g.fillStyle='#8fc7e8';for(let r=0;r<Math.floor(bh/(h*.05));r++)for(let c=0;c<3;c++)g.fillRect(x+bw2*(.12+c*.29),gy-bh+h*.015+r*h*.05,bw2*.18,h*.025);
  if(hs>.5){rr(g,x+bw2*.15,gy-bh-h*.03,bw2*.3,h*.03,6);fs(g,'#c7cfdf',1.5)}}
 g.fillStyle='#d6d0c4';g.fillRect(0,gy,w,h*.04);g.fillStyle='#5b6178';g.fillRect(0,gy+h*.04,w,h*.2);g.fillStyle='#8bd36b';g.fillRect(0,gy+h*.24,w,h);
 g.fillStyle='#fff';const o2=(t*.5)%80;for(let x=-o2;x<w;x+=80)g.fillRect(x,gy+h*.135,40,h*.008);
 const o3=(t*.5)%260;for(let x=-o3;x<w+260;x+=260){g.fillStyle='#3d4766';g.fillRect(x,gy-h*.16,4,h*.16);rr(g,x-8,gy-h*.17,20,8,4);fs(g,'#fff1b8',1.5)}
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
