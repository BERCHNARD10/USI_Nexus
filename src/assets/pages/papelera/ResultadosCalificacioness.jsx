import React, { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom';

function ResultadosCalificacioness() {
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
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del Alumno</th>
              <th>Matrícula</th>
              <th>Materia</th>
              <th>Período</th>
              <th>Parcial 1</th>
              <th>Parcial 2</th>
              <th>Parcial 3</th>
              <th>Promedio Final</th>
              <th>Estado del Alumno</th>
              <th>Nombre de la Escuela</th>
              <th>Detalle Calificacion</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado) => (
              <tr key={resultado.vchMatricula}>
                <td>{resultado.vchNombre}</td>
                <td>{resultado.vchMatricula}</td>
                <td>{resultado.vchNomMateria}</td>
                <td>{resultado.vchPeriodo}</td>
                <td>{resultado.intPar1}</td>
                <td>{resultado.intPar2}</td>
                <td>{resultado.intPar3}</td>
                <td>{resultado.intPromFinal}</td>
                <td>{resultado.EstadoAlumno}</td>
                <td>{resultado.NombreEscuela}</td>
                <td><Link to={`/ResultadosCalificaciones/detalle/${resultado.vchClvMateria}`}>Detalle de Calificación</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
}

export default ResultadosCalificacioness;
