import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-512.png'],
      manifest: {
        name: 'Kitchen Cleaning',
        short_name: 'Kitchen',
        description: 'Kitchen Cleaning Task Manager — Ashara 1448H London',
        theme_color: '#7C5C3E',
        background_color: '#F7F2EC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-512.png', sizes: '897x998', type: 'image/png' },
          { src: 'icon-512.png', sizes: 'any',     type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})