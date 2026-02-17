/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE_NAME = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event: any) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event: any) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE_NAME) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event: any) => {
    if (event.request.method !== 'GET') return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE_NAME);

        // Always serve static assets from cache
        if (ASSETS.includes(url.pathname)) {
            return cache.match(url.pathname);
        }

        // For other requests, try network first, then cache
        try {
            const response = await fetch(event.request);
            if (response.status === 200) {
                // Cache chapters and materials for offline access
                if (url.pathname.includes('/api/v1/materials')) {
                    cache.put(event.request, response.clone());
                }
            }
            return response;
        } catch {
            return cache.match(event.request);
        }
    }

    event.respondWith(respond());
});
