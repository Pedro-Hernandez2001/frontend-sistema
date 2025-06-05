import React, { useState } from 'react';
import { useApp } from './AppContext';
import './MenuBebida.css';

const MenuBebida = () => {
  const { actions } = useApp();
  const [bebidas] = useState({
    mezcales: [
      {
        id: 1,
        nombre: "Mezcal Espadín Artesanal",
        descripcion: "Mezcal tradicional de agave espadín, destilado en horno de tierra",
        precio: 85,
        tamaño: "60ml",
        alcohol: "40% Vol",
        imagen: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      },
      {
        id: 2,
        nombre: "Mezcal Tobalá",
        descripcion: "Mezcal premium de agave tobalá silvestre, edición limitada",
        precio: 150,
        tamaño: "60ml",
        alcohol: "45% Vol",
        imagen: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      },
      {
        id: 3,
        nombre: "Mezcal con Gusano",
        descripcion: "Mezcal tradicional con gusano de maguey, sabor auténtico oaxaqueño",
        precio: 95,
        tamaño: "60ml",
        alcohol: "38% Vol",
        imagen: "https://images.unsplash.com/photo-1574095651064-e8d8b6151822?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: false
      }
    ],
    aguasFrescas: [
      {
        id: 4,
        nombre: "Agua de Jamaica",
        descripcion: "Refrescante agua de flor de jamaica con un toque de limón",
        precio: 25,
        tamaño: "500ml",
        alcohol: "Sin alcohol",
        imagen: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      },
      {
        id: 5,
        nombre: "Agua de Chía con Limón",
        descripcion: "Agua fresca de chía con limón y endulzante natural",
        precio: 30,
        tamaño: "500ml",
        alcohol: "Sin alcohol",
        imagen: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      },
      {
        id: 6,
        nombre: "Horchata de Arroz",
        descripcion: "Horchata tradicional oaxaqueña con canela y vainilla",
        precio: 35,
        tamaño: "500ml",
        alcohol: "Sin alcohol",
        imagen: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      }
    ],
    bebidasCalientes: [
      {
        id: 7,
        nombre: "Chocolate Oaxaqueño",
        descripcion: "Chocolate tradicional batido con molinillo, canela y almendras",
        precio: 45,
        tamaño: "300ml",
        alcohol: "Sin alcohol",
        imagen: "https://images.unsplash.com/photo-1542990253-0b8be23b4570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      },
      {
        id: 8,
        nombre: "Café de Olla",
        descripcion: "Café tradicional hervido en olla de barro con canela y piloncillo",
        precio: 35,
        tamaño: "250ml",
        alcohol: "Sin alcohol",
        imagen: "https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      },
      {
        id: 9,
        nombre: "Atole de Granillo",
        descripcion: "Atole tradicional de maíz granillo con canela y azúcar morena",
        precio: 30,
        tamaño: "300ml",
        alcohol: "Sin alcohol",
        imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        artesanal: true
      }
    ]
  });

  // Función para manejar acciones
  const agregarCarrito = (bebida) => {
    console.log(`Agregando ${bebida.nombre} al carrito`);
    // Agregar al carrito global y volver a la vista de orden
    actions.addItem(bebida);
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