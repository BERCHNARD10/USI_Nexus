// SideNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { HiUserGroup, HiBookOpen, HiOfficeBuilding, HiAcademicCap } from 'react-icons/hi';
import { useAuth } from '../server/authUser'; // Importar el hook de autenticación
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { BiCalendarEvent } from 'react-icons/bi';

const SideNav = ({ isSidebarOpen, toggleSidebar }) => { 
  
  const { isAuthenticated, userData } = useAuth(); 

  return (
      <Sidebar collapsed={!isSidebarOpen} aria-label="Sidebar with multi-level dropdown example" 
       className={`mt-16 fixed inset-y-0 left-0 z-10 flex-shrink-0 text-white sidebar flex-grow bg-gray-100 shadow-none sm:shadow-[4px_0_10px_-2px_rgba(0,0,0,0.1)] ${isSidebarOpen ? 'sidebar-enter' : 'sidebar-exit'} ${isAuthenticated ? '' : 'hidden'} `}       
        theme={{
          root: {
            inner: "h-full overflow-y-auto overflow-x-hidden rounded bg-white px-3 py-4 dark:bg-gray-900 sm:px-4 rounded p-3 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md"
          }
        }}
        >
        <Sidebar.Items >
            <Sidebar.ItemGroup>
            {isAuthenticated && userData.intRol !=null? 
            (
              <div>
                <Link to="/alumnos">
                  <Sidebar.Item icon={FaUserGraduate}>
                    Alumnos
                  </Sidebar.Item>
                </Link>
                {userData.vchNombreRol === 'Administrador' && (
                <>
                  <Link to="/carreras">
                    <Sidebar.Item icon={HiAcademicCap}>
                      Carreras
                    </Sidebar.Item>
                  </Link>
                  <Link to="/docentes">
                    <Sidebar.Item icon={FaChalkboardTeacher}>
                      Docentes
                    </Sidebar.Item>
                  </Link>
                  <Link to="/departamentos">
                    <Sidebar.Item icon={HiOfficeBuilding}>
                      Departamentos
                    </Sidebar.Item>
                  </Link>
                  <Link to="/periodos">
                    <Sidebar.Item icon={BiCalendarEvent}>
                      Periodos
                    </Sidebar.Item>
                  </Link>
                </>
                )}

              <Link to="/">
                <Sidebar.Item icon={HiBookOpen}>
                  Materias
                </Sidebar.Item>
              </Link>
              </div>
            )
            :
            (
              <div>
                <Link to="/">
                  <Sidebar.Item icon={HiBookOpen}>
                    Materias
                  </Sidebar.Item>
                </Link>
              </div>
            )}
            </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
  );
};

export default SideNav;
