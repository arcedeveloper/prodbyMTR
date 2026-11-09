// Lo que se muestra en la página. El precio que se cobra está en backend/productos.js:
// si cambiás un precio, cambialo en los dos archivos.
// Los "id" tienen que coincidir con los del backend.

import imgDrumkit from '../assets/sample-bateria-acustica.webp';
import imgCumbia from '../assets/pack-cumbia.webp';
import imgReggaeton from '../assets/pack-reggaeton.webp';
import imgTrap from '../assets/pack-trap-essentials.webp';
import imgSynthwave from '../assets/pack-synthwave-pop.webp';
import imgVocal from '../assets/vocal-template.webp';
import imgPlantillas from '../assets/plantillas-fl.webp';
import imgBundleGeneros from '../assets/pack-bundle-urbano.webp';
import imgBundleCompleto from '../assets/bundle-completo-sonidos.webp';

export const productos = [
  {
    id: 'drumkit-essential',
    nombre: 'Drumkit Essential',
    categoria: 'sonidos',
    precio: 25,
    imagen: imgDrumkit,
    etiqueta: 'Más popular',
    color: 'kick',
    descripcion: 'Sonidos elegidos para cualquier género: kicks, snares, hi-hats y percusión con carácter.',
    incluye: ['150+ sonidos', 'Kicks, snares y hi-hats', 'Percusión']
  },
  {
    id: 'cumbia-420',
    nombre: 'Cumbia 420 Drumkit',
    categoria: 'sonidos',
    precio: 18,
    imagen: imgCumbia,
    etiqueta: 'Nuevo',
    color: 'snare',
    descripcion: 'El sonido de la cumbia argentina y paraguaya: gritos, samples de acordeón, guitarras y percusión.',
    incluye: ['150+ samples', 'Presets incluidos']
  },
  {
    id: 'reggaeton-hits',
    nombre: 'Reggaeton Hits Drumkit',
    categoria: 'sonidos',
    precio: 20,
    imagen: imgReggaeton,
    etiqueta: 'Top',
    color: 'perc',
    descripcion: 'Kicks potentes, snares con pegada, rolls de hi-hat y patrones de dembow listos para usar.',
    incluye: ['200+ sonidos', 'Patrones de dembow']
  },
  {
    id: 'trap-essentials',
    nombre: 'Trap Essentials Pack',
    categoria: 'sonidos',
    precio: 22,
    imagen: imgTrap,
    color: 'kick',
    descripcion: '808 distorsionados, hi-hats rápidos, kicks con sub y adlibs. Para trap latino y drill.',
    incluye: ['808 exclusivos', 'Pack de adlibs']
  },
  {
    id: 'synthwave-pop',
    nombre: 'Synthwave & Pop Pack',
    categoria: 'sonidos',
    precio: 25,
    imagen: imgSynthwave,
    color: 'hat',
    descripcion: 'Sintes retro, pads atmosféricos, arpegios y leads melódicos para pop moderno y synthwave.',
    incluye: ['100+ presets', 'Patrones MIDI']
  },
  {
    id: 'vocal-template',
    nombre: 'Vocal Chain Template',
    categoria: 'plantillas',
    precio: 17,
    imagen: imgVocal,
    color: 'perc',
    descripcion: 'Cadena vocal completa hecha solo con plugins nativos de FL Studio, sin instalar nada más.',
    incluye: ['EQ y compresión', 'Delay y reverb', 'Solo plugins nativos']
  },
  {
    id: 'plantillas-fl',
    nombre: 'Plantillas FL Studio',
    categoria: 'plantillas',
    precio: 29,
    imagen: imgPlantillas,
    color: 'hat',
    descripcion: 'Estructuras profesionales listas para usar en tus sesiones de mezcla, mastering y grabación.',
    incluye: ['2 de mezcla y mastering', '1 de grabación']
  },
  {
    id: 'bundle-generos',
    nombre: 'Bundle de Géneros',
    categoria: 'bundles',
    precio: 65,
    imagen: imgBundleGeneros,
    color: 'snare',
    descripcion: 'Cumbia, reggaeton, trap y synthwave en una sola descarga. Más de 600 samples y presets.',
    contiene: ['cumbia-420', 'reggaeton-hits', 'trap-essentials', 'synthwave-pop']
  },
  {
    id: 'bundle-completo',
    nombre: 'Bundle Completo',
    categoria: 'bundles',
    precio: 99,
    imagen: imgBundleCompleto,
    etiqueta: 'Mejor precio',
    color: 'kick',
    descripcion: 'Todos los packs y plantillas de la tienda en una sola descarga.',
    contiene: ['drumkit-essential', 'cumbia-420', 'reggaeton-hits', 'trap-essentials', 'synthwave-pop', 'vocal-template', 'plantillas-fl']
  }
];

export const servicios = [
  {
    nombre: 'Preset vocal personalizado',
    precio: 45,
    descripcion: 'Analizo tu tipo de voz, timbre y estilo, y armo una cadena de efectos hecha para vos.',
    detalle: 'Instalación guiada y una revisión',
    campoExtra: { etiqueta: 'Tipo de voz y plugins que usás', ejemplo: 'Voz grave, uso FL Studio con plugins nativos' }
  },
  {
    nombre: 'Mezcla',
    precio: 60,
    descripcion: 'Balance, ecualización, compresión y efectos para que tu canción suene clara y lista para streaming.',
    detalle: 'Entrega en 3 a 5 días',
    campoExtra: { etiqueta: 'Cantidad de pistas', ejemplo: 'Por ejemplo: beat + 3 voces' }
  },
  {
    nombre: 'Mezcla + mastering',
    precio: 79,
    etiqueta: 'El más pedido',
    descripcion: 'Mezcla completa y mastering final, con volumen competitivo para todas las plataformas.',
    detalle: 'Entrega en 3 a 5 días',
    campoExtra: { etiqueta: 'Cantidad de pistas', ejemplo: 'Por ejemplo: beat + 3 voces' }
  },
  {
    nombre: 'Mastering',
    precio: 30,
    descripcion: 'El último paso para que tu canción suene fuerte y pareja en Spotify, YouTube y donde la subas.',
    detalle: 'Entrega en 1 a 2 días',
    campoExtra: { etiqueta: 'Link a tu mezcla (opcional)', ejemplo: 'Drive, WeTransfer, SoundCloud...' }
  },
  {
    nombre: 'Beat personalizado',
    precio: 80,
    descripcion: 'Un beat original desde cero: trabajamos juntos la idea, la estructura, los sonidos y la mezcla.',
    detalle: 'Derechos de uso y stems incluidos',
    campoExtra: { etiqueta: 'BPM o tonalidad, si tenés preferencia', ejemplo: 'Por ejemplo: 95 BPM, La menor' }
  }
];
