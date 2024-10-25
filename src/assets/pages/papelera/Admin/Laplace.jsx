// SideNav.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación

const MateriasAlum = () => { 
    const [valorInicial, setValorInicial] = useState('');
    const [tasa, setTasa] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [resultado, setResultado] = useState(null);
  
    const handleCalcular = () => {
      const valorFinal = parseFloat(valorInicial) * Math.pow(1 + parseFloat(tasa), parseInt(tiempo));
      setResultado(valorFinal);
    };
  
    return (
      <div>
        <h2>Calculadora Crecimiento o Decrecimiento</h2>
        <div>
          <label>Valor Inicial:</label>
          <input type="number" value={valorInicial} onChange={(e) => setValorInicial(e.target.value)} />
        </div>
        <div>
          <label>Tasa de Crecimiento/Decrecimiento:</label>
          <input type="number" value={tasa} onChange={(e) => setTasa(e.target.value)} />
        </div>
        <div>
          <label>Tiempo (en años):</label>
          <input type="number" value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
        </div>
        <button onClick={handleCalcular}>Calcular</button>
        {resultado !== null && (
          <div>
            {tasa > 0 ? (
              <p>El valor después de {tiempo} años con una tasa de crecimiento del {tasa * 100}% será: {resultado}</p>
            ) : tasa < 0 ? (
              <p>El valor después de {tiempo} años con una tasa de decrecimiento del {-tasa * 100}% será: {resultado}</p>
            ) : (
              <p>La tasa de crecimiento o decrecimiento debe ser distinta de cero.</p>
            )}
          </div>
        )}
      </div>
  );
};

export default MateriasAlum;
