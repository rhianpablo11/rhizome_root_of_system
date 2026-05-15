import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // IMPORTA O PLUGIN

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o SW automaticamente pro usuário
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Arquivos que devem estar na pasta /public
      manifest: {
        name: 'Rhizome: A rota do sistema',
        short_name: 'Rhizome',
        description: 'Um jogo de dedução social onde a Comunidade luta para aprovar projetos enquanto o Lobby tenta se infiltrar e aprovar suas próprias medidas arbitrárias. Descubra a raiz do sistema.',
        theme_color: '#78C6A3', // O Verde pastel do projeto
        background_color: '#1E293B', // O Chumbo escuro das telas
        display: 'standalone', // Abre como um app nativo (sem barra do navegador)
        scope: '/',
        start_url: '/',
        orientation: 'portrait', // Trava em pé
        icons: [
          {
            src: 'android-chrome-192x192.png', // Arquivo 192x192 que vc gerou
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png', // Arquivo 512x512 que vc gerou
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // IMPORTANTE: Pra ícones adaptativos do Android
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10485760,
        globPatterns: ['**/*.{js,css,html,png,svg,json,ico}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst', // Imagens não mudam muito, carrega do cache primeiro
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ]
      }
    })
  ]
});