if (!self.define) {
    let e, s = {};
    const i = (i, n) => (
      i = new URL(i + ".js", n).href,
      s[i] || new Promise((s => {
        if ("document" in self) {
          const e = document.createElement("script");
          e.src = i, e.onload = s, document.head.appendChild(e);
        } else e = i, importScripts(i), s();
      })).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
    );
    self.define = (n, r) => {
      const t = e || ("document" in self ? document.currentScript.src : "") || location.href;
      if (s[t]) return;
      let o = {};
      const l = e => i(e, t), d = { module: { uri: t }, exports: o, require: l };
      s[t] = Promise.all(n.map(e => d[e] || l(e))).then((e => (r(...e), o)));
    };
  }
  
  define(["./workbox-7cfec069"], function (e) {
    "use strict";
  
    // Omitir esperar para que el SW se active de inmediato
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
    });
  
    // Cachea todos los archivos necesarios para el App Shell
    e.precacheAndRoute([
      { url: "index.html", revision: "511f320575fd55ee489a8ec421400813" },
      { url: "assets/index-BvjgDCLV.css", revision: null },
      { url: "assets/index-CL0kqHfM.js", revision: null },
      { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" },
      { url: "manifest.webmanifest", revision: "df107d306e786433044fa5d968ab9cee" },
      // Agrega aquí otros recursos esenciales para el App Shell
    ], {});
  
    // Limpieza de cachés antiguos
    e.cleanupOutdatedCaches();
  
    // Estrategia para contenido HTML - modo de navegación
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
    );
  
    // Cachea de manera dinámica el contenido de la API, con estrategia de Network First
    e.registerRoute(
      ({ url }) => url.origin === 'http://localhost/UTHH_VIRTUAL/', 
      new e.NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
          new e.ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // Un día
          }),
        ],
      })
    );
  
    // Cacheo de recursos estáticos (imágenes, estilos, fuentes) con Cache First
    e.registerRoute(
      ({ request }) => request.destination === 'image' || request.destination === 'style' || request.destination === 'font',
      new e.CacheFirst({
        cacheName: 'static-resources',
        plugins: [
          new e.ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // Un mes
          }),
        ],
      })
    );
  });
  