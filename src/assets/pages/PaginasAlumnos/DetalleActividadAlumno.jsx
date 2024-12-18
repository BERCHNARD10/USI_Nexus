import React, { useState, useEffect } from 'react';
import {Link, useParams } from 'react-router-dom';
import Components from '../../components/Components';
const { TitlePage, ContentTitle, Paragraphs, TitleSection, DescriptionActivity, DetailedActivitySkeleton} = Components;
import { Card } from 'flowbite-react';
import { FaRegFrown } from 'react-icons/fa';
import { useAuth } from '../../server/authUser';
import ReactMarkdown from 'react-markdown';

const DetalleActividadAlumno = () => {
    const { vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, intIdActividadCurso } = useParams();
    const [actividad, setActividad] = useState([]);
    const [practicas, setPracticas] = useState([]);
    const [datosCalAlumn, setDatosCalAlumn] = useState([]);
    const {userData} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchActividad = async () => {
        const requestData = {
            clvMateria: vchClvMateria,
            grupo: chrGrupo,
            periodo: intPeriodo,
            numeroActividad: intNumeroActi,
            numeroActividadCurso: intIdActividadCurso
        };

        try {
            const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("Respuesta", data);

            if (data.done) {
                setActividad(data.message.detalleActividad);
                setPracticas(data.message.practicasActividad);
            } else {
                console.log(data);
            }
        } catch (error) {
            alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
            // Manejar el error, mostrar mensaje al usuario, etc.
        }
        finally
        {
            setIsLoading(false)
        }
    };

    const fetchDatosCalAlumn = async () => {
        const dataAlumnCal = {
            matricula: userData.vchMatricula,
            fkActividadGlobal: intNumeroActi,
            idActividadCurso: intIdActividadCurso
        };
        
        console.log("datos", dataAlumnCal);
    
        try {
            const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    datosAlumno: dataAlumnCal
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response}`);
            }
    
            const data = await response.json();
            console.log("RespuestaCalificaciones", data);
    
            if (data.done) {
                setDatosCalAlumn(data.message);
            } else {
                console.log(data);
            }
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error, mostrar mensaje al usuario, etc.
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            await fetchActividad();
            await fetchDatosCalAlumn();
        };
    
        fetchData();
    }, [vchClvMateria, chrGrupo, intPeriodo, intNumeroActi]);

    // Combina prácticas con calificaciones

    // Combina prácticas con calificaciones, manejando el caso cuando datosCalAlumn es null o está vacío
    // Asegúrate de que practicas sea un arreglo antes de mapearlo
    const prácticasConCalificaciones = (practicas || []).map(practica => {
        const calificacion = datosCalAlumn?.find(c => c.idPractica === practica.idPractica);
        return {
            ...practica,
            calificacionPractica: calificacion ? calificacion.calificacionPractica : 'No calificado',
            calificacionObtenidaAlumno: calificacion ? calificacion.calificacionObtenidaAlumno : 'No calificado'
        };
    });

    console.log("datos",prácticasConCalificaciones)

    if (isLoading) {
        return <DetailedActivitySkeleton />;
    }

    return (
        <section className='w-full flex flex-col'>
            <div className="m-3 flex flex-col">
                <TitlePage label={actividad.Nombre_Actividad} />
                <DescriptionActivity label={actividad.Descripcion_Actividad}/>
            </div>
            <div className="flex flex-col md:flex-row">
                {/* Detalles de la Actividad en dispositivos móviles y en PC */}
                <div className="flex flex-col md:w-1/3 md:order-last gap-y-4 mb-4 md:mb-0 md:ml-4">
                    <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                        <TitleSection label="Detalles de la Actividad" />
                        <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400 mt-3">
                            <div>
                                <ContentTitle label="Fecha de Solicitud: " />
                                <Paragraphs label={actividad.Fecha_Solicitud} />
                            </div>
                            <div>
                                <ContentTitle label="Fecha de Entrega: " />
                                <Paragraphs label={actividad.Fecha_Entrega} />
                            </div>
                            <div>
                                <ContentTitle label="Valor de la Actividad: " />
                                <Paragraphs label={actividad.Valor_Actividad} />
                            </div>
                            <div>
                                <ContentTitle label="Calificación Obtenida: " />
                                {datosCalAlumn.length > 0 ? (
                                    <Paragraphs label={datosCalAlumn.length > 0 && datosCalAlumn[0].calificacionActividadAlumno !== null ? datosCalAlumn[0].calificacionActividadAlumno : "0"} />
                                ) : (
                                    <Paragraphs label="0" />
                                )}

                            </div>
                            <div>
                                <ContentTitle label="Clave de Instrumento:" />
                                <Paragraphs label={actividad.Clave_Instrumento} />
                            </div>
                            <div>
                                <ContentTitle label="Modalidad:" />
                                <Paragraphs label={actividad.Modalidad} />
                            </div>
                        </address>
                    </section>
                </div>

                {/* Sección de prácticas */}
                <div className="flex-1">
                    <>
                        {prácticasConCalificaciones.length > 0 ? (
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {prácticasConCalificaciones.map((practica) => (
                                <Link
                                    to={`/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${practica.idPractica}/${intIdActividadCurso}`}
                                    className="block"
                                >
                                <Card
                                    key={practica.idPractica}
                                    //href={`/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${practica.idPractica}/${intIdActividadCurso}`}
                                    className="relative rounded-lg overflow-hidden shadow-lg p-0"
                                    theme={{ root: { children: "p-0" } }}
                                >
                                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                        {practica.calificacionObtenidaAlumno}/{practica.calificacionPractica}
                                    </div>
                                    <div className="relative h-36">
                                        <div className="pt-5 pb-6 px-4">
                                            <h3 className="text-xl font-bold text-gray-900 text-center">{practica.vchNombre}</h3>
                                            <p className="text-sm text-gray-500 text-center">{practica.vchDescripcion}</p>
                                        </div>
                                    </div>
                                </Card>
                                </Link>
                                ))}
                            </section>
                        ) : (
                            <section className="flex flex-col items-center justify-center w-full h-64">
                                <FaRegFrown className="text-gray-500 text-6xl" />
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    No hay actividades o prácticas disponibles.
                                </div>
                            </section>
                        )}
                    </>
                </div>
            </div>
        </section>
    );
};

export default DetalleActividadAlumno;
