self.addEventListener('install', () => {
  console.log('SW: instalado')
})

self.addEventListener('activate', () => {
  console.log('SW: activado')
})

self.addEventListener('fetch', (event) => {
  console.log('SW fetch:', event.request.method, event.request.url)
})