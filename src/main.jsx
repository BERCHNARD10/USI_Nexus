import React from 'react';
import * as Sentry from "@sentry/react";
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

Sentry.init({
  dsn: "https://[your_dsn_here].ingest.sentry.io/[project_id]",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/robe\.host8b\.me\//],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});


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
