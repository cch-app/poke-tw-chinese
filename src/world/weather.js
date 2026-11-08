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

const LIVE_MAX_AGE = 15 * 60 * 1000;
let liveWeather = null;
let liveRequest = null;
let lastAttempt = 0;

function kindFromCode(code, temperature) {
  if (code >= 95) return 'storm';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 71 && code <= 86) return 'cloudy';
  if (code === 2 || code === 3 || code === 45 || code === 48) return 'cloudy';
  return temperature >= 33 ? 'scorching' : 'sunny';
}

/** Request current conditions using the player's device location. */
export function requestLiveWeather({ force = false } = {}) {
  const now = Date.now();
  if (liveRequest) return liveRequest;
  if (!force && liveWeather && now - liveWeather.updatedAt < LIVE_MAX_AGE) return Promise.resolve(liveWeather);
  if (!force && now - lastAttempt < 60 * 1000) return Promise.resolve(liveWeather);
  lastAttempt = now;
  if (typeof navigator === 'undefined' || !navigator.geolocation || typeof fetch !== 'function') return Promise.resolve(null);

  liveRequest = new Promise(resolve => {
    const fail = () => { liveRequest = null; resolve(null); };
    try {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
          const url = new URL('https://api.open-meteo.com/v1/forecast');
          url.searchParams.set('latitude', coords.latitude.toFixed(4));
          url.searchParams.set('longitude', coords.longitude.toFixed(4));
          url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day');
          url.searchParams.set('timezone', 'auto');
          const response = await fetch(url, { headers: { Accept: 'application/json' } });
          if (!response.ok) throw new Error(`weather request failed: ${response.status}`);
          const payload = await response.json();
          const current = payload.current || {};
          const temperature = Number(current.temperature_2m);
          const code = Number(current.weather_code);
          if (!Number.isFinite(temperature) || !Number.isFinite(code)) throw new Error('weather response incomplete');
          liveWeather = {
            kind: kindFromCode(code, temperature), temperature,
            humidity: Number(current.relative_humidity_2m), windSpeed: Number(current.wind_speed_10m),
            isDay: Number(current.is_day) === 1, updatedAt: Date.now(), source: 'live',
          };
          liveRequest = null; resolve(liveWeather);
        } catch (error) { console.warn('Live weather unavailable; using local fallback.', error); fail(); }
      }, fail, { enableHighAccuracy: false, maximumAge: LIVE_MAX_AGE, timeout: 8000 });
    } catch (error) { console.warn('Location access unavailable; using local weather fallback.', error); fail(); }
  });
  return liveRequest;
}

export function dayPhase(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h < 5.5 || h >= 21) return 'night';
  if (h < 6.5) return 'dawn';
  if (h < 17.2) return 'day';
  if (h < 18.7) return 'sunset';
  if (h < 21) return 'dusk';
  return 'night';
}

function scheduledWeatherAt(date = new Date(), city = 0) {
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
  return { kind, phase, label: LABELS[kind], bucket: Math.floor(date.getTime() / 7200000), source: 'local-simulation' };
}

export function weatherAt(date = new Date(), city = 0) {
  const fallback = scheduledWeatherAt(date, city);
  if (!liveWeather || Date.now() - liveWeather.updatedAt >= LIVE_MAX_AGE) return fallback;
  const phase = dayPhase(date);
  const kind = liveWeather.kind;
  return {
    ...fallback, ...liveWeather, phase,
    label: phase === 'night' && kind === 'sunny' ? LABELS.night : LABELS[kind],
    bucket: Math.floor(liveWeather.updatedAt / 7200000), source: 'live',
  };
}

export function localClock(date = new Date()) {
  return {
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
  };
}

export const weatherLabels = LABELS;
