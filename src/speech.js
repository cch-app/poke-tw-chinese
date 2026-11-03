// ===== 語音：只用臺灣口音 =====
import { S } from './state.js';

export let twVoices=[];
const isTW=v=>{const l=(v.lang||'').toLowerCase().replace('_','-');return l==='zh-tw'||l.startsWith('zh-tw')||l.startsWith('cmn-hant-tw')||/taiwan|台灣|臺灣/i.test(v.name)};
function loadVoices(){try{twVoices=speechSynthesis.getVoices().filter(isTW)}catch(e){twVoices=[]}}
export const ttsOK=()=>twVoices.length>0;
export function speak(text,rate){if(!ttsOK())return false;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);
 u.voice=twVoices.find(v=>v.voiceURI===S.settings.voice)||twVoices[0];u.lang=u.voice.lang||'zh-TW';u.rate=rate||S.settings.rate;speechSynthesis.speak(u);return true}catch(e){return false}}
export const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
export function initSpeech(){if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}}
