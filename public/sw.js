const CACHE_NAME = 'edu-kit-offline-v3';

const CORE_ASSETS = [
  '/',
  '/demo',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Сразу активируем
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Кэшируем по одному. Если Next.js отдаст ошибку на один роут, остальные сохранятся.
      return Promise.all(
        CORE_ASSETS.map((url) => 
          cache.add(url).catch((err) => console.log(`SW: пропуск ${url} при установке`, err))
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim(); // Сразу берем контроль над страницей
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
  // Пропускаем все, кроме стандартных GET-запросов (Supabase, API и т.д. идут лесом)
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase') || !url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Кэшируем на лету только успешные запросы
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(async () => {
        // Офлайн: ищем точное совпадение в кэше
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // Если это запрос страницы (navigate), отдаем кэш корня
        if (event.request.mode === 'navigate') {
          const fallback = await caches.match('/');
          if (fallback) return fallback;
        }
        
        // Заглушка, чтобы не было динозавра
        return new Response('Офлайн режим. Сторінка не знайдена в кеші.', { 
          status: 503, 
          headers: { 'Content-Type': 'text/plain; charset=utf-8' } 
        });
      })
  );
});