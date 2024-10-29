// MateriasAlumno.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MateriasAlumno from './MateriasAlumno';
import { useAuth } from '../../server/authUser';
import '@testing-library/jest-dom';

// Mock del hook useAuth para simular datos de usuario
jest.mock('../../server/authUser', () => ({
  useAuth: jest.fn(),
}));
global.alert = jest.fn();


describe('MateriasAlumno Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      userData: { 
        vchMatricula: "20344567",
        dataEstudiante:
        {
            chrGrupo: "B", 
            intClvCarrera: 64, 
            intClvCuatrimestre: 3, 
            intPeriodo: 8,
            vchFotoPerfil: null,
            vchMatricula: "20344567",
            vchNomCarrera: "INGENIERÍA EN DESARROLLO Y GESTIÓN DE SOFTWARE ",
            vchNomCuatri: "3er. CUATRIMESTRE",
            vchPeriodo: "20243",
        }
    }, // Ajusta con el valor de prueba de matrícula necesario
    });
  });

  test('Renderiza el estado de carga inicial correctamente', () => {
    render(<MateriasAlumno />);

    // Verificar que los CardSkeleton se rendericen mientras `isLoading` es `true`
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  test('Muestra las materias cuando la carga es exitosa', async () => {
    render(<MateriasAlumno />);
    
    // Espera que el elemento con la clave "INF137" esté en el documento
    const materiaElemento = await screen.findByText(/INF137/);
    expect(materiaElemento).toHaveTextContent('INF137');
  });

  test('Muestra mensaje de error cuando ocurre un error en la carga', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('API no disponible')));

    render(<MateriasAlumno />);

    // Verificar que el mensaje de error se muestra
    await waitFor(() => {
      expect(screen.getByText(/No hay clases agregadas./i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('Muestra el mensaje "No hay clases agregadas" cuando no hay materias', async () => {
    render(<MateriasAlumno />);

    // Esperar a que el mensaje de "No hay clases agregadas" se muestre si la respuesta es vacía
    await waitFor(() => {
      expect(screen.getByText(/No hay clases agregadas/i)).toBeInTheDocument();
    });
  });
});
