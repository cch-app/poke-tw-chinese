// ===== 室內：跟櫃檯人員、路人說話（旅館、商店、茶店、廟） =====
import { leaderTalk } from '../battle/gym.js';
import { $, OPPOSITE, pick } from '../core/util.js';
import { FORTUNES, UI, UNIT } from '../data/index.js';
import { T, Z } from '../i18n.js';
import { setMode } from '../scene.js';
import { S, innFee, maxFat, save } from '../state.js';
import { ask, choice, healFx, qtyBox, say, showLine } from '../ui/dialog.js';
import { hud } from '../ui/hud.js';
import { opt } from '../ui/panel.js';

const CLERK_NAME={inn:['櫃檯人員',"Receptionist","受付係"],store:['店員',"Clerk","店員"],tea:['店員',"Tea server","店員"],coffee:['咖啡師',"Barista","バリスタ"],temple:['廟公',"Temple keeper","廟の管理人"],mall:['店員',"Food court staff","店員"],dept:['專櫃小姐',"Sales associate","販売員"]};
export function talkNpc(n){if(n.role==='leader')return leaderTalk();n.dir='down';shopFlow(n.kind)}
export async function talkWalker(n){n.talk=true;n.dir=OPPOSITE[S.dir];await say([n.line],n.who);
 if(n.gift){const k=n.gift;n.gift=null;S.bag[k]++;save();hud();await say([UI.gift,[`${UI.got[0]}${UI[k][0]}！`,`${UI.got[1]}: ${UI[k][1]}!`,`${UI[k][2]}を${UI.got[2]}！`]],n.who)}n.talk=false}
// 美食街什麼都有；百貨公司比較貴，但一樣都買得到
const SHOP_ITEMS={store:[['snack',50],['drink',120]],tea:[['bubble',70]],coffee:[['coffee',90]],mall:[['snack',60],['drink',130],['bubble',80],['coffee',100]],dept:[['snack',70],['drink',140],['bubble',90],['coffee',110]]};
async function shopFlow(kind){const nm=CLERK_NAME[kind][0];const hello={inn:UI.innHello,store:UI.storeHello,tea:UI.teaHello,coffee:UI.coffeeHello,temple:UI.templeHello,mall:UI.mallHello,dept:UI.deptHello}[kind];
 if(kind==='inn'){const i=await ask(hello,nm,[opt('rest',` NT$${innFee()}`),opt('leave')]);
  if(i===0){if(S.fat>=maxFat())await say([UI.innFull],nm);else if(S.money<innFee())await say([UI.notEnoughL],nm);
   else{const c=await ask([`休息一下要NT$${innFee()}，可以嗎？`,`A rest costs NT$${innFee()}. OK?`,`ご休憩はNT$${innFee()}です。よろしいですか？`],nm,[opt('yes'),opt('no')]);
    if(c===0){S.money-=innFee();S.fat=maxFat();save();hud();await healFx();await say([UI.innDone],nm)}else await say([UI.maybeLater],nm)}}
  return say([UI.comeAgain],nm)}
 if(kind==='temple'){const i=await ask(hello,nm,[opt('pray'),opt('fortune'),opt('leave')]);
  if(i===0){save();await say([UI.prayed],nm)}
  if(i===1){const f=pick(FORTUNES);if(f[0]==='大吉')S.bag.snack++;if(f[0]==='中吉')S.luck=1;await say([[f[0]+'！',f[1],f[2]]],nm)}
  return say([UI.comeAgain],nm)}
 let line=hello;
 while(true){const i=await ask(line,nm,[opt('buy'),opt('leave')]);line=UI.anythingElse;if(i!==0)break;
  const list=SHOP_ITEMS[kind];const j=await choice([...list.map(([k,p])=>`${Z(k)} <span class="tl" style="display:inline">${T(k)}</span><span class="pr">NT$${p}</span>`),opt('cancel')],{title:`NT$${S.money}`,cls:'wide'});
  if(j<0||j>=list.length)continue;const[k,p]=list[j];
  if(S.money<p){await say([UI.notEnoughL],nm);continue}
  setMode('dialog');await showLine(UI.howMany,nm);const q=await qtyBox(`${Z(k)} · NT$${p}`,p);$('#dlg').hidden=true;if(!q)continue;
  const u=UNIT[k]||'個',it=UI[k];
  const c=await ask([`${it[0]}${q}${u}，一共NT$${q*p}，可以嗎？`,`${q} × ${it[1]}: NT$${q*p}. OK?`,`${it[2]}を${q}つで、NT$${q*p}です。よろしいですか？`],nm,[opt('yes'),opt('no')]);
  if(c===0){S.money-=q*p;S.bag[k]+=q;hud();save();await say([UI.thanks],nm)}else await say([UI.maybeLater],nm)}
 return say([UI.comeAgain],nm)}
