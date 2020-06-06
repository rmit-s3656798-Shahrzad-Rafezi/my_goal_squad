const staticCacheName = 'site-static';
// const dynamicCacheName = 'site-dynamic-v7';
const assets = [
  '/',
  '/index.html',
  '/pages/admin-page.html',
  '/pages/gratitude-journal.html',
  '/pages/quote-of-the-day.html',
  '/pages/user-main-page.html',
  '/pages/user-profile-page.html',
  '/functions/index.js',
  '/js/app.js',
  '/js/user-main-page.js',
  '/js/admin-page.js',
  '/js/firebase.js',
  '/js/gratitude-journal.js',
  '/js/navbar.js',
  '/js/quote-of-the-day.js',
  '/js/user-profile-page.js',
  '/css/index.css',
  '/css/user-main-page.css',
  '/css/admin-page.css',
  '/css/gratitude-journal.css',
  '/css/navbar.css',
  '/css/quote-of-the-day.css',
  '/css/user-profile-page.css',
  '/img/logo.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// // cache size limit function
// const limitCacheSize = (name, size) => {
//   caches.open(name).then(cache => {
//     cache.keys().then(keys => {
//       if(keys.length > size){
//         cache.delete(keys[0]).then(limitCacheSize(name, size));
//       }
//     });
//   });
// };

// install event
self.addEventListener('install', evt => {
  console.log('service worker installed');
   evt.waitUntil(
     caches.open(staticCacheName).then((cache) => {
       console.log('caching shell assets');
       cache.addAll(assets);
     })
   );
});

// // activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  // evt.waitUntil(
  //   caches.keys().then(keys => {
  //     //console.log(keys);
  //     return Promise.all(keys
  //       .filter(key => key !== staticCacheName && key !== dynamicCacheName)
  //       .map(key => caches.delete(key))
  //     );
  //   })
  // );
});

// // fetch events
// self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
//   if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
//     evt.respondWith(
//       caches.match(evt.request).then(cacheRes => {
//         return cacheRes || fetch(evt.request).then(fetchRes => {
//           return caches.open(dynamicCacheName).then(cache => {
//             cache.put(evt.request.url, fetchRes.clone());
//             // check cached items size
//             limitCacheSize(dynamicCacheName, 15);
//             return fetchRes;
//           })
//         });
//       }).catch(() => {
//         if(evt.request.url.indexOf('.html') > -1){
//           return caches.match('/pages/fallback.html');
//         }
//       })
//     );
//   }
// });