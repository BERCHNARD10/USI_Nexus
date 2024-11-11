import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
/*export default defineConfig({
  plugins: [react()],
})*/
const manifestForPlugin = {
  manifest: {
    name: "UTHH Virtual",
    short_name: "UTHH Virtual",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    lang: "en",
    scope: "/",
    registerType: "autoUpdate",
    includeAssets: [
      "favicon-196.ico",
      "apple-icon-180.png",
      "manifest-icon-192.maskable.png",
      "manifest-icon-512.maskable.png",
      "logo-pwa-resized-phone-192.png"
  
    ],
    icons: [
      {
        src: "manifest-icon-144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "logo-pwa-resized-phone-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "logo-pwa-resized-phone-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "manifest-icon-512.maskable-pwa.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "manifest-icon-512.maskable-pwa.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#171717",
    orientation: "portrait",
    screenshots: [
      {
        src: "screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "screenshot-narrow.png",
        sizes: "720x1280",
        type: "image/png",
        form_factor: "narrow"
      }
    ]
  }
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
            // Cache para imágenes (PNG, JPG, JPEG, SVG, GIF, WebP)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50, // Limita el número de imágenes en el caché
                maxAgeSeconds: 30 * 24 * 60 * 60, // Expira en 30 días
              },
            },
          },
          {
            // Cache para assets estáticos (JS, CSS, imágenes)
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
          {
            // Cache para tus APIs (Web Services)
            urlPattern: /^https:\/\/robe\.host8b\.me\/WebServices\/.*\.php$/,
            handler: 'NetworkFirst', // Intenta la red primero, si falla, busca en cache
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10, // Tiempo de espera de la red antes de usar cache
              expiration: {
                maxEntries: 20, // Máximo 20 respuestas de API
                maxAgeSeconds: 60 * 60 * 24 * 9, // Cache de 7 días
              },
              cacheableResponse: {
                statuses: [0, 200], // Cachea solo respuestas con código 0 (offline) o 200 (OK)
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
    exclude: ['xlsx-style'] // Evitar que ciertos módulos sean pre-empacados
  },
  build: {
    outDir: 'dist', // La carpeta de salida debe ser 'dist'
  }

});

