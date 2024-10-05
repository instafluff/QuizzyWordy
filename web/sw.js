// web/sw.js

const CACHE_NAME = 'quizzywordy-cache-v1';
const urlsToCache = [
  '../',
  '../index.html',
  './styles/style.css',
  './scripts/app.js',
  './manifest.json',
  './data/cs-en.json',
  // Add other language data files as needed
  // Add icons
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});
