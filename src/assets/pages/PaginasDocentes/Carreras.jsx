import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tooltip, Pagination } from 'flowbite-react';
import { FaEdit, FaInfoCircle, FaTrash } from 'react-icons/fa';
import Components from '../../components/Components';
const { LoadingButton, ConfirmDeleteModal, IconButton, CustomInput, InfoAlert  } = Components;
import { IoMdAdd } from 'react-icons/io';
import { useForm } from 'react-hook-form';

const CarrerasCrud = () => {
    const [carreras, setCarreras] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [idCarrera, setIdCarrera] = useState('');
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [carreraToDelete, setCarreraToDelete] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    const totalItems = carreras.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCarreras = carreras.slice(indexOfFirstItem, indexOfLastItem);
    const visibleRangeText = `Mostrando ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, totalItems)} de ${totalItems}`;
    const apiUrl = import.meta.env.VITE_API_URL;

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const {
        register,
        setValue,
        handleSubmit,
        trigger,
        watch,
        reset,
        formState: { errors },
    } = useForm();


    useEffect(() => {
        fetchCarreras();
    }, [idCarrera]);

    const fetchCarreras = async () => {
        try {
            const response = await fetch(`${apiUrl}/carreras.php`);
            const data = await response.json();
            if (data.done) {
                setCarreras(data.message);
            } else {
                console.error('Error fetching carreras:', data.message);
            }
        } catch (error) {
            console.error('Error fetching carreras:', error);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        reset(); // Limpia todos los valores del formulario
        setModalOpen(true);
    };

    const handleEdit = (carrera) => {
        setIdCarrera(carrera);
        setIsEditing(true);
        setModalOpen(true);
        setValue('carrera', carrera.vchNomCarrera);
    };
    

    // Eliminar un departamento
    const handleDelete = async () => {
        setIsLoading(true);
        console.log(carreraToDelete)
        try {
            const response = await fetch(`${apiUrl}/carrerasCrud.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    carreraID: carreraToDelete,
                }),
            });
            const data = await response.json();
            if (data.done) {
                setOpenModalDelete(false);
                fetchCarreras();
                setServerResponse(`Éxito: ${data.message}`);
            } else {
                setServerResponse(`Error: ${data.message}`);
                console.error('Error deleting carrera:', data.message);
            }
        } catch (error) {
            console.error('Error deleting carrera:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const url = `${apiUrl}/carrerasCrud.php`;
            const method = 'POST';
            const body = isEditing 
                ? { carreraID: idCarrera.intClvCarrera, nuevoNombre: formData.carrera }
                : { nuevoNombre: formData.carrera };
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.done) {
                fetchCarreras();
                setModalOpen(false);
                setServerResponse(`Éxito: ${data.message}`);
            } else {
                setServerResponse(`Error: ${data.message}`);
                console.error('Error saving carrera:', data.message);
            }
        } catch (error) {
            console.error('Error saving carrera:', error);
        } finally {
            setIsLoading(false);
        }
    };  

    const toggleActionsMenu = (intClvCarrera) => {
        setIsMenuOpen(isMenuOpen === intClvCarrera ? null : intClvCarrera);
    };

    return (
        
        <section className='flex flex-col'>
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
                onConfirm={handleDelete}
                message="¿Estás seguro de que deseas eliminar esta carrera?<br />También se eliminarán las calificaciones."
            />

            <h1 className="m-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Carreras</h1>
            <div className="w-full mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 grid gap-4">
                <IconButton
                    className="ml-2"
                    Icon={IoMdAdd}
                    message="Añadir Carreras"
                    onClick={handleAdd}
                />

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>No</Table.HeadCell>
                        <Table.HeadCell>Nombre</Table.HeadCell>
                        <Table.HeadCell>Acciones</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {currentCarreras.map((carrera, index) => (
                            <Table.Row key={carrera.intClvCarrera} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{index + 1 + (currentPage - 1) * itemsPerPage}</Table.Cell>
                                <Table.Cell>{carrera.vchNomCarrera}</Table.Cell>
                                <Table.Cell className="px-4 py-3 flex items-center justify-end">
                                    <Tooltip content="Acciones" placement="left">
                                        <button
                                            onClick={() => toggleActionsMenu(carrera.intClvCarrera)}
                                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:text-gray-400"
                                            type="button"
                                        >
                                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                    </Tooltip>

                                    {isMenuOpen === carrera.intClvCarrera && (
                                        <div className="mr-12 absolute z-10 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                                            <ul className="py-1 text-sm">
                                                <li>
                                                    <button onClick={() => handleEdit(carrera)} className="flex items-center py-2 px-4 hover:bg-gray-100 dark:text-gray-200">
                                                        <FaEdit className="w-4 h-4 mr-2" /> Editar
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => { setOpenModalDelete(true); setCarreraToDelete(carrera.intClvCarrera); }} className="flex items-center py-2 px-4 hover:bg-gray-100 text-red-500">
                                                        <FaTrash className="w-4 h-4 mr-2" /> Eliminar
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {/* Mostrar el rango de elementos */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{visibleRangeText}</span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                        onPageChange={onPageChange}
                    />
                </div>

            </div>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>{isEditing ? 'Editar Carrera' : 'Agregar Carrera'}</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <CustomInput
                                label="Nombre de la Carrera"
                                name="carrera"
                                pattern={/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/}
                                errorMessage="Solo letras y espacios"
                                errors={errors}
                                register={register}
                                trigger={trigger}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <LoadingButton
                                isLoading={isLoading}
                                loadingLabel="Cargando..."
                                normalLabel={isEditing ? 'Actualizar' : 'Agregar'}
                            />
                            <Button color="gray" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default CarrerasCrud;
