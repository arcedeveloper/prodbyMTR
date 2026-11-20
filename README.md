# ProdByMTR

Tienda de drumkits, packs y plantillas de FL Studio, con pedidos de servicios (mezcla, mastering, beats) por WhatsApp.

- `frontend/`: la tienda, hecha con **React 19 + Vite 8 + Tailwind CSS 4**. Se publica en GitHub Pages.
- `backend/`: servidor en Node.js + Express (Render). Crea los pagos en Stripe, guarda los pedidos en Neon y envía la descarga por email con Mailjet.

Necesitás **Node.js 20.19 o más nuevo** (`node -v` para ver tu versión).

## Trabajar en la tienda

```bash
cd frontend
npm install      # solo la primera vez
npm run dev      # abre la tienda en http://localhost:5173 y se actualiza sola al guardar
```

Los pagos usan el backend de Render. Para usar el backend de tu compu, creá `frontend/.env.local` con `VITE_API_URL=http://localhost:3001`.

### Dónde está cada cosa

| Archivo | Qué tiene |
| --- | --- |
| `src/data/productos.js` | Productos y servicios: nombres, precios, textos, imágenes |
| `src/components/` | Cada parte de la página (Hero, Productos, Servicios...) |
| `src/components/Secuenciador.jsx` | El secuenciador del inicio |
| `src/index.css` | Colores y tipografías de la marca |
| `src/config.js` | Dirección del backend y número de WhatsApp |

## Publicar la tienda (GitHub Pages)

1. En GitHub: **Settings > Pages > Source: GitHub Actions**.
2. Cada vez que subas cambios a `main`, GitHub compila y publica sola la tienda en `https://arcedeveloper.github.io/prodbyMTR/`. El progreso se ve en la pestaña **Actions**.

## Backend en Render

1. **Settings > Build & Deploy**: repositorio `arcedeveloper/prodbyMTR`, **Root Directory** `backend`, build `npm install`, start `npm start`.
2. **Environment**: cargá las variables de `backend/.env.example`.
3. La tabla `pedidos` se crea sola en Neon al iniciar el servidor.

Panel de ventas: `https://prodbymtr-backend.onrender.com/admin` (usuario `ADMIN_USER`, contraseña `ADMIN_PASSWORD`).

## Cambiar precios o productos

Los precios están en dos lugares y tienen que coincidir:

- `frontend/src/data/productos.js`: lo que se muestra.
- `backend/productos.js`: lo que se cobra, y el enlace de descarga de cada producto.
