// ═══════════════════════════════════════════════
//  bAIkov Service Worker — Offline First
//  Кэширует все файлы при первой загрузке.
//  После этого приложение работает без интернета.
// ═══════════════════════════════════════════════

const CACHE_NAME = 'bAIkov-v1';

// Все файлы которые нужно закэшировать
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// ── Установка: кэшируем все файлы ────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Кэшируем файлы приложения...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Сразу активируем без ожидания
  self.skipWaiting();
});

// ── Активация: удаляем старые кэши ───────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Удаляем старый кэш:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ── Перехват запросов: сначала кэш ───────────
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Если есть в кэше — отдаём из кэша (офлайн работает!)
      if (response) return response;
      // Иначе — идём в сеть
      return fetch(event.request);
    })
  );
});
