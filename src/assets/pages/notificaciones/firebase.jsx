/*// Importa las funciones necesarias desde Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJgXEVRF9Kku6zK0DUqg15JkLylAzOKgo",
  authDomain: "notificaciones-5e417.firebaseapp.com",
  projectId: "notificaciones-5e417",
  storageBucket: "notificaciones-5e417.appspot.com",
  messagingSenderId: "978484214496",
  appId: "1:978484214496:web:f869d2d9ab4745a10dae85",
  measurementId: "G-RDQCGEV699"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén la instancia de Firebase Messaging
const messaging = getMessaging(app);

export { messaging };
*/

// Importa las funciones necesarias desde Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

let messaging;

// Verifica si la página se está sirviendo a través de HTTPS
if (window.location.protocol === 'https:') {
  // Tu configuración de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCJgXEVRF9Kku6zK0DUqg15JkLylAzOKgo",
    authDomain: "notificaciones-5e417.firebaseapp.com",
    projectId: "notificaciones-5e417",
    storageBucket: "notificaciones-5e417.appspot.com",
    messagingSenderId: "978484214496",
    appId: "1:978484214496:web:f869d2d9ab4745a10dae85",
    measurementId: "G-RDQCGEV699"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);

  // Obtén la instancia de Firebase Messaging
  messaging = getMessaging(app);

  // Aquí puedes agregar la lógica de obtener el token y gestionar los mensajes, etc.
  console.log("Firebase Messaging ha sido inicializado exitosamente.");
} else {
  console.log("La aplicación no está utilizando HTTPS. Firebase Messaging no se inicializa.");
}

// Exporta messaging solo si se inicializa correctamente
export { messaging };
