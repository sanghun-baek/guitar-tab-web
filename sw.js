// 웹판 오프라인용 서비스 워커. 웹 빌드(vite.web.config.mts)가 판 번호와 파일 목록을 채워 dist-web/sw.js로 낸다.
// 페이지는 네트워크 우선(배포하면 바로 새 판, 끊기면 캐시), 그 밖의 파일(해시가 붙은 스크립트·폰트 등)은 캐시 우선.

const CACHE = 'gtab-f5cacg'
const FILES = ["./","assets/bravura-CBWYXOFh.woff2","assets/grip-BmpIFA-d.css","assets/grip-PonwAiI9.js","assets/index-4JMkAoDD.js","assets/index-DPOT50m6.css","assets/jsx-runtime-DXtSKCYQ.js","grip.html","icon-192.png","icon-512.png","index.html","manifest.webmanifest"]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('gtab-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            void caches.open(CACHE).then((cache) => cache.put('index.html', copy))
          }
          return response
        })
        .catch(() => caches.match('index.html', { ignoreSearch: true, ignoreVary: true }).then((hit) => hit ?? Response.error()))
    )
    return
  }

  // ignoreVary: crossorigin 스크립트 요청에는 Origin 헤더가 붙어 서버의 Vary 때문에 캐시와 맞지 않는다 (Chromium)
  event.respondWith(caches.match(request, { ignoreVary: true }).then((hit) => hit ?? fetch(request)))
})
