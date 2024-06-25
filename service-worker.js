self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pwa-cache-v1').then((cache) => {
            return cache.addAll([
                '/prajananam/',
                '/prajananam/index.html',
                '/prajananam/style.css',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
