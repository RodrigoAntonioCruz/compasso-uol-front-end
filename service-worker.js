//Assignem nom i versió a la cache
const CACHE_NAME = 'v1_cache_cristina_roige_prova_pwa';
//fitxers que es guardaran a la cache es un array d'arxius
var urlsToCache = [
	'./', //fitxers del directori actual
];

//events del service worker
//event install
//utilitzarem l'EventListener per capturar els elements
//self és la variable del service worker que estem carregant a main.js 
//el event es install, guardarà en cache els recursos del array urlsToCache
self.addEventListener('install', e => {
	//waitUntil és un mètode de l'event install
	e.waitUntil(
		//caches es un objecte open un metode de l'objecte caches
		caches.open(CACHE_NAME)
			  .then(cache => {
			  	return cache.addAll(urlsToCache) //afegim a la cache els arxius
			  				 .then(() => { //funció fletxa callback sense paràmetre
			  				 	self.skipWaiting(); //obliga a esperarse que s'afegeixin els arxius a la cache
			  				 });
			  				 
			  }) //Retorna una promesa
			  .catch(err=> { //en cas error
			  		console.log('no s\'ha registrat el cache', err);
			  })
	);
});

//Event activate
// utilitzarem self.addEventListener amb una funció de callback
self.addEventListener('activate', e => {
	//crearem una constant que anomenarem cacheWhiteList que contindrà
	//tots els elements que hi haurà a la cache
  const cacheWhitelist = [CACHE_NAME]
 
  e.waitUntil(
  	//cridarem el objecte caches i al mètode keys
		//el mètode keys recull el que hi ha a la cache i és una promesa
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
        	//buscarem dins de la cache l'element que estem recorrent
			//si no hi ha l'element programaticament a a cache guardada
			//s'eliminarà
          cacheNames.map(cacheName => {
            //Eliminem el que no es necessita de la cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      //funció callback sense paràmetre que activa la cache actual al dispositiu
	  //i l'app funcioni sense connexió.
      .then(() => self.clients.claim())
  )
})

//Event fetch
self.addEventListener('fetch', e => {
  //reponem amb dades de la cache o dades que recuperem del servidor
  e.respondWith(
  	//Si troba e.request es una promes i utilitzem then
    caches.match(e.request)
      .then(res => {
      	//si fa match i dona true retorna dades de la cache
        if (res) {
          
          return res
        }
        //en qualsevol altre cas petició ajax a la url original
        return fetch(e.request)
      })
  )
})