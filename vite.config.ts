import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { devApi } from './scripts/dev-api'
import { VitePWA } from 'vite-plugin-pwa'

// Dev runs local API handlers against the configured Neon database.
// Set API_PROXY to use a deployed API instead.

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['DATABASE_URL', 'AUTH_SECRET']) {
    if (!process.env[key] && env[key]) process.env[key] = env[key]
  }
  const apiTarget = process.env.API_PROXY
  return {
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt',
    injectRegister: 'auto',
    includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icon.png', 'icon-512.png', 'icon-maskable.png'],
    manifest: {
      name: 'FitJoy', short_name: 'FitJoy', lang: 'en',
      description: 'Your 22-day balance program',
      start_url: '/', scope: '/', display: 'standalone',
      background_color: '#fbf8f3', theme_color: '#fbf8f3',
      icons: [
        { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      navigateFallbackDenylist: [/^\/api(?:\/|$)/],
      cleanupOutdatedCaches: true,
    },
  }), ...(!apiTarget ? [devApi()] : [])],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: apiTarget ? { proxy: { '/api': { target: apiTarget, changeOrigin: true } } } : {},
  }
})
