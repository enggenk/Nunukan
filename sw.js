self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Pass through requests
});
const CACHE_NAME = 'sinjai-timer-v2.1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://enggenk.github.io/Sinjai/logo-512.png',
  'https://enggenk.github.io/Sinjai/qris (1).jpg',
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  'https://actions.google.com/sounds/v1/alarms/digital_alarm_clock.ogg'
];

// Tahap Install: Simpan semua file ke memori HP
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Tahap Fetch: Ambil dari cache jika offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Hapus cache lama jika ada update
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
