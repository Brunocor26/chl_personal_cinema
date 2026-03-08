import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/movielist': 'http://localhost:8080',
      '/media': 'http://localhost:8080'
    }
  }
})
