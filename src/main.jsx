import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PWA from './PWA.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from './assets/server/authUser'; // Importa el AuthProvider
import NotificationHandler from './NotificationHandler'; // Importa el nuevo componente NotificationHandler


/*
if (process.env.NODE_ENV === 'production') {

  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}*/


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PWA/>
      <NotificationHandler />
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

//serviceWorker.register();
