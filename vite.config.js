import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Vercel automatically detects this
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
})
