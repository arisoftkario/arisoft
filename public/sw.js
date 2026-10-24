// Service worker ARISOFT : rend le site installable et utilisable avec une connexion faible.
const CACHE = 'arisoft-v1';
const SCOPE = new URL(self.registration.scope).pathname; // « / » ou « /arisoft/ »

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(SCOPE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // Firebase, WhatsApp, Google Maps… : jamais mis en cache
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Pages : réseau d'abord (contenu toujours à jour), cache si hors-ligne
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(SCOPE)))
    );
    return;
  }

  // Fichiers versionnés (JS, CSS, polices) et images : cache d'abord
  if (url.pathname.includes('/_next/static/') || /\.(png|jpe?g|webp|svg|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
  }
});
