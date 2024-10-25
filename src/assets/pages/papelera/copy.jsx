import React, { useState, useEffect } from 'react';
import { MdAssignment, MdDescription } from 'react-icons/md';
import { FaPlus, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import TitlePage from './TitlePage'; // Asegúrate de importar correctamente tus componentes
import Paragraphs from './Paragraphs';
import Tabs from './Tabs';
import FloatingLabelInput from './FloatingLabelInput';
import CustomInputOnchange from './CustomInputOnchange';
import Tooltip from './Tooltip';

const DetallePracticaDocente = ({ detalleActividad }) => {
  const [editedData, setEditedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (detalleActividad && detalleActividad.rubros) {
      setEditedData(detalleActividad.rubros);
    }
  }, [detalleActividad]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (index, field, value) => {
    const updatedData = [...editedData];
    updatedData[index][field] = value;
    setEditedData(updatedData);
  };

  // Función para agregar un nuevo rubro
  const handleAddRubro = () => {
    const newRubro = {
      intValor: '', // Inicializar con valores vacíos o predeterminados
      descripcion: '',
      valorMaximo: 10, // Valor máximo por defecto
      // Otros campos necesarios para el rubro
    };
    setEditedData([...editedData, newRubro]);
  };

  // Función para eliminar un rubro por índice
  const handleDeleteRubro = (index) => {
    const updatedData = editedData.filter((_, i) => i !== index);
    setEditedData(updatedData);
  };

  // Función para guardar los cambios (opcional)
  const handleSave = () => {
    setIsEditing(false);
    // Aquí podrías realizar la lógica para guardar los cambios en el backend
    console.log('Datos guardados:', editedData);
  };

  // Función para habilitar la edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <section className="w-full flex flex-col">
      <TitlePage label={detalleActividad.vchNombre} />
      <Paragraphs className="ml-3" label={detalleActividad.vchDescripcion} />

      <Tabs>
        <Tabs.Item title="Instrucciones" icon={MdDescription}>
          <div className="p-4">
            <p>{detalleActividad.vchInstrucciones}</p>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Rúbrica" icon={MdAssignment}>
          <div className="flex flex-col gap-4">
            {editedData.map((rubro, index) => (
              <div key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <FloatingLabelInput
                      value={rubro.descripcion}
                      onChange={(e) => handleInputChange(index, 'descripcion', e.target.value)}
                      label="Descripción"
                    />
                    <CustomInputOnchange
                      value={rubro.intValor}
                      onChange={(e) => handleInputChange(index, 'intValor', e.target.value)}
                      label="Valor"
                      type="number"
                    />
                    <Tooltip content="Eliminar rubro">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteRubro(index)}
                      >
                        <FaTrash />
                      </button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <p className="text-lg">{rubro.descripcion}</p>
                    <p className="text-lg">{rubro.intValor}</p>
                  </>
                )}
              </div>
            ))}

            {isEditing && (
              <Tooltip content="Agregar nuevo rubro">
                <button
                  type="button"
                  className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleAddRubro}
                >
                  <FaPlus className="mr-2" />
                  Agregar Rubro
                </button>
              </Tooltip>
            )}

            <div className="mt-4">
              {isEditing ? (
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleSave}
                >
                  <FaSave className="mr-2" />
                  Guardar Cambios
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={handleEdit}
                >
                  <FaEdit className="mr-2" />
                  Editar Rúbrica
                </button>
              )}
            </div>
          </div>
        </Tabs.Item>
      </Tabs>
    </section>
  );
};

export default DetallePracticaDocente;
