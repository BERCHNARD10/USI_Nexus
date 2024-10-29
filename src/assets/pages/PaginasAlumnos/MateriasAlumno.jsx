// SideNav.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { Card, Button } from 'flowbite-react';
import { FaRegFrown } from 'react-icons/fa';
import  Components from '../../components/Components'
const {TitlePage, CardSkeleton} = Components;

const MateriasAlumno = () => { 
    const {userData} = useAuth(); // Obtén el estado de autenticación del contexto
    const [materias, setMaterias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = "https://robe.host8b.me/WebServices/";
    const webUrl = "https://robe.host8b.me/";
    const onloadNaterias = async () => {
        try {
            const response = await fetch(`${apiUrl}/cargarMaterias.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matriculaAlumn: userData.vchMatricula
            }),
        });

        const result = await response.json();
        console.log(result);
        if (result.done) {
            setMaterias(result.message);

            } else {
            console.log('Error en el registro:', result.message);
            
        }
        
    } 
    catch (error) 
    {
        console.error('Error 500 Error: API no disponible');
        alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.'); 
    } 
    finally 
    {
        setIsLoading(false);
    }
    };

    useEffect(() => {
        {
        onloadNaterias()
        }
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <CardSkeleton key={index} data-testid="skeleton" />
                ))}
            </div>        
        )
    }

return (
    <div className="container mx-auto px-4 py-8">
        <TitlePage label="Materias Asociadas" />
        {materias.length > 0 ? 
        (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {materias.map((materia) => (
                    <Card
                        key={materia.vchClvMateria}
                        href={`/actividades/${materia.vchClvMateria}/${userData.dataEstudiante.chrGrupo}/${materia.intPeriodo}`}
                        className="rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 p-4"
                    >
                        <div className="flex flex-col items-center text-center space-y-2">
                        <img
                            alt={`Foto de perfil de ${materia.vchNombre}`}
                            src={materia.vchFotoPerfil 
                                ? `https://robe.host8b.me/assets/imagenes/${materia.vchFotoPerfil}`
                                : 'https://robe.host8b.me/assets/imagenes/userProfile.png'}
                            className="w-24 h-24 rounded-full shadow-lg mb-3 object-cover"
                        />
                        <h3 className="text-xl font-medium text-gray-900">
                            {materia.vchNombre} {materia.vchAPaterno} {materia.vchAMaterno}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {materia.vchClvMateria}: {materia.vchNomMateria} - {materia.intHoras} Horas
                        </p>
                        <p className="text-sm text-gray-500">
                            {materia.intClvCuatrimestre}{materia.chrGrupo}
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Periodo:</strong> {materia.vchPeriodo}
                        </p>
                        </div>
                    </Card>
                ))}
            </div>
        ) 
        : 
        (
            <div className="flex flex-col items-center justify-center h-64">
                <FaRegFrown className="text-gray-500 text-6xl" />
                <p className="text-gray-500 text-lg mt-4">No hay clases agregadas.</p>
            </div>
        )}
    </div>
    );
};

export default MateriasAlumno;
