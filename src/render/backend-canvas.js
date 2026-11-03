// ===== 繪圖後端：2D 畫布（沒有 WebGL 時的備案） =====
// 貼圖就是 art.js 畫好的畫布本身。

export function createCanvasBackend(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  let dpr = 1, cx = 0, cy = 0, vw = 0, vh = 0;

  return {
    name: 'canvas2d',
    createTexture: cv => cv,
    destroyTexture() {},
    resize(cssW, cssH, d) { dpr = d; canvas.width = Math.round(cssW * d); canvas.height = Math.round(cssH * d) },
    begin(clear, x, y, w, h) {
      cx = x; cy = y; vw = w; vh = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = 1;
      ctx.fillStyle = clear;
      ctx.fillRect(0, 0, w, h);
    },
    // 只畫看得到的部分（整張地面圖很大，這點很重要）
    draw(tex, x, y, w, h, alpha) {
      const x0 = Math.max(x, cx), y0 = Math.max(y, cy), x1 = Math.min(x + w, cx + vw), y1 = Math.min(y + h, cy + vh);
      if (x1 <= x0 || y1 <= y0) return;
      const sx = tex.width / w, sy = tex.height / h;
      ctx.globalAlpha = alpha;
      ctx.drawImage(tex, (x0 - x) * sx, (y0 - y) * sy, (x1 - x0) * sx, (y1 - y0) * sy, x0 - cx, y0 - cy, x1 - x0, y1 - y0);
    },
    end() { ctx.globalAlpha = 1 },
    onContextRestored() {},
    start(onFrame) {
      const loop = now => { requestAnimationFrame(loop); onFrame(now) };
      requestAnimationFrame(loop);
    },
  };
}
