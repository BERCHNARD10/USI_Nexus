import React, { useState, useEffect } from 'react';
import {Link , useParams } from 'react-router-dom';
import  Components from '../../components/Components'
const {DetailedActivitySkeleton, TitlePage, ContentTitle, Paragraphs, TitleSection, LoadingButton, SelectInput, FloatingLabelInput, ConfirmDeleteModal, InfoAlert, IconButton, DescriptionActivity, LoadingOverlay} = Components;
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';
import { FaRegFrown, FaEllipsisV, FaEdit, FaDownload, FaTrash } from 'react-icons/fa';
import { Pagination, Tooltip, Modal, Button  } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor

const DetalleActividadDocente = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const webUrl = import.meta.env.VITE_URL;
    const { vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, intIdActividadCurso } = useParams();
    const [actividad, setActividad] = useState([]);
    const [practicas, setPracticas] = useState([]);
    const [file, setFile] = useState(null);
    const {register, handleSubmit, trigger, formState: { errors }} = useForm();
    const [practicasCount, setPracticasCount] = useState(0);
    const [arregloPracticas, setArregloPracticas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [practiceToDelete, setPracticeToDelete] = useState(null);
    const [serverResponse, setServerResponse] = useState('');
    const [selectedPracticeForEdit, setSelectedPracticeForEdit] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPrat, setIsLoadingPract] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);


    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${apiUrl}accionesPracticas.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idPractica: practiceToDelete }), // Envía el ID de la práctica que quieres eliminar
            });
            const result = await response.json();
            if (result.done) 
            {
                setServerResponse(`Éxito: ${result.message}`);
                fetchActividad();
            } 
            else 
            {
                setServerResponse(`Error: ${result.message}`);
            }
        } 
        catch (error) 
        {
            console.error("Error:", error);
            alert("Error en la solicitud. Inténtalo de nuevo.");
        } 
        finally 
        {
            setOpenModalDelete(false);
        }
    };
    

    const toggleActionsMenu = (idPractica) => {
        if (isMenuOpen === idPractica) {
        // Si el mismo menú está abierto, ciérralo
        setIsMenuOpen(null);
        } else {
        // Abre el menú clickeado y cierra los demás
        setIsMenuOpen(idPractica);
        }
    };

    /*const fetchActividad = async () => 
    {
        const requestData = 
        {
            clvMateria: vchClvMateria,
            grupo: chrGrupo,
            periodo: intPeriodo,
            numeroActividad: intNumeroActi,
            numeroActividadCurso: intIdActividadCurso
        };
        console.log("datos", requestData);

        try 
        {
            const response = await fetch(`${apiUrl}cargarMaterias.php`, 
            {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("Respuesta", data);

            if (data.done) 
            {
            setActividad(data.message.detalleActividad);
            setPracticas(data.message.practicasActividad);
            }
            else{

                console.log(data);
            }
        } catch (error) {
            console.error('Error: Error al cargar los datos de la actividad');
        }
        finally{
            setIsLoading(false);
        }

    };*/

    const fetchActividad = async () => {
        setIsLoading(true); // Activa el indicador de carga al inicio
    
        const requestData = {
            clvMateria: vchClvMateria,
            grupo: chrGrupo,
            periodo: intPeriodo,
            numeroActividad: intNumeroActi,
            numeroActividadCurso: intIdActividadCurso
        };
        console.log("Datos enviados:", requestData);
    
        try {
            /*
            // Abrir el caché y buscar la respuesta en caché
            const cache = await caches.open('api-cache');
            const cachedResponse = await cache.match(`${apiUrl}cargarDetalleActividad.php`);
    
            // Si hay una respuesta en caché y el usuario está offline, usar los datos en caché
            if (cachedResponse && !navigator.onLine) {
                const data = await cachedResponse.json(); // Acceder a los datos del caché
                console.log('Cargando actividad desde la caché:', data);
                setActividad(data.message.detalleActividad);
                setPracticas(data.message.practicasActividad);
                return; // Terminar la función aquí si usamos el caché
            }*/
    
            // Realizar la solicitud a la API
            const response = await fetch(`${apiUrl}cargarMaterias.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
    
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
    
            // Clonar la respuesta antes de leer el JSON para poder guardarla en el caché
            //const responseClone = response.clone();
            const data = await response.json();
            console.log("Respuesta", data);
    
            if (data.done) {
                setActividad(data.message.detalleActividad);
                setPracticas(data.message.practicasActividad);
                console.log('Actividad cargada exitosamente desde la API.');
    
                //// Guardar la respuesta clonada en el caché para uso futuro
                //await cache.put(`${apiUrl}cargarDetalleActividad.php`, responseClone);
                //console.log('Respuesta de la API almacenada en caché.');
            } else {
                console.log('Error en la respuesta:', data);
            }
        } catch (error) {
            if (!navigator.onLine) {
                console.log('No tienes conexión a Internet. Intenta nuevamente más tarde.');
            } else {
                console.error('Error en la petición:', error);
                alert('Error: Ocurrió un problema en la comunicación con el servidor. Intenta nuevamente más tarde.');
            }
        } finally {
            setIsLoading(false); // Desactiva el indicador de carga al finalizar
        }
    };    
        
    useEffect(() => {
        fetchActividad();
    }, [ vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, intIdActividadCurso]);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        processFile(uploadedFile);
    };

    const processFile = (file) => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Leer prácticas y rúbrica
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const practicasData = jsonData[17].slice(12, 21); // M18 a U18
            const rubros = jsonData.slice(18, 24).map(row => row[4]); // E19 a E24
            const valores = jsonData.slice(18, 24).map(row => row[11]); // L19 a L24
            const datosPracticas = practicasData.map((nombre, index) => ({
                numero: index + 1,
                nombre: nombre
            }));

            const rubrica = rubros.map((rubro, index) => ({
                vchClaveCriterio: `C${index + 1}`,
                vchCriterio: `Criterio ${index + 1}`,
                vchDescripcion: rubro,
                intValor: valores[index]
            }));
            console.log("datos del excel", datosPracticas)

            resolve({ practicasServer:arregloPracticas, detalles: rubrica });
            } catch (error) {
            reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
        });
    };

    const sendDataToServer = async (data) => {
        try 
        {
            setIsLoadingPract(true);
            const response = await fetch(`${apiUrl}InsertarActividades.php`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log(data);

            const result = await response.json();
            console.log(result);

            if (result.done) 
            {
                fetchActividad();
                setServerResponse(`Éxito: ${result.message}`);
                if(file)
                {
                    setFile(null);
                    resetPracticas();
                }
            } 
            else 
            {
                setServerResponse(`Error: ${result.message}`);
            }
        } 
        catch (error) 
        {
            console.error('Error al enviar los datos', error);
        }
        finally
        {
            setIsLoadingPract(false);
        }
    };

    const handleAddData = async () => {
        if (!file) {
        alert("Por favor, sube un archivo primero.");
        return;
        }

        try {
        const data = await processFile(file);
        console.log("Practicas servidor: ", data);
        // Validar que los datos no estén vacíos y tengan descripción
        const allPracticasValid = data.practicasServer.every(practice =>
            practice.descripcion.trim() !== '' 
            // Añadir más validaciones si es necesario
        );

        if (!allPracticasValid) {
            setServerResponse(`Error: Por favor llena todos los campos obligatorios`);
            return;
        }
        await sendDataToServer(data);
        } catch (error) {
        console.error('Error al procesar el archivo', error);
        alert('Error al procesar el archivo.');
        }
    };
    // Ejemplo de uso
    const numPracticasInsert = Array.from({ length: 15 }, (_, index) => ({
        value: index + 1,
    }));

    const itemsPerPage = 1;

    // Calcular el total de páginas
    const totalPages = Math.ceil(arregloPracticas.length / itemsPerPage);

    const handleSelectChange = (e) => {
        const count = parseInt(e.target.value, 10);
        // Determina el índice de inicio basado en el número de prácticas existentes en la base de datos
        const startIndex = (practicas && practicas!=null) ? practicas.length + 1 : 1;

        setPracticasCount(count);
        const newPracticas = Array.from({ length: count }, (_, index) => ({
        fkActividadGlobal: intNumeroActi,
        fkActividadCurso: intIdActividadCurso,
        titulo: `Práctica ${startIndex + index}`,
        descripcion: '',
        instrucciones: ''
        }));
        setArregloPracticas(newPracticas);

        setCurrentPage(1); // Reiniciar a la primera página al cambiar el número de prácticas
    };

    /*const handleInputChange = (index, field, value) => {
        const newPracticas = [...arregloPracticas];
        newPracticas[index][field] = value;
        setArregloPracticas(newPracticas);
    };*/
    const handleInputChange = (index, field, value) => {
        const newPracticas = [...arregloPracticas];
        
        // Aplica la validación solo si el campo es "titulo"
        if (field === 'titulo') {
            // Verifica que el valor comience con "Práctica"
            if (value.toLowerCase().startsWith("práctica")) {
                newPracticas[index][field] = value;
            }
        } else {
            // Para otros campos, simplemente actualiza el valor
            newPracticas[index][field] = value;
        }
        
        setArregloPracticas(newPracticas);
    };
    
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const resetPracticas = () => {
        setArregloPracticas([]); // Reinicia el estado a un array vacío
    };
    
    // Obtener los elementos de la página actual
    const currentItems = arregloPracticas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEditClick = (practica) => {
        setSelectedPracticeForEdit(practica);
        console.log("dato",practica)

        console.log("datosPractica", selectedPracticeForEdit)
    };


    const handleInputChangePracticas = (field, value) => {
        setSelectedPracticeForEdit(prevState => {
            if (field === 'vchNombre') {
                const prefix = "Práctica ";
                // Si el valor editado no comienza con "Práctica", mantener el valor anterior
                if (!value.toLowerCase().startsWith(prefix.toLowerCase())) {
                    return prevState; // No hacer ningún cambio si no comienza con "Práctica"
                }
            }
            
            return {
                ...prevState,
                [field]: value
            };
        });
    };
    
    const handleSaveEdit = async () => {
        // Validar que todos los campos necesarios estén completos
        const {vchDescripcion} = selectedPracticeForEdit;

        if (!vchDescripcion.trim()) {
            setServerResponse(`Error: Por favor llena todos los campos obligatorios`);
            return;
        }
        try {
            const response = await fetch(`${apiUrl}accionesPracticas.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    practicaEdit: selectedPracticeForEdit
                }),
            });
    
            const result = await response.json();
            console.log(result);
            if (result.done) {
                setServerResponse(`Éxito: ${result.message}`);
                fetchActividad(); // Vuelve a cargar las prácticas
                setSelectedPracticeForEdit(null); // Cierra el modo de edición
            } else {
                setServerResponse(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error al actualizar la práctica", error);
            setServerResponse("Error al actualizar la práctica.");
        }
    };

      const handleDownload = async () => {
        const response = await fetch(`${webUrl}assets/archivos/Formato-de-Rubricas.xlsx`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });
    
        if (!response.ok) {
          throw new Error('Error al descargar el archivo');
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Formato-de-Rubricas.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      };

    if (isLoading) {
        return <DetailedActivitySkeleton />;
      }
    
    return (
        
        <section className='w-full flex flex-col'>
            {selectedPracticeForEdit && (
                <Modal
                    className='h-0 mt-auto pt-12'
                    show={openModalEdit}
                    size="4xl"
                    onClose={() => setOpenModalEdit(false)}
                    popup
                >
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="relative w-full mx-12 bg-white rounded-lg shadow-lg">
                            <Modal.Header>Editar Práctica</Modal.Header>
                            <Modal.Body className='sm:max-h-72 max-h-96'>
                                <div className="space-y-6 px-6 py-4">                                
                                    <FloatingLabelInput
                                        id="edit_titulo"
                                        label="Título (Obligatorio)"
                                        value={selectedPracticeForEdit.vchNombre || ''}
                                        onChange={(e) => handleInputChangePracticas('vchNombre', e.target.value)}
                                    />
                                    <FloatingLabelInput
                                        id="edit_descripcion"
                                        label="Descripción (Obligatorio)"
                                        value={selectedPracticeForEdit.vchDescripcion || ''}
                                        onChange={(e) => handleInputChangePracticas('vchDescripcion', e.target.value)}
                                    />
                                    
                                    <div className="my-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Instrucciones
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            value={selectedPracticeForEdit.vchInstrucciones|| ''}
                                            onChange={(value) => handleInputChangePracticas('vchInstrucciones', value)}
                                            placeholder={`Instrucciones (Opcional)`}
                                        />
                                    </div>
                                
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <LoadingButton
                                    className="w-36"
                                    isLoading={isLoading}
                                    loadingLabel="Cargando..."
                                    normalLabel="Guardar"
                                    onClick={handleSaveEdit}
                                    disabled={isLoading}
                                />
                                <Button
                                    color="gray"
                                    onClick={() => setOpenModalEdit(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300"
                                >
                                    No, cancelar
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </Modal>
            )}

            <InfoAlert
                message={serverResponse}
                type={serverResponse.includes('Éxito') ? 'success' : 'error'}
                isVisible={!!serverResponse}
                onClose={() => {
                setServerResponse('');
                }}
            />
            <ConfirmDeleteModal
                open={openModalDelete}
                onClose={() => setOpenModalDelete(false)}
                onConfirm={handleConfirmDelete}
                message="¿Estás seguro de que deseas eliminar a esta práctica?<br />También se eliminarán las calificaciones."
            />
            <div className="flex justify-between items-center">
                <TitlePage label={actividad.Nombre_Actividad} />
                <IconButton message="Descargar Formato de Rubricas" Icon={FaDownload}
                onClick={handleDownload}/>
            </div>
            <div className="m-3 flex flex-col">
                <DescriptionActivity label={actividad.Descripcion_Actividad}/>
            </div>

            <div className="flex flex-col md:flex-row">
                <div className='md:w-1/2 md:mr-4 flex flex-col gap-y-4 mb-3'>
                    <section className="h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                        <TitleSection label="Subir Rúbricas" />
                        <div className="w-full flex flex-col gap-4 p-4">
                            <div className="w-full">
                            <input
                                type="file"
                                accept=".xls, .xlsx" // Solo permite archivos .xls y .xlsx
                                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                                onChange={handleFileUpload}
                            />
                            </div>
                            {file && (
                            <>
                            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <SelectInput
                                    id="value"
                                    labelSelect="Seleccionar cuantas practicas deseas insertar:"
                                    label="Número de Prácticas"
                                    name="value"
                                    value="value"
                                    options={numPracticasInsert}
                                    errors={errors}
                                    register={register}
                                    trigger={trigger}
                                    onChange={handleSelectChange}
                                    pattern=""
                                    className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-4 md:gap-6 mt-4">
                                <ul className="space-y-4">
                                    {currentItems.map((practica, index) => {
                                    // Calcula el índice global para las prácticas
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                    return (
                                        <li key={globalIndex} className="space-y-4">
                                        <FloatingLabelInput
                                            id={`titulo_${globalIndex}`}
                                            label={`Título ${globalIndex} (Obligatorio)`}
                                            value={practica.titulo}
                                            onChange={(e) => handleInputChange(index + (currentPage - 1) * itemsPerPage, 'titulo', e.target.value)}
                                        />
                                        <FloatingLabelInput
                                            id={`descripcion_${globalIndex}`}
                                            label={`Descripción ${globalIndex} (Obligatorio)`}
                                            value={practica.descripcion}
                                            onChange={(e) => handleInputChange(index + (currentPage - 1) * itemsPerPage, 'descripcion', e.target.value)}
                                        />
                                        {/*
                                        <FloatingLabelInput
                                            id={`instrucciones_${globalIndex}`}
                                            label={`Instrucciones ${globalIndex} (Opcional)`}
                                            value={practica.instrucciones}
                                            onChange={(e) => handleInputChange(index + (currentPage - 1) * itemsPerPage, 'instrucciones', e.target.value)}
                                        />*/}
                                        <div className="my-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Instrucciones
                                            </label>
                                            <ReactQuill
                                                theme="snow"
                                                value={practica.instrucciones|| ''}
                                                onChange={(value) => handleInputChange(index + (currentPage - 1) * itemsPerPage, 'instrucciones', value)}
                                                placeholder={`Instrucciones ${globalIndex} (Opcional)`}
                                            />
                                        </div>
 
                                        </li>
                                    );
                                    })}
                                </ul>
                                {currentItems.length > 0 && (
                                    <>
                                    <Pagination
                                        currentPage={currentPage}
                                        layout="pagination"
                                        onPageChange={onPageChange}
                                        totalPages={totalPages}
                                        previousLabel="Anterior"
                                        nextLabel="Siguiente"
                                        showIcons={true}
                                    />
                                    </>
                                )}
                            </div>

                            {currentItems.length > 0 && (
                            <>
                            <div className="w-full flex justify-center md:justify-end mt-4">
                            <LoadingButton
                                className="w-full md:w-auto h-11"
                                loadingLabel="Cargando..."
                                normalLabel="Agregar"
                                onClick={handleAddData}
                                isLoading={isLoadingPrat}
                            />
                            </div>
                            </>
                            )}
                            </>
                            )}
                        </div>
                    </section>
                </div>
                <div className='md:w-1/2 flex flex-col gap-y-4'>
                    <section className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                    <TitleSection label="Detalles de la Actividad" />
                    <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400 mt-3">
                        <div>
                        <ContentTitle label="Fecha de Solicitud: " />
                        <Paragraphs label={actividad.Fecha_Solicitud} />
                        </div>
                        <div>
                        <ContentTitle label="Fecha de Entrega: " />
                        <Paragraphs label={actividad.Fecha_Entrega} />
                        </div>
                        <div>
                        <ContentTitle label="Valor de la Actividad: " />
                        <Paragraphs label={actividad.Valor_Actividad} />
                        </div>
                        <div>
                        <ContentTitle label="Clave de Instrumento:" />
                        <Paragraphs label={actividad.Clave_Instrumento} />
                        </div>
                        <div>
                        <ContentTitle label="Modalidad:" />
                        <Paragraphs label={actividad.Modalidad} />
                        </div>
                    </address>
                    </section>
                </div>
            </div>

            <div className="container mt-8">
                <TitlePage label="Practicas" />
                <>
                {practicas ? (
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {practicas.map((practica) => (
                    <div className=" bg-white relative rounded-lg overflow-hidden shadow-lg p-0 cursor-pointer">
                        <div className="absolute top-2 right-2 z-10">
                            <Tooltip content="Acciones" placement="left">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita que el clic en el botón de menú active el clic en el enlace
                                        toggleActionsMenu(practica.idPractica); // Alterna la visibilidad del menú
                                    }}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none"
                                >
                                    <FaEllipsisV className="text-gray-600" />
                                </button>
                            </Tooltip>
                            {isMenuOpen === practica.idPractica && (
                                <div className="absolute top-8 right-0 z-20 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm">
                                        <li>
                                            <button
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic en el botón de menú active el clic en el enlace
                                                    // Aquí puedes abrir el modal para editar
                                                    handleEditClick(practica);  
                                                    setOpenModalEdit(true); // Maneja el clic para abrir el modal de eliminar
                                                }}
                                            >
                                                <FaEdit className="w-4 h-4 mr-2" aria-hidden="true" />
                                                Editar
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic en el botón de menú active el clic en el enlace
                                                    setPracticeToDelete(practica.idPractica); // Establece el ID de la práctica a eliminar
                                                    setOpenModalDelete(true); // Maneja el clic para abrir el modal de eliminar
                                                    console.log('Eliminar');
                                                }}
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                            >
                                                <FaTrash className="w-4 h-4 mr-2" aria-hidden="true" />
                                                Eliminar
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Link
                            to={`/gruposMaterias/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${practica.idPractica}/${intIdActividadCurso}`}
                            className="block h-36"
                        >
                            <div className="relative h-full">
                                <div className="pt-5 pb-6 px-4">
                                    <h3 className="text-xl font-bold text-gray-900 text-center">{practica.vchNombre}</h3>
                                    <p className="text-sm text-gray-500 text-center">{practica.vchDescripcion}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    ))}
                    </section>
                ) : (
                    <section className="flex flex-col items-center justify-center w-full h-64">
                        <FaRegFrown className="text-gray-500 text-6xl" />
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No hay actividades o prácticas disponibles.
                        </div>
                    </section>
                )}
                </>
            </div>
        </section>
    );
};

export default DetalleActividadDocente;
