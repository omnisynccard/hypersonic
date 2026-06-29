/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         Service Worker - PWA 離線支援與快取管理          ║
 * ║  支援 iPhone 和 Android 的「加入主畫面」功能             ║
 * ╚══════════════════════════════════════════════════════════╝
 */

const CACHE_NAME = 'digital-card-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './main.js',
  './style.css',
  './manifest.json',
];

/* ── 安裝事件 ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('快取部分資源失敗:', err);
      });
    })
  );
  self.skipWaiting();
});

/* ── 啟用事件 ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* ── 請求攔截 ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* 只快取同源請求 */
  if (url.origin !== location.origin) {
    return;
  }

  /* 跳過查詢字串的請求 */
  if (url.search) {
    return;
  }

  /* GET 請求使用快取優先策略 */
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((response) => {
          /* 不快取非成功的回應 */
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          /* 複製回應並快取 */
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        }).catch(() => {
          /* 離線時返回快取版本 */
          return caches.match(request);
        });
      })
    );
  }
});
