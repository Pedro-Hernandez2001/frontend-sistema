import React, { useState, useEffect } from 'react';

import { useApp } from './AppContext';
import './MenuBebida.css';

const MenuBebida = () => {
  const { actions } = useApp();
  const [bebidas, setBebidas] = useState({
  mezcales: [],
  aguasFrescas: [],
  bebidasCalientes: []
});

useEffect(() => {
  fetch("http://localhost:8080/api/bebidas")
    .then(res => res.json())
    .then(data => {
      const mezcales = data.filter(b => b.categoria === "mezcales");
      const aguasFrescas = data.filter(b => b.categoria === "aguasFrescas");
      const bebidasCalientes = data.filter(b => b.categoria === "bebidasCalientes");

      setBebidas({ mezcales, aguasFrescas, bebidasCalientes });
    })
    .catch(err => console.error("Error al cargar bebidas", err));
}, []);


  // Función para manejar acciones
  const agregarCarrito = (bebida) => {
  console.log(`Agregando ${bebida.nombre} al carrito`);

  actions.addItem({
    id: bebida.id, // ID del producto real
    nombre: bebida.nombre,
    precio: bebida.precio,
    cantidad: 1,
    tipo: "bebida", // importante para detalle_orden
    producto_id: bebida.id // explícito por claridad
  });

  actions.setView('orden');
};

  const volverAOrden = () => {
    actions.setView('orden');
  };

  // Componente para renderizar una categoría
  const renderizarCategoria = (titulo, bebidas, icono) => (
    <div className="bebida-section">
      <div className="bebida-category-title">
        <h2>
          <span className="bebida-icon">{icono}</span>
          {titulo}
        </h2>
      </div>
      <div className="bebidas-grid">
        {bebidas.map(bebida => (
          <div key={bebida.id} className="bebida-card">
            {bebida.artesanal && (
              <div className="artesanal-badge">Artesanal</div>
            )}
            <div className="bebida-image">
              <img src={bebida.imagen} alt={bebida.nombre} />
              <div className="bebida-price">${bebida.precio}</div>
            </div>
            <div className="bebida-content">
              <h3 className="bebida-name">{bebida.nombre}</h3>
              <p className="bebida-description">{bebida.descripcion}</p>
              
              <div className="bebida-details">
                <span className="bebida-size">📏 {bebida.tamaño}</span>
                <span className="bebida-alcohol">{bebida.alcohol}</span>
              </div>
              
              <div className="bebida-actions">
                <button 
                  className="bebida-btn primary"
                  onClick={() => agregarCarrito(bebida)}
                >
                  🛒 Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="menu-bebida-container">
      <div className="bebida-header">
        <button 
          className="back-button" 
          onClick={volverAOrden}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(108, 117, 125, 0.1)',
            color: '#6c757d',
            border: '2px solid rgba(108, 117, 125, 0.2)',
            padding: '10px 15px',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          ← Volver
        </button>
        <h1>Carta de Bebidas Tradicionales</h1>
        <p>Desde mezcales artesanales hasta aguas frescas de la región</p>
        <div className="mezcal-badge">🍃 Bebidas 100% Oaxaqueñas 🍃</div>
      </div>

      <div className="bebida-categories">
        {renderizarCategoria("Mezcales Artesanales", bebidas.mezcales, "🥃")}
        {renderizarCategoria("Aguas Frescas", bebidas.aguasFrescas, "🧊")}
        {renderizarCategoria("Bebidas Calientes", bebidas.bebidasCalientes, "☕")}
      </div>
    </div>
  );
};

export default MenuBebida;