import { useState } from 'react';
import { servicios } from '../data/productos.js';
import { WHATSAPP } from '../config.js';
import Boton from './Boton.jsx';
import Dialogo from './Dialogo.jsx';
import Etiqueta from './Etiqueta.jsx';

const usd = (n) => `$${n} USD`;

const campo = 'w-full rounded-lg border border-linea bg-noche px-3.5 py-3 font-normal placeholder:text-apagado focus:border-acento focus:outline-none';

function ServicioDialogo({ servicio, onCerrar }) {
  function enviar(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const lineas = [
      `Hola! Quiero pedir: *${servicio.nombre}* (${usd(servicio.precio)})`,
      '',
      `*Nombre:* ${d.nombre}`,
      ...[
        d.genero && `*Género:* ${d.genero}`,
        d.referencias && `*Referencias:* ${d.referencias}`,
        d.extra && `*${servicio.campoExtra.etiqueta}:* ${d.extra}`,
        d.detalle && `*Detalles:* ${d.detalle}`
      ].filter(Boolean)
    ];
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    onCerrar();
  }

  return (
    <Dialogo abierto={Boolean(servicio)} onCerrar={onCerrar} aria-labelledby="servicio-titulo">
      {servicio && (
        <form key={servicio.nombre} onSubmit={enviar} className="grid gap-3.5">
          <div className="flex items-start justify-between gap-3">
            <h2 id="servicio-titulo" className="titulo text-2xl">{servicio.nombre}</h2>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="-mt-1.5 -mr-2 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-[1.75rem] leading-none text-suave hover:bg-panel-alto hover:text-texto"
            >
              ×
            </button>
          </div>
          <p className="-mt-1.5 text-suave">{usd(servicio.precio)}. {servicio.detalle}.</p>

          <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
            Tu nombre o nombre artístico
            <input name="nombre" required autoComplete="name" className={campo} />
          </label>
          <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
            Género musical
            <input name="genero" placeholder="Cumbia, reggaeton, trap..." className={campo} />
          </label>
          <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
            Referencias
            <input name="referencias" placeholder="Artistas o canciones que te gusten" className={campo} />
          </label>
          <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
            {servicio.campoExtra.etiqueta}
            <input name="extra" placeholder={servicio.campoExtra.ejemplo} className={campo} />
          </label>
          <label className="grid gap-1.5 text-[0.9375rem] font-semibold">
            Contame más (opcional)
            <textarea name="detalle" rows="3" placeholder="Fecha límite, links a tu tema, lo que necesites" className={`${campo} resize-y`} />
          </label>
          <Boton type="submit" className="mt-1.5">Enviar por WhatsApp</Boton>
        </form>
      )}
    </Dialogo>
  );
}

export default function Servicios() {
  const [elegido, setElegido] = useState(null);

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="border-y border-linea bg-panel py-[clamp(56px,8vw,104px)]">
      <div className="contenedor">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h2 id="servicios-titulo" className="titulo max-w-[20ch] text-[clamp(1.9rem,3.6vw,2.875rem)] [font-stretch:125%]">
            Mezcla, mastering y producción a medida
          </h2>
          <p className="max-w-[44ch] text-suave">
            Elegí un servicio, contame tu proyecto y coordinamos los detalles por WhatsApp.
          </p>
        </div>

        <ul className="border-t border-linea">
          {servicios.map((s) => (
            <li
              key={s.nombre}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-7 gap-y-4 border-b border-linea py-6 lg:grid-cols-[minmax(0,1fr)_190px_110px_auto]"
            >
              <div className="col-span-2 lg:col-span-1">
                <h3 className="titulo text-xl [font-stretch:115%]">
                  {s.nombre}
                  {s.etiqueta && <span className="ml-2"><Etiqueta>{s.etiqueta}</Etiqueta></span>}
                </h3>
                <p className="mt-1.5 max-w-[60ch] text-suave">{s.descripcion}</p>
              </div>
              <p className="col-span-2 text-[0.9375rem] text-suave lg:col-span-1">{s.detalle}</p>
              <p className="titulo text-2xl whitespace-nowrap [font-stretch:110%] lg:text-right">{usd(s.precio)}</p>
              <Boton variante="secundario" className="min-w-[110px]" onClick={() => setElegido(s)}>Pedir</Boton>
            </li>
          ))}
        </ul>
      </div>

      <ServicioDialogo servicio={elegido} onCerrar={() => setElegido(null)} />
    </section>
  );
}
