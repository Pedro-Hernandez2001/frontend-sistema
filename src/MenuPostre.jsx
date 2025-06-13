import React, { useEffect, useState } from 'react';
import { useApp } from './AppContext';
import './MenuPostre.css';

const MenuPostre = () => {
  const { actions } = useApp();
  const [postres, setPostres] = useState([]);

  const volverAOrden = () => {
    actions.setView('orden');
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/postres')
      .then(res => res.json())
      .then(data => setPostres(data))
      .catch(err => console.error('Error al cargar postres:', err));
  }, []);

  // Filtrar postres por categoría
  const postresTradicionales = postres.filter(p => p.categoria === 'tradicional');
  const helados = postres.filter(p => p.categoria === 'helado');
  const dulcesRegionales = postres.filter(p => p.categoria === 'dulceRegional');

  const obtenerDulzura = (nivel) => {
    const sweets = [];
    for (let i = 1; i <= 3; i++) {
      let className = "sweet-icon";
      if (i <= nivel) {
        className += i === 1 ? " mild" : i === 2 ? " medium" : " sweet";
      } else {
        className += " mild";
      }
      sweets.push(<span key={i} className={className}>🍯</span>);
    }
    return sweets;
  };

  const agregarCarrito = (postre) => {
    console.log(`Agregando ${postre.nombre} al carrito`);


    actions.addItem({
    id: postre.id, // ID del producto real
    nombre: postre.nombre,
    precio: postre.precio,
    cantidad: 1,
    tipo: "postre", // importante para detalle_orden
    producto_id: postre.id // explícito por claridad
  });
    actions.setView('orden');
  };

  const renderizarCategoria = (titulo, postresCategoria, icono) => (
    <div className="postre-section">
      <div className="postre-category-title">
        <h2>
          <span className="postre-icon">{icono}</span>
          {titulo}
        </h2>
      </div>
      <div className="postres-grid">
        {postresCategoria.map(postre => (
          <div key={postre.id} className="postre-card">
            {postre.casero && (
              <div className="casero-badge">Casero</div>
            )}
            <div className="postre-image">
              <img src={postre.imagen} alt={postre.nombre} />
              <div className="postre-price">${postre.precio}</div>
            </div>
            <div className="postre-content">
              <h3 className="postre-name">{postre.nombre}</h3>
              <p className="postre-description">{postre.descripcion}</p>
              <div className="postre-details">
                <span className="postre-porcion">🍽️ {postre.porcion}</span>
                <span className="postre-calorias">{postre.calorias}</span>
              </div>
              <div className="dulzura-level">
                <span>Dulzura:</span>
                {obtenerDulzura(postre.dulzura)}
              </div>
              <div className="postre-actions">
                <button 
                  className="postre-btn primary"
                  onClick={() => agregarCarrito(postre)}
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
    <div className="menu-postre-container">
      <div className="postre-header">
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
        <h1>Carta de Postres Tradicionales</h1>
        <p>Un dulce sabor como el día de hoy</p>
        <div className="mezcal-badge">🍃 Postres 100% gurmet 🍃</div>
      </div>

      {renderizarCategoria('Postres Tradicionales', postresTradicionales, '🍮')}
      {renderizarCategoria('Helados Artesanales', helados, '🍦')}
      {renderizarCategoria('Dulces Regionales', dulcesRegionales, '🍬')}
    </div>
  );
};

export default MenuPostre;
