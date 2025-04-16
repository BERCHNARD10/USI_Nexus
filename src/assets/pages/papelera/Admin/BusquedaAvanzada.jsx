import React, { useState, useEffect } from 'react';

const BusquedaAvanzada = () => {
  const [carreras, setCarreras] = useState([]);
  const [cuatrimestres, setCuatrimestres] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
  const [cuatrimestreSeleccionado, setCuatrimestreSeleccionado] = useState('');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [resultados, setResultados] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para cargar las carreras
  const cargarCarreras = async () => {
    try {
      // Hacer solicitud para obtener las carreras
      const response = await fetch(`${apiUrl}obtenerCarreras.php`);
  
      if (!response.ok) {
        throw new Error('Error al obtener las carreras');
      }
  
      const data = await response.json();
  
      // Actualizar el estado de las carreras con los datos recibidos
      setCarreras(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  

// Función para cargar los cuatrimestres
const cargarCuatrimestres = async () => {
    if (carreraSeleccionada) {
      try {
        const response = await fetch(`${apiUrl}obtenerCuatrimestres.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idCarrera: carreraSeleccionada }),
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los cuatrimestres');
        }
  
        const data = await response.json();
        
        // Verificar si hay datos antes de actualizar el estado
        if (data && data.data) {
          setCuatrimestres(data.data);
        } else {
          // Manejar el caso donde no hay datos (puedes mostrar un mensaje o hacer algo más)
          console.warn('No se encontraron cuatrimestres.');
        }
      } catch (error) {
        console.error(error);
      }
    }
};

  

// Función para cargar los grupos
const cargarGrupos = async () => {
    if (cuatrimestreSeleccionado) {
      try {
        const response = await fetch(`${apiUrl}obtenerGrupos.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idCuatrimestre: cuatrimestreSeleccionado }),
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los grupos');
        }
  
        const data = await response.json();
        // Actualizar el estado de los grupos con los datos recibidos
        setGrupos(data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const cargarResultados = async () => {
    if (grupoSeleccionado) {
      try {
        const response = await fetch(`${apiUrl}buscarCalificaciones.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idGrupo: grupoSeleccionado }),
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los resultados');
        }
  
        const data = await response.json();
        setResultados(data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  useEffect(() => {
    cargarCarreras();
  }, []);

  useEffect(() => {
    cargarCuatrimestres();
  }, [carreraSeleccionada]);

  useEffect(() => {
    cargarGrupos();
  }, [cuatrimestreSeleccionado]);

  useEffect(() => {
    cargarResultados();
  }, [grupoSeleccionado]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Resultados de Calificaciones</h1>

      <div className="mb-3">
        <label htmlFor="carrera">Carrera:</label>
        <select
          id="carrera"
          value={carreraSeleccionada}
          onChange={(e) => setCarreraSeleccionada(e.target.value)}
        >
          <option value="">Seleccionar Carrera</option>
          {carreras.map((carrera) => (
            <option key={carrera.intClvCarrera} value={carrera.intClvCarrera}>
              {carrera.vchNomCarrera}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="cuatrimestre">Cuatrimestre:</label>
        <select
          id="cuatrimestre"
          value={cuatrimestreSeleccionado}
          onChange={(e) => setCuatrimestreSeleccionado(e.target.value)}
        >
          <option value="">Seleccionar Cuatrimestre</option>
          {cuatrimestres.map((cuatrimestre) => (
            <option key={cuatrimestre.intClvCuatrimestre} value={cuatrimestre.intClvCuatrimestre}>
              {cuatrimestre.vchNomCuatri}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
  <label htmlFor="grupo">Grupo:</label>
  <select
    id="grupo"
    value={grupoSeleccionado}
    onChange={(e) => setGrupoSeleccionado(e.target.value)}
  >
    <option value="">Seleccionar Grupo</option>
    {grupos.map((grupo) => (
      <option key={grupo.chrGrupo} value={grupo.chrGrupo}>
        {grupo.chrGrupo}
      </option>
    ))}
  </select>
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
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado) => (
              <tr key={resultado.intClvCalificaciones}>
                <td>{resultado.vchNombre}</td>
                <td>{resultado.vchMatricula}</td>
                <td>{resultado.vchClvMateria}</td>
                <td>{resultado.vchPeriodo}</td>
                <td>{resultado.intPar1}</td>
                <td>{resultado.intPar2}</td>
                <td>{resultado.intPar3}</td>
                <td>{resultado.intPromFinal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default BusquedaAvanzada;