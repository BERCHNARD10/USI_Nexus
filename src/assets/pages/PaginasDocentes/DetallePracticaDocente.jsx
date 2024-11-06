import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Components from '../../components/Components';
import { Tooltip } from 'flowbite-react';
import { useAuth } from '../../server/authUser';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Tabs } from "flowbite-react";
import { MdDescription, MdAssignment } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';

const {RubricaSkeletonLoader, DetailedPracticeSkeleton, TitlePage, Paragraphs, TitleSection, LoadingButton, CustomInputOnchange, ContentTitle, FloatingLabelInput, InfoAlert, IconButton } = Components;

const DetallePracticaDocente = () => {
    const {intNumeroActi, intIdActividadCurso, intNumeroPractica } = useParams();
    const [detalleActividad, setDetalleActividad] = useState({});
    const {sendNotification, userData } = useAuth();
    const [rubricaCalAlumno, setRubricaCalAlumno] = useState([]);
    const [puntajeTotal, setPuntajeTotal] = useState(0);
    const [puntajeTotalCal, setPuntajeTotalCal] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [rubricaData, setRubricaData] = useState([]);
    const [editedData, setEditedData] = useState([]);
    const [alumnos, setAlumnosMaterias] = useState([]);
    const {vchClvMateria, chrGrupo, intPeriodo } = useParams();
    const [selectedAlumnoMatricula, setSelectedAlumnoMatricula] = useState(null);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [puntajeObtenido, setPuntajeObtenido] = useState(0);
    const [serverResponse, setServerResponse] = useState('');
    const [selectedAlumnoTokenFirebase, setSelectedAlumnoTokenFirebase] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAlumn, setIsLoadingAlumn] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const webUrl = import.meta.env.VITE_URL;

    const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm();

    {/*const validatePuntajeTotal = (data) => {
        return data.reduce((sum, rubrica) => sum + (parseInt(rubrica.intValor) || 0), 0) <= 10;
    };*/}
    const validatePuntajeTotal = (data) => {
        const totalPuntos = data.reduce((sum, rubrica) => sum + (parseFloat(rubrica.intValor) || 0), 0);
        return totalPuntos >= 10 && totalPuntos <= 10;
    };
    

    const handleEditClick = () => {
        setEditedData([...rubricaData]);
        setIsEditing(true);
    };

    const validateRubricaData = (data) => {
        for (const rubrica of data) {
            if (!rubrica.vchDescripcion || !rubrica.intValor || rubrica.intValor <= 0) {
                return `Error: Todos los campos deben estar completos y el valor debe ser mayor a 0.`;
            }
        }
        return '';
    };

    const handleSaveClick = async () => {

        const validationError = validateRubricaData(editedData);
        if (validationError) {
            setServerResponse(validationError);
            return;
        }

        if (!validatePuntajeTotal(editedData)) {
            setServerResponse(`Error: El puntaje total debe ser exactamente 10 puntos.`);
            return;
        }
        console.log("datos rubrica",editedData);
        try {
        const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updatedRubrica: editedData }),
        });
        const result = await response.json();
        console.log("datos php",result);

        if (result.done) {
            setRubricaData(editedData);
            localStorage.setItem('rubricaData', JSON.stringify(editedData));
            setIsEditing(false);
            setServerResponse(`Éxito: ${result.message}`);

        } else {
            setServerResponse(`Error: ${result.message}`);

            console.error('Error al actualizar la rúbrica', data);
        }
        } catch (error) {
        console.error('Error:', error.message);
        }
    };

    const handleCancelClick = () => {
        const storedData = localStorage.getItem('rubricaData');
        if (storedData) {
        const parsedData = JSON.parse(storedData);
        setEditedData(parsedData);
        setRubricaData(parsedData);
        } else {
        setEditedData([...rubricaData]);
        }
        setIsEditing(false);
    };
    

    const handleInputChange = (index, field, value) => {
        const newEditedData = [...editedData];
        newEditedData[index][field] = value;
        setEditedData(newEditedData);
    };

    // Función para eliminar un rubro por índice
    const handleDeleteRubro = (index) => {
        console.log(index)
        // Elimina el rubro del estado editado
        const updatedEditedData = editedData.filter((_, i) => i !== index);
        setEditedData(updatedEditedData);
        console.log(updatedEditedData)
    
        // Elimina el rubro del estado original
        const updatedRubricaData = rubricaData.filter((_, i) => i !== index);
        setRubricaData(updatedRubricaData);
        console.log(updatedRubricaData)
    };
    
    const handleAddRubro = () => {
        // Crea un nuevo rubro con campos predefinidos
        const newRubro = {
            intIdDetalle: '', // Usar un identificador único
            vchClaveCriterio: '', // Campo necesario
            vchCriterio: '', // Campo necesario
            vchDescripcion: '', // Campo necesario
            intValor: 0, // Campo necesario
            intClvPractica: parseInt(intNumeroPractica, 10) // El segundo argumento 10 es para especificar que estamos usando base decimal
        };
    
        // Actualiza `editedData`
        const updatedEditedData = [...editedData, newRubro];
        setEditedData(updatedEditedData);
    
        // Actualiza `rubricaData` (si es necesario)
        const updatedRubricaData = [...rubricaData, newRubro];
        setRubricaData(updatedRubricaData);

    };
    
    useEffect(() => {
        console.log("edita1", editedData);
        console.log("edita 2", rubricaData);
        console.log("nuevo", editedData);
    }, [editedData, rubricaData]);

    const existeCalificacionMayorACero = alumnos.some(alumno => alumno.TieneCalificacion > 0);

    const handleInputChangeCal = (index, field, value) => {
        let newValue = parseFloat(value);
        if (isNaN(newValue) || newValue < 0) {
            newValue = 0;
        }
        const updatedRubricas = rubricaCalAlumno.map((rubrica, i) => {
            if (i === index) {
                // Validar que el valor no exceda el valor máximo
                const validValue = newValue <= rubrica.valorMaximo ? newValue : rubrica.valorMaximo;
                return { ...rubrica, [field]: validValue };
            }
            return rubrica;
        });
    
        setRubricaCalAlumno(updatedRubricas);
    
        // Calcular el puntaje total y el puntaje obtenido
        const totalMaximo = updatedRubricas.reduce((acc, rubrica) => acc + rubrica.valorMaximo, 0);
        const totalObtenido = updatedRubricas.reduce((acc, rubrica) => acc + (parseFloat(rubrica.calificacionObtenida) || 0), 0);
    
        setPuntajeTotalCal(totalMaximo);
        setPuntajeObtenido(totalObtenido);
    };
    
    
    useEffect(() => 
    {
        if (selectedAlumnoMatricula) {
            fetchCalificacionesAlumno(selectedAlumnoMatricula);
        }
    }, [selectedAlumnoMatricula, selectedAlumnoTokenFirebase]);
    
    const fetchCalificacionesAlumno = async (matricula) => {
        try {
            setIsLoadingAlumn(true);
            const response = await fetch(`${apiUrl}/accionesAlumnos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idPractica: intNumeroPractica,
                    alumnoMatricula: matricula 
                }),
            });
            const result = await response.json();
            console.log(result);
            if (result.done) {
                // Inicializar cada rubro con su valor máximo si aún no tiene calificación
                const initializedRubrica = result.message.map(rubrica => ({
                    ...rubrica,
                    calificacionObtenida: rubrica.calificacionObtenida === null ? rubrica.valorMaximo : rubrica.calificacionObtenida
                }));
    
                setRubricaCalAlumno(initializedRubrica);
            } else {
                console.error('Error al cargar las calificaciones del alumno:', result.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
        finally{
            setIsLoadingAlumn(false);
        }
    };
    
    const handleCalificarClick = async () => {
        if (!selectedAlumnoMatricula) {
        setServerResponse(`Error: Selecciona un alumno antes de calificar.`);

        return;
        }

        const sumaCalificaciones = rubricaCalAlumno.reduce((total, criterio) => total + criterio.calificacionObtenida, 0);

        const notificacion = {
            matricula: selectedAlumnoMatricula,
            title:`${detalleActividad.vchNombre} - ${detalleActividad.vchDescripcion}`,
            body:`Nueva calificacion: ${sumaCalificaciones}/10 \nDocente: ${userData.vchNombre} ${userData.vchAPaterno} ${userData.vchAMaterno}`,
            tokenUser: selectedAlumnoTokenFirebase,
            url:`${webUrl}actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}/${intIdActividadCurso}`
        }
        console.log(notificacion)
        try {
            const response = await fetch(`${apiUrl}/accionesAlumnos.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            practicaId: intNumeroPractica,
            calificacionRubrica: puntajeObtenido,
            alumnoMatricula: selectedAlumnoMatricula,
            calificaciones: rubricaCalAlumno,
            }),
        });
        const result = await response.json();
        if (result.done) {
            sendNotification(notificacion)
            onloadAlumnos()
            setServerResponse(`Éxito: ${result.message}`);
        } else {
            setServerResponse(`Error: ${result.message}`);
        }
        } catch (error) {
        console.error('Error:', error.message);
        }
    };
    
    /*
    const onloadAlumnos = async () => {
        try {
        const response = await fetch(`${apiUrl}/accionesAlumnos.php`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            clvMateria: vchClvMateria,
            matriculaDocent: userData.vchMatricula,
            chrGrupo: chrGrupo,
            periodo: intPeriodo,
            practicaId: intNumeroPractica, // Asegúrate de tener el idPractica en el contexto adecuado

            }),
        });
        const result = await response.json();
        console.log("alumnos calificados", result)
        if (result.done) {
            setAlumnosMaterias(result.message);
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
        }
        } catch (error) {
        console.error('Error 500', error);
        setTimeout(() => {
            alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
        }, 2000);
        }
        finally{
            setIsLoading(false);
        }
    };
*/
    const onloadAlumnos = async () => {
        setIsLoading(true); // Activa el indicador de carga al inicio

        try {
            // Abrir el caché y buscar la respuesta en caché
            const cache = await caches.open('api-cache');
            const cachedResponse = await cache.match(`${apiUrl}accionesAlumnosPractica.php`);

            // Si hay una respuesta en caché y el usuario está offline, usar los datos en caché
            if (cachedResponse && !navigator.onLine) {
                const data = await cachedResponse.json(); // Acceder a los datos del caché
                console.log('Cargando alumnos calificados desde la caché:', data);

                if (data.done) {
                    setAlumnosMaterias(data.message);
                }
                return; // Terminar la función aquí si usamos el caché
            }

            // Realizar la solicitud a la API
            const requestData = {
                clvMateria: vchClvMateria,
                matriculaDocent: userData.vchMatricula,
                chrGrupo: chrGrupo,
                periodo: intPeriodo,
                practicaId: intNumeroPractica,
            };

            const response = await fetch(`${apiUrl}/accionesAlumnos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }

            // Clonar la respuesta antes de leer el JSON para poder guardarla en el caché
            const responseClone = response.clone();
            const result = await response.json();
            console.log("Alumnos calificados", result);

            if (result.done) {
                setAlumnosMaterias(result.message);
                console.log('Alumnos calificados cargados exitosamente desde la API.');

                // Guardar la respuesta clonada en el caché para uso futuro
                await cache.put(`${apiUrl}accionesAlumnosPractica.php`, responseClone);
                console.log('Respuesta de la API almacenada en caché.');
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
            }
        } catch (error) {
            if (!navigator.onLine) {
                console.log('No tienes conexión a Internet. Intenta nuevamente más tarde.');
            } else {
                console.error('Error en la petición:', error);
                alert('Error: Ocurrió un problema en la comunicación con el servidor. Intenta nuevamente más tarde.');
            }
        } finally {
            setIsLoading(false); // Desactiva el indicador de carga al finalizar
        }
    };

    useEffect(() => {
        onloadAlumnos();
    }, [vchClvMateria, userData.vchMatricula, chrGrupo, intPeriodo, intNumeroPractica]);
    

    /*const fetchDetallePractica = async () => {
        const requestData = { idPracticaDetalle: intNumeroPractica };
        try {
            const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
            });
            const data = await response.json();
            console.log("datos rubrica: ", data);
            if (data.done) {
            setDetalleActividad(data.message.detallePractica);
            const fetchedRubricaData = data.message.detalleRubrica;
            setRubricaData(fetchedRubricaData);
            localStorage.setItem('rubricaData', JSON.stringify(fetchedRubricaData));
            setEditedData(fetchedRubricaData);
            } else {
            throw new Error('Error al cargar los datos de la actividad');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };*/

    const fetchDetallePractica = async () => {
        const requestData = { idPracticaDetalle: intNumeroPractica };
        console.log("Datos enviados:", requestData);
    
        try {
            // Abrir el caché y buscar la respuesta en caché
            const cache = await caches.open('api-cache');
            const cachedResponse = await cache.match(`${apiUrl}DetallePractica.php`);
    
            // Si hay una respuesta en caché y el usuario está offline, usar los datos en caché
            if (cachedResponse && !navigator.onLine) {
                const data = await cachedResponse.json(); // Acceder a los datos del caché
                console.log('Cargando detalle de práctica desde la caché:', data);
    
                if (data.done) {
                    setDetalleActividad(data.message.detallePractica);
                    const fetchedRubricaData = data.message.detalleRubrica;
                    setRubricaData(fetchedRubricaData);
                    localStorage.setItem('rubricaData', JSON.stringify(fetchedRubricaData));
                    setEditedData(fetchedRubricaData);
                }
                return; // Terminar la función aquí si usamos el caché
            }
    
            // Realizar la solicitud a la API
            const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });
    
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
    
            // Clonar la respuesta antes de leer el JSON para poder guardarla en el caché
            const responseClone = response.clone();
            const data = await response.json();
            console.log("Datos de rubrica:", data);
    
            if (data.done) {
                setDetalleActividad(data.message.detallePractica);
                const fetchedRubricaData = data.message.detalleRubrica;
                setRubricaData(fetchedRubricaData);
                localStorage.setItem('rubricaData', JSON.stringify(fetchedRubricaData));
                setEditedData(fetchedRubricaData);
    
                // Guardar la respuesta clonada en el caché para uso futuro
                await cache.put(`${apiUrl}DetallePractica.php`, responseClone);
                console.log('Respuesta de la API almacenada en caché.');
            } else {
                console.log('Error al cargar los datos de la actividad:', data);
            }
        } catch (error) {
            if (!navigator.onLine) {
                console.log('No tienes conexión a Internet. Intenta nuevamente más tarde.');
            } else {
                console.error('Error en la petición:', error);
                alert('Error: Ocurrió un problema en la comunicación con el servidor. Intenta nuevamente más tarde.');
            }
        }
    };
    

    useEffect(() => {
        fetchDetallePractica();
    }, [intNumeroPractica]);


    const handleAlumnoSelect = (matricula, TokenFirebase) => {
        setSelectedAlumno(alumnos.find(alumno => alumno.AlumnoMatricula === matricula));
        setSelectedAlumnoMatricula(matricula);
        setSelectedAlumnoTokenFirebase(TokenFirebase);
        
    };
    

    useEffect(() => {
        const dataToSum = isEditing ? editedData : rubricaData;
        const total = dataToSum.reduce((sum, rubrica) => sum + (parseFloat(rubrica.intValor) || 0), 0);
        setPuntajeTotal(total);
    }, [rubricaData, editedData, isEditing]);

    useEffect(() => {
        const totalMaximo = rubricaCalAlumno.reduce((acc, rubrica) => acc + rubrica.valorMaximo, 0);
        const totalObtenido = rubricaCalAlumno.reduce((acc, rubrica) => acc + (parseFloat(rubrica.calificacionObtenida) || 0), 0);
        setPuntajeTotalCal(totalMaximo);
        setPuntajeObtenido(totalObtenido);
    }, [rubricaCalAlumno]);


    if (isLoading) {
        return <DetailedPracticeSkeleton />;
    }

    return (
        <section className='w-full flex flex-col'>
            <InfoAlert
                message={serverResponse}
                type={serverResponse.includes('Éxito') ? 'success' : 'error'}
                isVisible={!!serverResponse}
                onClose={() => {
                setServerResponse('');
                }}
            />
        <TitlePage label={detalleActividad.vchNombre} />
        <Paragraphs className="ml-3" label={detalleActividad.vchDescripcion} />
        <Tabs>
            <Tabs.Item title="Instrucciones" icon={MdDescription}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className='md:w-full md:flex flex-col gap-y-4'>
                        <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                            <TitleSection label="Instrucciones" />
                            <div className="prose"
                                dangerouslySetInnerHTML={{ __html: detalleActividad.vchInstrucciones }} />
                            </div>
                            <div className="grid grid-cols-1 gap-1 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                                <div className="mb-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                                <TitleSection label="Rúbrica de Evaluación" />
                                
                                {isEditing ? (
                                    <div className="flex gap-2">
                                    <Tooltip content="Guardar" placement="left">
                                        <FaSave className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={handleSaveClick} />
                                    </Tooltip>
                                    <Tooltip content="Cancelar" placement="left">
                                        <FaTimes className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={handleCancelClick} />
                                    </Tooltip>
                                    </div>
                                ) : (
                                    
                                    existeCalificacionMayorACero ? (
                                        <Tooltip content="No es posible editar la rúbrica una vez usada para calificar" placement="left">
                                            <FaEdit className="text-gray-300 cursor-not-allowed" />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="Editar" placement="left">
                                            <FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={handleEditClick} />
                                        </Tooltip>
                                    )
                                    
                                )}

                                </div>
                                
                                {editedData.map((rubrica, index) => (
                                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                                    <div className={`grid ${isEditing ? 'grid-cols-10' : 'grid-cols-5'} items-center gap-6`}>
                                    <div className={`${isEditing ? 'col-span-7' : 'col-span-4'} text-muted-foreground`}>
                                        {isEditing ? (
                                        <FloatingLabelInput
                                            id={`vchRubro_${rubrica.intIdDetalle}`}
                                            label={`Rubro ${index + 1}`}
                                            value={rubrica.vchDescripcion || ''}
                                            onChange={(e) => handleInputChange(index, 'vchDescripcion', e.target.value)}
                                        />
                                        ) : (
                                        <p className="text-gray-900 dark:text-white">{rubrica.vchDescripcion}</p>
                                        )}
                                    </div>
                                    <div className={`${isEditing ? 'col-span-3' : 'col-span-1'} flex items-center justify-end gap-2`}>
                                        {isEditing ? (
                                        <>
                                            <FloatingLabelInput
                                            id={`intValor_${rubrica.intIdDetalle}`}
                                            label={`Valor ${index + 1}`}
                                            type="number"
                                            value={rubrica.intValor || ''}
                                            onChange={(e) => handleInputChange(index, 'intValor', e.target.value)}
                                            />
                                            <Tooltip content="Eliminar rubro">
                                            <button
                                                type="button"
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                                onClick={() => handleDeleteRubro(index)}
                                            >
                                                <FaTrash />
                                            </button>
                                            </Tooltip>
                                        </>
                                        ) : (
                                        <div className="flex items-center gap-2 text-lg font-semibold">
                                            <span className="text-gray-900 dark:text-white">{rubrica.intValor}</span>
                                        </div>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                ))}

                                {isEditing && (
                                <div className="flex items-center justify-start mb-4">
                                    <Tooltip content="Agregar nuevo criterio">
                                    <button
                                        type="button"
                                        className="bg-primary hover:bg-secondary p-3 bg-white rounded-full border border-bg-primary hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                                        onClick={handleAddRubro}
                                    >
                                        <FaPlus className="text-lg" />
                                    </button>
                                    </Tooltip>
                                </div>
                                )}

                                <div className=" flex justify-between items-center">
                                    <h1 className="text-muted-foreground text-xl font-semibold">Puntaje Total</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-2xl">{puntajeTotal}</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </Tabs.Item>
            <Tabs.Item title="Trabajos de los Alumnos" icon={MdAssignment}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className='md:w-5/12 md:flex flex-col gap-y-4'>
                    <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                        <TitleSection label="Lista de Alumnos Calificados" />
                        <div className="max-h-[400px] overflow-y-auto">
                            <ul className="space-y-2">
                                {alumnos.map((alumno) => (
                                <li
                                    key={alumno.AlumnoMatricula}
                                    className={`flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300 ${alumno.TieneCalificacion ? 'text-green-600' : 'text-red-600'}`}
                                    onClick={() => handleAlumnoSelect(alumno.AlumnoMatricula, alumno.TokenFirebase)}
                                >
                                    <div className="flex items-center space-x-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={alumno.FotoPerfil ? `${webUrl}assets/imagenes/${alumno.FotoPerfil}` : `${webUrl}assets/imagenes/userProfile.png`}
                                        alt={`Foto de ${alumno.AlumnoNombre}`}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {`${alumno.AlumnoNombre} ${alumno.AlumnoApellidoPaterno} ${alumno.AlumnoApellidoMaterno}`}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-300">
                                        Matrícula: {alumno.AlumnoMatricula}
                                        </p>
                                    </div>
                                    </div>
                                    {alumno.TieneCalificacion ? (
                                    <FaCheckCircle className="text-lg text-green-600" />
                                    ) : (
                                    <FaTimesCircle className="text-lg text-red-600" />
                                    )}
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="md:w-7/12 md:flex flex-col">
                <div className="h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                    {selectedAlumno ? (
                        <>
                        <div className="flex flex-col mb-4 md:mb-0">
                            <TitleSection label="Rúbrica de Evaluación" />
                            <div className="flex items-center space-x-4 mt-4">
                                <img
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={selectedAlumno.FotoPerfil ? `${webUrl}assets/imagenes/${selectedAlumno.FotoPerfil}` : `${webUrl}assets/imagenes/userProfile.png`}
                                    alt={`Foto de ${selectedAlumno.AlumnoNombre}`}
                                />
                                <div>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {selectedAlumno.AlumnoNombre} {selectedAlumno.AlumnoApellidoPaterno} {selectedAlumno.AlumnoApellidoMaterno}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        Matrícula: {selectedAlumno.AlumnoMatricula}
                                    </p>
                                </div>
                            </div>
                        </div>
                        </>
                        ) 
                        : 
                        (
                            <ContentTitle className="ml-3" label="Selecciona un alumno"/>
                        )
                    }
                    </div>
                    {isLoadingAlumn?(
                        <RubricaSkeletonLoader count={5} />                    
                    )
                    :
                    (
                        <>
                        {rubricaCalAlumno.map((rubrica, index) => (
                            <div key={index} className="py-4 border-b border-gray-300 dark:border-gray-700">
                                <div className="grid grid-cols-10 gap-4 items-center">
                                <div className="col-span-7 text-muted-foreground">
                                    <p className="text-gray-900 text-sm sm:text-base">{rubrica.criterioDescripcion}</p>
                                </div>
                                <div className="col-span-3 flex items-center justify-end gap-2">
                                    <CustomInputOnchange
                                    label={`Valor ${index + 1}`}
                                    type="number"
                                    name={`intCal_${index}`}
                                    value={rubrica.calificacionObtenida || ''}
                                    pattern={/^[0-9]+$/}
                                    errorMessage="El valor debe ser un número"
                                    errors={errors}
                                    register={register}
                                    onChange={(value) => handleInputChangeCal(index, 'calificacionObtenida', value || 0)}
                                    />
                                    <span className="font-semibold text-lg sm:text-xl">/{rubrica.valorMaximo}</span>
                                </div>
                                </div>
                            </div>
                            ))}
        
                            {selectedAlumno && (
                            <div className="mt-6 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-2xl font-semibold">Puntaje Total:</span>
                                    <span className="font-semibold text-2xl text-gray-700">{puntajeObtenido}</span>
                                    <span className="font-semibold text-2xl text-gray-900">/ {puntajeTotalCal}</span>
                                </div>
                                <LoadingButton Icon={FaCheckCircle} normalLabel="Calificar" className="w-28 h-10 text-white py-2 px-4 rounded-lg" onClick={handleCalificarClick} />
                            </div>
                            )}
                        </>
                    )}
      
                </div>
                </div>
            </div>
            </Tabs.Item>
        </Tabs>
        </section>
    );
};

export default DetallePracticaDocente;
