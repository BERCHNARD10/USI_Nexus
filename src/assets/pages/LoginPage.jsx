import React, { useState, useEffect  } from 'react';
import { useNavigate, Link  } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Checkbox, Label } from 'flowbite-react';
import Components from '../components/Components';
import { useAuth } from '../server/authUser'; 

const { TitlePage, Paragraphs, LoadingButton, CustomInput, CustomInputPassword, InfoAlert } = Components;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloquearBoton, setBloquearBoton] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}loginUser.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, matriculaAlum: data.matriculaAlum.toString() }),
      });

      const result = await response.json();
      console.log("Resultado del login", result);
      if (result.done) {
        login(result.userData.JWTUser, result.userData);
        navigate('/');
      } else {
        handleFailedLogin();
        setServerErrorMessage(result.message || 'Error en el servidor.');
      }
    } catch (error) {
      console.error('Error 500', error);
      alert('Error 500: Ocurrió un problema en el servidor. Intenta nuevamente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailedLogin = () => {
    setIntentosFallidos((prev) => prev + 1);
  };


  useEffect(() => {
    // Cargar el tiempo de bloqueo desde localStorage al cargar la página
    const bloqueoTiempo = localStorage.getItem('bloqueoTiempo');
    if (bloqueoTiempo) {
      const tiempoRestante = Math.floor((bloqueoTiempo - Date.now()) / 1000);
      if (tiempoRestante > 0) {
        setBloquearBoton(true);
        setSegundosRestantes(tiempoRestante);

        const interval = setInterval(() => {
          setSegundosRestantes((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setBloquearBoton(false);
              setIntentosFallidos(0);
              localStorage.removeItem('bloqueoTiempo');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('bloqueoTiempo');
      }
    }
  }, []);

  useEffect(() => {
    if (intentosFallidos >= 3) {
      alert('El login ha sido suspendido por 30 segundos');
      setBloquearBoton(true);
      const tiempoDesbloqueo = Date.now() + 30000;
      localStorage.setItem('bloqueoTiempo', tiempoDesbloqueo);
      setSegundosRestantes(30);

      const interval = setInterval(() => {
        setSegundosRestantes((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setBloquearBoton(false);
            setIntentosFallidos(0);
            localStorage.removeItem('bloqueoTiempo');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [intentosFallidos]);

  const onSubmit = (data, event) => {
    event.preventDefault();
    handleLogin(data);
  };

  return (
    <div>
      <InfoAlert
        message={serverErrorMessage}
        type="error"
        isVisible={!!serverErrorMessage}
        onClose={() => setServerErrorMessage('')}
      />

      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gradient-to-r flex items-center justify-center">
          <img 
            className="w-full h-auto lg:h-full object-cover object-center" 
            src={`${import.meta.env.VITE_URL}assets/uthhPanel-Cz40pBIq.png`}
            alt="illustration" 
          />
        </div>
        <div className="lg:w-1/2 bg-white p-8 flex-col flex items-center justify-center">
          <img className="w-20 mb-4" 
              src={`${import.meta.env.VITE_URL}assets/secondary-logo-BL9o4fsR.png`}
              alt="logo" 
          />
          <TitlePage label={"Bienvenido de vuelta"} />
          <Paragraphs label={"Empieza donde lo dejaste, inicia sesión para continuar."} />

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#009944' }}></h1>
          <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              label="Matrícula"
              name="matriculaAlum"
              pattern={/^\d+$/}
              errorMessage="Solo números y sin espacios"
              errors={errors}
              register={register}
              trigger={trigger}
            />
            <div className="mb-6 relative">
              <CustomInputPassword
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                name="password"
                errorMessage="No cumples con el patrón de contraseña"
                errors={errors}
                register={register}
                trigger={trigger}
              />
              <button
                type="button"
                data-testid="toggle-password-visibility"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-4 flex items-center"
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>

            <LoadingButton
              data-testid="loading-button"
              isLoading={isLoading}
              loadingLabel="Cargando..."
              normalLabel={bloquearBoton ? `Bloqueado (${segundosRestantes}s)` : 'Iniciar Sesión'}
              disabled={bloquearBoton}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/*<Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-600">Acuérdate de mí</label>*/}
              </div>
              <Link to="/recuperar-contrasena" 
                className="text-sm font-medium text-gray-900 dark:text-white"
              >¿Olvidaste tu contraseña? 
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
