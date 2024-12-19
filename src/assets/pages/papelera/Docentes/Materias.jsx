// SideNav.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

import { useForm } from 'react-hook-form';
import { useNavigate} from 'react-router-dom'; 
import { Checkbox, Table, Alert, Tooltip, Badge, ToggleSwitch, Card} from 'flowbite-react';
import { FaUser, FaCog, FaRegUser, FaRegEdit, FaRegEye, FaRegTrashAlt, FaEnvelope, FaCheck, FaTimes, FaEye, FaEyeSlash  } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { IoMdAdd, IoMdCreate, IoMdTrash } from 'react-icons/io';
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import { Label, TextInput, Button, Select, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import  Components from '../../components/Components'
const { LoadingButton, CustomInput, CustomInputPassword, CustomRepeatPassword} = Components;
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación

const Materias = () => { 
  const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
  const [carrera, setCarrera] = useState('');
  const [materia, setMateria] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [grado, setGrado] = useState('');
  const [grupo, setGrupo] = useState('');
  const [materias, setMaterias] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const webUrl = import.meta.env.VITE_URL;
  const apiUrl = import.meta.env.VITE_API_URL;

  const onloadNaterias = async () => {
    try {

      const response = await fetch(`${apiUrl}cargarMaterias.php`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matriculaDocent: userData.vchMatricula
          }),
      });

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(e);
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Leer la información general (carrera, materia, periodo, grado, grupo)
      const infoSheet = workbook.SheetNames[0];
      const sheet = workbook.Sheets[infoSheet];

      const carrera = sheet['B1'].v;
      const materia = sheet['B2'].v;
      const periodo = sheet['B3'].v;
      const grado = sheet['B4'].v;
      const grupo = sheet['B5'].v;

      setCarrera(carrera);
      setMateria(materia);
      setPeriodo(periodo);
      setGrado(grado);
      setGrupo(grupo);
      


      // Leer las actividades de evaluación
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 8 });
      if (jsonData) {
        const actividadesData = jsonData.map((fila) => {
          return {
              docente: userData.vchMatricula,
              carrera:carrera,
              materia:materia,
              periodo:periodo,
              grado:grado,
              grupo:grupo,
              noActividad: fila[0],
              nomActividad: fila[1],
              intPuntuacion: fila[2],
              dtmSolicitud: formatearFecha(new Date(fila[3])),
              ttmEntrega:  formatearFecha(new Date(fila[4])),
              vchDescripcion: fila[5],    
              intTiempo: fila[6],
              enumModalidad: fila[7],
              clvinstrumento: fila[8]            
           
          };
        });
        console.log(actividadesData)
        setActividades(actividadesData);
      }
  
      // Mostrar el archivo cargado en la sección de datos recibidos
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  function formatearFecha(fecha) {
    const dia = fecha.getDate(); // Obtener el día del mes (1-31)
    const mes = fecha.getMonth() + 1; // Obtener el mes (0-11), agregar 1 para mostrar el mes correctamente (1-12)
    const anio = fecha.getFullYear(); // Obtener el año (cuatro dígitos)
    const horas = fecha.getHours(); // Obtener las horas (0-23)
    const minutos = fecha.getMinutes(); // Obtener los minutos (0-59)
    const segundos = fecha.getSeconds(); // Obtener los segundos (0-59)
  
    // Crear el formato deseado: DD/MM/YYYY HH:mm:ss
    const formatoFecha = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  
    return formatoFecha;
  }

  const handleClickRegistrar = () => {
    registrarEstudiantes(actividades);
  };

  const registrarEstudiantes = async (actividadesData) => 
  {
    try 
    {
      setIsLoading(true);
      // Hacer solicitud para obtener las carreras
      const response = await fetch(`${apiUrl}InsertarActividades.php`,
        {
          method: 'POST',
          headers: 
          {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify
          ({
            dataActividades: actividadesData,
          }),
        }
      );
      const result = await response.json();
  
      if (result.done) 
      {
        setAlertMessage({ type: 'success', text: 'Datos de estudiantes registrados correctamente' });
        console.log('Datos recibidos php:', result);
      }
      else
      {                
        setAlertMessage({ type: 'error', text: result.message });
        console.log('Datos recibidos php:', result);
      }
    } 
    catch (error) 
    {
      setAlertMessage({ type: 'error', text: 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.' });
      console.error(error);
    }
    finally 
    {
      setIsLoading(false);
      setOpenModal(false)
      setFile(null);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {alertMessage && (
        <Alert type={alertMessage.type} onClose={() => setAlertMessage(null)}>
          {alertMessage.text}
        </Alert>
      )}
      <Modal className='mt-11 pt-16' size="4xl" base show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Agregar Materias</Modal.Header>
        <Modal.Body className='max-h-60'>
          <div className="space-y-6">
            <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Selecciona un archivo en formato excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {file !==null && (
              <section>
                <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Datos recibidos</h3>
                <div>
                    <div className='grid grid-cols-2 grid-rows-2 gap-4 m-y-2 mb-4'>
                      <div className='flex-row'>
                        <div className="mt-4">Carrera:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {carrera}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Materia:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {materia}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Periodo:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {periodo}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Grado:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {grado}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Grupo:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {grupo}
                        </div>
                      </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>No</Table.HeadCell>
                      <Table.HeadCell>Actividad</Table.HeadCell>
                      <Table.HeadCell>Descripción</Table.HeadCell>
                      <Table.HeadCell>Puntuacion</Table.HeadCell>
                      <Table.HeadCell>Tiempo estimado</Table.HeadCell>
                      <Table.HeadCell>Modalidad</Table.HeadCell>
                      <Table.HeadCell>Fecha Solicitud</Table.HeadCell>
                      <Table.HeadCell>Fecha de Entrega</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                    {actividades.map((actividad, index) => (
                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell>{actividad.noActividad}</Table.Cell>
                          <Table.Cell>{actividad.nomActividad}</Table.Cell>
                          <Table.Cell>{actividad.vchDescripcion}</Table.Cell>
                          <Table.Cell>{actividad.intPuntuacion}</Table.Cell>
                          <Table.Cell>{actividad.intTiempo}</Table.Cell>
                          <Table.Cell>{actividad.enumModalidad}</Table.Cell>
                          <Table.Cell>{actividad.dtmSolicitud}</Table.Cell>
                          <Table.Cell>{actividad.ttmEntrega}</Table.Cell>
                        </Table.Row>
                      ))}

                    </Table.Body>
                  </Table>
                </div>
              </section>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton
            onClick={handleClickRegistrar} 
            isLoading={isLoading}
            className="max-w-32 max-h-11" // Clase de Tailwind CSS para definir un ancho máximo
            loadingLabel="Cargando..."
            normalLabel="Agregar"
          />
          <Button color="gray" onClick={() => {setOpenModal(false); setFile(null)}}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex items-center m-2">
        <Button icon={IoMdAdd} className="ml-2 button" onClick={() => setOpenModal(true)}>
          <IoMdAdd className="mr-2 h-5 w-5" />
            Añadir Materias con actividades
        </Button> 
      </div>

      <h1 className="text-2xl font-bold mb-4">Materias Asociadas</h1>
      <div className="grid grid-cols-3 gap-4">

      {materias.map((materia) => (
    /*<a href={`/Admin/Materias/gruposMaterias/${materia.vchClvMateria}/${materia.intPeriodo}`}>
    <div key={materia.vchClvMateria} className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-bold mb-2">{materia.vchClvMateria}</h2>
            <p className="text-gray-600">{materia.vchNomMateria}</p>
            <p className="text-sm text-gray-500 mt-2">
              Cuatrimestre: {materia.intClvCuatrimestre}vo Cuatrimestre | Carrera: {materia.intClvCuatrimestre} ! Periodo: {materia.intPeriodo}
            </p>
          </div>
        </a>
        */

        <>
          <Card
            key={materia.vchClvMateria}
            href={`/materias/gruposMaterias/:vchClvMateria/:intPeriodo/${materia.vchClvMateria}/${materia.intPeriodo}`}
            className="max-w-sm rounded-lg overflow-hidden shadow-lg p-0"
            theme={{
              root: {
                children: "p-0",
              }
            }}
          >
            <div className="relative h-60 ">
              <div className="bg-gray-200 Fotter p-2 h-1/2 flex flex-col items-center">
                <div className="relative w-full flex justify-center">
              
                </div>
              </div>
              <div className="pt-5 pb-6 px-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">{materia.vchNomMateria}</h3>
                <p className="text-sm text-gray-500 text-center">{materia.vchClvMateria}: {materia.vchNomMateria} {materia.intHoras} Horas</p>
                <p className="mt-1 text-sm text-gray-500 text-center">
                  <strong>Periossdo:</strong> {materia.intPeriodo}
                </p>
              </div>
            </div>
          </Card>
</>
        ))}
      </div>
    </div>
  );
};

export default Materias;