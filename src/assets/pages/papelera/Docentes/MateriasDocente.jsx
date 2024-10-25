// SideNav.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

import { useForm } from 'react-hook-form';
import { useNavigate} from 'react-router-dom'; 
import { Checkbox, Table, Alert, Tooltip, Badge, ToggleSwitch, Card} from 'flowbite-react';
import { FaUser, FaCog, FaRegUser, FaRegEdit, FaRegEye, FaRegTrashAlt, FaEnvelope, FaCheck, FaTimes, FaEye, FaEyeSlash  } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { IoMdAdd, IoMdCreate, IoMdTrash } from 'react-icons/io';
import { FaRegFrown } from 'react-icons/fa';
import { Label, TextInput, Button, Select, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import  Components from '../../../components/Components'
const { LoadingButton, TitlePage, IconButton} = Components;
import { useAuth } from '../../../server/authUser'; // Importa el hook de autenticación

const Materias = () => { 
  const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
  const [materias, setMaterias] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  const [info, setInfo] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(event);
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
      const allData = [];
      const headers = [];
      let allActivities = [];
  
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        console.log(`Parsed Data for sheet ${sheetName}:`, parsedData);
  
        if (parsedData.length > 0) {
          allData.push({ sheetName, data: parsedData });
  
          const gradoYgrupo = parsedData[10][7];
          const firstDate = parsedData[10][1];
          const { period, partial } = determinePeriod(firstDate);
  
          console.log("gradoygru", gradoYgrupo);
          const [grado, grupo] = extractGradoYGrupo(gradoYgrupo);
  
          const infoData = {
            carrera: parsedData[6][0],
            docente: parsedData[8][2],
            materia: parsedData[9][1],
            grado: grado,
            grupo: grupo,
            periodo: period,
            parcial: partial,
          };
  
          console.log('Extracted Info:', infoData);
          setInfo(infoData);
  
          if (parsedData[12]) {
            const headerRow = [];
            parsedData[12].forEach((cell, index) => {
              const cellAddress = XLSX.utils.encode_cell({ r: 12, c: index });
              const merge = (sheet['!merges'] || []).find(
                (merge) => merge.s.c === index && merge.s.r === 12
              );
              if (merge) {
                const colspan = merge.e.c - merge.s.c + 1;
                for (let i = 0; i < colspan; i++) {
                  headerRow.push(cell);
                }
              } else {
                headerRow.push(cell);
              }
            });
            headers.push({ sheetName, header: headerRow });
          }
  
          const activityData = extractActivityData(parsedData);
          allActivities = [...allActivities, ...activityData];
        }
      });
  
      setData(allData);
      setHeader(headers);
      setActividades(allActivities);
    };
  
    reader.readAsBinaryString(file);
  };
/*
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
  */

  const formatDate = (excelDate) => {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  const extractGradoYGrupo = (gradoYgrupo) => {
    const match = gradoYgrupo.match(/(\d+)\s*°\s*"([A-Za-z])"/);
  
    if (match) {
      let grado = match[1];
      let grupo = match[2];
      
      // Elimina el 0 inicial del grado si está presente
      if (grado.startsWith('0')) {
        grado = grado.slice(1);
      }
  
      return [grado, grupo];
    }
    return ['', ''];
  };
  const determinePeriod = (monthYear) => {
    const [month, year] = monthYear.split('/').map(Number);
  
    let period;
    let partial;
  
    if (month >= 9 && month <= 12) {
      period = `${year}${3}`;
    } else if (month >= 1 && month <= 4) {
      period = `${year}${1}`;
    } else if (month >= 5 && month <= 8) {
      period = `${year}${2}`;
    }
  
    if (month >= 1 && month <= 4) {
      partial = `${month}`;
    } else if (month >= 5 && month <= 8) {
      partial = `${month - 4}`;
    } else if (month >= 9 && month <= 12) {
      partial = `${month - 8}`;
    }
  
    return { period, partial };
  };

  const extractActivityData = (parsedData) => {
    const activityData = [];
    let readingNormal = false;

    for (let i = 14; i < parsedData.length; i++) {
      if (parsedData[i][0] === 'Subtotal') {
        break; // Detener la lectura cuando se encuentre "Subtotal"
      }
      /*
      if (parsedData[i][0] === 'Subtotal') {
        readingNormal = true;
      } */


      if (readingNormal) {
        if (parsedData[i][0]) {
          activityData.push({
            actividad: parsedData[i][0],
            descripcion: parsedData[i][1],
            puntuacion: parsedData[i][3],
            tiempoEstimado: parsedData[i][4],
            modalidad: parsedData[i][5],
            fechaSolicitud: parsedData[i][6],
            fechaEntrega: parsedData[i][7],
          });
        }
      } else {
        if (i % 9 === 14 % 9) {
          const activity = {
            actividad: parsedData[i][0],
            descripcion: parsedData[i + 1] ? parsedData[i + 1][0] : '',
            puntuacion: parsedData[i][3],
            tiempoEstimado: parsedData[i + 6] ? parsedData[i + 6][2] : '',
            modalidad: parsedData[i + 7] ? parsedData[i + 7][2] : '',
            instrumento: parsedData[i + 8] ? parsedData[i + 8][2] : '',
            fechaSolicitud: formatDate(parsedData[i][6]),
            fechaEntrega: formatDate(parsedData[i][7]),
          };
          activityData.push(activity);
        }
      }
    }

    return activityData;
  };

  const handleClickRegistrar = () => {
    registrarEstudiantes(actividades);
  };

  const registrarEstudiantes = async () => 
  {
    const actividadesData = actividades.map((activity, index) => {
        return {
          docente: userData.vchMatricula,
          carrera: info.carrera,
          materia: info.materia,
          periodo: info.periodo,
          grado: info.grado,
          grupo: info.grupo,
          parcial: info.parcial,
          noActividad: index + 1,
          nomActividad: activity.actividad,
          intPuntuacion: activity.puntuacion,
          dtmSolicitud: activity.fechaSolicitud,
          ttmEntrega: activity.fechaEntrega,
          vchDescripcion: activity.descripcion,
          intTiempo: activity.tiempoEstimado,
          enumModalidad: activity.modalidad,
          clvinstrumento: activity.instrumento
        };
      });
      console.log("datos", actividadesData)
    try 
    {
      setIsLoading(true);
      // Hacer solicitud para obtener las carreras
      const response = await fetch('https://robe.host8b.me/WebServices/InsertarActividades.php',
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
        onloadNaterias(); // Llamar a la función para recargar las materias

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

  const onloadNaterias = async () => 
    {
      try 
      {
        const response = await fetch('https://robe.host8b.me/WebServices/cargarMaterias.php', 
        {
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
        if (result.done) 
        {
          setMaterias(result.message);
        } 
        else 
        {
          console.log('Error en el registro:', result.message);
        }
      } 
      catch (error) 
      {
        console.error('Error 500', error);
        setTimeout(() => 
        {
          alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.'); 
        }, 2000);
      } 
      finally 
      {
        setIsLoading(false);
      }
    };
  
    useEffect(() => 
    {
      {
        onloadNaterias()
      }
    }, []);

  const sendToDatabase = async () => {
    const actividadesData = actividades.map((activity, index) => {
      return {
        docente: userData.vchMatricula,
        carrera: info.carrera,
        materia: info.materia,
        periodo: info.periodo,
        grado: info.grado,
        grupo: info.grupo,
        parcial: info.parcial,
        noActividad: index + 1,
        nomActividad: activity.actividad,
        intPuntuacion: activity.puntuacion,
        dtmSolicitud: activity.fechaSolicitud,
        ttmEntrega: activity.fechaEntrega,
        vchDescripcion: activity.descripcion,
        intTiempo: activity.tiempoEstimado,
        enumModalidad: activity.modalidad,
        clvinstrumento: activity.instrumento
      };
    });
    console.log("datos", actividadesData)
    try {
      const response = await fetch('https://robe.host8b.me/WebServices/InsertarActividades.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify
        ({
          dataActividades: actividadesData,
        }),
        });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos a la base de datos');
      }
  
      const result = await response.json();
      console.log('Datos enviados con éxito:', result);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
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
                        {info.carrera}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Materia:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {info.materia}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Periodo:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {info.periodo}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Grado:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {info.grado}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Grupo:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {info.grupo}
                        </div>
                      </div>
                      <div className="fle-row">
                      <div className="mt-4">Parcial:</div>
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {info.parcial}
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
                      <Table.HeadCell>Instrumento</Table.HeadCell>
                      <Table.HeadCell>Fecha Solicitud</Table.HeadCell>
                      <Table.HeadCell>Fecha de Entrega</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                    {data.map((sheet, sheetIndex) => {
      const activityData = extractActivityData(sheet.data);
      return activityData.map((actividad, index) => (


                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>{actividad.actividad}</Table.Cell>
                          <Table.Cell>{actividad.descripcion}</Table.Cell>
                          <Table.Cell>{actividad.puntuacion}</Table.Cell>
                          <Table.Cell>{actividad.tiempoEstimado}</Table.Cell>
                          <Table.Cell>{actividad.modalidad}</Table.Cell>
                          <Table.Cell>{actividad.instrumento}</Table.Cell>
                          <Table.Cell>{actividad.fechaSolicitud}</Table.Cell>
                          <Table.Cell>{actividad.fechaEntrega}</Table.Cell>
                        </Table.Row>
))
                })}

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
            Añadir dd con actividades
        </Button> 

      </div>
      <TitlePage label="Materias Asociadas" />
      {materias.length > 0 ? 
      (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {materias.map((materia) => (
            <Card
              key={materia.vchClvMateria}
              href={`/materias/gruposMaterias/${materia.vchClvMateria}/${materia.intPeriodo}`}
              className="max-w-sm rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
              theme={{
                root: {
                  children: "p-0",
                }
              }}
            >
              <div className="relative h-60">
                <div className="bg-gray-200 p-2 h-1/2 flex flex-col items-center justify-center">
                  <div className="relative w-full flex justify-center">
                    {/* Puedes agregar algo aquí si lo necesitas */}
                  </div>
                </div>
                <div className="pt-5 pb-6 px-4">
                  <h3 className="text-xl font-bold text-gray-900 text-center">{materia.vchNomMateria}</h3>
                  <p className="text-sm text-gray-500 text-center">{materia.vchClvMateria}: {materia.vchNomMateria} {materia.intHoras} Horas</p>
                  <p className="mt-1 text-sm text-gray-500 text-center">
                    <strong>Periodo:</strong> {materia.intPeriodo}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) 
      : 
      (
        <div className="flex flex-col items-center justify-center h-64">
          <FaRegFrown className="text-gray-500 text-6xl" />
          <p className="text-gray-500 text-lg mt-4">No hay clases agregadas. Añade una clase para empezar.</p>
        </div>
      )}
    </div>

  );
};

export default Materias;