import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Rutas relativas: funciona en GitHub Pages (arcedeveloper.github.io/prodbyMTR/) sin cambiar nada
  base: './',
  plugins: [react(), tailwindcss()]
});
