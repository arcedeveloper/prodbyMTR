import { useEffect, useState } from 'react';
import { API_URL, WHATSAPP } from '../config.js';
import Boton from './Boton.jsx';

const barras = ['h-[45%] bg-kick', 'h-full bg-snare', 'h-[70%] bg-hat', 'h-[35%] bg-perc'];

// Pantalla que se ve al volver de Stripe con el pago aprobado.
export default function Exito({ sessionId }) {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/verificar-sesion/${encodeURIComponent(sessionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.completed && d.email && setDatos(d))
      .catch(() => {});
  }, [sessionId]);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-[560px]">
        <div aria-hidden="true" className="mb-7 flex h-14 items-end gap-1.5">
          {barras.map((b) => <span key={b} className={`w-3.5 rounded ${b}`} />)}
        </div>
        <h1 className="font-titulo text-[clamp(2.2rem,7vw,3.25rem)] leading-none font-black tracking-[-0.03em] [font-stretch:140%]">
          ¡Pago confirmado!
        </h1>
        <p className="mt-[18px] text-[1.1875rem] text-suave">
          {datos ? (
            <>
              Gracias por comprar {datos.producto ? <strong className="text-texto">{datos.producto}</strong> : 'tu pack'}.
              En unos minutos te llega el enlace de descarga a <strong className="text-texto">{datos.email}</strong>.
            </>
          ) : (
            'Gracias por tu compra. En unos minutos te llega el enlace de descarga a tu email.'
          )}
        </p>
        <p className="mt-7 rounded-[14px] border border-linea bg-panel px-5 py-[18px] text-suave">
          Si no lo ves, revisá spam o promociones. ¿Pasaron 15 minutos y nada?{' '}
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="font-semibold text-acento">
            Escribime por WhatsApp
          </a>{' '}
          con el email que usaste y te lo reenvío.
        </p>
        <Boton href={window.location.pathname} className="mt-8">Volver a la tienda</Boton>
      </div>
    </main>
  );
}
