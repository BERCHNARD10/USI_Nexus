import React, { useState } from 'react';
import { Label } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { Button, Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import Components from '../components/Components';
const { CustomInput, LoadingButton, TitlePage, InfoAlert } = Components;
import { useNavigate } from 'react-router-dom';

const EmailForm = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/correo.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({           
          correo: data.correo,
        }),
      });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
          const text = await response.text();
          console.error("Respuesta de error del servidor:", text); // Aquí puedes ver si el servidor envió HTML
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

      const result = await response.json();
      console.log("RESULTADO DEL SERVIDOR" ,result);
      
      if (result.done) {
        setServerError(`Solicitud de recuperación de contraseña enviada con éxito. ${result.message}`);
        setEmailSent(true);
      } else {
        setServerError(`Error: ${result.message}`);
        if (result.debug_info) {
          console.error('Información de depuración:', result.debug_info);
        }
        if (result.errors) {
          result.errors.forEach(error => {
            console.error('Error específico:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError('Error en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      {!emailSent ? (
        <section className="">
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <InfoAlert
              message={serverError}
              type="error"
              isVisible={!!serverError}
              onClose={() => {
                setServerError('');
              }}
            />
            <div className="w-full max-w-md">
              <TitlePage label={"Recuperar Contraseña"}/>
              <p className="text-sm text-gray-600 mb-4">
                Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>
            <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                label="Correo Electrónico"
                name="correo"
                pattern={/^\S+@\S+\.\S+$/}  // Regex para un correo electrónico general
                errorMessage="El correo electrónico no es válido"
                errors={errors}
                register={register}
                trigger={trigger}
              />
              <LoadingButton
                isLoading={isLoading}
                loadingLabel="Enviando..."
                normalLabel="Enviar Correo de Recuperación"
              />
            </form>
          </div>
        </section>
      ) : (
        <section className="md:min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <Alert className="flex items-center justify-center" color="success" icon={HiInformationCircle}>
              <span className="font-medium">Correo Enviado!</span> Hemos enviado un enlace de recuperación a tu correo electrónico.
            </Alert>
          </div>
        </section>
      )}
    </div>
  );
};

export default EmailForm;
