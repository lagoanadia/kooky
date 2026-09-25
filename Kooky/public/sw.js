const CACHE = 'kooky-v1'
self.addEventListener('install', () => {
  console.log('SW: instalado')
})

self.addEventListener('activate', () => {
  console.log('SW: activado')
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // 1. Solo GET se puede cachear
  if (request.method !== 'GET') return

  // 2. No tocar la API
  if (url.pathname.startsWith('/recipes')) return

  console.log('SW se encargaría de:', url.href)
})
  // 3. Fuentes de Google → cache-first
  const esFuente =
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com'

  if (esFuente) {
    event.respondWith(
      caches.match(request).then((guardada) => {
        if (guardada) {
          console.log('SW: desde caché', url.href)
          return guardada
        }
        return fetch(request).then((respuesta) => {
          const copia = respuesta.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copia))
          console.log('SW: desde internet (guardada)', url.href)
          return respuesta
        })
      })
    )
  }