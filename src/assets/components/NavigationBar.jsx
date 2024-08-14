import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { HiUserCircle } from 'react-icons/hi';
import { Button, Navbar, Avatar, Dropdown } from 'flowbite-react';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../server/authUser'; // Importa el hook de autenticación
import secondaryLogo from '../images/secondary-logo.png'
import SideNav from './Admin/SideNavBar'
const NavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate(); 
  const { isAuthenticated, userData, logout } = useAuth(); // Obtén el estado de autenticación del contexto
  const [showMenu, setShowMenu] = useState(false);

  const profileImageUrl = isAuthenticated && userData?.vchFotoPerfil
    ? `https://robe.host8b.me/assets/imagenes/${userData.vchFotoPerfil}`
    : 'https://robe.host8b.me/assets/imagenes/userProfile.png'; // Enlace alternativo cuando vchFotoPerfil es null o usuario no está autenticado

// Usar profileImageUrl para el src de la imagen
<img src={profileImageUrl} alt="Perfil" />

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
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
    <Navbar fluid rounded className="p-3 bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 header">
      <div className="nav__section flex">
      <div className={`nav__toggle  ${isAuthenticated ? "block md:block mr-2" : "hidden "}`} id="nav-toggle" onClick={toggleSidebar}>
          <IoMenu />
        </div>
        <Navbar.Brand as={NavLink} to="/">
          <img className="h-8 mr-2" src={secondaryLogo} alt="" />
          UTHH Virtual
        </Navbar.Brand>
      </div>
      {isAuthenticated ? 
        (
          <div className="flex md:order-2">
            <Dropdown  label={<span className="hover:bg-gray-100 mr-3 p-3.5 rounded-full"><IoMdAdd /> </span>} inline arrowIcon={false}>
              <Dropdown.Item >Agregar nuevo curso</Dropdown.Item>
              <Dropdown.Item href="/Admin/Students">Agregar alumnos</Dropdown.Item>
            </Dropdown>
            <Dropdown
                arrowIcon={false}
                inline
                label={<Avatar alt="User settings" 
                  img={profileImageUrl}
                  rounded />}
            >
                <Dropdown.Header>
                <span className="block text-sm">{userData.vchNombre}</span>
                <span className="block truncate text-sm font-medium">{userData.roles}</span>
                <span className="block text-sm">{userData.vchCorreoElectronico}</span>
                </Dropdown.Header>
                <Dropdown.Item href="/mi-perfil">Mi Perfil</Dropdown.Item>
                {/*<Dropdown.Item>Ajustes</Dropdown.Item>
                <Dropdown.Item href="/ResultadosCalificaciones">Busqueda Sencilla</Dropdown.Item>
                <Dropdown.Item href="/BusquedaAvanzada">Busqueda Avanzada</Dropdown.Item>*/}
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>Cerrar Sesion</Dropdown.Item>
            </Dropdown>
          </div>
        )
        :
        (
          <div className="contents items-center">
            <div className={`nav__section nav__menu ${showMenu ? "show-menu" : ""}`} id="nav-menu">
              <ul className="nav__list">
                <li className="nav__item">
                  <NavLink to="/" className="nav__link" onClick={closeMenuOnMobile}>
                    Inicio
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="/news" className="nav__link" onClick={closeMenuOnMobile}>
                    Para Docentes
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="/about-us" className="nav__link" onClick={closeMenuOnMobile}>
                    Gamificación educativa
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="/favorite" className="nav__link" onClick={closeMenuOnMobile}>
                    Preguntas frecuentes
                  </NavLink>
                </li>
              </ul>

              <div className="nav__close" id="nav-close" onClick={toggleMenu}>
                <IoClose />
              </div>
            </div>
    
            <div className="nav__section nav__button">
              <Button className={`button  ${showMenu ? "button-menu-active" : "button-menu-disable"}`} onClick={() => navigate('/inicio-sesion')} variant="outlined">
                <HiUserCircle className="mr-2" /> Iniciar Sesión
              </Button>
            </div>

            <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <IoMenu />
            </div>
          </div>
        )
    }
    </Navbar>

    <SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
    </>

  );
};

export default NavigationBar;
