import React, { useState, useEffect } from 'react';
import { Checkbox, Table, Alert, Tooltip } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { IoMdAdd } from 'react-icons/io';
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import { Label, TextInput, Button, Tabs, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import Components from '../../components/Components'
import ArrayIterator from '../../components/Clases/Iterador'
const { LoadingButton, SelectInput, IconButton, CustomInput, InfoAlert } = Components;
import { FaFileExcel, FaPencilAlt, FaDownload } from 'react-icons/fa';

import { data } from 'autoprefixer';

const Alumnos = () => {

    const [periodos, setPeriodos] = useState([]);
    const [periodosTotal, setPeriodosTotal] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [carrerasTotal, setCarreraTotal] = useState([]);
    const [cuatrimestres, setCuatrimestres] = useState([]);
    const [cuatrimestresTotal, setCuatrimestresTotal] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [gruposTotal, setGruposTotal] = useState([]);
    const [periodo, setPeriodo] = useState('');
    const [carrera, setCarrera] = useState('');
    const [cuatrimestre, setCuatrimestre] = useState('');
    const [grupo, setGrupo] = useState('');
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
    const [selectedCarrera, setSelectedCarrera] = useState(null);
    const [selectedCuatrimestre, setSelectedCuatrimestre] = useState(null);
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [alumnos, setAlumnos] = useState([]);
    const [alumnosUpload, setAlumnosUpload] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalAlumn, setOpenModalAlumn] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [serverResponse, setServerResponse] = useState('');
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const webUrl = import.meta.env.VITE_URL;

    const {
        register,
        setValue,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
    } = useForm();

    const toggleActionsMenu = (matricula) => {
        if (activeMenu === matricula) {
            // Si el mismo menú está abierto, ciérralo
            setActiveMenu(null);
        } else {
            // Abre el menú clickeado y cierra los demás
            setActiveMenu(matricula);
        }
    };



    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        setFile(event);

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Obtener información adicional
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const listaDeAlumnos = sheet['A5'].v;
            const periodo = sheet['C7'].v;
            const carrera = sheet['A5'].v;
            const cuatrimestre = sheet['C8'].v;
            const grupo = sheet['C9'].v;

            setPeriodo(periodo);
            setCarrera(carrera);
            setCuatrimestre(cuatrimestre);
            setGrupo(grupo);
            console.log('Lista de Alumnos:', listaDeAlumnos);
            console.log('Periodo:', periodo);
            console.log('Carrera:', carrera);
            console.log('Cuatrimestre:', cuatrimestre);
            console.log('Grupo:', grupo);

            // Obtener datos de los alumnos
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 12 });
            // Procesar los datos para obtener un array de objetos
            const alumnosData = jsonData.map((fila) => {
                return {
                    PERIODO: periodo,
                    CARRERA: carrera,
                    CUATRIMESTRE: cuatrimestre,
                    GRUPO: grupo,
                    MATRICULA: fila[0],
                    NOMBRE: fila[3],
                    APELLIDOMATERNO: fila[2],
                    APELLIDOPATERNO: fila[1],
                    CORREO: fila[4] + "@uthh.edu.mx",
                    PASSWORD: fila[4],
                };
            }).filter((fila) => fila.MATRICULA && fila.NOMBRE && fila.APELLIDOPATERNO && fila.APELLIDOMATERNO && fila.CORREO && fila.PASSWORD);
            setAlumnosUpload(alumnosData);
            console.log('Datos del archivo Excel:', alumnosData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleClickRegistrar = () => {
        registrarEstudiantes(alumnosUpload);
    };

    const registrarEstudiantes = async (alumnosData) => {
        try {
            setIsLoading(true);
            // Hacer solicitud para obtener las carreras
            const response = await fetch(`${apiUrl}registerStudents.php`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify
                        ({
                            dataEstudiantes: alumnosData,
                        }),
                }
            );
            const result = await response.json();

            if (result.done) {

                setServerResponse(`Éxito: Datos de estudiantes registrados correctamente`);
                console.log('Datos recibidos php:', result);
            }
            else {
                setServerResponse(`Error: ${result.message} Inténtalo de nuevo.`);
                console.log('Datos recibidos php:', result);
            }
        }
        catch (error) {
            setServerResponse(`Error: Error al conectar con el servidor. ${error}`);
        }
        finally {
            setIsLoading(false);
            setOpenModal(false)
            setFile(null);
        }
    };

    useEffect(() => {
        {
            cargarPeriodos()
            cargarCarrerasTotal()
            cargarCuatrimestresTotal()
            cargarGruposTotal()
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (selectedPeriodo) {
                await cargarCarreras(selectedPeriodo);
            }
            if (selectedCarrera) {
                await cargarCuatrimestres(selectedCarrera);
            }
            if (selectedCuatrimestre) {
                await cargarGrupos(selectedCuatrimestre);
            }
            if (selectedGrupo) {
                await cargarAlumnos(selectedGrupo);
            }
        };

        loadData();
    }, [selectedPeriodo, selectedCarrera, selectedCuatrimestre, selectedGrupo]);

    const cargarCarrerasTotal = async () => {
        try {
            const response = await fetch(`${apiUrl}obtenerCarreras.php`);
            const result = await response.json();

            if (!result.done) {
                throw new Error('Error al obtener las carreras');
            }
            setCarreraTotal(result.message);
        }
        catch (error) {
            console.error(error);
        }
    }

    const cargarCuatrimestresTotal = async () => {
        try {
            const response = await fetch(`${apiUrl}obtenerCuatrimestres.php`);
            const result = await response.json();

            if (!result.done) {
                throw new Error('Error al obtener las carreras');
            }
            setCuatrimestresTotal(result.message);
        }
        catch (error) {
            console.error(error);
        }
    }

    const cargarGruposTotal = async () => {
        try {
            const response = await fetch(`${apiUrl}obtenerGrupos.php`);
            const result = await response.json();

            if (!result.done) {
                throw new Error('Error al obtener las carreras');
            }
            setGruposTotal(result.message);
        }
        catch (error) {
            console.error(error);
        }
    }

    const cargarPeriodos = async () => {
        try {
            const response = await fetch(`${apiUrl}obtener-periodos.php`);
            const result = await response.json();

            console.log("resultado", result);
            if (!result.done) {
                throw new Error('Error al obtener', result.message);
            }
            console.log(result);


            const responseData = {
                arrayData: ['item1', 'item2', 'item3'],
                nestedObject: {
                    key1: 'value1',
                    key2: 'value2',
                    key3: 'value3'
                }
            };

            // Crear un iterador con los elementos del arrayData
            const iterator1 = new ArrayIterator(responseData.arrayData);
            const iterator2 = new ArrayIterator(Object.values(responseData.nestedObject));

            // Iterar sobre los elementos
            let optsit = [];

            iterator1.first();
            while (iterator1.hasNext()) {
                optsit.push(iterator1.next())
            }

            while (iterator2.hasNext()) {
                optsit.push(iterator2.next())
            }
            console.log("mapeo", optsit);

            const iterador = new ArrayIterator(result.message)

            let opts = [];

            while (iterador.hasNext()) {
                opts.push(iterador.next())
            }
            setPeriodos(opts);
            setPeriodosTotal(result.message);


            //setPeriodos(new ArrayIterator(result.message));
            /*const [iterator, setIterator] = useState(null);
            setIterator(new ArrayIterator(response.data));*/
            //setPeriodos(result.message);


        }
        catch (error) {
            console.error(error);
        }
    }
    // Función para cargar las carreras
    const cargarCarreras = async (data) => {
        try {
            // Hacer solicitud para obtener las carreras
            const response = await fetch(`${apiUrl}obtenerCarreras.php`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        periodo: data,
                    }),
                });
            const result = await response.json();
            console.log(result);
            if (result.done) {
                // Actualizar el estado de las carreras con los datos recibidos
                setCarreras(result.message);
            }
            else {
                setCarreras([]);
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const cargarCuatrimestres = async (carrera) => {
        try {
            // Hacer solicitud para obtener las carreras
            const response = await fetch(`${apiUrl}obtenerCuatrimestres.php`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        carrera: carrera,
                        idPeriodo: selectedPeriodo,

                    }),
                });
            const result = await response.json();
            console.log(result);
            if (result.done) {
                // Actualizar el estado de las carreras con los datos recibidos
                setCuatrimestres(result.message);
            }
            else {
                setCuatrimestres([]);
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const cargarGrupos = async (cuatrimestre) => {
        try {
            // Hacer solicitud para obtener las carreras
            const response = await fetch(`${apiUrl}obtenerGrupos.php`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cuatrimestre: cuatrimestre,
                        idPeriodo: selectedPeriodo,
                    }),
                });
            const result = await response.json();
            console.log(result);
            if (result.done) {
                // Actualizar el estado de las carreras con los datos recibidos
                setGrupos(result.message);
            }
            else {
                setGrupos([]);
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await fetch(`${apiUrl}registerStudents.php`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dataEstudiante: data
                    }),
                });

            const result = await response.json();

            if (result.done) {
                setServerResponse(`Éxito:.${result.message}`);
                setOpenModal(false)
            }
            else {
                setServerResponse(`Error: .${result.message}`);
                console.log('Datos recibidos php:', result);
            }
        } catch (error) {
            console.error(error);
            setServerResponse(`Error: Error al conectar con el servidor. ${error}`);
        }
    }

    const cargarAlumnos = async (grupo) => {
        try {
            const requestBody = {
                idPeriodo: selectedPeriodo,
                idCarrera: selectedCarrera,
                idCuatrimestre: selectedCuatrimestre,
                idGrupo: grupo,
            };

            console.log('Cuerpo de la solicitud:', requestBody);

            // Hacer solicitud para obtener las carreras
            const response = await fetch(`${apiUrl}obtenerResultados.php`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idPeriodo: selectedPeriodo,
                        idCarrera: selectedCarrera,
                        idCuatrimestre: selectedCuatrimestre,
                        idGrupo: grupo,
                    }),
                });

            const result = await response.json();
            console.log(result);
            if (result.done) {
                // Actualizar el estado de las carreras con los datos recibidos
                setAlumnos(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [file, setFile] = useState(null);

    const handleDrop = (acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        // Aquí puedes enviar el archivo a tu servidor para su procesamiento
    };


    ///Editar Alumno/suspender

    const [selectAlumnos, setselectAlumnos] = useState();
    const editUser = (data) => {
        setOpenModalDelete(true)
        console.log("editar alumno: ", data)
        setselectAlumnos(data.vchMatricula)

    };


    const suspender = async (data) => {
        try {
            const response = await fetch(`${apiUrl}suspenderAlumno.php`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Matricula: data,

                    }),
                });

            const result = await response.json(); // Asumiendo que la respuesta es JSON
            console.log(result.message);
            if (result.done) {
                setServerResponse(`Éxito: ${result.message}`);

                //setAlertMessage({ type: 'error', text: result.message });
                //cargarDocentes();}
                cargarAlumnos(selectedGrupo);

            }
            else {
                setServerResponse(`Error: ${result.message}`);

            }
        } catch (error) {
            console.error('Error during fetch operation:', error);
        }
        finally {
            setOpenModalDelete(false);


        }

    }

    ///Editar Alumno/Editar todo 
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [seleCarrera, setseleCarrera] = useState();
    const [seleCuatri, setseleCuatri] = useState();

    const editAll = (data, carrera) => {
        console.log("editar: ", data)
        setValue('matriculaAlumEdit', data.vchMatricula);
        setValue('nombrEdit', data.vchNombre);
        setValue('apellidoPaternoEdit', data.vchAPaterno);
        setValue('apellidoMaternoEdit', data.vchAMaterno);
        setValue('correoEdit', data.vchEmail);
        setValue('vchNomCarreraToEdit', data.intClvCarrera);
        setValue('vchNomCuatriTo', data.intClvCuatrimestre);
        setValue('chrGrupoTo', data.chrGrupo);
        setValue('editEstado', data.enmEstadoCuenta);
        setValue('editPeriodo', data.intPeriodo);
        console.log("periodo editado", data.intPeriodo)



        setseleCarrera(data.intClvCarrera)
        console.log(seleCarrera)
        console.log(watch('vchNomCarreraToEdit'))
        console.log("el grupo" + watch('chrGrupoTo'))
        //intClvCuatrimestre, chrGrupo



    }
    const [disbleButton, setdisbleButton] = useState();

    const valiEmail = () => {

        const correo = watch('correoEdit');
        // Expresión regular para validar el correo institucional
        const emailPattern = /^[a-zA-Z0-9._%+-]+@uthh\.edu\.mx$/;
        const isCorreoValid = emailPattern.test(correo);
        setdisbleButton(!isCorreoValid)

    }
    useEffect(() => {
        valiEmail();
    }, [
        watch('correoEdit'),

    ]);

    const [allAlu, setAllAlu] = useState();
    const updateAllAlumno = () => {
        const matricula = (watch('matriculaAlumEdit') || '').toUpperCase();
        const nombre = (watch('nombrEdit') || '').toUpperCase();
        const apellidoP = (watch('apellidoPaternoEdit') || '').toUpperCase();
        const apellidoM = (watch('apellidoMaternoEdit') || '').toUpperCase();
        const correo = (watch('correoEdit') || '');
        const periodo = (watch('editPeriodo') || '');
        const carrera = (watch('vchNomCarreraToEdit') || '');
        const cuatri = (watch('vchNomCuatriTo') || '');
        const grupo = (watch('chrGrupoTo') || '');
        const estatoCuenta = (watch('editEstado') || '');
        const datosDocente = {
            matricula: matricula,
            nombre: nombre,             // nombre en mayúsculas
            apellidoP: apellidoP,       // apellido paterno en mayúsculas
            apellidoM: apellidoM,
            correo: correo,
            carrera: carrera,               // rol seleccionado
            cuatri: cuatri,          // estado seleccionado
            grupo: grupo,
            estado: estatoCuenta,
            periodo: periodo
        };

        console.log(datosDocente)
        setAllAlu(datosDocente)
        setOpenConfirm(true)

    }
    const updateAlu = async (data) => {
        try {
            const response = await fetch(`${apiUrl}updateAlumno.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            });




            const result = await response.json(); // Asumiendo que la respuesta es JSON
            console.log(result);
            if (result.done) {
                setAlertMessage({ type: 'error', text: result.message });
                setServerResponse(`Éxito: ${result.message}`);

                cargarAlumnos(selectedGrupo);
            }
            else {
                setServerResponse(`Error: ${result.message}`);

            }
        } catch (error) {
            console.error('Error during fetch operation:', error);
        }
        finally {
            setOpenConfirm(false)
            setOpenModalEdit(false);
        }
    };


    const handleDownload = async () => {
        const response = await fetch(`${webUrl}assets/archivos/Formato-Lista-Alumnos.xlsx`, {
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
        link.download = 'Formato-Lista-Alumnos.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <section className='flex flex-col'>
            <InfoAlert
                message={serverResponse}
                type={serverResponse.includes('Éxito') ? 'success' : 'error'}
                isVisible={!!serverResponse}
                onClose={() => setServerResponse('')}
            />

            <Modal popup className='h-0 mt-auto' size="4xl" show={openModal} onClose={() => { setOpenModal(false), setFile(null) }}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative w-full mx-12 bg-white rounded-lg shadow-lg">
                        <Modal.Header>Agregar Alumnos</Modal.Header>
                        <div className='px-8'>
                            <Tabs aria-label="Tabs with underline" style="underline">
                                <Tabs.Item active title="Carga desde Excel" icon={FaFileExcel}>
                                    <Modal.Body className='max-h-60 px-0 pt-0'>
                                        <div className="space-y-6">
                                            <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Selecciona un archivo en formato excel</h3>
                                            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                                            {file !== null && (
                                                <section>
                                                    <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Datos recibidos</h3>
                                                    <div>
                                                        <div className='grid grid-cols-2 grid-rows-2 gap-4 m-y-2 mb-4'>
                                                            <div className='flex-row'>
                                                                <div className="mt-4">Periodo</div>
                                                                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    {periodo}
                                                                </div>
                                                            </div>
                                                            <div className='flex-row'>
                                                                <div className="mt-4">Carrera</div>
                                                                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    {carrera}
                                                                </div>
                                                            </div>
                                                            <div className='flex-row'>
                                                                <div className="mt-4">Cuatrimestre</div>
                                                                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    {cuatrimestre}
                                                                </div>
                                                            </div>
                                                            <div className='flex-row'>
                                                                <div className="mt-4">Grupo</div>
                                                                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    {grupo}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <Table hoverable>
                                                            <Table.Head>
                                                                <Table.HeadCell>Matricula</Table.HeadCell>
                                                                <Table.HeadCell>Nombre</Table.HeadCell>
                                                                <Table.HeadCell>Correo</Table.HeadCell>
                                                                <Table.HeadCell>Contraseña</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                {alumnosUpload.map((alumnosExcel, index) =>
                                                                (
                                                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                            {alumnosExcel.MATRICULA}
                                                                        </Table.Cell>
                                                                        <Table.Cell>{alumnosExcel.NOMBRE} {alumnosExcel.APELLIDOMATERNO} {alumnosExcel.APELLIDOPATERNO}</Table.Cell>
                                                                        <Table.Cell>{alumnosExcel.CORREO}</Table.Cell>
                                                                        <Table.Cell>{alumnosExcel.PASSWORD}</Table.Cell>
                                                                    </Table.Row>
                                                                ))
                                                                }
                                                            </Table.Body>
                                                        </Table>
                                                    </div>
                                                </section>
                                            )}
                                        </div>
                                    </Modal.Body>
                                    {file !== null && (
                                        <Modal.Footer>
                                            <LoadingButton
                                                className="max-w-32 max-h-11" // Clase de Tailwind CSS para definir un ancho máximo
                                                onClick={handleClickRegistrar}
                                                isLoading={isLoading}
                                                loadingLabel="Cargando..."
                                                normalLabel="Agregar"
                                            />
                                            <Button color="gray" onClick={() => { setOpenModal(false); setFile(null) }}>
                                                Cancelar
                                            </Button>
                                        </Modal.Footer>
                                    )}
                                </Tabs.Item>
                                <Tabs.Item title="Ingreso Manual" icon={FaPencilAlt}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Modal.Body className='max-h-96'>
                                            <div className='info-person grid grid-cols-2 gap-x-4'>
                                                <CustomInput
                                                    label="Matrícula"
                                                    name="matriculaAlum"
                                                    pattern={/^\d{8}$/} // Verifica exactamente 8 dígitos
                                                    errorMessage="La matrícula debe contener solo 8 números y sin espacios."
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                />
                                                <CustomInput
                                                    label="Nombre"
                                                    name="nombre"
                                                    pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/}
                                                    errorMessage="Solo letras y sin espacios"
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                    style={{ textTransform: 'uppercase' }}
                                                />
                                                <CustomInput
                                                    label="Apellido Paterno"
                                                    name="apellidoPaterno"
                                                    pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+$/}
                                                    errorMessage="Solo letras y sin espacios"
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                    style={{ textTransform: 'uppercase' }}
                                                />
                                                <CustomInput
                                                    label="Apellido Materno"
                                                    name="apellidoMaterno"
                                                    pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+$/}
                                                    errorMessage="Solo letras y sin espacios"
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                    style={{ textTransform: 'uppercase' }}
                                                />
                                            </div>

                                            <div className='info-person grid grid-cols-2 gap-x-4'>
                                                <SelectInput
                                                    id="intIdPeriodo"
                                                    labelSelect="Seleccionar Periodo"
                                                    label="Periodo"
                                                    name="vchPeriodoTo"
                                                    value="vchPeriodo"
                                                    options={periodosTotal}
                                                    errorMessage="No cumples con el patron de contraseña"
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                    pattern=""
                                                />

                                                <SelectInput
                                                    id="intClvCarrera"
                                                    labelSelect="Seleccionar Carrera"
                                                    label="Carrera"
                                                    name="vchNomCarreraTo"
                                                    value="vchNomCarreraTo"
                                                    options={carrerasTotal}
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                />

                                                <SelectInput
                                                    id="intClvCuatrimestre"
                                                    labelSelect="Seleccionar Cuatrimestre"
                                                    label="Cuatrimestre"
                                                    name="vchNomCuatriTo"
                                                    value="vchNomCuatriTo"
                                                    options={cuatrimestresTotal}
                                                    errorMessage="No cumples con el patron de contraseña"
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                    pattern=""
                                                />

                                                <SelectInput
                                                    id="chrGrupo"
                                                    labelSelect="Seleccionar Grupo"
                                                    label="Grupo"
                                                    name="chrGrupoTo"
                                                    value="chrGrupoTo"
                                                    options={gruposTotal}
                                                    errorMessage="No cumples con el patron de contraseña"
                                                    errors={errors}
                                                    register={register}
                                                    trigger={trigger}
                                                    pattern=""
                                                />
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <LoadingButton
                                                className="max-w-32 max-h-11" // Clase de Tailwind CSS para definir un ancho máximo
                                                isLoading={isLoading}
                                                loadingLabel="Cargando..."
                                                normalLabel="Agregar"
                                            />
                                            <Button color="gray" onClick={() => { setOpenModal(false); setFile(null) }}>
                                                Cancelar
                                            </Button>
                                        </Modal.Footer>
                                    </form>
                                </Tabs.Item>
                            </Tabs>
                        </div>
                    </div>
                </div>

            </Modal>

            <Modal show={openModalDelete} size="md" onClose={() => setOpenModalDelete(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            ¿Estás seguro de que deseas suspender a este estudiante?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => { setOpenModalDelete(false); suspender(selectAlumnos) }}>
                                {"Sí estoy seguro"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModalDelete(false)}>
                                No, cancelar
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <h1 className="m-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Alumnos</h1>
            <div className="w-full mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 grid gap-4">
                <div className="mb-2 block">
                    <Label htmlFor="email4" value="Buscar alumno" />
                </div>
                <div className="flex items-center">
                    {/*<TextInput id="email4" type="email" icon={HiOutlineSearch} placeholder="Matricula del Alumno" required />*/}
                    <div className="flex items-center space-x-4">
                        <IconButton
                            className="ml-2"
                            Icon={IoMdAdd} // Pasa el componente de ícono
                            message="Añadir Estudiantes"
                            onClick={() => setOpenModal(true)}
                        />
                        <IconButton
                            Icon={FaDownload}
                            message="Formato Lista de Alumnos"
                            onClick={handleDownload}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">Consultar Alumnos</h3>
                    <div className='grid grid-cols-2 grid-rows-2 gap-4'>
                        <SelectInput
                            id="intIdPeriodo"
                            labelSelect="Seleccionar Periodo"
                            label="Periodo"
                            value="vchPeriodo"
                            name="vchPeriodo1"
                            option=""
                            options={periodos}
                            errorMessage="No cumples con el patron de contraseña"
                            errors={errors}
                            register={register}
                            trigger={trigger}
                            onChange={(e) => {
                                setSelectedPeriodo(e.target.value);
                                // Cargar carreras al seleccionar periodo
                            }}
                            pattern=""
                        />
                        <SelectInput
                            id="intClvCarrera"
                            labelSelect="Seleccionar Carrera"
                            label="Carrera"
                            name="vchNomCarrera"
                            value="vchNomCarrera"
                            options={carreras}
                            errorMessage="No cumples con el patron de contraseña"
                            errors={errors}
                            register={register}
                            trigger={trigger}
                            onChange={(e) => {
                                setSelectedCarrera(e.target.value);
                                // Cargar carreras al seleccionar periodo
                            }}
                            pattern=""
                        />
                        <SelectInput
                            id="intClvCuatrimestre"
                            labelSelect="Seleccionar Cuatrimestre"
                            label="Cuatrimestre"
                            name="vchNomCuatri"
                            value="vchNomCuatri"
                            options={cuatrimestres}
                            errorMessage="No cumples con el patron de contraseña"
                            errors={errors}
                            register={register}
                            trigger={trigger}
                            onChange={(e) => {
                                setSelectedCuatrimestre(e.target.value);
                                // Cargar carreras al seleccionar periodo
                            }}
                            pattern=""
                        />
                        <SelectInput
                            id="chrGrupo"
                            labelSelect="Seleccionar Grupo"
                            label="Grupo"
                            name="chrGrupo"
                            value="chrGrupo"
                            options={grupos}
                            errorMessage="No cumples con el patron de contraseña"
                            errors={errors}
                            register={register}
                            trigger={trigger}
                            onChange={(e) => {
                                setSelectedGrupo(e.target.value);
                                // Cargar carreras al seleccionar periodo
                            }}
                            pattern=""
                        />
                    </div>
                </div>


                {/*Editar Alumno*/}
                <Modal
                    show={openModalEdit}
                    onClose={() => setOpenModalEdit(false)}
                    className="fixed inset-0 flex items-center justify-center z-50" // Asegura que el overlay cubra toda la pantalla y el modal esté centrado
                >
                    <Modal.Header>Editar Alumnos</Modal.Header>
                    <Modal.Body>
                        <div className="relative w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"> {/* Estilo para el contenido del modal */}
                            <form>
                                {/* Se ajusta el alto máximo y se agrega scroll si es necesario */}
                                <div className="info-person grid grid-cols-2 gap-x-4"> {/* Se ajusta el espacio entre columnas */}
                                    <CustomInput
                                        label="Matrícula"
                                        name="matriculaAlumEdit"
                                        pattern={/^\d+$/}
                                        errorMessage="Solo números y sin espacios"
                                        errors={errors}
                                        register={register}
                                        trigger={trigger}
                                        readOnly={true}
                                    />
                                    <CustomInput
                                        label="Nombre"
                                        name="nombrEdit"
                                        pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/}

                                        errorMessage="Solo letras y sin espacios"
                                        errors={errors}
                                        register={register}
                                        trigger={trigger}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                    <CustomInput
                                        label="Apellido Paterno"
                                        name="apellidoPaternoEdit"
                                        pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+$/}
                                        errorMessage="Solo letras y sin espacios"
                                        errors={errors}
                                        register={register}
                                        trigger={trigger}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                    <CustomInput
                                        label="Apellido Materno"
                                        name="apellidoMaternoEdit"
                                        pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+$/}
                                        errorMessage="Solo letras y sin espacios"
                                        errors={errors}
                                        register={register}
                                        trigger={trigger}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                    <CustomInput
                                        label="Correo"
                                        name="correoEdit"
                                        errors={errors}
                                        errorMessage={"El correo no pertenece a la Institucion"}
                                        register={register}
                                        trigger={trigger}
                                        pattern={/^[a-zA-Z0-9._%+-]+@uthh\.edu\.mx$/}
                                        style={{ textTransform: 'lowercase' }}
                                    />
                                </div>

                                <div className="info-academic grid grid-cols-2 gap-6 mt-6"> {/* Más espacio entre las secciones */}

                                    <div className="w-full">
                                        <div className="mb-2 block">
                                            <Label htmlFor="editPeriodo" value="Periodo" />
                                        </div>
                                        <select
                                            name="editPeriodo"
                                            id="editPeriodo"
                                            {...register('editPeriodo')}
                                            className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => setSelectedPeriodo(e.target.value)}
                                        >
                                            {periodos.map((dep) => (
                                                <option key={dep.intIdPeriodo} value={dep.intIdPeriodo}>
                                                    {dep.vchPeriodo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full">
                                        <div className="mb-2 block">
                                            <Label htmlFor="vchNomCarreraToEdit" value="Carrera" />
                                        </div>
                                        <select
                                            name="vchNomCarreraToEdit"
                                            id="vchNomCarreraToEdit"
                                            {...register('vchNomCarreraToEdit')}
                                            className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => setseleCarrera(e.target.value)}
                                        >
                                            {carrerasTotal.map((dep) => (
                                                <option key={dep.intClvCarrera} value={dep.intClvCarrera}>
                                                    {dep.vchNomCarreraTo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full">
                                        <div className="mb-2 block">
                                            <Label htmlFor="vchNomCuatriTo" value="Seleccionar Cuatrimestre" />
                                        </div>
                                        <select
                                            name="vchNomCuatriTo"
                                            id="vchNomCuatriTo"
                                            {...register('vchNomCuatriTo')}
                                            className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => setseleCuatri(e.target.value)}
                                        >
                                            {cuatrimestresTotal.map((dep) => (
                                                <option key={dep.intClvCuatrimestre} value={dep.intClvCuatrimestre}>
                                                    {dep.vchNomCuatriTo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="w-full">
                                        <div className="mb-2 block">
                                            <Label htmlFor="chrGrupoTo" value="Seleccionar Grupo" />
                                        </div>
                                        <select
                                            name="chrGrupoTo"
                                            id="chrGrupoTo"
                                            {...register('chrGrupoTo')}
                                            className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => setseleCuatri(e.target.value)}
                                        >
                                            {gruposTotal.map((dep) => (
                                                <option key={dep.chrGrupo} value={dep.chrGrupo}>
                                                    {dep.chrGrupoTo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full">
                                        <div className="mb-2 block">
                                            <Label htmlFor="editEstado" value="Estado de Cuenta" />
                                        </div>
                                        <select
                                            id="editEstado"
                                            name="editEstado"
                                            required
                                            className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            {...register('editEstado')}
                                        // value={selectedDocenteEstado} // Controla el valor seleccionado
                                        // onChange={(e) => setSelectedDocenteEstado(e.target.value)} // Actualiza el estado cuando se cambia la selección
                                        >
                                            <option value="activa">Activa</option>
                                            <option value="bloqueada">Bloqueada</option>
                                        </select>

                                    </div>





                                    {/*
                                    <SelectInput
                                        id="chrGrupo"
                                        labelSelect="Seleccionar Grupo"
                                        label="Grupo"
                                        name="chrGrupoTo"
                                        option=""
                                        options={gruposTotal}
                                        errorMessage="No cumples con el patrón de contraseña"
                                        errors={errors}
                                        register={register}
                                        trigger={trigger}
                                    />*/
                                    }
                                </div>

                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex justify-between"> {/* Distribuye los botones */}
                        <LoadingButton
                            className="max-w-xs max-h-11" // Define un ancho y altura máximos para el botón
                            isLoading={isLoading}
                            loadingLabel="Cargando..."
                            normalLabel="Editar"
                            disabled={disbleButton}
                            onClick={() => updateAllAlumno()}
                        />
                        <Button color="gray" onClick={() => setOpenModalEdit(false)}>
                            Cancelar
                        </Button>
                    </Modal.Footer>

                </Modal>






                {/*modal para confirmar update*/}
                <Modal show={openConfirm} onClose={() => { setOpenConfirm(false) }} size="md" popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                ¿Estás seguro de que deseas Actualizar a este Alumno?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure"
                                    onClick={() => updateAlu(allAlu)}
                                >
                                    {"Sí estoy seguro"}
                                </Button>
                                <Button color="gray" onClick={() => { setOpenConfirm(false), setAllAlu("") }}>
                                    No, cancelar
                                </Button>
                            </div>
                        </div>

                    </Modal.Body>


                </Modal>













                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Matricula</Table.HeadCell>
                            <Table.HeadCell>Nombre</Table.HeadCell>
                            <Table.HeadCell>Correo</Table.HeadCell>
                            <Table.HeadCell>Estado de inscripcion</Table.HeadCell>
                            <Table.HeadCell>Estado de cuenta</Table.HeadCell>
                            <Table.HeadCell className='px-4 py-3'><div className="sr-only">Actions</div></Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {alumnos.map((alumnosFitro) =>
                            (
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {alumnosFitro.vchMatricula}
                                    </Table.Cell>
                                    <Table.Cell>{alumnosFitro.vchNombre} {alumnosFitro.vchAPaterno} {alumnosFitro.vchAMaterno}</Table.Cell>
                                    <Table.Cell>{alumnosFitro.vchEmail}</Table.Cell>
                                    <Table.Cell>Activa</Table.Cell>
                                    <Table.Cell>
                                        <div className={`w-4 h-4 rounded-full ${alumnosFitro.enmEstadoCuenta == 'activa' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            <span className=" ml-5">
                                                {alumnosFitro.enmEstadoCuenta == 'activa' ? 'Activo' : 'Bloqueda'}
                                            </span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="px-4 py-3 flex items-center justify-end">
                                        <Tooltip content="Acciones" placement="left">
                                            <button
                                                onClick={() => toggleActionsMenu(alumnosFitro.vchMatricula)} // Pasar la matrícula como parámetro
                                                className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                                type="button"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>
                                        </Tooltip>

                                        {activeMenu === alumnosFitro.vchMatricula && (
                                            <div className="mr-12	absolute z-10 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                                <ul className="py-1 text-sm" aria-labelledby="apple-imac-27-dropdown-button">
                                                    <li>
                                                        <button type="button" data-modal-target="updateProductModal" data-modal-toggle="updateProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                                            onClick={() => { setOpenModalEdit(true); editAll(alumnosFitro, carrerasTotal) }}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                            </svg>

                                                            Editar
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                                            onClick={() => { editUser(alumnosFitro) }}
                                                        >
                                                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 18.66 18.24 16.44 19.77L4.23 7.56C5.76 5.34 8.69 4 12 4Z" />
                                                                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                                                            </svg>
                                                            Bloquear
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))
                            }
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </section>
    );
};

export default Alumnos;
