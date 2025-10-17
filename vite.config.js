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
      overlay: false, // ✅ Oculta overlay de errores
      clientPort: 3000 // ✅ Fuerza puerto del WebSocket
    }
  }
})