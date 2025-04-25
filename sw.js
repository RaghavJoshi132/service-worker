const CACHE_NAME = "brew-haven-v1";
const urlsToCache = [
  "index.html",
  "about.html",
  "menu.html",
  "blog.html",
  "contact.html",
  "faq.html",
  "reservation.html",
  "event.html",
  "careers.html",
  "reviews.html",
  "offline.html",
  "style.css",
  "beans.webp",
  "blackcoffe.webp",
  "blueberry.webp",
  "coffee.webp",
  "coldcoffee.webp",
  "esspresso.webp",
  "interior.webp",
  "latte art.webp",
  "latte.webp",
  "mocha.webp",
  "outside.webp"
];

// Install Service Worker & cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).catch((err) => {
      console.error("Caching failed:", err);
    })
  );
});

// Activate the Service Worker and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch and serve from cache, fallback to offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        return caches.match("offline.html");
      });
    })
  );
});
