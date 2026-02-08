const CACHE_NAME = 'ysa-sinjai-offline-v3'; // Ganti versi jika ada update besar
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Icon
  'https://enggenk.github.io/Sinjai/logo-512.png',
  // Audio Files (PENTING: Agar alarm bunyi saat offline)
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  'https://actions.google.com/sounds/v1/alarms/digital_alarm_clock.ogg',
  // Firebase SDK (Kita cache agar script tidak 404 saat offline, walau fungsinya mati)
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-database-compat.js'
];

// 1. Install SW
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Paksa update segera
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate SW (Bersihkan cache lama)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Menghapus cache lama', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch (Strategi: Cache First, Network Fallback)
// Jika ada di cache (offline), ambil dari cache. Jika tidak, coba internet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Ditemukan di cache
        }
        return fetch(event.request).catch(() => {
            // Jika fetch gagal (offline total) dan file tidak ada di cache
            console.log('Offline dan file tidak ada di cache:', event.request.url);
        });
      })
  );
});
