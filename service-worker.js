// 캐시 이름 정의 (버전 관리용)
const CACHE_NAME = 'retirement-calculator-v2';

// 오프라인에서도 작동하기 위해 캐시에 저장할 필수 파일 목록
// 아이콘 파일들은 실제 경로에 존재해야 합니다.
const urlsToCache = [
  '.', // 루트 디렉토리
  'index.html',
  'manifest.json'
  // 'icon-192x192.png', // 아이콘 파일이 있다면 여기에 추가
  // 'icon-512x512.png'  // 아이콘 파일이 있다면 여기에 추가
];

// 1. 서비스 워커 설치 이벤트: 필수 파일을 캐시에 저장합니다.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching essential files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 네트워크 요청 가로채기(fetch) 이벤트: 캐시 우선 전략 사용
self.addEventListener('fetch', (event) => {
  // CDN에서 로드되는 스크립트(React, Chart.js 등)는 네트워크 요청을 그대로 둡니다.
  if (event.request.url.includes('cdn') || event.request.url.includes('unpkg')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 파일이 있으면 그것을 즉시 반환하고,
        // 없으면 네트워크로 요청하여 가져옵니다.
        return response || fetch(event.request);
      })
  );
});

// 3. 서비스 워커 활성화 이벤트: 이전 버전의 캐시를 정리합니다.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
