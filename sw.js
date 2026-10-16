/**
 * Service worker: makes the site installable as a PWA and keeps visited pages
 * readable offline. Network-first, so deploys show up immediately; the cache
 * is only a fallback. Bump CACHE_VERSION to drop old caches.
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

// Resolved against this file's location, so it works at the domain root or a subpath.
const PRECACHE = [
    './',
    'index.html',
    '404.html',
    'css/style.css',
    'js/main.js',
    'favicon.ico',
    'files/favicon-192x192.png',
    'files/favicon-512x512.png',
    'manifest.webmanifest'
].map((path) => new URL(path, self.location).href);

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key.startsWith('portfolio-') && key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Only handle same-origin GETs; analytics, CDNs, etc. go straight to the network.
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(request, { ignoreSearch: request.mode === 'navigate' });
                if (cached) {
                    return cached;
                }
                if (request.mode === 'navigate') {
                    return caches.match(new URL('./', self.location).href);
                }
                return Response.error();
            })
    );
});
