import { useEffect, useRef, useState } from 'react';
import { API_URL } from './config.js';
import { useComprar } from './hooks/useComprar.js';
import Aviso from './components/Aviso.jsx';
import ComoComprar from './components/ComoComprar.jsx';
import DialogoPago from './components/DialogoPago.jsx';
import Exito from './components/Exito.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Productos from './components/Productos.jsx';
import Servicios from './components/Servicios.jsx';

const params = new URLSearchParams(window.location.search);

export default function App() {
  const [aviso, setAviso] = useState(null);
  const avisoTimer = useRef(null);

  function avisar(texto, tipo = 'info') {
    setAviso({ texto, tipo, visible: true });
    clearTimeout(avisoTimer.current);
    avisoTimer.current = setTimeout(() => setAviso((a) => a && { ...a, visible: false }), 6000);
  }

  const { comprar, cancelar, cargandoId, mostrarEspera } = useComprar(avisar);

  useEffect(() => {
    // Despierta el servidor de Render apenas se abre la página, así el pago responde más rápido.
    fetch(`${API_URL}/api/health`).catch(() => {});

    if (params.get('pago') === 'cancelado') {
      avisar('Pago cancelado. No se cobró nada.');
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
  }, []);

  // Stripe vuelve con ?session_id=... cuando el pago salió bien
  const sessionId = params.get('session_id');
  if (sessionId) return <Exito sessionId={sessionId} />;

  return (
    <>
      <a
        href="#productos"
        className="absolute -top-16 left-4 z-[200] rounded-lg bg-acento px-4 py-2.5 font-bold text-noche no-underline focus:top-4"
      >
        Ir a los productos
      </a>
      <Header />
      <main id="inicio">
        <Hero />
        <Productos cargandoId={cargandoId} onComprar={comprar} />
        <Servicios />
        <ComoComprar />
      </main>
      <Footer />
      <DialogoPago abierto={mostrarEspera} onCancelar={cancelar} />
      <Aviso aviso={aviso} />
    </>
  );
}
