const CACHE_NAME = 'sinjai-timer-v2.4.2';
// Daftar file yang akan disimpan di memori HP agar bisa dibuka offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://enggenk.github.io/Sinjai/logo-512.png',
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  'https://actions.google.com/sounds/v1/alarms/digital_alarm_clock.ogg',
  'https://enggenk.github.io/Sinjai/qris (1).jpg'
];

// Tahap Install: Menyimpan file ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Menyimpan aset ke cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Tahap Aktivasi: Menghapus cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Menghapus cache lama');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Tahap Fetch: Mengambil data dari cache jika sedang offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, gunakan cache. Jika tidak, ambil dari network.
      return response || fetch(event.request).catch(() => {
        // Jika gagal (offline) dan tidak ada di cache, bisa diarahkan ke halaman offline khusus
        // atau dalam kasus ini, tetap di index.html
        return caches.match('./index.html');
      });
    })
  );
});
