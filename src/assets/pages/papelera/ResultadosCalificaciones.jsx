import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'flowbite-react';

function ResultadosCalificaciones() {
  const [matriculaAlumno, setMatriculaAlumno] = useState('');
  const [resultados, setResultados] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const obtenerResultados = async () => {
    try {
      const response = await fetch(`${apiUrl}buscarAlumno.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matriculaAlumno }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener los resultados');
      }

      const data = await response.json();
      setResultados(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (matriculaAlumno.trim() !== '') {
        obtenerResultados();
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [matriculaAlumno]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Resultados de Calificaciones</h1>
      <div className="mb-3">
        <label htmlFor="matriculaAlumno" className="form-label">
          Matrícula del Alumno:
        </label>
        <input
          type="text"
          id="matriculaAlumno"
          className="form-control"
          value={matriculaAlumno}
          onChange={(e) => setMatriculaAlumno(e.target.value)}
        />
      </div>

      {resultados.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Nombre del Alumno</Table.HeadCell>
              <Table.HeadCell>Matrícula</Table.HeadCell>
              <Table.HeadCell>Materia</Table.HeadCell>
              <Table.HeadCell>Período</Table.HeadCell>
              <Table.HeadCell>Parcial 1</Table.HeadCell>
              <Table.HeadCell>Parcial 2</Table.HeadCell>
              <Table.HeadCell>Parcial 3</Table.HeadCell>
              <Table.HeadCell>Promedio Final</Table.HeadCell>
              <Table.HeadCell>Estado del Alumno</Table.HeadCell>
              <Table.HeadCell>Nombre de la Escuela</Table.HeadCell>
              <Table.HeadCell>Detalle Calificación</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {resultados.map((resultado) => (
                <Table.Row key={resultado.vchMatricula} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{resultado.vchNombre}</Table.Cell>
                  <Table.Cell>{resultado.vchMatricula}</Table.Cell>
                  <Table.Cell>{resultado.vchNomMateria}</Table.Cell>
                  <Table.Cell>{resultado.vchPeriodo}</Table.Cell>
                  <Table.Cell>{resultado.intPar1}</Table.Cell>
                  <Table.Cell>{resultado.intPar2}</Table.Cell>
                  <Table.Cell>{resultado.intPar3}</Table.Cell>
                  <Table.Cell>{resultado.intPromFinal}</Table.Cell>
                  <Table.Cell>{resultado.EstadoAlumno}</Table.Cell>
                  <Table.Cell>{resultado.NombreEscuela}</Table.Cell>
                  <Table.Cell><Link to={`/ResultadosCalificaciones/detalle/${resultado.vchClvMateria}`}>Detalle de Calificación</Link></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
}

export default ResultadosCalificaciones;
