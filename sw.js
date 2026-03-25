var CACHE_NAME = 'tradefi-v8';

var ASSETS = [
  './',
  './index.html',
  './TradeFiCalendar.html',
  './fundamental.html',
  './nav-dock.js'
];

var CDN_HOSTS = ['cdn.jsdelivr.net', 'cdn.bootcdn.net', 'unpkg.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

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

  // App pages: network-first (always get latest, fallback to cache offline)
  var isAppPage = url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname.endsWith('nav-dock.js');
  if (isAppPage) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
          return response;
        })
        .catch(function() {
          return caches.match(e.request);
        })
    );
    return;
  }

  // CDN resources: cache-first
  var isCDN = CDN_HOSTS.some(function(host) { return url.hostname === host; });
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        return fetch(e.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
          return response;
        });
      })
    );
    return;
  }

  // Everything else: cache-first
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
        return response;
      });
    })
  );
});
