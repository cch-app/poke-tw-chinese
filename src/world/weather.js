// Local-time ambience. Weather is intentionally deterministic for a short
// local-time window so it feels like a forecast rather than flickering every
// render frame, while still changing during a real day.
const LABELS = {
  sunny: ['晴朗', 'Sunny', '晴れ'],
  scorching: ['酷熱', 'Scorching sun', '猛暑'],
  cloudy: ['多雲', 'Cloudy', '曇り'],
  rain: ['下雨', 'Rain', '雨'],
  storm: ['暴風雨', 'Storm', '嵐'],
  sunset: ['夕陽', 'Sunset', '夕焼け'],
  dusk: ['黃昏', 'Dusk', '黄昏'],
  night: ['夜晚', 'Night', '夜'],
};

const hash = value => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
};

export function dayPhase(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h < 5.5 || h >= 21) return 'night';
  if (h < 6.5) return 'dawn';
  if (h < 17.2) return 'day';
  if (h < 18.7) return 'sunset';
  if (h < 21) return 'dusk';
  return 'night';
}

export function weatherAt(date = new Date(), city = 0) {
  const phase = dayPhase(date);
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${city}-${Math.floor(date.getHours() / 2)}`;
  const roll = hash(dateKey);
  let kind = 'sunny';
  if (phase === 'night') kind = roll < .28 ? 'cloudy' : 'night';
  else if (phase === 'sunset') kind = roll < .22 ? 'rain' : 'sunset';
  else if (phase === 'dusk' || phase === 'dawn') kind = roll < .2 ? 'rain' : phase === 'dusk' ? 'dusk' : 'cloudy';
  else if (roll < .1) kind = 'storm';
  else if (roll < .28) kind = 'rain';
  else if (roll < .48) kind = 'cloudy';
  else if (date.getHours() >= 11 && date.getHours() < 16 && roll > .86) kind = 'scorching';
  return { kind, phase, label: LABELS[kind], bucket: Math.floor(date.getTime() / 7200000) };
}

export function localClock(date = new Date()) {
  return {
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
  };
}

export const weatherLabels = LABELS;
