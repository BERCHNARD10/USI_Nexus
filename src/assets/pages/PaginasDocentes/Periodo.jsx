import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tooltip, Pagination } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Components from '../../components/Components';
const { LoadingButton, ConfirmDeleteModal, IconButton, CustomInput, InfoAlert } = Components;
import { IoMdAdd } from 'react-icons/io';
import { useForm } from 'react-hook-form';

const PeriodosCrud = () => {
    const [periodos, setPeriodos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [idPeriodo, setIdPeriodo] = useState('');
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [periodoToDelete, setPeriodoToDelete] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = periodos.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPeriodos = periodos.slice(indexOfFirstItem, indexOfLastItem);
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
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetchPeriodos();
    }, [idPeriodo]);

    const fetchPeriodos = async () => {
        try {
            const response = await fetch(`${apiUrl}periodos.php`);
            const data = await response.json();
            if (data.done) {
                setPeriodos(data.message);
            } else {
                console.error('Error fetching periodos:', data.message);
            }
        } catch (error) {
            console.error('Error fetching periodos:', error);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        reset();
        setModalOpen(true);
    };

    const handleEdit = (periodo) => {
        setIdPeriodo(periodo);
        setIsEditing(true);
        setModalOpen(true);
        setValue('periodo', periodo.vchPeriodo);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}periodosCrud.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ periodoID: periodoToDelete }),
            });
            const data = await response.json();
            if (data.done) {
                setOpenModalDelete(false);
                fetchPeriodos();
                setServerResponse(`Éxito: ${data.message}`);
            } else {
                setServerResponse(`Error: ${data.message}`);
                console.error('Error deleting periodo:', data);
            }
        } catch (error) {
            console.error('Error deleting periodo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (formData) => {
        setIsLoading(true);
        console.log("periodo", idPeriodo);

        try {
            const url = `${apiUrl}periodosCrud.php`;
            const method = 'POST';
            console.log("es edicion", isEditing);
            console.log("formData", formData);

            const body = isEditing
                ? { periodoID: idPeriodo.intIdPeriodo, nuevoNombre: formData.periodo }
                : { nuevoPeriodo: formData.periodo };
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.done) {
                fetchPeriodos();
                setModalOpen(false);
                setServerResponse(`Éxito: ${data.message}`);
            } else {
                setServerResponse(`Error: ${data.message}`);
                console.error('Error saving periodo:', data.message);
            }
        } catch (error) {
            console.error('Error saving periodo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleActionsMenu = (intIdPeriodo) => {
        setIsMenuOpen(isMenuOpen === intIdPeriodo ? null : intIdPeriodo);
    };

    return (
        <section className="flex flex-col">
            <InfoAlert
                message={serverResponse}
                type={serverResponse.includes('Éxito') ? 'success' : 'error'}
                isVisible={!!serverResponse}
                onClose={() => setServerResponse('')}
            />
            <ConfirmDeleteModal
                open={openModalDelete}
                onClose={() => setOpenModalDelete(false)}
                onConfirm={handleDelete}
                message="¿Estás seguro de que deseas eliminar este periodo?"
            />

            <h1 className="m-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Periodos</h1>
            <div className="w-full mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 grid gap-4">
                <IconButton
                    className="ml-2"
                    Icon={IoMdAdd}
                    message="Añadir Periodos"
                    onClick={handleAdd}
                />

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>No</Table.HeadCell>
                        <Table.HeadCell>Nombre</Table.HeadCell>
                        <Table.HeadCell>Acciones</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {currentPeriodos.map((periodo, index) => (
                            <Table.Row key={periodo.intIdPeriodo} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{index + 1 + (currentPage - 1) * itemsPerPage}</Table.Cell>
                                <Table.Cell>{periodo.vchPeriodo}</Table.Cell>
                                <Table.Cell className="px-4 py-3 flex items-center justify-end">
                                    <Tooltip content="Acciones" placement="left">
                                        <button
                                            onClick={() => toggleActionsMenu(periodo.intIdPeriodo)}
                                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:text-gray-400"
                                        >
                                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                    </Tooltip>

                                    {isMenuOpen === periodo.intIdPeriodo && (
                                        <div className="mr-12 absolute z-10 w-32 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                                            <ul className="py-1 text-sm">
                                                <li>
                                                    <button onClick={() => handleEdit(periodo)} className="flex items-center py-2 px-4 hover:bg-gray-100 dark:text-gray-200">
                                                        <FaEdit className="w-4 h-4 mr-2" /> Editar
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => { setOpenModalDelete(true); setPeriodoToDelete(periodo.intIdPeriodo); }} className="flex items-center py-2 px-4 hover:bg-gray-100 text-red-500">
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
                <div className="mt-2 flex items-center justify-between">
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                        showIcons
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                    />
                    <p className="text-sm font-medium">{visibleRangeText}</p>
                </div>
            </div>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>
                    {isEditing ? 'Editar Periodo' : 'Nuevo Periodo'}
                </Modal.Header>
                <Modal.Body>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <CustomInput
                            register={register}
                            name="periodo"
                            label="Nombre del Periodo"
                            placeholder="Periodo"
                            errors={errors}
                            validate={{ required: 'El nombre del periodo es obligatorio' }}
                            trigger={trigger}
                        />
                        <LoadingButton
                            type="submit"
                            isLoading={isLoading}
                            loadingLabel="Cargando..."
                            normalLabel={isEditing ? 'Actualizar' : 'Guardar'}
                        />
                    </form>
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default PeriodosCrud;
