// ===== 語音：只用臺灣口音 =====
import { settings } from './state.js';
import { toast } from './ui/hud.js';

export let twVoices=[];
const speechSupported=()=>typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
export const speechAvailable=()=>speechSupported();
// Mobile browsers expose the same Taiwan voice with several valid BCP-47 tags.
const isTW=v=>{const l=(v.lang||'').toLowerCase().replace(/_/g,'-');return /^(?:zh|cmn)(?:-hant)?-tw(?:-|$)/.test(l)||l==='zh-hant'||l.startsWith('zh-hant-')||/taiwan|台灣|臺灣/i.test(v.name||'')};
function loadVoices(){try{twVoices=speechSynthesis.getVoices().filter(isTW)}catch(e){twVoices=[]}}
// 開機時語音清單常常還沒載入（getVoices() 回傳空的），而 Chrome 在重新整理後不一定會再發 voiceschanged，
// 所以清單是空的就每次重新讀一次，不能只靠那個事件
export function voices(){if(!twVoices.length&&'speechSynthesis' in window)loadVoices();return twVoices}
export const ttsOK=()=>voices().length>0;
// 語速一定要是正的有限數字：設定裡沒有 rate（例如標題畫面的暫時玩家）時，指定 undefined 會丟錯、整句不念
const rateOf=r=>Number.isFinite(r)&&r>0?r:.9;

/* ---------- 手機 ----------
 * iOS Safari：第一句一定要在「點一下」的處理函式裡念，不然之後的句子都不會出聲；
 *   靜音開關打開時網頁語音也會被靜音，除非把網頁音訊設成「播放」。
 * Android Chrome：還沒點過畫面就念會得到 not-allowed。
 * 兩邊都有：cancel() 之後馬上 speak() 那一句常常被吃掉；切到別的 App 或來電後，引擎會卡在「念著」的狀態。 */
let unlocked=false,silent=null;
// Put speech in the media-playback category when the browser exposes that API.
// This is what lets iOS use the normal loudspeaker instead of the receiver/ringer route.
function setPlaybackSession(){try{const session=navigator.audioSession;if(session&&session.type!=='playback')session.type='playback'}catch(e){}}
function unlock(){if(unlocked||!speechSupported())return;setPlaybackSession();
 // 一句沒有聲音的空白：這次點擊就把語音解鎖。不能 cancel 它，還沒開始念就被 cancel 的話引擎會卡住、之後都不出聲
 try{const u=silent=new SpeechSynthesisUtterance(' ');u.volume=0;u.lang='zh-TW';u.onend=u.onerror=()=>{if(silent===u)silent=null};speechSynthesis.speak(u);unlocked=true;['touchend','click','keydown'].forEach(t=>document.removeEventListener(t,unlock,true))}catch(e){silent=null}}
/** 不是點擊觸發的自動播放：手機上還沒點過畫面就先不念（▶ 按鈕還在，點了就念） */
export const canAutoPlay=()=>unlocked||!(navigator.userActivation&&!navigator.userActivation.hasBeenActive);

// 念到一半的句子要留著參考：Chrome 會把沒人參考的 utterance 回收掉，念到一半就停
let current=null,seq=0;
// 引擎多久沒開始念就算卡住：網路語音（Android 的 Google 語音）第一次念要先下載，給久一點
const STUCK_MS=4000;
const FAIL=[['聲音沒有播出來，請再按一次 ▶。iPhone 請確認音量。','The audio did not play. Tap ▶ again, and check your phone volume.','音声が再生されませんでした。もう一度 ▶ を押し、音量を確認してください。']];
function say(text,rate,id,retry){const st=settings(),u=current=new SpeechSynthesisUtterance(text);
 u.voice=twVoices.find(v=>v.voiceURI===st.voice)||twVoices[0];u.lang=u.voice.lang||'zh-TW';u.rate=rateOf(rate||st.rate);
 let started=false;u.onstart=()=>{started=true};
 u.onend=u.onerror=e=>{if(current===u)current=null;
  if(e.error&&e.error!=='interrupted'&&e.error!=='canceled'){console.warn('speech failed:',e.error);if(id===seq)toast(FAIL[0])}};
 speechSynthesis.resume();speechSynthesis.speak(u);
 // 引擎卡住了（一直沒開始念）：清掉重來一次，還是不行就提示玩家
 setTimeout(()=>{if(started||id!==seq||current!==u)return;speechSynthesis.cancel();
  if(retry)setTimeout(()=>{if(id===seq)say(text,rate,id,false)},80);else{current=null;toast(FAIL[0])}},STUCK_MS)}
function queueSpeak(text,rate,id,attempt=0){if(id!==seq)return;if(!ttsOK()){if(attempt<20)return setTimeout(()=>queueSpeak(text,rate,id,attempt+1),250);toast(FAIL[0]);return}
 if(current&&(speechSynthesis.speaking||speechSynthesis.pending)){speechSynthesis.cancel();setTimeout(()=>{if(id===seq)say(text,rate,id,true)},80)}else say(text,rate,id,true)}
export function speak(text,rate){if(!speechSupported())return false;try{setPlaybackSession();unlock();const id=++seq;
 // 正在念別的句子才需要 cancel（只有解鎖用的空白在排隊時直接排在它後面）；cancel 之後隔一下再念，手機才不會把新的這句一起吃掉
 queueSpeak(text,rate,id);
 return true}catch(e){console.warn('speech failed:',e);return false}}
export const hush=()=>{seq++;current=null;try{speechSynthesis.cancel()}catch(e){}};
export function initSpeech(){if(!speechSupported())return;setPlaybackSession();loadVoices();speechSynthesis.addEventListener('voiceschanged',loadVoices);
 // 第一次點畫面（走路、按 A、按任何按鈕）就先解鎖語音
 ['touchend','click','keydown'].forEach(t=>document.addEventListener(t,unlock,true));
 // 切到背景時停掉，回來時引擎才不會卡住
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hush()})}
