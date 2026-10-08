import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { handleRealtimeMiddleware } from './src/server/realtimeHandler.js'

const devAnalyticsPlugin = (): Plugin => ({
  name: 'dev-analytics-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      handleRealtimeMiddleware(req, res, next)
    })
  },
})

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGitHubPages ? '/Btech2/' : '/',

  plugins: [
    react(),

    devAnalyticsPlugin(),

    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },

      manifest: {
        name: 'Btech2 - Complete Brass Band & Conducting Academy',
        short_name: 'Btech2',

        description:
          'btech — British brass band education platform founded by Nokuvimba Bafu.',

        theme_color: '#020617',
        background_color: '#020617',

        display: 'standalone',

        start_url: isGitHubPages ? '/Btech2/' : '/',
        scope: isGitHubPages ? '/Btech2/' : '/',

        icons: [
          {
            src: isGitHubPages
              ? '/Btech2/pwa-192x192.png'
              : '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: isGitHubPages
              ? '/Btech2/pwa-512x512.png'
              : '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 5000,
  },
})