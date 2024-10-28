const PWA = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js', { scope: '/pwa/' })
        .then(function(registration) {
            console.log('Service Worker PWA registrado con éxito:', registration);
    
            console.log('Service Worker registered with scope PWA:', registration.scope);
        })
        .catch(function(error) {
            console.log('Error al registrar el service de la PWA:', error);
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js').then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                    console.log('Nueva versión disponible. Actualizando...');
                    // Aquí puedes forzar la recarga o avisar al usuario
                    window.location.reload();
                } 
                else 
                {
                    console.log('Contenido cacheado para usar offline.');
                }
              }
            };
          };
        });
      }

    return null; // Este componente no necesita renderizar nada
};

export default PWA;