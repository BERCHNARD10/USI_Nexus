// SideNav.js
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {Table, Alert, Card} from 'flowbite-react';
import { MdAdd } from 'react-icons/md';
import {FaRegFrown, FaDownload } from 'react-icons/fa';
import {Button, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import  Components from '../../components/Components'
const {IconButton, LoadingButton, TitlePage, Paragraphs, InfoAlert, CardSkeleton} = Components;
import {useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const MateriasDocente = () => { 
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const webUrl = import.meta.env.VITE_URL;

    const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
    const [materias, setMaterias] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [header, setHeader] = useState([]);
    const [info, setInfo] = useState({});
    const [serverResponse, setServerResponse] = useState('');

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
            let alertShown = false; // Bandera para controlar si la alerta se muestra

            const activityData = extractActivityData(parsedData, (message) => {
                if (!alertShown) { // Solo mostrar la alerta si no se ha mostrado antes
                    setServerResponse(`Error: ${message}`);                

                    alertShown = true;
                }
            });
    
            if (!alertShown) {
                allActivities = [...allActivities, ...activityData];
            }
            }
        });
        console.log(allData)
        setData(allData);
        setHeader(headers);
        setActividades(allActivities);
        console.log(allActivities)

        };
    
        reader.readAsBinaryString(file);
    };

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

    const extractActivityData = (parsedData, showAlert) => {
        const activityData = [];
        let totalPuntuacion = 0;
    
        for (let i = 14; i < parsedData.length; i++) {

        // Verificar si la fila está completamente vacía
        if (parsedData[i].every(cell => cell === null || cell === undefined || cell === '')) {
            continue; // Saltar la fila vacía pero no detener la lectura
        }
            if (parsedData[i][0] === 'Subtotal') {
            break; // Detener la lectura cuando se encuentre "Subtotal"
        }
            if (i % 9 === 14 % 9) {
                const puntuacion = parseFloat(parsedData[i][3]); // Asegúrate de convertir a número
                
                if (totalPuntuacion + puntuacion > 10) {
                    if (showAlert) showAlert("No se pueden agregar más actividades. La suma de las puntuaciones excede 10.");
                }
    
                totalPuntuacion += puntuacion; // Sumar la puntuación solo si no excede 10
    
                const activity = {
                    actividad: parsedData[i][0],
                    descripcion: parsedData[i + 1] ? parsedData[i + 1][0] : '',
                    puntuacion: puntuacion,
                    tiempoEstimado: parsedData[i + 6] ? parsedData[i + 6][2] : '',
                    modalidad: parsedData[i + 7] ? parsedData[i + 7][2] : '',
                    instrumento: parsedData[i + 8] ? parsedData[i + 8][2] : '',
                    fechaSolicitud: formatDate(parsedData[i][6]),
                    fechaEntrega: formatDate(parsedData[i][7]),
                };
    
                activityData.push(activity);
            }
        }
    
        // Validar si la suma de las puntuaciones es exactamente 10
        if (totalPuntuacion !== 10) {
            if (showAlert) showAlert("La suma de las puntuaciones debe ser igual a 10. La suma actual es: " + totalPuntuacion);
        }
    
        return activityData; // Retornar los datos de actividad si la suma es 10
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
            setActividades([]);
            if (result.done) 
            {
                onloadNaterias(); // Llamar a la función para recargar las materias
                setServerResponse(`Éxito: ${result.message}`);
                console.log('Datos recibidos php:', result);
            }
            else
            {
                setServerResponse(`Error: ${result.message}`);                
                console.log('Datos recibidos php:', result);
            }
        } 
        catch (error) 
        {
            setServerResponse(`Error: ${error}`);
            console.error(error);
        }
        finally 
        {
            setIsLoading(false);
            setOpenModal(false)
            setFile(null);
        }
    };

    const onloadNaterias = async () => {
        try {
            /*
            const cache = await caches.open('api-cache');
            const cachedResponse = await cache.match(`${webUrl}cargarMaterias.php`);

            if (cachedResponse && !navigator.onLine) {
                const data = await cachedResponse.json();
                console.log('Cargando materias desde la cache.');
                setMaterias(data.message);
                return;
            } 
            else if (!cachedResponse) 
            {
                console.error('No se encontró la respuesta en la caché.');
            }
            // Mostrar todas las URLs almacenadas en el caché (para depuración)
            const keys = await cache.keys();
            keys.forEach(request => {
                console.log("URL en caché:", request.url);
            });
    */
            setIsLoading(true);
    
            // Hacer la solicitud a la API si no hay datos en la caché o si estamos online
            const response = await fetch(`${apiUrl}cargarMaterias.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matriculaDocent: userData.vchMatricula
                }),
            });
    
            // Clonar la respuesta antes de leer el JSON
            const responseClone = response.clone();
            const result = await response.json();
            
            if (result.done) {
                setMaterias(result.message);
                console.log('Respuesta de la API. ', result.message);
                
                // Guardar la respuesta clonada en el caché
                //await cache.put(`${apiUrl}cargarMaterias.php`, responseClone);
                console.log('Respuesta de la API almacenada en caché.');
            } else {
                console.log('Error en el registro:', result.message);
            }
        } catch (error) {
            if (!navigator.onLine) {
                console.log('No tienes conexión a Internet. Intenta nuevamente más tarde.');
            } else {
                console.error('Error en la petición:', error);
                alert('Error: Ocurrió un problema en la comunicación con el servidor. Intenta nuevamente más tarde.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    
    useEffect(() => 
    {
        {
            onloadNaterias()
        }
    }, []);

    const handleDownload = async () => {
        const response = await fetch(`${webUrl}assets/archivos/Formato-FDA05.xlsx`, {
            method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });
    
        if (!response.ok) {
          throw new Error('Error al descargar el archivo');
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Formato-FDA05.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      };

      const handleHelpClick = () => {
        alert('Aquí puedes añadir información de ayuda o abrir un modal.');
      };

    return (
        <div className="container mx-auto px-4 py-8">

            <InfoAlert
                message={serverResponse}
                type={serverResponse.includes('Éxito') ? 'success' : 'error'}
                isVisible={!!serverResponse}
                onClose={() => {
                setServerResponse('');
                }}
                hasDuration={false} // El alert permanecerá visible hasta que el usuario lo cierre
            />

            <Modal popup className='h-0 mt-auto ' size="4xl" show={openModal} onClose={() =>{setFile(null), setOpenModal(false)}}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative w-full mx-12 bg-white rounded-lg shadow-lg">
                        <Modal.Header>Agregar Materias</Modal.Header>
                        <Modal.Body className='sm:max-h-60 h-96'>
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
                        {actividades.length > 0 && file !==null && (
                        <Modal.Footer>
                            <LoadingButton
                                onClick={handleClickRegistrar} 
                                isLoading={isLoading}
                                className="max-w-32 max-h-11" 
                                loadingLabel="Cargando..."
                                normalLabel="Agregar"
                            />
                            <Button color="gray" onClick={() => {setOpenModal(false); setFile(null)}}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                        )}
                    </div>
                </div>     
            </Modal>
            
    {/* Barra de Acciones */}
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <IconButton
            Icon={MdAdd}
            message="Añadir Materias con actividades UWU"
            onClick={() => setOpenModal(true)}
          />
          
          <IconButton
            Icon={FaDownload}
            message="Descargar Formato FDA05"
            onClick={handleDownload}
          />
        </div>

        {/* Botón de Ayuda 
        <button 
          onClick={handleHelpClick} 
          className=" bg-white rounded-full p-2 shadow-md transition-all duration-300 ease-in-out"
          aria-label="Ayuda"
        >
          <AiOutlineQuestionCircle size={24} />
        </button>*/}
      </div>

 

            <TitlePage label="Materias Asociadas" />
            {isLoading ? 
            (
                // Mostrar 3 Skeletons mientras `isLoading` es true
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>
            ) 
            : 
            (
                // Si hay datos en materias, renderiza las tarjetas
                materias.length > 0 ? 
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {materias.map((materia) => (
                            <Card
                                key={materia.vchClvMateria}
                                //href={`/gruposMaterias/${materia.vchClvMateria}/${materia.intPeriodo}`}
                                className="rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
                                theme={{
                                    root: {
                                        children: "p-0",
                                    }
                                }}
                            >
                                <Link
                                    to={`/gruposMaterias/${materia.vchClvMateria}/${materia.intPeriodo}`}
                                    className="block"
                                >
                                    <div className="relative h-60">
                                        <div className="bg-gray-200 p-2 h-1/2 flex flex-col items-center justify-center">
                                            <div className="relative w-full flex justify-center">
                                                {/* Puedes agregar algo aquí si lo necesitas */}
                                            </div>
                                        </div>
                                        <div className="pt-5 pb-6 px-4">
                                            <h3 className="text-xl font-bold text-gray-900 text-center">
                                                {materia.vchNomMateria}
                                            </h3>
                                            <p className="text-sm text-gray-500 text-center">
                                                {materia.vchClvMateria}: {materia.vchNomMateria} {materia.intHoras}
                                            </p>
                                            <p className="text-sm text-gray-500 text-center">
                                                {materia.NombreCuatrimestre}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500 text-center">
                                                <strong>Periodo:</strong> {materia.NombrePeriodo}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) 
                : 
                (
                    // Si no hay datos en materias, muestra el mensaje de "No hay clases"
                    <div className="flex flex-col items-center justify-center h-64">
                        <FaRegFrown className="text-gray-500 text-6xl" />
                        <Paragraphs label="No hay clases agregadas. Añade una clase para empezar." />
                    </div>
                )
            )}
        </div>
    );
};

export default MateriasDocente;