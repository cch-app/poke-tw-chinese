// ===== 選擇繪圖後端：優先用 WebGL（PlayCanvas），不行就退回 2D 畫布 =====
// 網址加 ?renderer=2d 可以強制使用 2D 後端（測試用）。
import { createCanvasBackend } from './backend-canvas.js';
import { createWebglBackend } from './backend-webgl.js';

export function createBackend(canvas) {
  const forced = new URLSearchParams(location.search).get('renderer');
  if (forced !== '2d') {
    try { return createWebglBackend(canvas) }
    catch (e) { console.warn('WebGL renderer unavailable, falling back to Canvas 2D:', e) }
  }
  return createCanvasBackend(canvas);
}
