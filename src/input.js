// ===== 輸入：鍵盤、觸控方向鍵 =====
import { $ } from './core/util.js';
import { UI } from './data/index.js';
import { mode } from './scene.js';
import { S, save } from './state.js';
import { CH, nextLine, tw } from './ui/dialog.js';
import { hud, toast } from './ui/hud.js';
import { mainMenu } from './ui/menus.js';
import { closePanel } from './ui/panel.js';
import { hold, interact, refreshView, release } from './world/overworld.js';

const KEYDIR={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
function pressA(){if(mode==='choice'&&CH){const f=document.activeElement;if(f&&CH.box.contains(f))f.click();else CH.box.querySelector('.chi').click();return}if(mode==='dialog'){if(tw)tw.fin();else nextLine()}else if(mode==='world')interact()}
function pressB(){if(mode==='choice'&&CH){CH.cancel();return}if(mode==='world')mainMenu();else if(mode==='menu')closePanel();else if(mode==='dialog'){if(tw)tw.fin();else nextLine()}}
function navFocus(scope,dir,sel){const items=[...scope.querySelectorAll(sel)].filter(b=>!b.disabled&&b.offsetParent);if(!items.length)return;let i=items.indexOf(document.activeElement);
 if(i<0){items[0].focus();return}const cur=items[i].getBoundingClientRect();let best=null,bd=1e9;items.forEach((b,j)=>{if(j===i)return;const r=b.getBoundingClientRect();const dx=(r.left+r.width/2)-(cur.left+cur.width/2),dy=(r.top+r.height/2)-(cur.top+cur.height/2);
  const ok=dir==='up'?dy<-4:dir==='down'?dy>4:dir==='left'?dx<-4:dx>4;if(!ok)return;const d=Math.abs(dx)+Math.abs(dy)*(dir==='left'||dir==='right'?3:1)+(dir==='up'||dir==='down'?Math.abs(dx)*2:0);if(d<bd){bd=d;best=b}});
 if(best)best.focus();else if(dir==='down'||dir==='right')items[(i+1)%items.length].focus();else items[(i-1+items.length)%items.length].focus()}
export function initInput(){
 document.addEventListener('keydown',e=>{const tag=e.target.tagName||'';if(tag==='INPUT'||tag==='SELECT')return;
 if(mode==='choice'&&CH){const d=KEYDIR[e.key];if(d){e.preventDefault();if(CH.adj&&(d==='up'||d==='down')){CH.adj(d==='up'?1:-1);return}if(CH.adj&&(d==='left'||d==='right')){CH.adj(d==='right'?10:-10);return}navFocus(CH.box,d,'.chi');return}
  if(['z','Z',' ','Enter'].includes(e.key)){e.preventDefault();pressA();return}if(['x','X','Escape','Backspace'].includes(e.key)){e.preventDefault();pressB()}return}
 if((mode==='menu'||mode==='battle')&&KEYDIR[e.key]&&e.key.startsWith('Arrow')){e.preventDefault();navFocus($('#panel'),KEYDIR[e.key],'button');return}
 if(mode==='battle'){if(/^[1-4]$/.test(e.key)){const b=$(`#bbody .opt[data-i="${+e.key-1}"]`);if(b&&!b.disabled)b.click()}if(e.key==='p'||e.key==='P'){const pb=$('#playBtn');if(pb)pb.click()}return}
 if(KEYDIR[e.key]&&mode==='world'){hold(KEYDIR[e.key]);e.preventDefault();return}
 if(['z','Z',' ','Enter'].includes(e.key)&&(mode==='world'||mode==='dialog')){e.preventDefault();pressA();return}
 if(['x','X','Escape','Backspace'].includes(e.key)&&mode!=='title'){e.preventDefault();pressB()}});
document.addEventListener('keyup',e=>{if(KEYDIR[e.key])release(KEYDIR[e.key])});
// 方向盤：整個圓都能按，依手指相對圓心的角度決定方向；按著滑到別的方向就直接轉彎，中間一小圈不動
{const dp=$('.dpad'),keyOf=d=>dp.querySelector(`[data-dir="${d}"]`);let cur=null,pid=null;
 const dirAt=e=>{const r=dp.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
  if(Math.hypot(x,y)<r.width*.11)return null;return Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down')};
 const set=d=>{if(d===cur)return;if(cur){release(cur);keyOf(cur).classList.remove('on')}cur=d;if(d){hold(d);keyOf(d).classList.add('on')}};
 dp.addEventListener('pointerdown',e=>{e.preventDefault();pid=e.pointerId;try{dp.setPointerCapture(pid)}catch(_){}set(dirAt(e))});
 dp.addEventListener('pointermove',e=>{if(e.pointerId===pid)set(dirAt(e))});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>dp.addEventListener(t,e=>{if(e.pointerId===pid){pid=null;set(null)}}))}
$('#aBtn').addEventListener('click',pressA);$('#bBtn').addEventListener('click',pressB);
$('#menuBtn').addEventListener('click',()=>{if(mode==='world')mainMenu();else if(mode==='menu')closePanel();else if(mode==='choice'&&CH)CH.cancel()});
$('#rubyBtn').addEventListener('click',()=>{if(!S)return;const o=['pinyin','zhuyin','off'];S.settings.ruby=o[(o.indexOf(S.settings.ruby)+1)%3];save();refreshView();hud();toast(UI[S.settings.ruby])})}
