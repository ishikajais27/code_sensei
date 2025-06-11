import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            appwrite: ['appwrite'],
            charts: ['chart.js', 'react-chartjs-2'],
          },
        },
      },
    },

    server: {
      port: 3001,
      strictPort: true,
      open: true,
    },

    preview: {
      port: 4173,
      strictPort: true,
    },

    resolve: {
      alias: {
        '@': '/src',
        '@assets': '/src/assets',
      },
    },

    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  }
})
