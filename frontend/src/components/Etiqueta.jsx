// Etiqueta de color ("Nuevo", "Más popular"). Toma el color de la variable --color del producto.
export default function Etiqueta({ children, flotante = false }) {
  return (
    <span
      className={`inline-block rounded-full bg-(--color,var(--color-acento)) px-2.5 py-1 align-middle font-texto text-[0.8125rem] leading-none font-bold text-noche [font-stretch:100%] ${flotante ? 'absolute top-3 left-3' : ''}`}
    >
      {children}
    </span>
  );
}
