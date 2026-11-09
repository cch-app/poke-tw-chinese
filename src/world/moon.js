// Lunar calendar and celestial rendering are kept separate from weather so
// every scene and the HUD use the same date-driven moon shape.
const SYNODIC_DAYS = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

const PHASES = {
  new: { labels: ['新月', 'New Moon', '新月'] },
  'waxing-crescent': { labels: ['蛾眉月', 'Waxing Crescent', '三日月'] },
  'first-quarter': { labels: ['上弦月', 'First Quarter', '上弦の月'] },
  'waxing-gibbous': { labels: ['盈凸月', 'Waxing Gibbous', '満ちていく凸月'] },
  full: { labels: ['滿月', 'Full Moon', '満月'] },
  'waning-gibbous': { labels: ['虧凸月', 'Waning Gibbous', '欠けていく凸月'] },
  'third-quarter': { labels: ['下弦月', 'Third Quarter', '下弦の月'] },
  'waning-crescent': { labels: ['殘月', 'Waning Crescent', '有明月'] },
};

export function moonPhase(date = new Date()) {
  const elapsedDays = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  return ((elapsedDays % SYNODIC_DAYS) + SYNODIC_DAYS) % SYNODIC_DAYS;
}

export function moonState(date = new Date()) {
  const age = moonPhase(date);
  const cycle = age / SYNODIC_DAYS;
  const illumination = .5 * (1 - Math.cos(cycle * Math.PI * 2));
  let phase = 'waxing-crescent';
  if (illumination < .035 || age > SYNODIC_DAYS - 1.85) phase = 'new';
  else if (age < 7.38) phase = 'waxing-crescent';
  else if (age < 9.22) phase = 'first-quarter';
  else if (age < 14.765) phase = 'waxing-gibbous';
  else if (age < 16.615) phase = 'full';
  else if (age < 22.15) phase = 'waning-gibbous';
  else if (age < 23.99) phase = 'third-quarter';
  else phase = 'waning-crescent';
  return { age, illumination, waxing: age < SYNODIC_DAYS / 2, phase, labels: PHASES[phase].labels };
}

/** Draw a date-driven moon. The result is deliberately pixel-friendly: a
 * single luminous disc plus an overlapping dark disc for curved phases. */
export function drawMoon(g, x, y, radius, date = new Date(), alpha = 1) {
  const state = moonState(date);
  g.save();
  g.globalAlpha = alpha;
  if (state.phase === 'new') {
    g.strokeStyle = '#8da2c4';
    g.lineWidth = Math.max(1, radius * .06);
    g.beginPath(); g.arc(x, y, radius, 0, Math.PI * 2); g.stroke();
    g.restore();
    return state;
  }
  g.fillStyle = '#fff2bd';
  g.beginPath(); g.arc(x, y, radius, 0, Math.PI * 2); g.fill();
  if (state.illumination < .98) {
    const cutOffset = (1 - state.illumination) * radius * 2;
    g.globalCompositeOperation = 'destination-out';
    g.beginPath();
    g.arc(x + (state.waxing ? -cutOffset : cutOffset), y, radius * 1.02, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  return state;
}

export const moonPhases = PHASES;
