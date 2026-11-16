// Quota · service worker v4 — cache dell'app e dei componenti Firebase per l'uso offline
const CACHE = 'quota-v4';
const FILES = ['./', './index.html', './config.js', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  // componenti Firebase (versione fissa nell'indirizzo): prima la cache, poi la rete
  if (u.hostname === 'www.gstatic.com' && u.pathname.indexOf('/firebasejs/') === 0) {
    e.respondWith(caches.match(e.request.url).then(hit => hit || fetch(e.request.url, { mode: 'cors' }).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request.url, copy)); } return r; }).catch(() => fetch(e.request))));
    return;
  }
  if (u.origin !== location.origin) return; // Firestore, Auth, Open Food Facts, font: rete
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
