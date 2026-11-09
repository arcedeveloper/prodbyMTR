const variantes = {
  principal: 'border-transparent bg-acento text-noche hover:bg-acento-claro',
  secundario: 'border-linea bg-transparent hover:border-texto',
  comprar: 'w-full border-transparent bg-texto text-noche hover:bg-acento'
};

export default function Boton({ variante = 'principal', href, className = '', ...props }) {
  const clases = `inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-[22px] py-3 text-base font-bold no-underline transition-colors disabled:cursor-progress disabled:opacity-60 ${variantes[variante]} ${className}`;
  return href ? <a href={href} className={clases} {...props} /> : <button type="button" className={clases} {...props} />;
}
