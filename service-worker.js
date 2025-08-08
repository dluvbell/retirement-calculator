// This service worker is for basic PWA functionality (installability)
// and does not provide offline capabilities as requested.

const CACHE_NAME = 'retirement-calculator-pwa-install-v1';

// A minimal list of files to cache for the app shell to be installable.
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

// Install event: caches the essential files for the app shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching install files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Network-first strategy.
// It tries to fetch from the network first. If it fails (e.g., offline),
// it then tries to serve the request from the cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
