// SideNav.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Card} from 'flowbite-react';
import  Components from '../../components/Components'
const {TitlePage, CardSkeleton } = Components;

const GruposMateriasDocente = () => { 
    const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
    const [materias, setMaterias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {vchClvMateria, chrGrupo, intPeriodo} = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;

    const onloadNaterias = async () => {
        try {
        const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
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

        const result = await response.json();
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
        alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
    }
    finally{
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
            <TitlePage label="Grupos inscritos en la Materia" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <CardSkeleton key={index} />
            ))
            : materias.map((materia) => (                    
                <Card
                    key={materia.chrGrupo}
                    href={`/gruposMaterias/actividades/${vchClvMateria}/${materia.chrGrupo}/${intPeriodo}`}
                    className="w-full rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
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

export default GruposMateriasDocente;