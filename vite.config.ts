import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const allowedHosts = process.env.VITE_ALLOWED_HOSTS
  ? process.env.VITE_ALLOWED_HOSTS.split(',').map((h) => h.trim())
  : []

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    ...(allowedHosts.length > 0 && { allowedHosts }),
    proxy: {
      '/api': {
        target: 'http://localhost:38000',
        changeOrigin: true,
      },
    },
  },
})
