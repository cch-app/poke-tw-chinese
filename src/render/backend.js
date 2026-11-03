// ===== 選擇繪圖後端：以平滑 2D 畫布為預設，PlayCanvas 可選 =====
// main 分支使用原生 2D 畫布；網址加 ?renderer=webgl 可啟用 PlayCanvas。
import { createCanvasBackend } from './backend-canvas.js';
import { createWebglBackend } from './backend-webgl.js';

export function createBackend(canvas) {
  const forced = new URLSearchParams(location.search).get('renderer');
  if (forced === 'webgl') {
    try { return createWebglBackend(canvas) }
    catch (e) { console.warn('WebGL renderer unavailable, falling back to Canvas 2D:', e) }
  }
  return createCanvasBackend(canvas);
}
