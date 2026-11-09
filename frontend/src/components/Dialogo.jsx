import { useEffect, useRef } from 'react';

// Ventana modal con <dialog> nativo: maneja el foco, Escape y el fondo oscuro.
export default function Dialogo({ abierto, onCerrar, className = '', children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCerrar();
      }}
      onClick={(e) => e.target === ref.current && onCerrar()}
      className={`m-auto max-h-[calc(100dvh-32px)] w-[min(100%-32px,480px)] rounded-[22px] border border-linea bg-panel p-7 text-texto shadow-[0_40px_100px_-20px_rgb(0_0_0/0.8)] ${className}`}
      {...props}
    >
      {children}
    </dialog>
  );
}
