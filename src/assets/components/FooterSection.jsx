import React, { useState, useEffect } from "react";
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import  Components from './Components'
const {LoadingButton} = Components;

function FooterSection() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false); // Muestra el snackbar si la app es instalable
  const [isInstallable, setIsInstallable] = useState(false); // Estado para saber si la PWA es instalable

  // Función para verificar si la PWA está instalada
  const checkIfAppIsInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches;
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
  
    window.addEventListener('beforeinstallprompt', handler);
  
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    // Verifica si la PWA ya está instalada al cargar la página
    if (!checkIfAppIsInstalled() && isInstallable) {
      setShowSnackbar(true);
    }

    // Escucha el evento `appinstalled`
    window.addEventListener('appinstalled', () => {
      console.log('PWA fue instalada');
      setShowSnackbar(false); // Oculta el Snackbar una vez instalada
    });

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('appinstalled', () => {
        setShowSnackbar(false);
      });
    };
  }, [isInstallable]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

    return (
      <Footer container className="Fotter mt-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {/* Logo */}
            <div className="flex justify-center sm:justify-start">
              <img
                src={`${import.meta.env.VITE_URL}assets/main-logo.png`}
                alt="Company Logo"
                className="h-24 w-24"
              />
            </div>

            {/* Links Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col items-center sm:items-start">
                <Footer.Title title="Acerca de" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">
                    Carretera Huejutla - Chalahuiyapa S/N, C.P. 43000, Huejutla de Reyes, Hidalgo.
                  </Footer.Link>
                  <Footer.Link href="#">E-mail: rectoría@uthh.edu.mx</Footer.Link>
                </Footer.LinkGroup>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Footer.Title title="Términos Legales" />
                <Footer.LinkGroup col>
                  <Footer.Link as={Link} to="/Terminos">
                    Términos & Condiciones
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>

            {/* App Section */}
            {showSnackbar && (
            <div className="flex flex-col sm:flex-row items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 shadow-lg rounded-xl">
              <div className="flex items-center mb-4 sm:mb-0 sm:mr-4">
                <img src={`${import.meta.env.VITE_URL}assets/logo-pwa-D7m3SRGY.png`} alt="Logo UTHH Virtual" className="w-12 h-12" />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">App de UTHH Virtual</h2>
                  <p className="text-gray-600 text-sm">Descarga la app para un acceso rápido</p>
                </div>
              </div>
              <LoadingButton normalLabel="Instalar App" className="w-full sm:w-auto h-auto text-white rounded px-4 py-2" onClick={handleInstallClick}/>
            </div>
            )}
          </div>

          {/* Divider */}
          <Footer.Divider className="my-6" />

          {/* Copyright */}
          <div className="w-full text-center sm:text-left">
            <Footer.Copyright href="#" by="UTHH" year={2024} />
          </div>
        </div>
      </Footer>
    );
}

export default FooterSection;
