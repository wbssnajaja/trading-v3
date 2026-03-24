var CACHE_NAME = 'trading-v4';
// 1. 把新页面也加入预缓存列表，确保离线可用
var ASSETS = [
  './',
  './index.html',
  './trade.html' // <--- 加上你的第二个页面
];

var CDN_HOSTS = ['cdn.jsdelivr.net', 'cdn.bootcdn.net', 'unpkg.com'];

// ... (install 和 activate 部分保持不变)

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // 【核心修改：白名单/网络优先】
  // 如果你正在开发 trade.html，不希望它被旧缓存死死卡住
  // 或者你有一些需要实时数据的 API，在这里排除
  if (url.pathname.includes('trade.html')) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request); // 只有断网了才走缓存
      })
    );
    return;
  }

  // CDN 资源保持原样：缓存优先（因为库文件很少变）
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

  // 本地文件：缓存优先
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
