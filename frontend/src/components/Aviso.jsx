// Mensaje flotante abajo de la pantalla (pago cancelado, errores de conexión).
export default function Aviso({ aviso }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[300] w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[14px] px-5 py-3.5 font-semibold text-noche shadow-[0_20px_50px_-10px_rgb(0_0_0/0.6)] transition duration-250 ${aviso?.tipo === 'error' ? 'bg-kick' : 'bg-texto'} ${aviso?.visible ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'}`}
    >
      {aviso?.texto}
    </div>
  );
}
