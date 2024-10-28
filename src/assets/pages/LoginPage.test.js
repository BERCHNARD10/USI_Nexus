// src/assets/pages/LoginPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../server/authUser';

// Mock del hook useAuth
jest.mock('../server/authUser', () => ({
  useAuth: jest.fn(),
}));

// Mock del navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage Component', () => {
  const loginMock = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      login: loginMock,
    });
    jest.clearAllMocks();
  });

  test('renderiza correctamente el formulario de inicio de sesión', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Verificar que los campos del formulario están presentes
    expect(screen.getByLabelText(/Matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });


  /*test('muestra error cuando se envía el formulario vacío', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    // Simular el clic en el botón de envío usando getByTestId
    const submitButton = screen.getByTestId('loading-button');
    
    // Envolver en `act` para manejar cambios asíncronos
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    // Esperar a que los errores de validación se muestren
    await waitFor(() => {
      // Verificar que el texto "Oh, snapp!" está presente
      expect(screen.getByText(/Oh, snapp!/i)).toBeInTheDocument();
  
      // Verificar que el texto "Este campo es requerido" está presente
      expect(screen.getByText(/Este campo es requerido/i)).toBeInTheDocument();
    });
  });*/

  test('Mapea correctamente los datos de las materias', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    // Verificar que inicialmente la contraseña está oculta
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  
    // Seleccionar el botón para alternar la visibilidad de la contraseña
    const toggleButton = screen.getByTestId('toggle-password-visibility');
  
    // Simular el clic en el botón para mostrar la contraseña
    fireEvent.click(toggleButton);
  
    // Verificar que la contraseña ahora esté visible
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
  

  test('', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    // Simular la entrada de datos válidos
    fireEvent.change(screen.getByLabelText(/Matrícula/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
  
    // Mockear respuesta de éxito del servidor
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ done: true, userData: { JWTUser: 'mockedToken' } }),
      })
    );
  
    // Simular el clic en el botón de "Iniciar Sesión" usando el data-testid
    const submitButton = screen.getByTestId('loading-button');
    fireEvent.click(submitButton);
  
    // Esperar a que la función login sea llamada
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledTimes(1);
    });
  
    // Verificar que se llamó a la función navigate
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  
  
  test('muestra mensaje de error del servidor si el inicio de sesión falla', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Simular datos válidos
    fireEvent.change(screen.getByLabelText(/Matrícula/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });

    // Mockear respuesta de error del servidor
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ done: false, message: 'Error en el servidor' }),
      })
    );

    // Simular el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    // Esperar a que el mensaje de error aparezca
    await waitFor(() => {
      expect(screen.getByText(/Error en el servidor/i)).toBeInTheDocument();
    });
  });
});
