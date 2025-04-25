const CACHE_NAME = 'brew-haven-v1';
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

// Install event - Cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static site files');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately after install
});

// Activate event - Remove old caches that are no longer needed
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

// Fetch event - Serve cached content first, then fallback to network if not cached
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If cached response is found, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network if not in cache
      return fetch(event.request).then(fetchedResponse => {
        // Only cache successful responses from the network
        if (!fetchedResponse || fetchedResponse.status !== 200 || fetchedResponse.type !== 'basic') {
          return fetchedResponse;
        }

        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchedResponse.clone()); // Cache the network response
          return fetchedResponse; // Return the network response
        });
      });
    })
  );
});
