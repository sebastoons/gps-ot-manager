import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true, // Mostrar errores para debugging
      clientPort: 3000
    }
  },
  // Agregar configuración para evitar re-renders innecesarios
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})