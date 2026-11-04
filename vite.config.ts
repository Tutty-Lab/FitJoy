import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// In dev, /api is proxied to the deployed Vercel Functions (same Neon database).
// Override with API_PROXY=http://localhost:3000 when running the functions locally.
const apiTarget = process.env.API_PROXY ?? 'https://fit-joy.vercel.app'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { proxy: { '/api': { target: apiTarget, changeOrigin: true } } },
})
