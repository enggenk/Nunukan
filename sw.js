const CACHE_NAME = 'sinjai-timer-v3.5'; // Ubah versi untuk memicu update
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://enggenk.github.io/Sinjai/logo-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Mengunduh aset...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Mengambil kendali halaman segera
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Selalu berikan cache jika ada, jika tidak ada baru ambil ke internet
      return cachedResponse || fetch(event.request);
    })
  );
});
