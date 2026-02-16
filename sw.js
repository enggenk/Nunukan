const CACHE_NAME = 'sinjai-v6.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://enggenk.github.io/Nunukan/1770574638579.png',
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  'https://actions.google.com/sounds/v1/alarms/digital_alarm_clock.ogg',
  'https://enggenk.github.io/Sinjai/qris (1).jpg'
];

// Tahap Install: Menyimpan aset ke dalam CacheStorage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Tahap Aktivasi: Menghapus cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Tahap Fetch: Mengambil aset dari Cache jika Offline
self.addEventListener('fetch', (event) => {
  // Biarkan Firebase ditangani secara online oleh SDK-nya sendiri
  if (event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Jika gagal fetch (benar-benar offline) dan tidak ada di cache
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
