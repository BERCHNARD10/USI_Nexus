import React from 'react';
import { Carousel } from 'flowbite-react';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import HomeImg from '../images/home-img.png';
import { useAuth } from '../server/authUser';
import MateriasAlumno from '../pages/PaginasAlumnos/MateriasAlumno';
import MateriasDocente from '../pages/PaginasDocentes/MateriasDocente';
import imagePanel from '../images/uthhPanel.png';
import Components from '../components/Components';
const { TitlePage } = Components;

const HomePage = () => {
  const { isAuthenticated, userData } = useAuth();

  return (
    <section className="container mx-auto">
      {isAuthenticated ? (
        userData.intRol ? <MateriasDocente /> : <MateriasAlumno />
      ) : (
        <div>
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel>
              <img src={imagePanel} alt="..." />
            </Carousel>
          </div>
          <section className="bg-white dark:bg-gray-900">
            <div className="gap-8 items-center py-16 px-6 mx-auto max-w-screen-xl md:grid md:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="relative flex items-center mb-12">
                <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-full relative z-10">
                  <FaUserGraduate className="text-6xl text-blue-600 dark:text-blue-300" />
                </div>
                <div className="absolute w-40 h-40 rounded-full bg-blue-200 opacity-50 animate-pulse top-4 left-8"></div>
                <div className="absolute w-28 h-28 rounded-full bg-blue-300 opacity-40 animate-pulse top-12 left-12"></div>
              </div>
              <div className="text-center md:text-left">
                <TitlePage label="Para los Alumnos PRUEBA HOSTINGER" />
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                  En esta plataforma, podrás consultar las calificaciones de las prácticas que te asignan tus docentes. Revisa tus avances, mantente al tanto de tus resultados en tiempo real y trabaja para mejorar en cada actividad.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-white dark:bg-gray-900">
            <div className="py-16 px-6 mx-auto max-w-screen-xl lg:px-8">
              <div className="flex items-center mb-12 justify-end">
                <div className="relative flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 p-6 rounded-full relative z-10">
                    <FaChalkboardTeacher className="text-6xl text-green-600 dark:text-green-300" />
                  </div>
                  <div className="absolute w-40 h-40 rounded-full bg-green-200 opacity-50 animate-pulse top-4 right-8"></div>
                  <div className="absolute w-28 h-28 rounded-full bg-green-300 opacity-40 animate-pulse top-12 right-12"></div>
                </div>
              </div>
              <div className="text-center md:text-left max-w-screen-md mx-auto">
                <TitlePage label="Para los Docentes" />
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                  Como docente, tendrás la posibilidad de crear actividades y prácticas personalizadas para tus alumnos, y evaluarlas en tiempo real. Facilita el seguimiento del desempeño de tus estudiantes y brinda retroalimentación inmediata para potenciar su aprendizaje.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default HomePage;
