import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Components from '../../components/Components';
import { useAuth } from '../../server/authUser';
import { useForm } from 'react-hook-form';

const { TitlePage, Paragraphs, TitleSection, DetailedPracticeSkeleton, CustomInputOnchange, ContentTitle, FloatingLabelInput } = Components;

const DetallePracticaAlumno = () => {
    const { intNumeroPractica } = useParams();
    const [detalleActividad, setDetalleActividad] = useState({});
    const { isAuthenticated, userData } = useAuth();
    const [rubricaData, setRubricaData] = useState([]);
    const [rubricaCalAlumno, setRubricaCalAlumno] = useState([]);
    const [puntajeTotal, setPuntajeTotal] = useState(0);
    const [puntajeTotalCal, setPuntajeTotalCal] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState([]);
    const {vchClvMateria, chrGrupo, intPeriodo } = useParams();
    const [puntajeObtenido, setPuntajeObtenido] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm();

    const fetchCalificacionesAlumno = async () => {
        try {
            const response = await fetch(`${apiUrl}/accionesAlumnos.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
            idPractica: intNumeroPractica,
            alumnoMatricula: userData.vchMatricula 
            }),
        });
        const result = await response.json();
    console.log("cal",result.message)

        if (result.done) {
            
            setRubricaCalAlumno(result.message);
        } else {
            console.error('Error al cargar las calificaciones del alumno:', result.message);
        }
        } catch (error) {
        console.error('Error:', error.message);
        }
    };
    

    useEffect(() => {
    }, [vchClvMateria, userData.vchMatricula, chrGrupo, intPeriodo, intNumeroPractica]);
    
    useEffect(() => {
        const fetchActividad = async () => {
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
        finally{
            setIsLoading(false)
        }
        };

        fetchActividad();
    }, [intNumeroPractica]);

    useEffect(() => {
        fetchCalificacionesAlumno()
        const dataToSum = isEditing ? editedData : rubricaData;
        const total = dataToSum.reduce((sum, rubrica) => sum + (parseInt(rubrica.intValor) || 0), 0);
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
        <TitlePage label={detalleActividad.vchNombre} />
        <Paragraphs className="ml-3" label={detalleActividad.vchDescripcion} />
        <div className="flex flex-col md:flex-row gap-4">
                <div className='md:w-full md:flex flex-col gap-y-4'>
                <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                    <TitleSection label="Instrucciones" />
                    <div className="prose" dangerouslySetInnerHTML={{ __html: detalleActividad.vchInstrucciones }} />
                </div>

                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-4 border-b border-gray-300 dark:border-gray-700">
                    <TitleSection label="Rúbrica de Evaluación" />
                </div>

                {rubricaCalAlumno.map((rubrica, index) => (
                    <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 text-muted-foreground mr-4">
                        <p className='text-gray-900 dark:text-white'>{rubrica.criterioDescripcion}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 text-lg font-semibold">
                        <span className="text-gray-700 dark:text-gray-300">{rubrica.calificacionObtenida||'0'}</span>
                        <span className="text-gray-500 dark:text-gray-400">/{rubrica.valorMaximo}</span>
                    </div>
                    </div>
                ))}
                
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-300 dark:border-gray-700">
                    <div className="text-muted-foreground text-xl font-semibold">Puntaje Total</div>
                    <div className="flex items-center gap-2 text-xl font-bold">
                        
                    <span className="font-semibold text-2xl text-muted-foreground text-gray-700">{puntajeObtenido}</span>
                    <span className="font-semibold text-2xl">/ {puntajeTotalCal}</span>
                    </div>
                </div>
                </div>


                </div>
                {/** 
                <div className="md:w-1/4 md:flex flex-col">
                <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                    <TitleSection label="Tu Trabajo" />
                    <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
                    <div className="grid grid-cols-1 gap-1">
                        <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Subir Archivo
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            name="file-upload"
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm max-sm:w-full md:w-full"
                        />
                        </div>
                        <LoadingButton normalLabel="Entregar" className="mt-4 w-full text-white py-2 px-4 rounded-lg" />
                    </div>
                    </address>
                </div>
                </div>*/}
            </div>
        </section>
    );
};

export default DetallePracticaAlumno;
