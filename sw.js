const CACHE = "monitor-ierf-catu-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./css/print.css",
  "./css/brand.css",
  "./js/data.js",
  "./js/app.js",
  "./icons/logo-catu-dorado.png",
  "./icons/catu_logo_white.png",
  "./icons/logo-catu-dorado.svg",
  "./icons/catu_logo_white.svg"
];
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((cached) => {
      if (cached) return cached;
      if (req.mode === "navigate") return caches.match("./index.html");
      return cached;
    }))
  );
});
