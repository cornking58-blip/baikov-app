const CACHE = 'bAIkov-v4';
const FILES = ['/baikov-app/', '/baikov-app/index.html', '/baikov-app/manifest.json', '/baikov-app/icon-192.png', '/baikov-app/icon-512.png', '/baikov-app/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(()=>{}))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => k !== CACHE && caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/baikov-app/index.html')))); });
