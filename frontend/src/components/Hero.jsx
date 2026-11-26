import fondo from '../assets/fondo-estudio.webp';
import Boton from './Boton.jsx';
import Secuenciador from './Secuenciador.jsx';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Fondo: foto del estudio desenfocada, luces de color y degradados para que el texto se lea.
          La máscara lo desvanece hacia abajo para que se funda con el resto de la página. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)'
        }}
      >
        <img src={fondo} alt="" fetchPriority="high" className="size-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgb(26 20 36 / 0.92) 0%, rgb(26 20 36 / 0.62) 38%, rgb(26 20 36 / 0.12) 100%)'
          }}
        />
        <div className="absolute inset-0 bg-noche/50 lg:hidden" />
        <div className="absolute -top-32 -right-24 size-[520px] rounded-full bg-perc/30 blur-[130px]" />
      </div>

      <section
        aria-labelledby="hero-titulo"
        className="contenedor grid items-center gap-[clamp(32px,5vw,72px)] pt-[clamp(48px,8vw,104px)] pb-[clamp(56px,8vw,96px)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <div>
          <h1
            id="hero-titulo"
            className="font-titulo text-[clamp(2.25rem,4vw,3.25rem)] leading-[1] font-black tracking-[-0.025em] text-balance [font-stretch:100%]"
          >
            Sonidos para producir cumbia, reggaeton y trap
          </h1>
          <p className="mt-[22px] max-w-[46ch] text-[1.1875rem] text-suave">
            Drumkits, packs y plantillas de FL Studio hechos en Paraguay. Pagás con tarjeta y la descarga te llega al email en minutos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Boton href="#productos">Ver productos</Boton>
            <Boton href="#servicios" variante="secundario">Pedir mezcla o beat</Boton>
          </div>
        </div>
        <Secuenciador />
      </section>
    </div>
  );
}
