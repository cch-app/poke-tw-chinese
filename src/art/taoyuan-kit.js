// Taoyuan visual kit: original modular 2.5D art built from a small set of
// reusable façade, window, door and character parts. It deliberately shares
// no graphics with the reference game; only its economical design grammar.
import { storeBrand } from '../data/stores.js';

const OUT = '#25283a';
const DIMS = {
  gym: { w: 7, h: 5, ex: 1.3 }, inn: { w: 6, h: 5, ex: 1.4 },
  store: { w: 5, h: 4, ex: .7 }, tea: { w: 4, h: 3, ex: 1 },
  temple: { w: 6, h: 4, ex: 1.6 }, house: { w: 3, h: 4, ex: 1.8 },
};

const rr = (c, x, y, w, h, r) => {
  r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
};
const path = (c, pts) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath() };
const shade = (hex, amount) => {
  const n = parseInt(hex.slice(1), 16), f = amount < 0 ? 0 : 255, p = Math.abs(amount);
  const v = s => Math.round(((n >> s) & 255) + (f - ((n >> s) & 255)) * p);
  return `rgb(${v(16)},${v(8)},${v(0)})`;
};
const fill = (c, color, lw = 0) => { c.fillStyle = color; c.fill(); if (lw) { c.lineWidth = lw; c.strokeStyle = OUT; c.lineJoin = 'round'; c.stroke() } };
const grad = (c, x0, y0, x1, y1, colors) => { const g = c.createLinearGradient(x0, y0, x1, y1); colors.forEach((v, i) => g.addColorStop(i / (colors.length - 1), v)); return g };
const text = (c, value, x, y, size, color = '#fff') => { c.fillStyle = color; c.font = `900 ${size}px "Noto Sans TC",system-ui,sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(value, x, y) };

function windowPart(c, x, y, w, h, u, warm = false) {
  const lw = u * .035; rr(c, x, y, w, h, u * .045); fill(c, grad(c, x, y, x, y + h, warm ? ['#ffe7a8', '#b98755'] : ['#d9f4ff', '#6fa9c7']), lw);
  c.fillStyle = 'rgba(255,255,255,.48)'; c.fillRect(x + w * .1, y + h * .09, w * .13, h * .67);
  c.strokeStyle = 'rgba(37,40,58,.55)'; c.lineWidth = u * .025; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.stroke();
}
function glassDoor(c, x, y, w, h, u) {
  rr(c, x, y, w, h, u * .04); fill(c, grad(c, x, y, x, y + h, ['#dff6ff', '#6595b5']), u * .04);
  c.strokeStyle = OUT; c.lineWidth = u * .028; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.stroke();
  c.fillStyle = '#f3d267'; c.fillRect(x + w * .19, y + h * .54, u * .045, u * .07); c.fillRect(x + w * .77, y + h * .54, u * .045, u * .07);
}
function shell(c, w, h, u, top, body, roof = '#e8edf1') {
  const lw = u * .04, x = u * .16, right = w - u * .38, bottom = h - u * .1, d = u * .25;
  c.fillStyle = 'rgba(20,30,35,.16)'; c.fillRect(x + u * .18, bottom - u * .22, w - x, u * .25);
  rr(c, x, top, right - x, bottom - top, u * .05); fill(c, grad(c, x, top, right, top, [shade(body, .12), body]), lw);
  path(c, [[right, top], [w - u * .08, top + d], [w - u * .08, bottom - d * .2], [right, bottom]]); fill(c, shade(body, -.2), lw);
  path(c, [[x, top], [x + d, top - d], [w - u * .34, top - d], [w - u * .08, top], [right, top + d], [x, top + d]]); fill(c, grad(c, x, top - d, x, top + d, [shade(roof, .18), roof, shade(roof, -.12)]), lw);
  return { x, right, bottom, top: top + d };
}
function signPart(c, label, x, y, w, h, u, bg, fg = '#fff') {
  rr(c, x, y, w, h, u * .055); fill(c, bg, u * .035); text(c, label, x + w / 2, y + h * .52, Math.min(h * .55, u * .3), fg);
}

export function spriteTaoyuanBuilding(kind, u, dpr, city, emblemImg, brandId) {
  const b = DIMS[kind], w = b.w * u, h = (b.h + b.ex) * u;
  const cv = document.createElement('canvas'); cv.width = Math.ceil(w * dpr); cv.height = Math.ceil(h * dpr); const c = cv.getContext('2d'); c.scale(dpr, dpr);
  if (kind === 'gym') {
    const s = shell(c, w, h, u, u * 1.42, '#e7ecee', city.roof); const lobbyY = h - u * 1.52;
    windowPart(c, u * .55, lobbyY, u * 1.55, u * .82, u); windowPart(c, w - u * 2.38, lobbyY, u * 1.55, u * .82, u); glassDoor(c, w / 2 - u * .62, lobbyY - u * .08, u * 1.24, u * 1.36, u);
    c.fillStyle = '#f6c84b'; c.fillRect(s.x, u * 1.83, s.right - s.x, u * .14);
    for (let i = 0; i < 5; i++) windowPart(c, u * (.62 + i * 1.18), u * 2.35, u * .82, u * .68, u);
    c.fillStyle = 'rgba(66,84,92,.18)'; c.fillRect(u * .36, u * 3.35, w - u * .74, u * .09);
    path(c, [[u * .35, u * 1.5], [u * 1.04, u * .54], [w - u * 1.2, u * .54], [w - u * .2, u * 1.5]]); fill(c, grad(c, 0, u * .5, 0, u * 1.6, [shade(city.roof, .2), city.roof]), u * .045);
    c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = u * .04; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(u * .65 + i * (w - u * 1.6) / 6, u * .62); c.lineTo(u * .4 + i * (w - u * .7) / 6, u * 1.47); c.stroke() }
    c.beginPath(); c.arc(w / 2, u * 1.04, u * .52, 0, Math.PI * 2); fill(c, '#fff', u * .04);
    if (emblemImg?.complete && emblemImg.naturalWidth) c.drawImage(emblemImg, w / 2 - u * .43, u * .61, u * .86, u * .86); else text(c, '桃', w / 2, u * 1.04, u * .42, city.roof);
    signPart(c, '道館', w / 2 - u * .7, u * 1.6, u * 1.4, u * .5, u, '#26394f');
  } else if (kind === 'inn') {
    shell(c, w, h, u, u * .8, '#e6d5bd', '#b9c0c5');
    for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) windowPart(c, u * (.48 + col * 1.25), u * (1.35 + row * 1.05), u * .82, u * .58, u, row === 2);
    c.fillStyle = '#435b65'; c.fillRect(u * .25, h - u * 1.42, w - u * .62, u * .13);
    path(c, [[u * 1.58, h - u * 1.33], [w - u * 1.73, h - u * 1.33], [w - u * 1.48, h - u * .98], [u * 1.33, h - u * .98]]); fill(c, '#c84b40', u * .04);
    glassDoor(c, w / 2 - u * .58, h - u * 1.25, u * 1.16, u * 1.15, u); signPart(c, '桃園旅店', u * .55, u * .48, u * 2.35, u * .52, u, '#b74439');
  } else if (kind === 'store') {
    const brand = storeBrand(brandId), s = shell(c, w, h, u, u * .72, '#e9ecec', '#f4f6f7');
    signPart(c, brand.sign, u * .5, u * .28, w - u * 1.05, u * .53, u, '#fff', brand.primary);
    brand.stripes.forEach((col, i) => { c.fillStyle = col; c.fillRect(s.x, u * (.99 + i * .13), s.right - s.x, u * .13) });
    windowPart(c, u * .48, h - u * 2.22, u * 1.55, u * 1.48, u); windowPart(c, w - u * 2.31, h - u * 2.22, u * .82, u * 1.48, u); glassDoor(c, w / 2 - u * .48, h - u * 2.22, u * .96, u * 2.12, u);
    c.fillStyle = brand.secondary; c.fillRect(s.x, h - u * .26, s.right - s.x, u * .16);
  } else if (kind === 'tea') {
    shell(c, w, h, u, u * .95, '#b98253', '#6e4932');
    c.fillStyle = 'rgba(66,37,22,.22)'; for (let x = u * .35; x < w - u * .45; x += u * .24) c.fillRect(x, u * 1.21, u * .025, h - u * 1.38);
    rr(c, u * .46, h - u * 1.72, w - u * 1.12, u * .92, u * .04); fill(c, '#3f3028', u * .04);
    c.fillStyle = '#f2dfbd'; c.fillRect(u * .46, h - u * .66, w - u * 1.12, u * .23);
    for (let i = 0; i < 3; i++) { rr(c, u * (.75 + i * .75), h - u * 1.02, u * .27, u * .31, u * .04); fill(c, '#f7eddf', u * .025); c.fillStyle = '#392b23'; c.beginPath(); c.arc(u * (.885 + i * .75), h - u * .77, u * .07, 0, Math.PI * 2); c.fill() }
    path(c, [[u * .2, u * 1.35], [w - u * .4, u * 1.35], [w - u * .16, u * 1.7], [u * .02, u * 1.7]]); fill(c, '#e4c29a', u * .04); signPart(c, '大溪茶舖', u * .7, u * .54, w - u * 1.6, u * .55, u, '#34443a');
  } else if (kind === 'temple') {
    shell(c, w, h, u, u * 1.72, '#b7332e', '#dc7b2b');
    for (const x of [u * .65, u * 1.55, w - u * 1.9, w - u * 1.0]) { rr(c, x, h - u * 2.6, u * .27, u * 2.38, u * .04); fill(c, '#c73b32', u * .035) }
    rr(c, w / 2 - u * .75, h - u * 2.1, u * 1.5, u * 2, u * .035); fill(c, '#5b3325', u * .04);
    const roof = (y, inset) => { path(c, [[inset, y], [inset + u * .55, y - u * .64], [w - inset - u * .55, y - u * .64], [w - inset, y], [w - inset - u * .22, y + u * .2], [inset + u * .22, y + u * .2]]); fill(c, grad(c, 0, y - u * .64, 0, y + u * .2, ['#f3a43b', '#ce6825']), u * .045) };
    roof(u * 1.86, u * .05); roof(u * .92, u * .72); signPart(c, '福德宮', w / 2 - u * .82, u * 1.13, u * 1.64, u * .5, u, '#2e7862', '#f8dc72');
  } else {
    shell(c, w, h, u, u * .88, '#d9cfbf', '#7c8d95');
    windowPart(c, u * .52, u * 1.45, u * 1.28, u * .72, u); windowPart(c, u * .52, u * 2.65, u * 1.28, u * .72, u, true);
    rr(c, u * .33, u * 2.36, u * 1.68, u * .14, u * .03); fill(c, '#788a91', u * .035);
    glassDoor(c, u * .72, h - u * 1.52, u * .92, u * 1.42, u); c.fillStyle = '#56735c'; c.fillRect(u * .18, h - u * .27, u * 2.44, u * .16);
  }
  return cv;
}

export function enhanceTaoyuanGround(cv, map, u) {
  const c = cv.getContext('2d'), h = map.length, w = map[0].length; c.save(); c.lineCap = 'butt';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const t = map[y][x], px = x * u, py = y * u;
    if (t === 3) {
      c.strokeStyle = 'rgba(80,91,96,.13)'; c.lineWidth = Math.max(1, u * .018);
      c.beginPath(); c.moveTo(px, py + u * .5); c.lineTo(px + u, py + u * .5); c.stroke();
      for (let col = 0; col < 2; col++) { const xx = px + (col + .5) * u; c.beginPath(); c.moveTo(xx, py + (col ? 0 : u * .5)); c.lineTo(xx, py + (col ? u * .5 : u)); c.stroke() }
      if (map[y - 1]?.[x] !== 3) { c.fillStyle = 'rgba(255,255,255,.34)'; c.fillRect(px, py, u, u * .035) }
      if (map[y + 1]?.[x] !== 3) { c.fillStyle = 'rgba(47,55,58,.14)'; c.fillRect(px, py + u * .94, u, u * .06) }
    } else if (t === 2) {
      c.fillStyle = 'rgba(117,91,56,.08)'; for (let i = 0; i < 3; i++) c.fillRect(px + u * (.16 + i * .28), py + u * (.25 + (i % 2) * .39), u * .1, u * .035);
    }
  }
  c.restore(); return cv;
}

const poly = (c, pts, color, lw) => { path(c, pts); fill(c, color, lw) };
export function drawTaoyuanChar(c, cx, footY, s, look, dir, step) {
  const lw = Math.max(1.1, s * .035), side = dir === 'left' || dir === 'right', back = dir === 'up', flip = dir === 'left' ? -1 : 1;
  const bob = step ? -s * .025 : 0, y = footY + bob, skin = look.skin || '#efbd92', hair = look.hair || '#3d2c29';
  const top = look.top || '#4b79b8', bottom = look.bottom || '#34445b', shoes = look.shoes || '#3b3340';
  c.save(); c.translate(cx, 0); c.scale(flip, 1); c.translate(-cx, 0); c.lineJoin = 'round'; c.lineCap = 'round';
  const stride = step ? s * .075 : 0;
  // Compact six-head silhouette, with the same limited three-tone ramp used by buildings.
  poly(c, [[cx - s * .24 - stride, y - s * .34], [cx - s * .06, y - s * .36], [cx - s * .03, y - s * .06], [cx - s * .2, y - s * .03]], shade(bottom, -.14), lw);
  poly(c, [[cx + s * .03, y - s * .36], [cx + s * .21 + stride, y - s * .33], [cx + s * .19, y - s * .03], [cx + s * .02, y - s * .06]], bottom, lw);
  rr(c, cx - s * .23 - stride, y - s * .09, s * .23, s * .1, s * .04); fill(c, shoes, lw); rr(c, cx + s * .01, y - s * .09, s * .25 + stride, s * .1, s * .04); fill(c, shade(shoes, -.08), lw);
  const torsoX = side ? cx - s * .2 : cx - s * .25; rr(c, torsoX, y - s * .75, side ? s * .4 : s * .5, s * .43, s * .09); fill(c, grad(c, torsoX, 0, torsoX + s * .5, 0, [shade(top, .18), top, shade(top, -.15)]), lw);
  if (look.pack) { rr(c, back ? cx - s * .28 : cx + s * .17, y - s * .69, s * .24, s * .34, s * .07); fill(c, shade(top, -.28), lw) }
  const armSwing = step ? s * .055 : 0;
  c.strokeStyle = shade(top, -.09); c.lineWidth = s * .16; c.beginPath(); c.moveTo(cx - s * .2, y - s * .66); c.lineTo(cx - s * .31, y - s * .38 + armSwing); c.stroke();
  c.strokeStyle = top; c.beginPath(); c.moveTo(cx + s * .2, y - s * .66); c.lineTo(cx + s * .31, y - s * .38 - armSwing); c.stroke();
  c.fillStyle = skin; c.beginPath(); c.arc(cx - s * .31, y - s * .35 + armSwing, s * .075, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(cx + s * .31, y - s * .35 - armSwing, s * .075, 0, Math.PI * 2); c.fill();
  rr(c, cx - s * .08, y - s * .83, s * .16, s * .13, s * .04); fill(c, skin, lw);
  c.beginPath(); c.ellipse(cx, y - s * 1.01, side ? s * .22 : s * .25, s * .27, 0, 0, Math.PI * 2); fill(c, skin, lw);
  c.beginPath(); c.ellipse(cx, y - s * 1.12, side ? s * .23 : s * .26, s * .17, 0, Math.PI, Math.PI * 2); c.lineTo(cx + s * .22, y - s * 1.03); c.quadraticCurveTo(cx, y - s * 1.11, cx - s * .22, y - s * 1.03); c.closePath(); fill(c, hair, lw);
  if (look.cap) { c.beginPath(); c.ellipse(cx, y - s * 1.2, s * .28, s * .11, 0, Math.PI, Math.PI * 2); fill(c, look.cap, lw); c.fillStyle = shade(look.cap, -.15); c.fillRect(cx + (side ? s * .08 : -s * .15), y - s * 1.2, s * .3, s * .055) }
  if (!back) {
    c.fillStyle = OUT; if (side) { c.beginPath(); c.arc(cx + s * .115, y - s * 1.03, s * .025, 0, Math.PI * 2); c.fill() } else { for (const dx of [-.09, .09]) { c.beginPath(); c.arc(cx + dx * s, y - s * 1.03, s * .024, 0, Math.PI * 2); c.fill() } }
    c.strokeStyle = shade(skin, -.24); c.lineWidth = s * .018; c.beginPath(); c.moveTo(cx - s * .045, y - s * .91); c.quadraticCurveTo(cx, y - s * .88, cx + s * .045, y - s * .91); c.stroke();
  }
  c.restore();
}
