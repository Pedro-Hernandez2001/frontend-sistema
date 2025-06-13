import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import './MenuComida.css';

const MenuComida = () => {
  const { actions } = useApp();

  // Estado inicial vacío
  const [platillos, setPlatillos] = useState({
    antojitos: [],
    platillosPrincipales: [],
    caldos: []
  });

  useEffect(() => {
    // Aquí colocas la URL de tu backend que entrega los datos de platillos
    fetch('http://localhost:8080/api/platillos') 
      .then(response => response.json())
      .then(data => {
        // Suponiendo que data tiene la misma estructura { antojitos: [...], platillosPrincipales: [...], caldos: [...] }
        setPlatillos(data);
      })
      .catch(error => {
        console.error("Error al cargar platillos:", error);
        // Opcional: Puedes manejar un estado de error o usar datos por defecto
      });
  }, []);

  // (El resto de funciones y renderizado quedan igual)
  // Función para obtener los íconos de picante
  const obtenerPicante = (nivel) => {
    const chilis = [];
    for (let i = 1; i <= 3; i++) {
      let className = "chili-icon";
      if (i <= nivel) {
        className += i === 1 ? " mild" : i === 2 ? " medium" : " hot";
      } else {
        className += " mild";
      }
      chilis.push(<span key={i} className={className}>🌶️</span>);
    }
    return chilis;
  };

  const agregarCarrito = (platillo) => {
    console.log(`Agregando ${platillo.nombre} al carrito`);
    actions.addItem({
    id: platillo.id, // ID del producto real
    nombre: platillo.nombre,
    precio: platillo.precio,
    cantidad: 1,
    tipo: "platillo", // importante para detalle_orden
    producto_id: platillo.id // explícito por claridad
  });
    actions.setView('orden');
  };

  const volverAOrden = () => {
    actions.setView('orden');
  };

  const renderizarCategoria = (titulo, platillosCategoria, icono) => (
    <div className="category-section">
      <div className="category-title">
        <h2>
          <span className="category-icon">{icono}</span>
          {titulo}
        </h2>
      </div>
      <div className="platillos-grid">
        {platillosCategoria.map(platillo => (
          <div key={platillo.id} className="platillo-card">
            {platillo.especialidad && (
              <div className="specialty-badge">Especialidad</div>
            )}
            <div className="platillo-image">
              <img src={platillo.imagen} alt={platillo.nombre} />
              <div className="platillo-price">${platillo.precio}</div>
            </div>
            <div className="platillo-content">
              <h3 className="platillo-name">{platillo.nombre}</h3>
              <p className="platillo-description">{platillo.descripcion}</p>
              
              <div className="spice-level">
                <span>Picante:</span>
                {obtenerPicante(platillo.picante)}
              </div>
              
              <div className="platillo-ingredients">
  {(Array.isArray(platillo.ingredientes)
    ? platillo.ingredientes
    : typeof platillo.ingredientes === 'string'
      ? platillo.ingredientes.split(',')  // Convierte el string a array
      : []
  ).map((ingrediente, index) => (
    <span key={index} className="ingredient-tag">
      {ingrediente.trim()}
    </span>
  ))}
</div>

              
              <div className="platillo-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => agregarCarrito(platillo)}
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
    <div className="menu-comida-container">
      <div className="menu-header">
  <button className="back-button" onClick={volverAOrden}>
    ← Volver
  </button>
  <div className="menu-texts">
    <h1>Menú de Comida Tradicional</h1>
    <p>Auténticos sabores de Oaxaca en cada platillo</p>
    <div className="oaxaca-badge">🌽 Cocina Oaxaqueña Tradicional 🌽</div>
  </div>
</div>


      <div className="menu-categories">
        {renderizarCategoria("Antojitos Oaxaqueños", platillos.antojitos, "🌮")}
        {renderizarCategoria("Platillos Principales", platillos.platillosPrincipales, "🍽️")}
        {renderizarCategoria("Caldos y Sopas", platillos.caldos, "🍲")}
      </div>
    </div>
  );
};

export default MenuComida;
