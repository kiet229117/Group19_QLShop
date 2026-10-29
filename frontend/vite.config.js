import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    allowedHosts: [
      'yearling-camisole-skewed.ngrok-free.dev'
    ]
  }
})
