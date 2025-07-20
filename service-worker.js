const CACHE_NAME = 'retirement-calculator-v1';
// 오프라인에서도 작동하기 위해 저장할 파일 목록
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

// 1. 서비스 워커 설치 및 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 요청이 있을 때 캐시된 파일 먼저 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 파일이 있으면 그것을 반환, 없으면 네트워크로 요청
        return response || fetch(event.request);
      })
  );
});