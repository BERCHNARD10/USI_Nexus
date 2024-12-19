import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Tabs, Accordion } from "flowbite-react";
import { HiClipboardList, HiUserGroup } from "react-icons/hi"; // Actualiza aquí
import Components from '../../components/Components';
const { TitlePage, ContentTitle, Paragraphs, Link, TitleSection, DescriptionActivity, ActivitiesSkeleton} = Components;
//esto es un prueba para ver si jala en github

const ActividadesAlumno = () => {
    const { userData } = useAuth(); // Obtén el estado de autenticación del contexto
    const [actividades, setActividades] = useState([]);
    const [alumnos, setAlumnosMaterias] = useState([]);
    const {vchClvMateria, chrGrupo, intPeriodo } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const webUrl = import.meta.env.VITE_URL;


    const onloadActividades = async () => {
        try {
            const response = await fetch(`${apiUrl}cargarMaterias.php`, {
            method: 'POST',
            headers: {
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

        const requestData = {
            matriculaAlumno: userData.vchMatricula,
            intClvCarrera:userData.dataEstudiante.intClvCarrera,
            intMateria: vchClvMateria,
            intPeriodo: userData.dataEstudiante.intPeriodo,
            intClvCuatrimestre:userData.dataEstudiante.intClvCuatrimestre,
            chrGrupo: userData.dataEstudiante.chrGrupo
        };

        console.log("datods: ", requestData)
        const result = await response.json();
        console.log(result);

        if (result.done) {
            setActividades(result.message);
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
        alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
        }
        finally{
            setIsLoading(false)
        }
    };

    const onloadAlumnos = async () => {
        try {
            const response = await fetch(`${apiUrl}accionesAlumnos.php`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clvMateria: vchClvMateria,
                matriculaAlumno: userData.vchMatricula,
                chrGrupo:chrGrupo,
                periodo: intPeriodo,
            }),
        });
        const result = await response.json();
        console.log("datoalumnos: ", result)

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
        alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
        }
    };

    useEffect(() => {
        onloadActividades();
        onloadAlumnos();
    }, []);

    const groupActivitiesByParcial = (activities) => {
        return activities.reduce((groups, activity) => {
        const { intParcial } = activity;
        if (!groups[intParcial]) {
            groups[intParcial] = [];
        }
        groups[intParcial].push(activity);
        return groups;
        }, {});
    };

    const groupedActivities = groupActivitiesByParcial(actividades);

    if (isLoading) {
        return <ActivitiesSkeleton />;
    }
    return (
        <section className='w-full flex flex-col'>
        <TitlePage label="Trabajo de clase" />
        <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
            <Tabs aria-label="Tabs with underline" style="underline">
            <Tabs.Item active title="Actividades" icon={HiClipboardList}>
                {Object.entries(groupedActivities).map(([parcial, activities]) => (
                <div key={parcial}>
                    <TitleSection label={'Parcial '+ parcial} />
                    <Accordion collapseAll>
                    {activities.map((actividad) => (
                        <Accordion.Panel key={actividad.intClvActividad}>
                        <Accordion.Title>
                            <ContentTitle label={actividad.vchNomActivi} />
                        </Accordion.Title>
                        <Accordion.Content>
                            <DescriptionActivity label={actividad.vchDescripcion}/>
                            <Paragraphs label={`Valor: ${actividad.fltValor} puntos`} />
                        </Accordion.Content>
                        <Accordion.Content>
                            <Link
                            to={`/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${actividad.intClvActividad}/${actividad.intIdActividadCurso}`}
                            children="Ver Más"
                            />
                        </Accordion.Content>
                        </Accordion.Panel>
                    ))}
                    </Accordion>
                </div>
                ))}
            </Tabs.Item>
            <Tabs.Item title="Alumnos" icon={HiUserGroup}>
                <TitlePage label="Docente" />
                {alumnos.length > 0 && (
                    <div
                        key={alumnos[0].DocenteMatricula}
                        className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <img
                            className="w-12 h-12 rounded-full object-cover"
                            src={alumnos[0].DocenteFotoPerfil
                                ? `${webUrl}assets/imagenes/${alumnos[0].DocenteFotoPerfil}`
                                : `${webUrl}assets/imagenes/userProfile.png`}
                            alt={`Foto de ${alumnos[0].DocenteNombre}`}
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                {`${alumnos[0].DocenteNombre} ${alumnos[0].DocenteApellidoPaterno} ${alumnos[0].DocenteApellidoMaterno}`}
                            </p>
                            <p className="text-xs text-gray-500">
                                Matrícula: {alumnos[0].DocenteMatricula}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <TitlePage label="Alumnos" />
                    <p className="text-lg font-semibold text-gray-800 text-start mb-3">
                    Total de alumnos: {alumnos.length+1}
                    </p>
                </div>

                <div className="space-y-3">
                    {alumnos.map((alumno) => (
                        <div
                            key={alumno.AlumnoMatricula}
                            className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                        <img
                            className="w-12 h-12 rounded-full object-cover"
                            src={alumno.FotoPerfil
                            ? `${webUrl}assets/imagenes/${alumno.FotoPerfil}`
                            : `${webUrl}assets/imagenes/userProfile.png`}
                            alt={`Foto de ${alumno.AlumnoNombre}`}
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                            {`${alumno.AlumnoNombre} ${alumno.AlumnoApellidoPaterno} ${alumno.AlumnoApellidoMaterno}`}
                            </p>
                            <p className="text-xs text-gray-500">
                            Matrícula: {alumno.AlumnoMatricula}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
            </Tabs.Item>
            </Tabs>
        </div>
        </section>
    );
};

export default ActividadesAlumno;
