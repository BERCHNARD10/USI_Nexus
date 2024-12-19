import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
  name: "UTHH Virtual",
  short_name: "UTHH Virtual",
  start_url: "/UTHH_VIRTUAL/",
  display: "standalone",
  background_color: "#02233a",
  lang: "es",
  scope: "/UTHH_VIRTUAL/",
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
      src: "/logo.png",
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
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: manifestForPlugin,
      registerType: 'autoUpdate',
      cleanupOutdatedCaches: true,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 15,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' || 
              request.destination === 'style' || 
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /^https:\/\/robe\.host8b\.me\/WebServices\/.*\.php$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 9,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Nueva configuración para caché de imágenes externas
            urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-image-cache',
              expiration: {
                maxEntries: 30, // Limita el número de imágenes externas en caché
                maxAgeSeconds: 30 * 24 * 60 * 60, // Expira en 30 días
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        globDirectory: 'dist',
        globPatterns: ['**/*.{html,js,css,png,jpg,svg}'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
      },
    }),
  ],
  server: {
    host: true,
    mimeTypes: {
      'application/javascript': ['js', 'jsx']
    }
  },
  optimizeDeps: {
    exclude: ['xlsx-style'],
    
  },
  build: {
    outDir: 'dist',
    base: '/UTHH_VIRTUAL/', // Esto indica que la base de los archivos generados estará bajo "/UTHH_VIRTUAL/"
    assetsDir: 'assets',  // Los archivos estáticos como JS y CSS estarán en esta carpeta dentro de 'dist'
  }
});
