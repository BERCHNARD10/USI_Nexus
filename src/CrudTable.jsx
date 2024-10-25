import React, { useState } from 'react';

function CrudTable({ title, items, addItem, deleteItem, updateItem }) {
  const [currentItem, setCurrentItem] = useState({ id: null, name: '' });

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCurrentItem({ ...currentItem, name: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentItem.id) {
      updateItem(currentItem);
    } else {
      addItem({ ...currentItem, id: Date.now() });
    }
    setCurrentItem({ id: null, name: '' });
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={currentItem.name}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder={`Agregar nueva ${title.toLowerCase()}`}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {currentItem.id ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center py-2 border-b">
            {item.name}
            <div className="space-x-2">
              <button onClick={() => handleEdit(item)} className="text-yellow-500">Editar</button>
              <button onClick={() => deleteItem(item.id)} className="text-red-500">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrudTable;
