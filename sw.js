const CACHE='bbb-bali-v4-1';
const ASSETS=['/','/index.html','/styles.css','/app.js','/manifest.json','/icon.svg','/assets/sunset-beanbags.png'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const req=event.request;
  event.respondWith(
    fetch(req).then(res=>{
      if(res && res.ok && new URL(req.url).origin===self.location.origin){
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
      }
      return res;
    }).catch(async()=>{
      const cached=await caches.match(req);
      if(cached) return cached;
      if(req.mode==='navigate') return caches.match('/index.html');
      return Response.error();
    })
  );
});
