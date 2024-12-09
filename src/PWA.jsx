const PWA = () => {
    // Verifica que el navegador soporte Service Workers y que el servidor utilice HTTPS
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('../sw.js', { scope: '/pwa/' })
            .then(function (registration) {
                console.log('Service Worker PWA registrado con éxito:', registration);
                console.log('Service Worker registrado con scope PWA:', registration.scope);
            })
            .catch(function (error) {
                console.log('Error al registrar el Service Worker de la PWA:', error);
            });

        navigator.serviceWorker.register('../sw.js').then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log('Nueva versión disponible. Actualizando...');
                            // Aquí puedes forzar la recarga o avisar al usuario
                            window.location.reload();
                        } else {
                            console.log('Contenido cacheado para usar offline.');
                        }
                    }
                };
            };
        });
    } else {
        console.log('Service Worker no registrado: El servidor no utiliza HTTPS o el navegador no lo soporta.');
    }

    return null; // Este componente no necesita renderizar nada
};

export default PWA;
