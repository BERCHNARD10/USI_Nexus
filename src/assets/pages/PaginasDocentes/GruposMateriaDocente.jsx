// SideNav.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { Link, useParams } from 'react-router-dom';
import { Card} from 'flowbite-react';
import  Components from '../../components/Components'
const {TitlePage, CardSkeleton } = Components;

const GruposMateriasDocente = () => { 
    const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
    const [materias, setMaterias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {vchClvMateria, intPeriodo} = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;

    const onloadGrupos = async () => {
        setIsLoading(true); // Activa el indicador de carga al inicio
        try {
            /*
            // Abrir el caché
            const cache = await caches.open('api-cache');
            const cachedResponse = await cache.match(`${apiUrl}cargarGrupos.php`);
    
            // Si hay una respuesta en caché y el usuario está offline, usar los datos en caché
            if (cachedResponse && !navigator.onLine) {
                const data = await cachedResponse.json(); // Acceder a los datos del caché
                console.log('Cargando materias desde la caché:', data);
                setMaterias(data.message);
                return; // Terminar la función aquí si usamos el caché
            }
    */
            // Realizar la solicitud a la API
            const response = await fetch(`${apiUrl}cargarMaterias.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clvMateria: vchClvMateria,
                    matriculaDocent: userData.vchMatricula,
                    periodo: intPeriodo
                }),
            });
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
    
            // Clonar la respuesta antes de leer el JSON para poder guardarla en el caché
            const responseClone = response.clone();
            const result = await response.json();
    
            if (result.done) {
                setMaterias(result.message);
                console.log('Materias cargadas exitosamente desde la API.', result);
    
                // Guardar la respuesta clonada en el caché
               // await cache.put(`${apiUrl}cargarGrupos.php`, responseClone);
                console.log('Respuesta de la API almacenada en caché.');
            } else {
                // Manejo de errores en la respuesta de la API
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
            if (!navigator.onLine) {
                console.log('No tienes conexión a Internet. Intenta nuevamente más tarde.');
            } else {
                console.error('Error en la petición:', error);
                alert('Error: Ocurrió un problema en la comunicación con el servidor. Intenta nuevamente más tarde.');
            }
        }  finally {
            setIsLoading(false); // Desactiva el indicador de carga al finalizar
        }
    };
    

    useEffect(() => {
        {
            onloadGrupos()
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <TitlePage label="Grupos inscritos en la Materia" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <CardSkeleton key={index} />
            ))
            : materias.map((materia) => (                    
                <Card
                    key={materia.chrGrupo}
                    className="w-full rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
                    theme={{
                    root: {
                        children: "p-0",
                    }
                    }}
                >
                    <Link
                        to={`/gruposMaterias/actividades/${vchClvMateria}/${materia.chrGrupo}/${intPeriodo}`}
                        className="block"
                    >
                        <div className="relative h-40">
                        <div className="pt-5 pb-6 px-4 flex justify-center items-center h-full">
                            <h3 className="text-xl font-bold text-gray-900 text-center">{materia.chrGrupo}</h3>
                        </div>
                        </div>
                    </Link>
                </Card>
                ))}
            </div>
        </div>
    );
};

export default GruposMateriasDocente;