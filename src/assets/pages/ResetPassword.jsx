

import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiInformationCircle } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Alert, Card } from 'flowbite-react';
import  Components from '../components/Components'
const { CustomInputPassword, CustomRepeatPassword, LoadingButton, TitlePage, InfoAlert} = Components;

const PasswordValidationItem = ({ isValid, text }) => (
  <li className="flex items-center mb-1">
    {isValid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
    {text}
  </li>
);

const ResetPassword = () => {
  const { matricula, token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverResponse, setServerResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  const validationItems = [
    { key: 'length', text: 'Mínimo 8 caracteres' },
    { key: 'lowercase', text: 'Al menos una letra minúscula' },
    { key: 'uppercase', text: 'Al menos una letra mayúscula' },
    { key: 'digit', text: 'Al menos un dígito' },
    { key: 'specialChar', text: 'Al menos 1 caracter especial' },
    { key: 'noSpace', text: 'No espacios en blanco' },
  ];

  const getPasswordValidationIcon = (key) => {
    const password = watch('password');

    switch (key) {
      case 'length':
        return password && password.length >= 8;
      case 'lowercase':
        return password && /(?=.*[a-z])/.test(password);
      case 'uppercase':
        return password && /(?=.*[A-Z])/.test(password);
      case 'digit':
        return password && /(?=.*\d)/.test(password);
      case 'specialChar':
        return password && /(?=.*[!@#$%^&*()_+{}|:;<>,.?/~`])/.test(password);
      case 'noSpace':
        return !/\s/.test(watch('password'));
      default:
        return false;
    }
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}restablecer-contrasena.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula,
          token,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (result.done) {
        setServerResponse(result.message);
      } else {
        setServerResponse(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setServerResponse('Error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 space-y-6 bg-white rounded-md shadow-lg">

        <InfoAlert
            message={serverResponse}
            type={serverResponse.includes('éxito') ? 'success' : 'error'}
            isVisible={!!serverResponse}
            onClose={() => {
              setServerResponse('');
            }}
        />
          
        <TitlePage label={"Restablecer Contraseña"}/>
        <p className="text-sm text-gray-600">
          Para restablecer tu contraseña, sigue estos pasos y asegúrate de que la nueva contraseña cumpla con todos los requisitos de seguridad:
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5 relative">
            <CustomInputPassword
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              errors={errors}
              register={register}
              trigger={trigger}
              pattern={/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?/~`]).{8,15}$/}
              errorMessage="La contraseña no cumple con el nivel de seguridad especificado."
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-4 flex items-center"            
            >
              {showPassword ? 
              (
                <FaEyeSlash className="text-gray-500" />
              ) 
              : 
              (
                <FaEye className="text-gray-500" />
              )
              }
            </button>
          </div>

          <CustomRepeatPassword
            type={showPassword ? 'text' : 'password'}
            label="Repetir contraseña"
            name="passwordRepeat"
            errors={errors}
            register={register}
            trigger={trigger}
            watch={watch}
            errorMessage="Las contraseñas no coinciden."
          />
          
          <Card href="#" className={ errors.password  ? 'mb-4' : 'hidden'}>
            <label htmlFor="" className='text-xs text-black-500 dark:text-gray-400 mt-3'>Tu contraseña debe tener:</label>
            <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {validationItems.map(({ key, text }) => (
                <PasswordValidationItem
                  key={key}
                  isValid={getPasswordValidationIcon(key)}
                  text={text}
                />
              ))}
            </ul>
          </Card>

          <LoadingButton
            isLoading={isLoading}
            loadingLabel="Restableciendo..."
            normalLabel="Restablecer Contraseña"
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
