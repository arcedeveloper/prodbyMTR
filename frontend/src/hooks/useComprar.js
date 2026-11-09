import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../config.js';

// Pide al backend una sesión de pago de Stripe y redirige a la página de pago.
export function useComprar(avisar) {
  const [cargandoId, setCargandoId] = useState(null);
  const [mostrarEspera, setMostrarEspera] = useState(false);
  const controladorRef = useRef(null);

  function terminar() {
    controladorRef.current = null;
    setCargandoId(null);
    setMostrarEspera(false);
  }

  async function comprar(productId) {
    if (controladorRef.current) return;
    const controlador = new AbortController();
    controladorRef.current = controlador;
    setCargandoId(productId);

    const limite = setTimeout(() => controlador.abort(), 75000);
    // Si tarda, se avisa que el servidor se está despertando.
    const espera = setTimeout(() => setMostrarEspera(true), 1500);

    try {
      const respuesta = await fetch(`${API_URL}/api/crear-pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        signal: controlador.signal
      });
      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || !datos.url) {
        throw new Error(datos.message || 'No se pudo iniciar el pago. Probá de nuevo en un momento.');
      }
      window.location.href = datos.url;
    } catch (error) {
      if (controladorRef.current === controlador) terminar();
      if (controlador.signal.aborted) {
        // Si lo canceló la persona no se avisa nada; si fue por tiempo, sí.
        if (!controlador.signal.reason?.manual) {
          avisar('El servidor tardó demasiado en responder. Probá de nuevo: la segunda vez suele ser rápido.', 'error');
        }
      } else {
        avisar(error instanceof TypeError ? 'Sin conexión con el servidor. Revisá tu internet y probá de nuevo.' : error.message, 'error');
      }
    } finally {
      clearTimeout(limite);
      clearTimeout(espera);
    }
  }

  function cancelar() {
    controladorRef.current?.abort({ manual: true });
    terminar();
  }

  // Al volver con "atrás" desde Stripe, los botones quedan habilitados de nuevo.
  useEffect(() => {
    const alVolver = (e) => e.persisted && terminar();
    window.addEventListener('pageshow', alVolver);
    return () => window.removeEventListener('pageshow', alVolver);
  }, []);

  return { comprar, cancelar, cargandoId, mostrarEspera };
}
