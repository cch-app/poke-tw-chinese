// ===== 面板 =====
import { $ } from '../core/util.js';
import { T, Z } from '../i18n.js';
import { setMode } from '../scene.js';
import { hush } from '../speech.js';
import { save } from '../state.js';
import { hud } from './hud.js';
import { mainMenu } from './menus.js';

export function openPanel(html,m='menu'){$('#panel').innerHTML=html;$('#ov').hidden=false;setMode(m);$('#panel').scrollTop=0;
 const f=$('#panel').querySelector('[data-autofocus]')||$('#panel').querySelector('button');if(f)f.focus({preventScroll:true})}
export function closePanel(){$('#ov').hidden=true;$('#panel').innerHTML='';hush();setMode('world');hud();save()}
export function closePanelQuiet(){$('#ov').hidden=true;$('#panel').innerHTML='';setMode('world')}
export const head=(k,extra='')=>`<div class="ptitle"><h2>${Z(k)}<span class="tl">${T(k)}</span></h2>${extra}<button class="x" data-close>${Z('close')}</button></div>`;
export const backBtn=()=>`<button class="x" id="backBtn">◀ ${Z('back')}</button>`;
export function wireBack(){const b=$('#backBtn');if(b)b.onclick=()=>{closePanelQuiet();mainMenu()}}
export const btn=(id,k,cls='',attrs='')=>`<button class="btn ${cls}" id="${id}" ${attrs}>${Z(k)}<span class="tl">${T(k)}</span></button>`;
export const opt=(k,extra='')=>`${Z(k)}${extra} <span class="tl" style="display:inline">${T(k)}</span>`;
export function initPanel(){document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closePanel()});}
