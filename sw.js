var CACHE_NAME = 'trading-v5'; // 升级版本号强制触发更新

var ASSETS = [
  './',
  './index.html',
  './TradeFiCalendar.html'
];

var CDN_HOSTS = ['cdn.jsdelivr.net', 'cdn.bootcdn.net', 'unpkg.com'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
          .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // 【关键修正】判断逻辑：只要路径里包含 TradeFiCalendar（不区分大小写），就走网络优先
  var isTradePage = url.pathname.toLowerCase().indexOf('tradeficalendar') !== -1;

  if (isTradePage) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          // 联网成功，顺便更新一下缓存
          var clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(function() {
          // 没网时才读缓存
          return caches.match(e.request);
        })
    );
    return;
  }

  // CDN 资源：缓存优先
  var isCDN = CDN_HOSTS.some(host => url.hostname === host);
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        return fetch(e.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // 其他本地资源：缓存优先
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      });
    })
  );
});
