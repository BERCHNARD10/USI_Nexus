import React, { useState, useEffect  } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Label, TextInput, Button, Select, Modal, Tooltip } from "flowbite-react"; // Importamos el componente Button
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaWifi } from "react-icons/fa"; // Importa íconos de react-icons
import { AiOutlineClose } from 'react-icons/ai';
import { BsCircleFill } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const ActivitiesSkeleton = () => {
    return (
      <div className="space-y-6">
        {/* Título Principal */}
        <div>
          <Skeleton width="50%" height={30} style={{ marginBottom: '10px' }} />
        </div>
  
        {/* Contenedor de Tabs - Tab de Actividades */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow space-y-6">
          {/* Parcial y Botón de Excel */}
          {Array.from({ length: 1 }).map((_, parcialIndex) => (
            <div key={parcialIndex} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Skeleton width="20%" height={20} />
                <Skeleton width="30%" height={35} />
              </div>
  
              {/* Acordeón de Actividades */}
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, activityIndex) => (
                  <div key={activityIndex} className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-3">
                    <Skeleton width="70%" height={20} />
                    <Skeleton width="90%" height={15} />
                    <Skeleton width="20%" height={15} />
                    <Skeleton width="25%" height={15} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

const DetailedActivitySkeleton = () => {
    return (
      <section className="w-full flex flex-col space-y-6">
        {/* Título y Botón de Descarga */}
        <div className="flex justify-between items-center">
          <Skeleton width="60%" height={30} />
          <Skeleton width={180} height={40} />
        </div>
        
        {/* Descripción */}
        <Skeleton count={3} height={20} width="80%" />
  
        {/* Sección de Subir Rúbricas y Detalles */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="md:w-1/2 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <Skeleton height={30} width="50%" />
            <Skeleton height={40} width="100%" style={{ marginTop: '10px' }} />
          </div>
          <div className="md:w-1/2 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <Skeleton height={150} width="100%" />
          </div>
        </div>
  
        {/* Tarjetas de Prácticas */}
        <div>
          <Skeleton width={100} height={30} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <Skeleton width="60%" height={20} />
                <Skeleton width="80%" height={15} style={{ marginTop: '5px' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const DetailedPracticeSkeleton = () => {
    return (
        <div className="space-y-6">
        {/* Título de la Práctica y Descripción (directamente sobre fondo gris) */}
        <div>
          <Skeleton width="40%" height={30} style={{ marginBottom: '10px' }} />
          <Skeleton width="60%" height={20} style={{ marginBottom: '5px' }} />
        </div>
        
        {/* Instrucciones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          {/* Título de Instrucciones */}
          <Skeleton width="30%" height={25} style={{ marginBottom: '10px' }} />
          {/* Texto de Instrucciones */}
          <div className="space-y-2">
            <Skeleton width="100%" height={15} />
            <Skeleton width="90%" height={15} />
            <Skeleton width="95%" height={15} />
          </div>
        </div>
        
        {/* Rúbrica de Evaluación */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow space-y-4">
          {/* Título de Rúbrica y Botón de Edición */}
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
            <Skeleton width="40%" height={25} />
            <Skeleton circle width={25} height={25} />
          </div>
  
          {/* Rubros */}
          {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-b border-gray-300 dark:border-gray-600 py-3 mb-2">
            <div className="flex justify-between items-center">
              <div className="flex-1 pr-2">
                <Skeleton width="90%" height={15} style={{ marginBottom: '5px' }} />
                <Skeleton width="75%" height={15} />
              </div>
              <Skeleton width={30} height={20} />
            </div>
          </div>
        ))}
  
          {/* Puntaje Total */}
          <div className="flex justify-between items-center mt-4">
            <Skeleton width="30%" height={20} />
            <Skeleton width="20%" height={20} />
          </div>
        </div>
      </div>
    );
  };
  
  const RubricaSkeletonLoader = ({ count = 3 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <div key={index} className="py-4 border-b border-gray-300 dark:border-gray-700">
                    <div className="grid grid-cols-10 gap-4 items-center">
                        <div className="col-span-7">
                            <Skeleton height={20} width="80%" />
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-2">
                            <Skeleton height={30} width="50px" />
                            <Skeleton width="20px" />
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Skeleton width={120} height={24} />
                    <Skeleton width={50} height={24} />
                    <Skeleton width={50} height={24} />
                </div>
                <Skeleton width={110} height={40} borderRadius="0.5rem" />
            </div>
        </>
    );
};


const TitlePage = ({ label }) => 
{   
    return (
        <h1 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">{label}</h1>
    )
}

const TitleSection = ({className, label }) => 
{   
    return (
        <h3 className={`mb-2 text-base font-bold text-gray-900 dark:text-white   ${className}`}>{label}</h3>
    )
}

const ContentTitle = ({ label }) => 
{   
    return (
        <h5 className="mb-D2 text-sm font-medium text-gray-900 dark:text-white">{label}</h5>
    )
}

const Paragraphs = ({className, label }) => 
{   
    return (
        <p className={`${className} mb-3 text-gray-500 dark:text-gray-400`}>
        {label}
        </p>
    )
}

const OfflineAlert =()=>{
    const handleReload = () => {
        window.location.reload();
      };
    
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 text-center">
        <FaWifi className="text-7xl text-gray-500 mb-6" />
        <p className="text-lg text-gray-400 mb-6">No tienes conexión a internet. Verifica tu conexión y recarga la página.</p>
        <button
          onClick={handleReload}
          className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
        >
          Recargar Página
        </button>
      </div>
      );
}

const DescriptionActivity = ({ label = "" }) => {
    const lines = label.split('\n');
    return (
        <div className='mb-3 text-gray-500 dark:text-gray-400'>
            {lines.map((line, index) => {
                if (line.startsWith('•')) 
                {
                    return <p key={index} className="mt-1 ml-5">{line}</p>;
                } 
                else if (line.startsWith('-')) 
                {
                    return <p key={index} className="ml-10">{line}</p>;
                } 
                else 
                {
                    return <p key={index}>{line}</p>;
                }
            })}
        </div>
    );
};

const CardSkeleton = () => {
    return (
        <div data-testid="skeleton" className="w-full rounded-lg overflow-hidden shadow-lg">
            <Skeleton height={160} /> {/* Placeholder principal */}
            <div className="pt-5 pb-6 px-4 flex justify-center items-center h-full">
                <Skeleton height={30} width="60%" /> {/* Placeholder del título */}
            </div>
        </div>
    );
};

const Link = ({ to, children }) => {
    return (
        <RouterLink 
            to={to}
            className="text-primary hover:text-secondary transition-colors duration-300"
        >
            {children}
        </RouterLink>
    );
};


const IconButton = ({ message, className = '', Icon, ...rest }) => {
    return (
        <Tooltip content={message} className="block md:hidden">
            <Button
                theme={{
                    color: {
                        primary: "bg-primary hover:bg-secondary",
                        gray: "bg-purple-500 hover:bg-gray-800",
                    },
                }}
                type="submit"
                color="primary"
                className={`
                    bg-primary hover:bg-secondary text-white 
                    rounded-full md:rounded-md  // Redondeado en móviles, bordes normales en pantallas grandes
                    p-2 md:px-2 md:py-2         // Ajusta el padding para pantallas pequeñas y grandes
                    text-sm md:text-base        // Tamaño de texto ajustado para pantallas pequeñas
                    w-12 h-12 md:w-auto md:h-auto // Botón cuadrado en móviles y de tamaño automático en pantallas grandes
                    flex items-center justify-center // Centrar contenido
                    ${className} 
                `}
                {...rest}
                variant="outlined"
            >
                {Icon && <Icon className="text-lg mr-1" />} {/* Tamaño del icono */}
                <span className="hidden md:inline"> {/* Texto oculto en móviles y visible en pantallas medianas y grandes */}
                    {message}
                </span>
            </Button>
        </Tooltip>
    );
};



const LoadingButton = ({ isLoading, normalLabel, loadingLabel, Icon, className, ...rest }) => {
    return (
        <Button
            theme={{
                color: {
                    gray: "bg-purple-500 hover:bg-gray-800",
                },
            }}
            type="submit"
            color="primary" // Esto aplica el color base
            className={`bg-primary hover:bg-secondary w-full text-white rounded-md flex items-center justify-center p-2 md:px-2 md:py-2 ${className}`} // Agregar la clase className aquí
            disabled={isLoading}
            {...rest}
        >
            {isLoading ? (
                <>
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                        />
                    </svg>
                    {loadingLabel}
                </>
            ) : (
                <>
                    {Icon && <Icon className="mr-2" />} {/* Agrega el ícono aquí si está presente */}
                    {normalLabel}
                </>
            )}
        </Button>
    );
};

const FloatingLabelInput = ({
    id,
    label,
    value,
    onChange,
    placeholder = '',
    className = '',
    type = 'text', // Puedes especificar el tipo de input como 'text' por defecto
    ...props
}) => {
    return (
        <div className={`relative ${className}`}>
            <input
                type={type}
                id={id}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                {...props}
            />
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
                {label}
            </label>
        </div>
    );
};


const CustomInput = ({className, label, value, name, errors, register, trigger, errorMessage, pattern, style, readOnly}) => 
{
    const [inputError, setInputError] = useState(false);

    return (
        <div className={`${className} mb-5 relative`}>
            <div className="relative">
                <input
                type='text'
                id={name}
                value={value}
                style={style}
                aria-describedby={`${name}_help`}
                readOnly= {readOnly}
                
                className=
                {`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer 
                    ${
                        errors[name]
                        ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                        : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                    } peer`
                }
                placeholder=" "
                {...register(name, { required: true, pattern: pattern})}
                onBlur={() => trigger(name).then((isValid) => setInputError(!isValid))}
                onKeyUp={() => setInputError(false)}
                />
                <label
                htmlFor={name}
                className={`absolute text-sm 
                ${
                    errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                } 
                duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
                ${
                    errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                } 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                {label}
                </label>
            </div>
            {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    <span className="font-medium">Oh, snapp!</span>{' '}
                    {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
        </div>
    );
};
/*
const CustomInput = ({ label, value, name, errors, register, trigger, errorMessage, pattern, onChange }) => {
    const [inputError, setInputError] = useState(false);

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                    type='text'
                    id={name}
                    value={value}
                    aria-describedby={`${name}_help`}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer 
                        ${
                            errors[name]
                            ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                            : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                        } peer`}
                    placeholder=" "
                    {...register(name, { required: true, pattern: pattern })}
                    onBlur={() => trigger(name).then((isValid) => setInputError(!isValid))}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    onKeyUp={() => setInputError(false)}
                />
                <label
                    htmlFor={name}
                    className={`absolute text-sm 
                    ${
                        errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                    } 
                    duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
                    ${
                        errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                    } 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                    {label}
                </label>
            </div>
            {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span className="font-medium">Oh, snapp!</span>{' '}
                        {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
        </div>
    );
};*/

const CustomInputOnchange = ({ label, value, type, name, onChange, errors, register, trigger, errorMessage, pattern }) => {
    const [inputError, setInputError] = useState(false);

    const handleBlur = async () => {
        // Valida el campo cuando el usuario sale del campo
        const isValid = await trigger(name);
        setInputError(!isValid);
    };

    const handleChange = (e) => {
        onChange(e.target.value);
        // Puedes agregar aquí una validación rápida si es necesario

    };

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                    type={type}
                    id={name}
                    value={value}
                    aria-describedby={`${name}_help`}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer 
                        ${errors[name]
                        ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                        : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'} peer`}
                    placeholder=" "
                    {...register(name, { required: true, pattern })}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyUp={() => setInputError(false)}
                />
                <label
                    htmlFor={name}
                    className={`absolute text-sm 
                        ${errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} 
                        duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
                        ${errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'} 
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                    {label}
                </label>
            </div>
            {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span className="font-medium">Oh, snapp!</span>{' '}
                        {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
        </div>
    );
};

const CustomInputPassword = ({ label, name, errors, register, trigger, pattern, errorMessage, onBlur, onKeyUp, type }) => 
{
    const [inputError, setInputError] = useState(false);

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                type={type || 'text'}
                id={name}
                aria-describedby={`${name}_help`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    errors[name]
                    ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                    : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                } peer`}
                placeholder=" "
                {...register(name, { required: true, pattern })}
                onBlur={(e) => trigger(name).then((isValid) => {setInputError(!isValid); onBlur && onBlur(e);})}
                onKeyUp={(e) =>trigger(name).then((isValid) => {setInputError(!isValid); onBlur && onBlur(e);})}
                />
                <label
                htmlFor={name}
                className={`absolute text-sm ${
                    errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 ${
                    errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                {label}
                </label>
            </div>
            {inputError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                <span className="font-medium">Oh, snapp!</span>{' '}
                {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                </p>
            )}
        </div>
    );
};

const CustomRepeatPassword = ({ label, name, errors, register, trigger, watch, type }) => 
{

    return (
        <div className="mb-5 relative">
            <div className="relative">
                <input
                type={type || 'text'}
                id={name}
                aria-describedby={`${name}_help`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    errors[name]
                    ? 'dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:border-red-600'
                    : 'dark:text-gray-500 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600'
                } peer`}
                placeholder=" "
                {...register(name, {
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                })}                
                onBlur={() => trigger(name)}
                onKeyUp={() => trigger(name)}
                />
                <label
                htmlFor={name}
                className={`absolute text-sm ${
                    errors[name] ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
                } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 ${
                    errors[name] ? 'peer-focus:text-red-600' : 'peer-focus:text-gray-500'
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                >
                {label}
                </label>
            </div>
            {errors.passwordRepeat && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            <span className="font-medium">Oh, snapp!</span> {errors.passwordRepeat.message}
                        </p>
                        )}
        </div>
    );
};


const SelectInput =  ({ id, label, labelSelect, name, option, options, errors, register, trigger, errorMessage, pattern, value, ...rest })=>
{
    const [inputError, setInputError] = useState(false);

    return(

    <div className="max-w-md">
        <div className="mb-2 block">
            <Label htmlFor={id} value={label} />
        </div>
        <Select id={id} required 
            {...register(name, { required: true, pattern: pattern})}
            onBlur={() => trigger(name).then((isValid) => setInputError(!isValid))}
            {...rest}
        >
        <option defaultChecked value="0">{labelSelect} </option>
        {options && options.map((option) => (
            <option key={option[id]} value={option[id]}>
                {option[value]} 
            </option>
        ))}
        </Select>
        {
                inputError && 
                (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    <span className="font-medium">Oh, snapp!</span>{' '}
                    {errors[name]?.type === 'required' ? 'Este campo es requerido' : errorMessage}
                    </p>
                )
            }
    </div>
    );
};

const ConfirmDeleteModal = ({ open, onClose, onConfirm, message }) => {
    return (
        <Modal className='h-0 mt-auto' show={open} size="md" onClose={onClose} popup>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                <span dangerouslySetInnerHTML={{ __html: message }} />
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={onConfirm}>
                                    Sí, estoy seguro
                                </Button>
                                <Button color="gray" onClick={onClose}>
                                    No, cancelar
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            </div>
        </Modal>
    );
};

const ContentModal = ({ open, onClose, onConfirm, message, children }) => {
    return (
        <Modal className='h-0 mt-auto' show={open} size="4xl" onClose={onClose} popup>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
                    <Modal.Header>     
                        {message && (
                            <span dangerouslySetInnerHTML={{ __html: message }} />
                        )}
                    </Modal.Header>
                    <Modal.Body className='sm:max-h-60 h-96'>
                        {/* Renderizar contenido dinámico */}
                        {children && <div>{children}</div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-center gap-4 mt-5">
                            <Button color="failure" onClick={onConfirm}>
                                Sí, estoy seguro
                            </Button>
                            <Button color="gray" onClick={onClose}>
                                    No, cancelar
                            </Button>
                        </div>
                    </Modal.Footer>
                </div>
            </div>
        </Modal>
    );
};

const InfoAlert = ({ message, type, isVisible, onClose, hasDuration = true }) => {
    const [timer, setTimer] = useState(null);
    const [isPaused, setIsPaused] = useState(false); // Controla el estado de pausa de la barra de progreso

    useEffect(() => {
        if (isVisible && (type !== "error" || hasDuration)) {
            const timeout  = setTimeout(() => {
                onClose();
            }, 2000);
            setTimer(timeout);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, type, hasDuration]);

    // Pausar el temporizador al pasar el mouse
    const handleMouseEnter = () => {
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setIsPaused(true); // Pausa la barra de progreso
    };

           // Reanudar el temporizador al salir del mouse
    const handleMouseLeave = () => {
        if (!timer && isVisible && (type !== "error" || hasDuration)) {
            const timeout = setTimeout(() => {
                onClose();
            }, 2000);
            setTimer(timeout);
        }
        setIsPaused(false); // Reanuda la barra de progreso
    };
    

    if (!isVisible) return null;

    // Estilos y colores según el tipo de alerta
    let bgColor, textColor, progressColor, Icon;
    switch (type) {
        case "success":
            bgColor = "bg-green-50 dark:bg-gray-800";
            textColor = "text-green-800 dark:text-green-400";
            progressColor = "bg-green-500";
            Icon = FaCheckCircle;
            break;
        case "error":
            bgColor = "bg-red-50 dark:bg-gray-800";
            textColor = "text-red-800 dark:text-red-400";
            progressColor = "bg-red-500";
            Icon = FaExclamationCircle;
            break;
        case "info":
        default:
            bgColor = "bg-blue-50 dark:bg-gray-800";
            textColor = "text-blue-800 dark:text-blue-400";
            progressColor = "bg-blue-500";
            Icon = FaInfoCircle;
            break;
    }

    return (
        <div
            id="alert-1"
            className={`flex items-center p-4 mb-4 rounded-lg shadow-lg alert-slide ${bgColor} ${textColor} myComponent`} // Esto equivale a md:max-w-lg
            role="alert"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Icon className="flex-shrink-0 w-4 h-4" aria-hidden="true" />
            <div className="ms-3 text-sm font-medium">{message}</div>
            <button
                type="button"
                className={`ms-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} rounded-lg focus:ring-2 p-1.5 hover:bg-opacity-75 inline-flex items-center justify-center h-8 w-8`}
                onClick={onClose}
                aria-label="Close"
            >
                <AiOutlineClose className="w-3 h-3" />
            </button>
            {hasDuration && (
                <div
                className={`progress-bar absolute bottom-0 left-0 h-1 ${progressColor} ${
                    isPaused ? "paused" : ""
                }`}
            ></div>
            )}
        </div>
    );
};

const LoadingOverlay = () => {
  
    return (
      <div className="loading-overlay">
        <div className="loading-balls">
          <BsCircleFill className="ball" />
          <BsCircleFill className="ball" />
          <BsCircleFill className="ball" />
        </div>
      </div>
    );
  };


export default {
    ActivitiesSkeleton,
    DetailedActivitySkeleton,
    DetailedPracticeSkeleton,
    ContentModal,
    TitlePage,  
    TitleSection, 
    ContentTitle, 
    CardSkeleton,
    Paragraphs, 
    DescriptionActivity,
    Link,
    IconButton,
    LoadingButton, 
    FloatingLabelInput,
    CustomInput, 
    CustomInputPassword, 
    CustomRepeatPassword,
    CustomInputOnchange,
    SelectInput,
    ConfirmDeleteModal,
    InfoAlert,
    OfflineAlert,
    LoadingOverlay,
    RubricaSkeletonLoader
};