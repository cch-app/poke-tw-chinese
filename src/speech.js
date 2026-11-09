// ===== 語音：只用臺灣口音 =====
import { settings } from './state.js';

export let twVoices=[];
const isTW=v=>{const l=(v.lang||'').toLowerCase().replace('_','-');return l==='zh-tw'||l.startsWith('zh-tw')||l.startsWith('cmn-hant-tw')||/taiwan|台灣|臺灣/i.test(v.name)};
function loadVoices(){try{twVoices=speechSynthesis.getVoices().filter(isTW)}catch(e){twVoices=[]}}
// 開機時語音清單常常還沒載入（getVoices() 回傳空的），而 Chrome 在重新整理後不一定會再發 voiceschanged，
// 所以清單是空的就每次重新讀一次，不能只靠那個事件
export function voices(){if(!twVoices.length&&'speechSynthesis' in window)loadVoices();return twVoices}
export const ttsOK=()=>voices().length>0;
// 語速一定要是正的有限數字：設定裡沒有 rate（例如標題畫面的暫時玩家）時，指定 undefined 會丟錯、整句不念
const rateOf=r=>Number.isFinite(r)&&r>0?r:.9;
// 念到一半的句子要留著參考：Chrome 會把沒人參考的 utterance 回收掉，念到一半就停
let current=null;
export function speak(text,rate){if(!ttsOK())return false;try{const st=settings();speechSynthesis.cancel();
 // Chrome 的語音引擎可能卡在暫停狀態（念到一半切到別的分頁），之後排進去的句子都不會念，先叫醒它
 speechSynthesis.resume();
 const u=current=new SpeechSynthesisUtterance(text);
 u.voice=twVoices.find(v=>v.voiceURI===st.voice)||twVoices[0];u.lang=u.voice.lang||'zh-TW';u.rate=rateOf(rate||st.rate);
 u.onend=u.onerror=e=>{if(e.error&&e.error!=='interrupted'&&e.error!=='canceled')console.warn('speech failed:',e.error);if(current===u)current=null};
 speechSynthesis.speak(u);return true}catch(e){console.warn('speech failed:',e);return false}}
export const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
export function initSpeech(){if('speechSynthesis' in window){loadVoices();speechSynthesis.addEventListener('voiceschanged',loadVoices)}}
