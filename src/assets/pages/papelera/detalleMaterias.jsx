import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Tabs, Accordion } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import  Components from '../../components/Components'
const {TitlePage, ContentTitle, Paragraphs, Link} = Components;

const DetalleMateria = () => { 
  const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
  const [actividades, setMaterias] = useState([]);
  const { vchClvMateria, chrGrupo, intPeriodo } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const onloadNaterias = async () => {
    try {

      const response = await fetch(`${apiUrl}cargarMaterias.php`, {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            intClvCarrera:userData.dataEstudiante.intClvCarrera,
            intMateria: vchClvMateria,
            intPeriodo: userData.dataEstudiante.intPeriodo,
            intClvCuatrimestre:userData.dataEstudiante.intClvCuatrimestre,
            chrGrupo: userData.dataEstudiante.chrGrupo
          }),
      });
      const result = await response.json();
      console.log(result);
      if (result.done) 
      {
        setMaterias(result.message);  
      } 
      else 
      {    
          console.error('Error en el registro:', result.message);

          if (result.debug_info) {
              console.error('Información de depuración:', result.debug_info);
          }
          if (result.errors) {
              result.errors.forEach(error => {
                  console.error('Error específico:', error);
              });
          }
          setServerErrorMessage(result.message || 'Error en el servidor.');
      }
      
  } catch (error) {
      console.error('Error 500', error);
      setTimeout(() => {
          alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.'); 
        }, 2000);
  } finally {
      setIsLoading(false);
  }
  };

  useEffect(() => {
    {
      onloadNaterias()
    }
  }, []);
  return (
    <section className='w-full flex flex-col'>
      <TitlePage label="Trabajo de clase"/>
      <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Actividades" icon={HiUserCircle}>
            <Accordion collapseAll>
              {actividades.map((actividad) => (
                <Accordion.Panel key={actividad.intClvActividad}>
                  <Accordion.Title>
                    <ContentTitle label={actividad.vchNomActivi}/>
                  </Accordion.Title>
                  <Accordion.Content>
                    <Paragraphs label={actividad.vchDescripcion}/>
                    <Paragraphs label={`Valor: ${actividad.fltValor} puntos`} />
                  </Accordion.Content>
                  <Accordion.Content>
                    <Link 
                      to={`/materias/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${actividad.intClvActividad}`}
                      children="Ver Mas"
                    />
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </Tabs.Item>
          <Tabs.Item title="Alumnos" icon={MdDashboard}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Sección de Alumnos</h2>
              <p>Lista de alumnos...</p>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </section>
  );
};

export default DetalleMateria;
