// service-worker.js
const CACHE_NAME = 'bryandev-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Agrega aquí otros activos estáticos que quieras cachear para uso sin conexión
  // Por ejemplo: '/css/app.css', '/js/app.js', '/img/logo.png'
  // Si usas Vue Router en modo history, asegúrate de cachear también los archivos de tus rutas.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Si está en caché, devuelve la versión cacheada
        }
        return fetch(event.request); // Si no, busca en la red
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina cachés antiguas
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});