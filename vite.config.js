import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
/*export default defineConfig({
  plugins: [react()],
})*/
const manifestForPlugin = {
  registerType: "autoUpdate",
  includeAssets: [
    "favicon-196.ico",
    "apple-icon-180.png",
    "manifest-icon-192.maskable.png",
    "manifest-icon-512.maskable.png",
  ],
  manifest: {
    name: "UTHH Virtual",
    short_name: "UTHH Virtual",
    description: "Una plataforma de evaluacion educativa",
    icons:[
      {
          "src":"manifest-icon-192.maskable.png",
          "sizes":"192x192",
          "type":"image/png",
          "purpose":"any"
      },
      {
          "src":"manifest-icon-192.maskable.png",
          "sizes":"192x192",
          "type":"image/png",
          "purpose":"maskable"
      },
      {
          "src":"manifest-icon-512.maskable.png",
          "sizes":"512x512",
          "type":"image/png",
          "purpose":"any"
      },
      {
          "src":"manifest-icon-512.maskable.png",
          "sizes":"512x512",
          "type":"image/png",
          "purpose":"maskable"
      }
    ],
    theme_color: "#171717",
    background_color: "#e8ebf2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: manifestForPlugin,
      registerType: 'autoUpdate',
      cleanupOutdatedCaches: true,  // Esto limpiará automáticamente las cachés obsoletas
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate', // Caché para páginas
            handler: 'NetworkFirst', // Intentar red, si falla usar caché
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 15, // Máximo 10 páginas
                maxAgeSeconds: 60 * 60 * 24 * 7, // Mantener en caché por 7 días
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' || 
              request.destination === 'style' || 
              request.destination === 'image', // Caché para JS, CSS, imágenes
            handler: 'CacheFirst', // Usar caché primero, si no está, descargar
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50, // Máximo 50 activos estáticos
                maxAgeSeconds: 60 * 60 * 24 * 30, // Mantener en caché por 30 días
              },
            },
          },
        ],
        globDirectory: 'dist', // Donde están los archivos de compilación
        globPatterns: ['**/*.{html,js,css,png,jpg,svg}'],
        cleanupOutdatedCaches: true, // Limpiar cachés antiguas
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 10 MB
      },
    }),
  ],
  server: {
    host: true, // Esto debería permitir conexiones desde cualquier dirección IP,
    mimeTypes: {
      'application/javascript': ['js', 'jsx']
    }
  },
  optimizeDeps: {
    exclude: ['xlsx-style']
  }
});

