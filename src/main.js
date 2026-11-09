// ===== 進入點：建立畫面、接上輸入、開始遊戲 =====
import './style.css';
import { initInput } from './input.js';
import { createBackend } from './render/backend.js';
import { createView } from './render/view.js';
import { boot } from './scenes/title.js';
import { initSpeech } from './speech.js';
import { initDialog } from './ui/dialog.js';
import { initPanel } from './ui/panel.js';
import { attachView, loop } from './world/overworld.js';

function start() {
  const canvas = document.querySelector('#map');
  const view = createView(canvas, createBackend(canvas));
  attachView(view);

  initSpeech();
  initDialog();
  initPanel();
  initInput();
  window.addEventListener('resize', () => view.fit());
  new ResizeObserver(() => view.fit()).observe(canvas);
  // 網路字型晚到時，招牌上的字要重畫
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => view.invalidate());

  boot();
  view.start(loop);
}

try { start() }
catch (e) {
  console.error(e);
  const p = document.createElement('p');
  p.className = 'bootErr';
  p.textContent = '遊戲無法啟動，請換一個瀏覽器試試。 The game could not start. Please try another browser.';
  document.body.appendChild(p);
}
