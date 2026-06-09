const CACHE_NAME = 'edu-kit-ios-fix-v5';

const CORE_ASSETS = [
  '/',
  '/demo',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        CORE_ASSETS.map((url) => 
          cache.add(url).catch((err) => console.log('SW skip:', url, err))
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase') || !url.protocol.startsWith('http')) return;

  event.respondWith(
    // КРИТИЧНО ДЛЯ iOS и Next.js: ignoreSearch игнорирует параметры типа ?_rsc
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      
      // 1. CACHE FIRST: Если файл есть в памяти, мгновенно отдаем его iOS (чтобы не было окна ошибки)
      if (cachedResponse) {
        // Фоном обновляем кэш, если интернет все-таки есть (Stale-While-Revalidate)
        event.waitUntil(
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
            }
          }).catch(() => {}) // Игнорируем ошибки сети в фоне
        );
        return cachedResponse;
      }

      // 2. Если в кэше нет — идем в сеть
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          // 3. Последний шанс: если это запрос HTML-страницы, отдаем корень
          if (event.request.mode === 'navigate') {
            const fallback = await caches.match('/');
            if (fallback) return fallback;
          }
          return new Response('Офлайн режим', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        });
    })
  );
});