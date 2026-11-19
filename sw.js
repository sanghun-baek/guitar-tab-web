// Pages판 이사 안내(5-3 PG7)의 서비스 워커: 옛 편집기의 서비스 워커(같은 자리의 sw.js)를 갈음해 들어와 스스로 물러난다.
// 브라우저가 옛 워커를 갱신하면서 이 파일을 받으면 기다리지 않고 바로 켜지고, 이 앱의 캐시(gtab-…)를 지운 뒤 등록을 푼다.
// fetch를 다루지 않으므로 그동안의 요청도 모두 네트워크로 간다 — 옛 편집기를 캐시에서 내주지 않는다.
// 열려 있는 옛 편집기 탭은 새로 고치지 않는다(고치던 악보를 잃지 않게). 다음에 열면 네트워크에서 안내가 온다.
// 안내 빌드(vite.notice.config.mts)가 이 파일을 그대로 낸다

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('gtab-')).map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
  )
})
