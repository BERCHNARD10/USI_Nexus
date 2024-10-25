import React, { useState, useEffect } from 'react';
import { Checkbox, Table, Alert, Tooltip } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { IoMdAdd, IoMdCreate, IoMdTrash } from 'react-icons/io';
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import { Label, TextInput, Button, Select, Modal } from "flowbite-react"; // Importamos el componente Button
import * as XLSX from 'xlsx';
import  Components from '../../components/Components'
import ArrayIterator from '../../components/Clases/Iterador'
const { LoadingButton, SelectInput} = Components;

const AgregarAlumnos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [cuatrimestres, setCuatrimestres] = useState([]);
  const [grupos, setGrupos] = useState([]);
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
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
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
                CORREO: fila[4]+"@uthh.edu.mx",
                PASSWORD: fila[4],                
            };
        });
        setAlumnosUpload(alumnosData);
        console.log('Datos del archivo Excel:', alumnosData);
    };

    reader.readAsArrayBuffer(file);
};

const handleClickRegistrar = () => {
  registrarEstudiantes(alumnosUpload);
};

const registrarEstudiantes = async (alumnosData) => 
{
  try 
  {
    setIsLoading(true);
    // Hacer solicitud para obtener las carreras
    const response = await fetch('https://robe.host8b.me/WebServices/registerStudents.php',
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

    if (result.done) 
    {
      setAlertMessage({ type: 'info', text: 'Datos de estudiantes registrados correctamente' });
      console.log('Datos recibidos php:', result);
    }
    else
    {                
      setAlertMessage({ type: 'failure', text:  result.message+' Inténtalo de nuevo.' });
      console.log('Datos recibidos php:', result.message);
    }
  } 
  catch (error) 
  {
    setAlertMessage({ type: 'failure', text: 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.' });
    console.error(error);
  }
  finally 
  {
    setIsLoading(false);
    setOpenModal(false)
    setFile(null);
  }
};
  useEffect(() => {
    {
      cargarPeriodos()
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
  
  const cargarPeriodos = async () => 
  {
    try
    {
      const response = await fetch('https://robe.host8b.me/WebServices/obtener-periodos.php');
      const result = await response.json();

      if (!result.done) 
      {
        throw new Error('Error al obtener las carreras');
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
    console.log("mapeo",optsit);
    
    const iterador = new ArrayIterator(result.message)

      let opts = [];

      while (iterador.hasNext()) {
        opts.push(iterador.next())
      }
      setPeriodos(opts);

      
      //setPeriodos(new ArrayIterator(result.message));
      /*const [iterator, setIterator] = useState(null);
      setIterator(new ArrayIterator(response.data));*/
      //setPeriodos(result.message);


    }
    catch(error)
    {
      console.error(error);
    } 
  }
    // Función para cargar las carreras
    const cargarCarreras = async (data) => 
    {
      try 
      {
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerCarreras.php',
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
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setCarreras(result.message);
        }
        else{
          setCarreras([]);
        }
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    const cargarCuatrimestres = async (carrera) => 
    {
      try 
      {
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerCuatrimestres.php',
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
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setCuatrimestres(result.message);
        }
        else
        {
          setCuatrimestres([]);
        }
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    const cargarGrupos = async (cuatrimestre) => 
    {
      try 
      {
        // Hacer solicitud para obtener las carreras
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerGrupos.php',
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
        if(result.done)
        {
          // Actualizar el estado de las carreras con los datos recibidos
          setGrupos(result.message);
        }
        else{
          setGrupos([]);
        }
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

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
        const response = await fetch('https://robe.host8b.me/WebServices/obtenerResultados.php',
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
        if(result.done)
        {
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

  return (
    <section className='flex flex-col'>
      {alertMessage && (
        <Alert color={alertMessage.type} onDismiss={() => setAlertMessage(null)}>
          {alertMessage.text}
        </Alert>
      )}
      <Modal className='mt-11 pt-16' size="4xl" base show={openModal} onClose={() => setOpenModalDelete(false)}>
        <Modal.Header>Agregar Alumnos</Modal.Header>
        <Modal.Body className='max-h-60'>
          <div className="space-y-6">
            <h3 className="mt-4 mb-2 text-base font-bold text-gray-900 dark:text-white">Selecciona un archivo en formato excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {file !==null && (
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
        <Modal.Footer>
          <LoadingButton
            className="max-w-32 max-h-11" // Clase de Tailwind CSS para definir un ancho máximo
            onClick={handleClickRegistrar} 
            isLoading={isLoading}
            loadingLabel="Cargando..."
            normalLabel="Agregar"
          />
          <Button color="gray" onClick={() => {setOpenModal(false); setFile(null)}}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={openModalDelete} size="md" onClose={() => setOpenModalDelete(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas eliminar a este estudiante?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => setOpenModalDelete(false)}>
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
          <TextInput id="email4" type="email" icon={HiOutlineSearch} placeholder="Matricula del Alumno" required />
          <Button icon={IoMdAdd} className="ml-2" onClick={() => setOpenModal(true)}>
            <IoMdAdd className="mr-2 h-5 w-5" />
            Añadir Estudiantes
          </Button> 
        </div>
        <div>
          <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">Consultar Alumnos</h3>
          <div className='grid grid-cols-2 grid-rows-2 gap-4'>
            <SelectInput
            id="intIdPeriodo" 
            labelSelect="Seleccionar Periodo" 
            label="Periodo"
            name="vchPeriodo"
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
            option="" 
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
            option="" 
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
            option="" 
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
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="p-4">
                <Checkbox />
              </Table.HeadCell>
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
                  <Table.Cell className="p-4">
                    <Checkbox />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {alumnosFitro.vchMatricula}
                  </Table.Cell>
                  <Table.Cell>{alumnosFitro.vchNombre} {alumnosFitro.vchAPaterno} {alumnosFitro.vchAMaterno}</Table.Cell>
                  <Table.Cell>{alumnosFitro.vchEmail}</Table.Cell>
                  <Table.Cell>Activa</Table.Cell>
                  <Table.Cell> 
                    <div className={`w-4 h-4 rounded-full ${alumnosFitro.enmEstadoCuenta=='activa' ? 'bg-green-500' : 'bg-red-500'}`}>
                      <span className=" ml-5">
                        {alumnosFitro.enmEstadoCuenta=='activa' ? 'Activo' : 'Bloqueda'}
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
                              <button type="button" data-modal-target="updateProductModal" data-modal-toggle="updateProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
                                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                      <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                  </svg>
                                  Editar
                              </button>
                          </li>
                          <li>
                              <button type="button" data-modal-target="readProductModal" data-modal-toggle="readProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
                                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" clipRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                  Detalles
                              </button>
                          </li>
                          <li>
                              <button type="button" data-modal-target="deleteModal" data-modal-toggle="deleteModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                onClick={() => setOpenModalDelete(true)}
                              >
                                  <svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                      <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                  </svg>
                                  Eliminar
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

export default AgregarAlumnos;
