const CACHE_NAME = 'brew-haven-v2';  // Increment cache version if you're making changes
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/menu.html',
  '/about.html',
  '/blog.html',
  '/careers.html',
  '/contact.html',
  '/event.html',
  '/faq.html',
  '/reservation.html',
  '/style.css',
  '/images/hero-bg.jpg',
  '/images/latte.webp',
  '/images/mocha.webp',
  '/images/coffee.webp',
  '/images/blackcoffe.webp',
  '/images/blueberry.webp',
  '/images/interior.webp',
  '/images/esspresso.webp',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching site files');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately after install
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Take control of open tabs
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
