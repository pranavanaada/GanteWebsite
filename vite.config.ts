import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // Prefer a dev proxy target so the frontend can keep calling "/api/..." without CORS headaches.
  // Set VITE_PROXY_TARGET to your function URL while developing, e.g.
  //  - Azure local:  http://localhost:7071
  //  - AWS API GW:   https://abc123.execute-api.ap-south-1.amazonaws.com
  //  - Vercel:       https://your-app.vercel.app
  const proxyTarget = env.VITE_PROXY_TARGET || ''
  
  return {
    plugins: [react()],
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.mp3'],
    base: './',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            i18n: ['i18next', 'react-i18next']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    server: proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    preview: {
      port: 3000,
      strictPort: true,
    },
  }
})
