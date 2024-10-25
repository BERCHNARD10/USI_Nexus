// SideNav.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Card} from 'flowbite-react';

const GruposMaterias = () => { 
  const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
  const [materias, setMaterias] = useState([]);
  const { vchClvMateria, chrGrupo, intPeriodo } = useParams();

  const onloadNaterias = async () => {
    try {

      const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            clvMateria:vchClvMateria,
            matriculaDocent: userData.vchMatricula,
            chrGrupo: chrGrupo,
            periodo:intPeriodo
          }),
      });
      const requestData = {
        clvMateria: vchClvMateria,
        matriculaDocent: userData.vchMatricula,
        chrGrupo: chrGrupo,
        periodo: intPeriodo
      };
console.log("datods: ", requestData)
      const result = await response.json();
  console.log(result);
      if (result.done) {
        setMaterias(result.message);

        } else {

          
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Grupos inscritos en la Materia</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {materias.map((materia) => (
          <Card
            key={materia.chrGrupo}
            href={`/materias/gruposMaterias/detalleMateria/${vchClvMateria}/${materia.chrGrupo}/${intPeriodo}`}
            className="max-w-sm rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
            theme={{
              root: {
                children: "p-0",
              }
            }}
          >
            <div className="relative h-40">
              <div className="pt-5 pb-6 px-4 flex justify-center items-center h-full">
                <h3 className="text-xl font-bold text-gray-900 text-center">{materia.chrGrupo}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GruposMaterias;