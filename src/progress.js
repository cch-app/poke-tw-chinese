// ===== 成長：經驗值、金錢、疲勞 =====
import { clamp } from './core/util.js';
import { UI } from './data/index.js';
import { S, has, petLv, xpNeed } from './state.js';
import { hud, toast } from './ui/hud.js';

export function xpFor(lv){const mult=clamp(1+.15*(lv-S.lv),.2,2.5);return{g:Math.max(1,Math.round((8+lv*2)*mult*(has('dog')?1.2+.02*(petLv('dog')-1):1))),mult}}
export function gainXP(g){S.xp+=g;let up=false;while(S.xp>=xpNeed(S.lv)){S.xp-=xpNeed(S.lv);S.lv++;up=true;S.fat+=5}if(up)toast([UI.levelUp[0]+' Lv '+S.lv,UI.levelUp[1]+' Lv '+S.lv,UI.levelUp[2]+' Lv '+S.lv]);hud()}
export function gainMoney(n){n=Math.round(n*(has('magpie')?1.3+.02*(petLv('magpie')-1):1));S.money+=n;return n}
export function dmgFor(lv){if(S.luck>0){S.luck--;return 0}const gap=S.lv-lv;const m=gap>0?Math.min(2,1+.03*gap):Math.max(.6,1+.02*gap);return Math.max(2,Math.round((5+S.lv*.9)*m*(has('bear')?Math.max(.5,.75-.01*(petLv('bear')-1)):1)))}
export function markSeen(it,ok){if(it.t!=='v')return;const s=S.seen[it.w]||{n:0,ok:0};s.n++;if(ok)s.ok++;S.seen[it.w]=s}
