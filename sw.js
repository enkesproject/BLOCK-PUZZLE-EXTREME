/* Service Worker — BLOCK PUZZLE EXTREME (c) 2026 enkes_project */
const CACHE_NAME = 'bpe-cache-v1';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const AUDIO = [
  'https://res.cloudinary.com/sogbouii/video/upload/v1789150308/Effect_Kemenangan_Setiap_Level.mp3',
  'https://res.cloudinary.com/sogbouii/video/upload/v1788965435/congratulations-Level_success.mp3',
  'https://res.cloudinary.com/sogbouii/video/upload/v1788965434/amazing-Pecah_2_baris_ke_atas.mp3',
  'https://res.cloudinary.com/sogbouii/video/upload/v1789150310/Effect_Naik_Level.wav',
  'https://res.cloudinary.com/sogbouii/video/upload/v1789150308/Effect_Ledakan.mp3',
  'https://res.cloudinary.com/sogbouii/video/upload/v1788965436/no-way-Pecah_1_baris.mp3',
  'https://res.cloudinary.com/sogbouii/video/upload/v1788837529/Block_Drop_Bounce_1.mp3',
  'https://res.cloudinary.com/sogbouii/video/upload/v1788837529/Block_Drop_Bounce.mp3',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Strategi: cache-first untuk semua; audio dicache saat pertama dipakai */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit =>
      hit ||
      fetch(req).then(res => {
        const copy = res.clone();
        const okCache = req.url.startsWith(self.location.origin) || AUDIO.some(u => req.url.startsWith(u.split('/video/upload')[0]) && req.url.includes('cloudinary'));
        if (res.ok && okCache) {
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
