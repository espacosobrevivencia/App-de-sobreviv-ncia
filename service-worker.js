const CACHE_PREFIX = "sobrevivencia-offline-v";
const CACHE_NAME = "sobrevivencia-offline-v3.2.1";

// Somente o shell da PWA entra no cache. Arquivos escolhidos pelo usuário
// na Biblioteca Offline (fotos, vídeos, PDFs etc.) NUNCA entram aqui.
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
const CORE_URLS = new Set(FILES.map(file => new URL(file, self.location).href));

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
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(FILES);

      const complete = await verifyCurrentCache();
      if (!complete) throw new Error("Cache novo incompleto.");

      // Não chama skipWaiting automaticamente. A versão antiga continua ativa
      // até o app confirmar que a nova foi instalada e o usuário aceitar atualizar.
    } catch (error) {
      // Se a instalação nova falhar, não deixa um cache V3.2 parcial ocupando o lugar.
      await caches.delete(CACHE_NAME);
      throw error;
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const complete = await verifyCurrentCache();
    if (!complete) throw new Error("Cache atual incompleto; ativação cancelada.");

    // Só depois de confirmar que a nova versão está completa removemos caches antigos.
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

  // Não intercepta blob:, data:, outros domínios nem qualquer mídia privada.
  if ((url.protocol !== "http:" && url.protocol !== "https:") || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedIndex = await cache.match(INDEX_URL);
      if (cachedIndex) return cachedIndex;

      try {
        return await fetch(request);
      } catch {
        return new Response("Aplicativo indisponível offline.", {
          status: 503,
          headers: {"Content-Type": "text/plain; charset=utf-8"}
        });
      }
    })());
    return;
  }

  // O cache runtime é propositalmente limitado aos próprios arquivos da PWA.
  // Isso impede que PDFs/vídeos/fotos selecionados no aparelho sejam duplicados.
  if (!CORE_URLS.has(url.href)) {
    event.respondWith(fetch(request));
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
