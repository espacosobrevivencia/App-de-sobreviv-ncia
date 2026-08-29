const CACHE_PREFIX = "sobrevivencia-offline-v";
const CACHE_NAME = "sobrevivencia-offline-v3.1.0";
const FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png"
];
const ESSENTIAL_FILES = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png"
];
const INDEX_URL = new URL("./index.html", self.location).href;

async function verifyCurrentCache() {
  const cache = await caches.open(CACHE_NAME);
  for (const file of ESSENTIAL_FILES) {
    const url = new URL(file, self.location).href;
    if (!(await cache.match(url))) return false;
  }
  return true;
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES);
    const complete = await verifyCurrentCache();
    if (!complete) {
      await caches.delete(CACHE_NAME);
      throw new Error("Cache novo incompleto; versão anterior preservada.");
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const complete = await verifyCurrentCache();
    if (!complete) throw new Error("Cache atual incompleto; ativação cancelada.");

    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedIndex = await cache.match(INDEX_URL);
      if (cachedIndex) return cachedIndex;

      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(INDEX_URL, response.clone());
        return response;
      } catch {
        return new Response("Aplicativo indisponível offline.", {
          status: 503,
          headers: {"Content-Type": "text/plain; charset=utf-8"}
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      return new Response("Offline", {
        status: 503,
        headers: {"Content-Type": "text/plain; charset=utf-8"}
      });
    }
  })());
});
