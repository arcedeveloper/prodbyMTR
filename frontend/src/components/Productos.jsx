import { useState } from 'react';
import { productos } from '../data/productos.js';
import Boton from './Boton.jsx';
import Etiqueta from './Etiqueta.jsx';

const filtros = [
  { id: 'todos', texto: 'Todos' },
  { id: 'sonidos', texto: 'Sonidos' },
  { id: 'plantillas', texto: 'Plantillas' },
  { id: 'bundles', texto: 'Bundles' }
];

const porId = Object.fromEntries(productos.map((p) => [p.id, p]));
const usd = (n) => `$${n} USD`;
const colorDe = (p) => ({ '--color': `var(--color-${p.color})` });

function ProductoCard({ producto: p, cargando, onComprar }) {
  return (
    <article style={colorDe(p)} className="flex flex-col overflow-hidden rounded-[14px] border border-t-4 border-linea border-t-(--color) bg-panel">
      <div className="relative aspect-square bg-panel-alto">
        <img src={p.imagen} alt={`Portada de ${p.nombre}`} width="720" height="720" loading="lazy" className="size-full object-cover" />
        {p.etiqueta && <Etiqueta flotante>{p.etiqueta}</Etiqueta>}
      </div>
      <div className="flex-1 px-5 pt-5">
        <h3 className="titulo text-xl [font-stretch:112%]">{p.nombre}</h3>
        <p className="mt-2 text-[0.9875rem] text-suave">{p.descripcion}</p>
        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {p.incluye.map((item) => (
            <li key={item} className="rounded-md bg-panel-alto px-2.5 py-0.5 text-[0.8125rem] font-semibold">{item}</li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-3.5 p-5">
        <p className="titulo text-2xl whitespace-nowrap [font-stretch:110%]">{usd(p.precio)}</p>
        <Boton variante="comprar" disabled={cargando} onClick={() => onComprar(p.id)}>
          {cargando ? 'Preparando pago...' : 'Comprar'}
        </Boton>
      </div>
    </article>
  );
}

function BundleCard({ bundle: b, cargando, onComprar }) {
  const incluidos = b.contiene.map((id) => porId[id]);
  const suelto = incluidos.reduce((total, p) => total + p.precio, 0);
  const ahorro = suelto - b.precio;

  return (
    <article
      style={{
        ...colorDe(b),
        backgroundImage: 'linear-gradient(100deg, color-mix(in srgb, var(--color) 14%, var(--color-panel)), var(--color-panel) 60%)'
      }}
      className="grid items-center gap-[18px] rounded-[22px] border border-[color-mix(in_srgb,var(--color)_40%,var(--color-linea))] p-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-7 lg:grid-cols-[220px_minmax(0,1fr)_240px]"
    >
      <img src={b.imagen} alt={`Portada de ${b.nombre}`} width="720" height="720" loading="lazy" className="aspect-square w-full rounded-[14px] object-cover" />
      <div>
        {b.etiqueta && <div className="mb-2.5"><Etiqueta>{b.etiqueta}</Etiqueta></div>}
        <h3 className="titulo text-[clamp(1.5rem,2.4vw,2rem)] font-black [font-stretch:130%]">{b.nombre}</h3>
        <p className="mt-2 text-[0.9875rem] text-suave">{b.descripcion}</p>
        <p className="mt-3.5 text-[0.9375rem] text-suave">
          <strong className="text-texto">Incluye:</strong> {incluidos.map((p) => p.nombre).join(', ')}.
        </p>
      </div>
      <div className="grid gap-1 sm:col-span-2 lg:col-span-1">
        <p className="text-[0.9375rem] text-suave line-through">Por separado {usd(suelto)}</p>
        <p className="titulo text-4xl leading-tight [font-stretch:110%]">{usd(b.precio)}</p>
        <p className="mb-3 font-bold text-(--color)">Ahorrás ${ahorro} ({Math.round((ahorro / suelto) * 100)}%)</p>
        <Boton variante="comprar" disabled={cargando} onClick={() => onComprar(b.id)}>
          {cargando ? 'Preparando pago...' : 'Comprar bundle'}
        </Boton>
      </div>
    </article>
  );
}

export default function Productos({ cargandoId, onComprar }) {
  const [filtro, setFiltro] = useState('todos');
  const sueltos = productos.filter((p) => p.categoria !== 'bundles' && (filtro === 'todos' || p.categoria === filtro));
  const bundles = filtro === 'todos' || filtro === 'bundles' ? productos.filter((p) => p.categoria === 'bundles') : [];

  return (
    <section id="productos" aria-labelledby="productos-titulo" className="py-[clamp(56px,8vw,104px)]">
      <div className="contenedor">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h2 id="productos-titulo" className="titulo max-w-[20ch] text-[clamp(1.9rem,3.6vw,2.875rem)] [font-stretch:125%]">
            Packs y plantillas
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar productos">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filtro === f.id}
                onClick={() => setFiltro(f.id)}
                className="min-h-[42px] cursor-pointer rounded-full border border-linea px-[18px] py-2 font-semibold text-suave hover:border-suave hover:text-texto aria-pressed:border-texto aria-pressed:bg-texto aria-pressed:text-noche"
              >
                {f.texto}
              </button>
            ))}
          </div>
        </div>

        {sueltos.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-5">
            {sueltos.map((p) => (
              <ProductoCard key={p.id} producto={p} cargando={cargandoId === p.id} onComprar={onComprar} />
            ))}
          </div>
        )}

        {bundles.length > 0 && (
          <div className={`grid gap-5 ${sueltos.length > 0 ? 'mt-5' : ''}`}>
            {bundles.map((b) => (
              <BundleCard key={b.id} bundle={b} cargando={cargandoId === b.id} onComprar={onComprar} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
