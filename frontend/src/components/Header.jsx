import { useEffect, useState } from 'react';

const enlaces = [
  { href: '#productos', texto: 'Productos' },
  { href: '#servicios', texto: 'Servicios' },
  { href: '#como-funciona', texto: 'Cómo funciona' },
  { href: '#contacto', texto: 'Contacto' }
];

export function Marca({ className = '' }) {
  return (
    <span className={`font-titulo font-extrabold tracking-[-0.01em] [font-stretch:130%] ${className}`}>
      Prod By <span className="text-acento">MTR</span>
    </span>
  );
}

export default function Header() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : '';
  }, [abierto]);

  return (
    <header className="sticky top-0 z-50 border-b border-linea">
      {/* El desenfoque va en una capa aparte: en el header mismo rompería el menú fijo del celular */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-noche/90 backdrop-blur-md" />
      <div className="contenedor flex min-h-[68px] items-center justify-between">
        <a href="#inicio" className="text-xl no-underline" aria-label="Prod By MTR, inicio">
          <Marca />
        </a>

        <button
          type="button"
          className="-mr-2.5 grid size-12 cursor-pointer place-items-center md:hidden"
          aria-expanded={abierto}
          aria-controls="menu"
          onClick={() => setAbierto(!abierto)}
        >
          <span className="sr-only">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span className={`absolute left-0 h-0.5 w-6 rounded bg-texto transition ${abierto ? 'top-[7px] rotate-45' : 'top-0'}`} />
            <span className={`absolute top-[7px] left-0 h-0.5 w-6 rounded bg-texto transition ${abierto ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-6 rounded bg-texto transition ${abierto ? 'top-[7px] -rotate-45' : 'top-[14px]'}`} />
          </span>
        </button>

        <nav
          id="menu"
          aria-label="Principal"
          className={`fixed inset-x-0 top-[69px] bottom-0 flex flex-col bg-noche px-4 py-4 transition-[opacity,visibility] md:static md:visible md:flex-row md:gap-7 md:bg-transparent md:p-0 md:opacity-100 ${abierto ? 'visible opacity-100' : 'invisible opacity-0'}`}
        >
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className="border-b border-linea py-[18px] font-titulo text-2xl font-bold no-underline [font-stretch:120%] md:border-0 md:p-0 md:font-texto md:text-base md:font-semibold md:text-suave md:[font-stretch:100%] md:hover:text-texto"
            >
              {e.texto}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
