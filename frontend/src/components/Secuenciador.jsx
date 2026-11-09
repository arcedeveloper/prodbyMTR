import { useEffect, useRef, useState } from 'react';
import { obtenerAudio, sonidos } from '../lib/audio.js';

const BPM = 96;
const PASOS = 16;
const DURACION_PASO = 60 / BPM / 4;

const filas = [
  { id: 'kick', nombre: 'Kick', inicial: [0, 4, 8, 12] },
  { id: 'snare', nombre: 'Snare', inicial: [3, 6, 11, 14] },
  { id: 'hat', nombre: 'Hi-hat', inicial: [0, 2, 4, 6, 8, 10, 12, 14] },
  { id: 'perc', nombre: 'Perc', inicial: [2, 7, 10, 15] }
];

const patronInicial = () => filas.map((f) => Array.from({ length: PASOS }, (_, i) => f.inicial.includes(i)));

export default function Secuenciador() {
  const [patron, setPatron] = useState(patronInicial);
  const [sonando, setSonando] = useState(false);
  const [actual, setActual] = useState(-1);

  const patronRef = useRef(patron);
  const motorRef = useRef(null);
  const introRef = useRef(null);
  patronRef.current = patron;

  function detenerIntro() {
    clearInterval(introRef.current);
    introRef.current = null;
  }

  function detener() {
    const motor = motorRef.current;
    if (motor) {
      clearInterval(motor.intervalo);
      cancelAnimationFrame(motor.cuadro);
      motorRef.current = null;
    }
    setSonando(false);
    setActual(-1);
  }

  // Planifica los golpes un poco antes de que suenen para que el ritmo no se trabe.
  function iniciar() {
    detenerIntro();
    const ctx = obtenerAudio();
    const motor = { paso: 0, tiempo: ctx.currentTime + 0.05, cola: [] };

    const planificar = () => {
      while (motor.tiempo < ctx.currentTime + 0.12) {
        filas.forEach((fila, f) => {
          if (patronRef.current[f][motor.paso]) sonidos[fila.id](motor.tiempo);
        });
        motor.cola.push({ paso: motor.paso, tiempo: motor.tiempo });
        motor.paso = (motor.paso + 1) % PASOS;
        motor.tiempo += DURACION_PASO;
      }
    };
    const dibujar = () => {
      while (motor.cola.length && motor.cola[0].tiempo <= ctx.currentTime) setActual(motor.cola.shift().paso);
      motor.cuadro = requestAnimationFrame(dibujar);
    };

    planificar();
    motor.intervalo = setInterval(planificar, 25);
    motor.cuadro = requestAnimationFrame(dibujar);
    motorRef.current = motor;
    setSonando(true);
  }

  function alternarPaso(f, p) {
    const activar = !patron[f][p];
    setPatron((prev) => prev.map((fila, i) => (i === f ? fila.map((v, j) => (j === p ? activar : v)) : fila)));
    if (activar && !sonando) {
      const ctx = obtenerAudio();
      sonidos[filas[f].id](ctx.currentTime + 0.01);
    }
  }

  // Una pasada en silencio al cargar, para mostrar que la grilla se mueve.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let paso = 0;
    const espera = setTimeout(() => {
      introRef.current = setInterval(() => {
        if (paso >= PASOS) {
          detenerIntro();
          setActual(-1);
          return;
        }
        setActual(paso++);
      }, DURACION_PASO * 1000);
    }, 700);
    return () => {
      clearTimeout(espera);
      detenerIntro();
    };
  }, []);

  // Se detiene si la pestaña queda en segundo plano o el componente se desmonta.
  useEffect(() => {
    const alOcultar = () => document.hidden && detener();
    document.addEventListener('visibilitychange', alOcultar);
    return () => {
      document.removeEventListener('visibilitychange', alOcultar);
      detener();
    };
  }, []);

  return (
    <div className="rounded-[22px] border border-linea bg-panel p-[clamp(16px,2.5vw,28px)] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.05)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="titulo text-lg">Patrón dembow</p>
          <p className="text-[0.9375rem] text-suave">{BPM} BPM</p>
        </div>
        <button
          type="button"
          aria-pressed={sonando}
          onClick={sonando ? detener : iniciar}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full bg-acento py-2 pr-[18px] pl-3.5 font-bold text-noche aria-pressed:bg-texto"
        >
          {sonando ? (
            <span aria-hidden="true" className="size-3 rounded-[2px] bg-current" />
          ) : (
            <span aria-hidden="true" className="size-0 border-y-[7px] border-l-12 border-y-transparent border-l-current" />
          )}
          {sonando ? 'Detener' : 'Escuchar'}
        </button>
      </div>

      <div className="grid gap-2" role="group" aria-label="Pasos del patrón">
        {filas.map((fila, f) => (
          <div
            key={fila.id}
            style={{ '--canal': `var(--color-${fila.id})` }}
            className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[56px_1fr] sm:gap-2.5"
          >
            <span className="text-sm font-semibold text-(--canal)">{fila.nombre}</span>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
              {[0, 1, 2, 3].map((tiempo) => (
                <div key={tiempo} className="grid grid-cols-4 gap-[3px] sm:gap-1">
                  {[0, 1, 2, 3].map((n) => {
                    const p = tiempo * 4 + n;
                    return (
                      <button
                        key={p}
                        type="button"
                        aria-label={`${fila.nombre}, paso ${p + 1}`}
                        aria-pressed={patron[f][p]}
                        data-actual={actual === p}
                        onClick={() => alternarPaso(f, p)}
                        className={`aspect-[1/1.25] min-w-0 cursor-pointer rounded-[3px] transition duration-75 hover:shadow-[inset_0_0_0_2px_var(--canal)] aria-pressed:bg-(--canal) data-[actual=true]:scale-y-[0.88] data-[actual=true]:shadow-[inset_0_0_0_2px_var(--color-texto)] aria-pressed:data-[actual=true]:shadow-[0_0_18px_var(--canal),inset_0_0_0_2px_var(--color-texto)] sm:rounded-[5px] ${tiempo % 2 === 0 ? 'bg-tiempo' : 'bg-panel-alto'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.9375rem] text-suave">Tocá los cuadros para armar tu propio patrón.</p>
    </div>
  );
}
