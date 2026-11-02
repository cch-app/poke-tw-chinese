// ===== 多語：中文加拼音／注音，說明文字用英文或日文 =====
import { esc } from './core/util.js';
import { UI } from './data/index.js';
import { settings } from './state.js';
import { segment, toMark, toZhu } from './text.js';

export function rb(text){const mode=settings().ruby;if(mode==='off')return esc(text);
 return segment(String(text)).map(([c,s])=>s?`<ruby>${esc(c)}<rt>${mode==='zhuyin'?toZhu(s):toMark(s)}</rt></ruby>`:esc(c)).join('')}
/** 打字機效果用：每個字先藏起來（class="twh"） */
export function rbTw(text){const m=settings().ruby;return segment(String(text)).map(([c,s])=>{const r=m!=='off'&&s?`<rt>${m==='zhuyin'?toZhu(s):toMark(s)}</rt>`:'';return r?`<ruby class="twh">${esc(c)}${r}</ruby>`:`<span class="twh">${esc(c)}</span>`}).join('')}
export const LI=()=>settings().lang==='ja'?2:1;
export const tr=a=>a[LI()];                                    // [zh,en,ja] → 說明語言
export const T=k=>esc(UI[k][LI()]);
export const Z=k=>rb(UI[k][0]);
export const itemTr=it=>LI()===2?it.ja:it.en;
