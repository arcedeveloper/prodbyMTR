import Boton from './Boton.jsx';
import Secuenciador from './Secuenciador.jsx';

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="contenedor grid items-center gap-[clamp(32px,5vw,72px)] pt-[clamp(48px,8vw,104px)] pb-[clamp(56px,8vw,96px)] lg:grid-cols-2"
    >
      <div>
        <h1
          id="hero-titulo"
          className="font-titulo text-[clamp(2.3rem,4.6vw,3.9rem)] leading-[0.98] font-black tracking-[-0.03em] text-balance hyphens-auto [font-stretch:125%]"
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
  );
}
