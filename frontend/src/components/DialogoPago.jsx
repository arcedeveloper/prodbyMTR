import Boton from './Boton.jsx';
import Dialogo from './Dialogo.jsx';

const barras = ['bg-kick', 'bg-snare [animation-delay:0.15s]', 'bg-hat [animation-delay:0.3s]', 'bg-perc [animation-delay:0.45s]'];

export default function DialogoPago({ abierto, onCancelar }) {
  return (
    <Dialogo abierto={abierto} onCerrar={onCancelar} aria-labelledby="pago-titulo" className="text-center">
      <div aria-hidden="true" className="mb-[18px] flex h-9 items-end justify-center gap-[5px]">
        {barras.map((clase) => (
          <span key={clase} className={`h-1/4 w-2 animate-barra rounded-[3px] ${clase}`} />
        ))}
      </div>
      <h2 id="pago-titulo" className="titulo text-2xl">Preparando tu pago</h2>
      <p className="mt-2.5 mb-[22px] text-suave">
        Si es la primera compra del día, el servidor puede tardar hasta un minuto en responder.
      </p>
      <Boton variante="secundario" onClick={onCancelar}>Cancelar</Boton>
    </Dialogo>
  );
}
