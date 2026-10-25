// Service worker ARISOFT : rend le site installable et utilisable avec une connexion faible.
const CACHE = 'arisoft-v2';
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

// Notifications : nouvelle publicité ou réalisation publiée par ARISOFT
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'ARISOFT';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'Nouvelle publication sur le site ARISOFT.',
      icon: `${SCOPE}icons/icon-192.png`,
      badge: `${SCOPE}icons/icon-192.png`,
      data: { url: data.url || SCOPE },
      tag: data.url || 'arisoft',
    })
  );
});

// Clic sur la notification : ouvre la publication (ou réutilise un onglet du site déjà ouvert)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || SCOPE, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => w.url.startsWith(self.location.origin));
      if (open) return open.navigate(target).then((w) => (w || open).focus());
      return self.clients.openWindow(target);
    })
  );
});
