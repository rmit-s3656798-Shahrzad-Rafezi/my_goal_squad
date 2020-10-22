//check if service workers are supported in browsers & then register a service worker if they are.
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('service worker registered', reg))
      .catch((err) => console.log('service worker not registered', err));
    }