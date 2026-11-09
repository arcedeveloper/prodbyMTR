import { Marca } from './Header.jsx';

const redes = [
  { texto: 'WhatsApp', href: 'https://wa.me/595983775018' },
  { texto: 'Instagram', href: 'https://instagram.com/matiasropy' },
  { texto: 'TikTok', href: 'https://tiktok.com/@matiasrodas_' },
  { texto: 'Email', href: 'mailto:matirodas50@gmail.com' }
];

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-linea pt-14 pb-8">
      <div className="contenedor flex flex-wrap items-start justify-between gap-7">
        <div>
          <p className="text-[1.75rem]"><Marca /></p>
          <p className="mt-1.5 text-suave">¿Dudas sobre un pack o un servicio? Escribime.</p>
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {redes.map((r) => (
            <li key={r.texto}>
              <a
                href={r.href}
                target={r.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener"
                className="inline-flex min-h-11 items-center rounded-full border border-linea px-[18px] py-2 font-semibold no-underline hover:border-texto"
              >
                {r.texto}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="contenedor mt-10 text-sm text-suave">© {new Date().getFullYear()} César Matías Rodas Arce</p>
    </footer>
  );
}
