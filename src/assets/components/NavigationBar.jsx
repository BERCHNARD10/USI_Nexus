import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoNotifications, IoMenu, IoClose } from 'react-icons/io5';
import { HiUserCircle } from 'react-icons/hi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Button, Navbar, Avatar, Dropdown, Badge } from 'flowbite-react';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../server/authUser'; // Importa el hook de autenticación
import secondaryLogo from '../images/secondary-logo.png'
import logoPwa from '../images/logo-pwa.png'
import SideNav from './SideNavBar'
import  Components from './Components'
const {LoadingButton, DarkModeToggle} = Components;

const NavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate(); 
  const { isAuthenticated, userData, logout } = useAuth(); // Obtén el estado de autenticación del contexto
  const [showMenu, setShowMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false); // Muestra el snackbar si la app es instalable
  const [isInstallable, setIsInstallable] = useState(false); // Estado para saber si la PWA es instalable
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const webUrl = import.meta.env.VITE_URL;

  // Función para alternar el menú de notificaciones
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Simulamos obtener notificaciones (puedes sustituir con una llamada a una API)
  useEffect(() => {
    // Datos de ejemplo de las notificaciones
    const fetchedNotifications = [
      { 
        id: 1, 
        message: 'Tarea de Juan Pérez: "Proyecto de Matemáticas entregado."', 
        time: 'Hace 1 hora', 
        status: 'Entregada', 
        profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg' // URL de la imagen
      },
      { 
        id: 2, 
        message: 'Tarea de Ana López: "Informe de Ciencias pendiente."', 
        time: 'Hace 2 horas', 
        status: 'Pendiente', 
        profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg' 
      },
      { 
        id: 3, 
        message: 'Tarea de Carlos García: "Tarea de Inglés comentada."', 
        time: 'Hace 4 horas', 
        status: 'Comentario', 
        profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg' 
      },
      { 
        id: 4, 
        message: 'Tarea de María Sánchez: "Entrega tardía de Historia."', 
        time: 'Hace 6 horas', 
        status: 'Entregada tarde', 
        profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg' 
      },
      { 
        id: 5, 
        message: 'Tarea de José Ruiz: "Ensayo de Filosofía entregado."', 
        time: 'Hace 1 día', 
        status: 'Entregada', 
        profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg' 
      },
    ];

    setNotifications(fetchedNotifications);
  }, []);


    // Función para verificar si la PWA está instalada
    const checkIfAppIsInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches;
    };
  
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
  
    const handleCloseSnackbar = () => {
      setShowSnackbar(false); // Cierra el Snackbar cuando se hace clic en la "X"
    };
  
  const profileImageUrl = isAuthenticated && userData?.vchFotoPerfil
    ? decodeURIComponent(`${webUrl}assets/imagenes/${userData.vchFotoPerfil}`)
    : `${webUrl}assets/imagenes/userProfile.png`; // Enlace alternativo cuando vchFotoPerfil es null o usuario no está autenticado

// Usar profileImageUrl para el src de la imagen
<img src={profileImageUrl} alt="Perfil" />



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


  useEffect(() => {
    const handleScroll = () => {
      if (showMenu) {
        // Cierra el menú si está abierto
        setShowMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Limpia el event listener cuando el componente se desmonta
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMenu]);

  return (
    <>
    <Navbar fluid rounded className="p-3 bg-white border border-gray-200 shadow dark:bg-background_400  dark:border-gray-700 header">
      <div className="nav__section flex">
        <div className={`nav__toggle  ${isAuthenticated ? "block md:block mr-2" : "hidden "}`} id="nav-toggle" onClick={toggleSidebar}>
          <IoMenu />
        </div>
        <Navbar.Brand as={NavLink} to="/">
          <img className="h-8 mr-2" src={`${webUrl}assets/secondary-logo-BL9o4fsR.png`} alt="" />
          Nexus  
        </Navbar.Brand>
      </div>
      {isAuthenticated ? 
        (
        <div className="flex items-center gap-4 md:order-2">
          {/*
          <Dropdown
            arrowIcon={false}
            inline
            label={
            <>
              <div className="relative">
                <IoNotifications className="w-8 h-8 text-gray-500 dark:text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {notifications.length}
                    </span>
                  )}
              </div>
            </>
            }
          >
          <Dropdown.Header>
            <span className="font-semibold text-gray-700">Notificaciones</span>
          </Dropdown.Header>

          {notifications.length === 0 ? (
            <Dropdown.Header>
              <span className="font-semibold text-gray-700">Notificaciones</span>
            </Dropdown.Header>
          ) 
            : 
            (
              notifications.map((notification) => (
              <>
                <Dropdown.Item href='/mi-perfil'>
                  <img 
                    src={notification.profileImageUrl} 
                    alt="Perfil" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-gray-700">{notification.message}</p>
                    <p className="text-sm text-gray-400">{notification.time}</p>
                  </div>
                </Dropdown.Item>
              </>
            ))
          )}
          </Dropdown>
          */}
      <Dropdown arrowIcon={false} inline
        label={
          <div className="flex items-center gap-2">
            {/* Botón de Modo Oscuro */}
            <DarkModeToggle />

            {/* Imagen de perfil */}
            <img 
              src={profileImageUrl}
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        }
      >
            <Dropdown.Item as="div">
              <Link to="/mi-perfil" className="flex items-center">
                <FaUser className="mr-2" />
                Mi Perfil
              </Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={logout}>
              <FaSignOutAlt className="mr-2" />
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown>

          <div className="flex flex-col text-right hidden-below-365">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200 capitalize">
          {userData.vchNombre.toLowerCase()} {userData.vchAPaterno.toLowerCase()} {userData.vchAMaterno.toLowerCase()}
            </span>
              <span className="text-start text-sm text-gray-500 dark:text-gray-400 truncate">{userData.vchNombreRol}</span>
            </div>
          </div>



        )
        :
        (
          <LoadingButton 
            Icon={HiUserCircle} 
            normalLabel="Iniciar Sesión" 
            className="w-auto h-auto"
            onClick={() => navigate('/inicio-sesion')} 
          />
        )
    }
    </Navbar>

    <SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
    </>

  );
};

export default NavigationBar;
