const CACHE = 'inventory-v2';

// File essenziali
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  const req = event.request;

  // 🔹 Navigazione (pagine HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => res)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 🔹 Altri asset (cache-first)
  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req);
    })
  );
});