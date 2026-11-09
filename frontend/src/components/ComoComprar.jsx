const pasos = [
  { titulo: 'Elegí tu pack', texto: 'Tocá "Comprar" en el producto que quieras.', color: 'text-kick' },
  { titulo: 'Pagá con tarjeta', texto: 'El pago lo procesa Stripe. Tus datos de tarjeta nunca pasan por esta página.', color: 'text-snare' },
  { titulo: 'Descargá desde tu email', texto: 'En pocos minutos te llega el enlace de descarga. Si no lo ves, revisá spam o promociones.', color: 'text-hat' }
];

const preguntas = [
  {
    pregunta: '¿Sirve para mi programa?',
    respuesta: 'Los samples y drumkits funcionan en cualquier programa de producción. La Vocal Chain Template y las Plantillas de FL Studio necesitan FL Studio.'
  },
  {
    pregunta: 'No me llegó el email, ¿qué hago?',
    respuesta: 'Revisá spam y promociones. Si en 15 minutos no aparece, escribime por WhatsApp con el email que usaste al pagar y te lo reenvío.'
  },
  {
    pregunta: '¿Cómo puedo pagar?',
    respuesta: 'Con tarjeta de crédito o débito. El pago es en dólares y lo procesa Stripe de forma segura.'
  },
  {
    pregunta: '¿Cuánto tarda un servicio?',
    respuesta: 'El mastering se entrega en 1 a 2 días y la mezcla en 3 a 5 días. Los beats y presets personalizados los coordinamos según tu proyecto.'
  }
];

export default function ComoComprar() {
  return (
    <section id="como-funciona" aria-labelledby="pasos-titulo" className="py-[clamp(56px,8vw,104px)]">
      <div className="contenedor">
        <h2 id="pasos-titulo" className="titulo text-[clamp(1.9rem,3.6vw,2.875rem)] [font-stretch:125%]">Cómo comprar un pack</h2>
        <ol className="mt-9 grid gap-5 md:grid-cols-3">
          {pasos.map((paso, i) => (
            <li key={paso.titulo} className="border-t-2 border-linea pt-5">
              <span aria-hidden="true" className={`mb-3.5 block font-titulo text-[2.75rem] leading-none font-black [font-stretch:140%] ${paso.color}`}>
                {i + 1}
              </span>
              <h3 className="text-lg font-bold">{paso.titulo}</h3>
              <p className="mt-1.5 max-w-[36ch] text-suave">{paso.texto}</p>
            </li>
          ))}
        </ol>

        <div className="mt-[clamp(56px,8vw,96px)] max-w-[760px]">
          <h2 className="titulo mb-5 text-[clamp(1.5rem,2.6vw,2rem)]">Preguntas frecuentes</h2>
          {preguntas.map((p) => (
            <details key={p.pregunta} className="group border-b border-linea">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[18px] text-[1.0625rem] font-bold">
                {p.pregunta}
                <span aria-hidden="true" className="text-2xl leading-none text-suave transition group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[65ch] pb-[18px] text-suave">{p.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
