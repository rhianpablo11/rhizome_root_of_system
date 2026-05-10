import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // icons to create
      manifest: {
        name: 'Rhizome: A rota do sistema',
        short_name: 'Rhizome',
        description: 'Um jogo de dedução social e educação ambiental crítica.',
        theme_color: '#F8FAFC', 
        background_color: '#F8FAFC',
        display: 'standalone', 
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})