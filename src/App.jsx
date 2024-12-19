import React, { useState, useEffect } from 'react';
import { BrowserRouter, Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './assets/server/authUser';
import Layout from './assets/components/Layout';
import HomePage from './assets/pages/HomePage';
import LoginPage from './assets/pages/LoginPage';
import RegisterPage from './assets/pages/RegisterPage';
import ProfilePage from './assets/pages/ProfileUser';
import EmailForm from './assets/pages/EmailForm';
import ResetPassword from './assets/pages/ResetPassword';
import ResetPasswordCode from './assets/pages/ResetPasswordCode';
import PrivacyPolicy from './assets/pages/Terminos';
import Error404 from './assets/pages/Error404';
//PAGINAS ALUMNO
import ActividadesAlumno from './assets/pages/PaginasAlumnos/ActividadesAlumno';
import DetalleActividadAlumno from './assets/pages/PaginasAlumnos/DetalleActividadAlumno';
import DetallePracticaAlumno from './assets/pages/PaginasAlumnos/DetallePracticaAlumno';

//PAGINAS DOCENTE

import Docentes from './assets/pages/PaginasDocentes/Teachers';
import Alumnos from './assets/pages/PaginasDocentes/Alumnos';
import CarrerasCrud from './assets/pages/PaginasDocentes/Carreras';
import Departamentos from './assets/pages/PaginasDocentes/Departamentos';
import Periodos from './assets/pages/PaginasDocentes/Periodo';
import GruposMateriasDocente from './assets/pages/PaginasDocentes/GruposMateriaDocente';
import ActividadesDocente from './assets/pages/PaginasDocentes/ActividadesDocente';
import DetalleActividadDocente from './assets/pages/PaginasDocentes/DetalleActividadDocente';
import DetallePracticaDocente from './assets/pages/PaginasDocentes/DetallePracticaDocente';
import Notificaciones from './assets/pages/Notificaciones'
// Importa los estilos de react-toastify
import 'react-toastify/dist/ReactToastify.css';
// Importa el ToastContainer y el método toast
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import Components from './assets/components/Components'
const { LoadingOverlay, OfflineAlert } = Components;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType('navigation');
    const isPageReloaded = navigationEntries.length > 0 && navigationEntries[0].type === 'reload';

    if (isPageReloaded) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Ajusta el tiempo según lo necesites
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };

  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <AuthProvider>
      
        <BrowserRouter basename="/UTHH_VIRTUAL">
      
      {
        //<BrowserRouter basename="/">

      }
      
        
        <Routes>
          {/*PAGINAS PARA TODOS */}

          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/inicio-sesion" element={<IsAuthenticated><LoginPage /></IsAuthenticated>} />
          <Route path="/registro" element={<IsAuthenticated><RegisterPage /></IsAuthenticated>} />
          <Route path="/recuperar-contrasena" element={<IsAuthenticated><Layout><EmailForm /></Layout></IsAuthenticated>} />
          <Route path="/restablecer-contrasena/:matricula/:token/" element={<IsAuthenticated><Layout><ResetPassword /></Layout></IsAuthenticated>} />
          <Route path="/mi-perfil/" element={<PrivateRouteUser><Layout><ProfilePage /></Layout></PrivateRouteUser>} />
          <Route path="/reset-password-code/:codigo/" element={<Layout><ResetPasswordCode /></Layout>} />

          {/*PAGINAS PARA Alumnos */}
          <Route path="/actividades/:vchClvMateria/:chrGrupo/:intPeriodo" element={<PrivateRouteUser><Layout><ActividadesAlumno /></Layout></PrivateRouteUser>} />
          <Route path="/actividades/detalleActividad/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intIdActividadCurso" element={<PrivateRouteUser><Layout><DetalleActividadAlumno /></Layout></PrivateRouteUser>} />
          <Route path="/actividades/detalleActividad/detallePractica/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intNumeroPractica/:intIdActividadCurso" element={<PrivateRouteUser><Layout><DetallePracticaAlumno /></Layout></PrivateRouteUser>} />
          {/*PAGINAS PARA Docentes */}

          <Route path="/alumnos" element={<PrivateRoute><Layout><Alumnos /></Layout></PrivateRoute>} />
          <Route path="/departamentos" element={<PrivateRoute><Layout><Departamentos /></Layout></PrivateRoute>} />
          <Route path="/periodos" element={<PrivateRoute><Layout><Periodos /></Layout></PrivateRoute>} />
          <Route path="/carreras" element={<PrivateRoute><Layout><CarrerasCrud /></Layout></PrivateRoute>} />
          <Route path="/docentes" element={<PrivateRoute><Layout><Docentes /></Layout></PrivateRoute>} />
          <Route path="/Admin/Teachers" element={<Layout><Docentes /></Layout>} />
          <Route path="/gruposMaterias/:vchClvMateria/:intPeriodo" element={<PrivateRoute><Layout><GruposMateriasDocente /></Layout></PrivateRoute>} />
          <Route path="/gruposMaterias/actividades/:vchClvMateria/:chrGrupo/:intPeriodo" element={<PrivateRoute><Layout><ActividadesDocente /></Layout></PrivateRoute>} />
          <Route path="/gruposMaterias/actividades/detalleActividad/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intIdActividadCurso" element={<PrivateRoute><Layout><DetalleActividadDocente /></Layout></PrivateRoute>} />
          <Route path="/gruposMaterias/actividades/detalleActividad/detallePractica/:vchClvMateria/:chrGrupo/:intPeriodo/:intNumeroActi/:intNumeroPractica/:intIdActividadCurso" element={<PrivateRoute><Layout><DetallePracticaDocente /></Layout></PrivateRoute>} />

          <Route path="/Terminos" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/*" element={<Layout><Error404 /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function IsAuthenticated({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" /> : children;
}


function PrivateRoute({ children }) {
  const { isAuthenticated, userData } = useAuth();

  // Validación: Usuario no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Validación: Usuario autenticado pero sin rol
  if (isAuthenticated && !userData.intRol) {
    return <Navigate to="/" />;
  }

  // Si pasa la validación, muestra el contenido de la ruta
  return children;
}


function PrivateRouteAdmin({ children }) {
  const { isAuthenticated, userData } = useAuth();

  // Validación: Usuario no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Validación: Usuario autenticado pero sin rol
  if (isAuthenticated && userData.vchNombreRol != "Administrador") {
    return <Navigate to="/" />;
  }

  // Si pasa la validación, muestra el contenido de la ruta
  return children;
}



function PrivateRouteUser({ children }) {
  const { isAuthenticated } = useAuth();

  // Validación: Usuario no autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si pasa la validación, muestra el contenido de la ruta
  return children;
}


export default App;
