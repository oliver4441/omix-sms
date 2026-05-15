const CACHE_NAME = "omixsms-v1";
const STATIC_ASSETS = [
  "/",
  "/favicon.ico",
  "/favicon-16.png",
  "/favicon-64.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest",
];

// Dashboard paths to cache for offline support
const DASHBOARD_PATHS = [
  "/bursar/dashboard",
  "/library/dashboard",
  "/science-lab/dashboard",
  "/computer-lab/dashboard",
  "/board/dashboard",
  "/principal/dashboard",
  "/dashboard",
  "/notifications",
];

// Install event: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Helper: check if request is a dashboard navigation
function isDashboardNavigation(url) {
  const pathname = new URL(url).pathname;
  return (
    DASHBOARD_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname === "/"
  );
}

// Helper: check if request is a static asset
function isStaticAsset(url) {
  const pathname = new URL(url).pathname;
  const staticExtensions = /\.(png|jpg|jpeg|gif|svg|ico|webp|js|css|woff2?|json)$/;
  return staticExtensions.test(pathname);
}

// Fetch event: cache-first for static assets, network-first for API, network-first fallback cache for dashboards
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Static assets: cache-first
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          })
        );
      })
    );
    return;
  }

  // API requests: network-first, no caching
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request).catch(() => new Response(null, { status: 503 })));
    return;
  }

  // Navigation requests: cache-first with network update for dashboards
  if (request.mode === "navigate" && isDashboardNavigation(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
                return response;
              });
            }
            return response;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for reconnection
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-notifications") {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_NOTIFICATIONS",
      });
    });
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push event listener (for future push notification support)
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "omixsystems";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event: open the url
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find((c) => c.url === urlToOpen);
        if (existing) {
          existing.focus();
        } else {
          clients.openWindow(urlToOpen);
        }
      })
  );
});
