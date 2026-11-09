// Sonidos de batería generados en el navegador con Web Audio (no se cargan archivos).

let ctx = null;
let ruido = null;

export function obtenerAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    ruido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const datos = ruido.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function envolvente(t, pico, duracion) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(pico, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duracion);
  g.connect(ctx.destination);
  return g;
}

function fuenteRuido(t, duracion, destino) {
  const src = ctx.createBufferSource();
  src.buffer = ruido;
  src.connect(destino);
  src.start(t);
  src.stop(t + duracion);
}

export const sonidos = {
  kick(t) {
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.35);
    osc.connect(envolvente(t, 0.9, 0.45));
    osc.start(t);
    osc.stop(t + 0.45);
  },
  snare(t) {
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'highpass';
    filtro.frequency.value = 1400;
    filtro.connect(envolvente(t, 0.45, 0.18));
    fuenteRuido(t, 0.18, filtro);
    const tono = ctx.createOscillator();
    tono.type = 'triangle';
    tono.frequency.setValueAtTime(190, t);
    tono.connect(envolvente(t, 0.3, 0.1));
    tono.start(t);
    tono.stop(t + 0.1);
  },
  hat(t) {
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'highpass';
    filtro.frequency.value = 7500;
    filtro.connect(envolvente(t, 0.18, 0.05));
    fuenteRuido(t, 0.05, filtro);
  },
  perc(t) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.08);
    osc.connect(envolvente(t, 0.35, 0.09));
    osc.start(t);
    osc.stop(t + 0.09);
  }
};
