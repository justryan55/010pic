const CACHE_NAME = "photo-app-cache-v1";
const IMAGE_CACHE_NAME = "photo-app-images-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.json"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (
    event.request.destination === "image" ||
    url.pathname.includes("images/") ||
    url.hostname.includes("supabase") ||
    url.hostname.includes("cloudflare")
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => {
              return new Response(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image unavailable</text></svg>',
                { headers: { "Content-Type": "image/svg+xml" } }
              );
            });
        });
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith("photo-app-") &&
              cacheName !== CACHE_NAME &&
              cacheName !== IMAGE_CACHE_NAME
            );
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_IMAGE_CACHE") {
    event.waitUntil(
      caches.delete(IMAGE_CACHE_NAME).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  if (event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data.type === "CLIENTS_CLAIM") self.clients.claim();
});
