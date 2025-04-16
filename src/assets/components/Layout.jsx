// Layout.js
import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import FooterSection from './FooterSection';
import BreadcrumbNav from './Breadcrumb';
import SideNav from './SideNavBar';
import { useAuth } from '../server/authUser'; // Importar el hook de autenticación

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación del contexto
  const isPc = window.innerWidth >= 1024; // Detectar si es PC o móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(isPc);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex">
      {/*<SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>*/}
      <div className={`flex-grow bg-gray-100 dark:bg-background_500 ${isAuthenticated ? (isSidebarOpen ? 'ml-12 lg:ml-64' : 'ml-12 lg:ml-12') : ''}`}>
      <NavigationBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
        <section className='m-4'>
          <main className="flex-grow mx-auto px-4 min-h-screen">
            <BreadcrumbNav />
                {children}
          </main>
          <FooterSection />
        </section>
      </div>
    </div>
  );
}

export default Layout;
