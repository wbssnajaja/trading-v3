var CACHE_NAME = ‘trading-v4’;
var ASSETS = [
‘./’,
‘./index.html’
];

// CDN resources to cache on first load
var CDN_HOSTS = [‘cdn.jsdelivr.net’, ‘cdn.bootcdn.net’, ‘unpkg.com’];

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
return cache.addAll(ASSETS);
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
// Clean old caches
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

self.addEventListener(‘fetch’, function(e) {
var url = new URL(e.request.url);

// For CDN scripts: cache-first (once cached, always offline)
var isCDN = false;
for (var i = 0; i < CDN_HOSTS.length; i++) {
if (url.hostname === CDN_HOSTS[i]) { isCDN = true; break; }
}

if (isCDN) {
e.respondWith(
caches.match(e.request).then(function(cached) {
if (cached) return cached;
return fetch(e.request).then(function(response) {
var clone = response.clone();
caches.open(CACHE_NAME).then(function(cache) {
cache.put(e.request, clone);
});
return response;
});
})
);
return;
}

// For local files: cache-first, fallback to network
e.respondWith(
caches.match(e.request).then(function(cached) {
return cached || fetch(e.request).then(function(response) {
var clone = response.clone();
caches.open(CACHE_NAME).then(function(cache) {
cache.put(e.request, clone);
});
return response;
});
})
);
});