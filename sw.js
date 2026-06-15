/* ==========================
HI • KAT SERVICE WORKER
========================== */

const CACHE_NAME = "hikat-v1";

const ASSETS = [
"./",
"./index.html",
"./home.html",
"./products.html",
"./cart.html",
"./orders.html",
"./profile.html",
"./admin.html",

"./style.css",

"./config.js",
"./common.js",
"./supabase.js",
"./productPopup.js",

"./manifest.json",

"./icon-192.png",
"./icon-512.png"
];

/* ==========================
INSTALL
========================== */

self.addEventListener("install", event => {

self.skipWaiting();

event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(ASSETS))
);

});

/* ==========================
ACTIVATE
========================== */

self.addEventListener("activate", event => {

event.waitUntil(
caches.keys().then(keys => {
return Promise.all(
keys.map(key => {

```
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }

    })
  );
})
```

);

self.clients.claim();

});

/* ==========================
FETCH
========================== */

self.addEventListener("fetch", event => {

if (event.request.method !== "GET") return;

event.respondWith(

```
caches.match(event.request)
  .then(response => {

    return (
      response ||
      fetch(event.request)
        .then(networkResponse => {

          const clone =
            networkResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(
                event.request,
                clone
              );
            });

          return networkResponse;

        })
        .catch(() => {
          return caches.match(
            "./index.html"
          );
        })

    );

  })
```

);

});

/* ==========================
MESSAGE
========================== */

self.addEventListener("message", event => {

if (
event.data &&
event.data.type === "SKIP_WAITING"
) {
self.skipWaiting();
}

});
