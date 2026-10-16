/**
 * Service worker: makes the site installable as a PWA and keeps visited pages
 * readable offline. Network-first, so deploys show up immediately; the cache
 * is only a fallback. Bump CACHE_VERSION to drop old caches.
 */

const CACHE_VERSION = 'v2';
const PRECACHE_NAME = `portfolio-precache-${CACHE_VERSION}`;
const RUNTIME_NAME = `portfolio-runtime-${CACHE_VERSION}`;
const RUNTIME_MAX_ENTRIES = 60;

// Resolved against this file's location, so it works at the domain root or a subpath.
const HOME_URL = new URL('./', self.location).href;
const PRECACHE = [
    './',
    'css/style.css',
    'js/main.js',
    'manifest.webmanifest',
    'files/favicon-192x192.png'
].map((path) => new URL(path, self.location).href);

// Large/binary downloads that shouldn't fill up the offline cache.
const NO_CACHE_EXTENSIONS = /\.(pdf|zip|mp4|webm|mov)$/i;

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Offline | Aidan Lenahan</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#18181b;color:#e4e4e7;text-align:center;padding:1rem}
a{color:#a5b4fc}
@media (prefers-color-scheme: light){body{background:#fff;color:#18181b}a{color:#4338ca}}
</style>
</head>
<body>
<main>
<h1>You're offline</h1>
<p>This page hasn't been saved for offline use. Check your connection and try again.</p>
<p><a href="${HOME_URL}">Go to the home page</a></p>
</main>
</body>
</html>`;

function offlineResponse() {
    return new Response(OFFLINE_HTML, {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
    });
}

function isCacheable(response) {
    return response.status === 200
        && response.type === 'basic'
        && !response.redirected
        && !response.headers.has('Content-Range');
}

// Drops the oldest runtime entries (cache.keys() is in insertion order).
async function trimRuntimeCache(cache) {
    const keys = await cache.keys();
    const excess = keys.length - RUNTIME_MAX_ENTRIES;
    for (let i = 0; i < excess; i++) {
        await cache.delete(keys[i]);
    }
}

async function storeInRuntimeCache(key, response) {
    const cache = await caches.open(RUNTIME_NAME);
    // Delete first so a refreshed entry moves to the end of the insertion order.
    await cache.delete(key);
    await cache.put(key, response);
    await trimRuntimeCache(cache);
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    const keep = [PRECACHE_NAME, RUNTIME_NAME];
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key.startsWith('portfolio-') && !keep.includes(key))
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
    // Range requests and big binaries go straight to the network, uncached.
    if (request.headers.has('Range') || NO_CACHE_EXTENSIONS.test(url.pathname)) {
        return;
    }

    const isNavigation = request.mode === 'navigate';
    // Pages are stored without their query string so ?utm=... etc. don't pile up copies.
    const cacheKey = isNavigation ? url.origin + url.pathname : request;

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (isCacheable(response)) {
                    const copy = response.clone();
                    event.waitUntil(
                        storeInRuntimeCache(cacheKey, copy).catch(() => { /* quota, etc. */ })
                    );
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(cacheKey);
                if (cached) {
                    return cached;
                }
                return isNavigation ? offlineResponse() : Response.error();
            })
    );
});
