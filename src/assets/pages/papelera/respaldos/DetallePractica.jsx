import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  Components from '../../../components/Components'
const {TitlePage, ContentTitle, Paragraphs, TitleSection, LoadingButton} = Components;
import { Checkbox, Table, Alert, Tooltip, Badge, ToggleSwitch, Card, Button} from 'flowbite-react';
import { useAuth } from '../../../server/authUser'; // Importar el hook de autenticación
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';


const DetallePractica = () => {
  const {intNumeroPractica } = useParams();
  const [detalleActividad, setDetalleActividad] = useState([]);
  const { isAuthenticated, userData } = useAuth(); 
  const [rubricaData, setRubricaData] = useState([]);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(rubricaData);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Aquí deberías manejar la lógica para guardar los cambios
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedData(rubricaData); // Restablecer los datos editados
    setIsEditing(false);
  };

  const handleInputChange = (index, field, value) => {
    const newEditedData = [...editedData];
    newEditedData[index][field] = value;
    setEditedData(newEditedData);
  };

  useEffect(() => {
    const fetchActividad = async () => {
      const requestData = {
        idPracticaDetalle: intNumeroPractica
      };

      try {
        const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
        const data = await response.json();

        if (!data.done) 
        {
          throw new Error('Error al cargar los datos de la actividad');
        }
        else
        {
          setDetalleActividad(data.message.detallePractica);
          setRubricaData(data.message.detalleRubrica);
          console.log(data);
        }
      } catch (error) {
        console.error('Error:', error.message);
        // Manejar el error, mostrar mensaje al usuario, etc.
      }
    };

    fetchActividad();
  }, [intNumeroPractica]);

  useEffect(() => {
    // Calcular el puntaje total cada vez que cambie rubricaData
    const total = rubricaData.reduce((sum, rubrica) => sum + rubrica.intValor, 0);
    setPuntajeTotal(total);
  }, [rubricaData, editedData]);

  return (
    <section className='w-full flex flex-col '>
    <TitlePage label={detalleActividad.vchNombre}/>
    <Paragraphs className="ml-3" label={detalleActividad.vchDescripcion}/>
    <div className="flex flex-col md:flex-row gap-4">
      <div className='md:w-9/12 md:flex flex-col gap-y-4 '>
        {/* Sección de información básica del usuario */}
        <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
          {/* Sección de información adicional del usuario */}
          <TitleSection label="Instrucciones"/>
          <Paragraphs label={detalleActividad.vchDescripcion}/>
        </div>
        {/*
        <div className="grid grid-cols-1 gap-1  md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
          <div className="flex justify-between items-center">
            <TitleSection label="Rúbrica de Evaluación" />
            <Tooltip content="Editar" placement="left">
              <FaEdit className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </div>
          {rubricaData.map((rubrica, index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 items-center">
                <div className="text-muted-foreground"></div>
                <div className="flex items-center justify-end gap-2">
                  <span className="font-semibold">{rubrica.intValor}</span>
                  {isAuthenticated && userData.roles == null && (
                    <span className="text-muted-foreground">/{rubrica.intValor}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {rubrica.vchDescripcion}
              </p>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-muted-foreground">Puntaje Total</div>
            <div className="flex items-center gap-2">
            {isAuthenticated && userData.roles == null && (
              <span className="text-muted-foreground">{puntajeTotal}</span>
            )}
              <span className="font-semibold text-2xl">{puntajeTotal}</span>
            </div>
          </div>
        </div>
 */}
        <div className="grid grid-cols-1 gap-1 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex justify-between items-center">
        <TitleSection label="Rúbrica de Evaluación" />
        {isEditing ? (
          <div className="flex gap-2">
            <Tooltip content="Guardar" placement="left">
              <FaSave className="text-gray-500 cursor-pointer" onClick={handleSaveClick} />
            </Tooltip>
            <Tooltip content="Cancelar" placement="left">
              <FaTimes className="text-gray-500 cursor-pointer" onClick={handleCancelClick} />
            </Tooltip>
          </div>
        ) : (
          <Tooltip content="Editar" placement="left">
            <FaEdit className="text-gray-500 cursor-pointer" onClick={handleEditClick} />
          </Tooltip>
        )}
      </div>
      {editedData.map((rubrica, index) => (
        <div key={index} className="space-y-4">
          <div className="grid grid-cols-2 items-center">
            <div className="text-muted-foreground">
              {isEditing ? (

                <input
                  type="text"
                  className="form-input"
                  value={rubrica.vchDescripcion}
                  onChange={(e) => handleInputChange(index, 'vchDescripcion', e.target.value)}
                />
              ) : (
                <h1></h1>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              {isEditing ? (
                <input
                  type="number"
                  className="form-input w-16"
                  value={rubrica.intValor}
                  onChange={(e) => handleInputChange(index, 'intValor', e.target.value)}
                />
              ) : (
                <span className="font-semibold">{rubrica.intValor}</span>
              )}
              {isAuthenticated && userData.roles == null && !isEditing && (
                <span className="text-muted-foreground">/{rubrica.intValor}</span>
              )}
            </div>
          </div>
          {!isEditing && (
            <p className="text-sm text-muted-foreground">
              {rubrica.vchDescripcion}x
            </p>
          )}
        </div>
      ))}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-muted-foreground">Puntaje Total</div>
        <div className="flex items-center gap-2">
          {isAuthenticated && userData.roles == null && (
            <span className="text-muted-foreground">{puntajeTotal}</span>
          )}
          <span className="font-semibold text-2xl">{puntajeTotal}</span>
        </div>
      </div>
    </div>
      </div>
      {/* Sección de información adicional del usuario */}
      <div className="md:w-1/4 md:flex flex-col">
        <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
          <TitleSection label="Tu Trabajo"/>
          <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
            <div className="grid grid-cols-1 gap-1">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                  Subir Archivo
                </label>
                <input type="file" id="file-upload" name="file-upload" className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-nonesm:text-sm max-sm:w-full md:w-full"/>
              </div>
              <LoadingButton normalLabel="Entregar" className="mt-4 w-full text-white py-2 px-4 rounded-lg"/>
            </div>
          </address>
        </div>
      </div>
    </div>
  </section>
  );
};

export default DetallePractica;
