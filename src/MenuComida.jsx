import React, { useState } from 'react';
import { useApp } from './AppContext';
import './MenuComida.css';

const MenuComida = () => {
  const { actions } = useApp();
  const [platillos] = useState({
    antojitos: [
      {
        id: 1,
        nombre: "Tlayudas Oaxaqueñas",
        descripcion: "Tortilla gigante tostada con frijoles, quesillo, col, rábano y tu elección de carne",
        precio: 120,
        ingredientes: ["Tortilla de maíz", "Frijoles", "Quesillo", "Carne tasajo", "Col", "Rábano"],
        imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 2,
        especialidad: true
      },
      {
        id: 2,
        nombre: "Memelas de Frijol",
        descripcion: "Tortilla de maíz gruesa con frijoles refritos, quesillo y salsa verde",
        precio: 45,
        ingredientes: ["Masa de maíz", "Frijoles", "Quesillo", "Salsa verde"],
        imagen: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 1,
        especialidad: false
      },
      {
        id: 3,
        nombre: "Empanadas de Quesillo",
        descripcion: "Empanadas fritas rellenas de quesillo oaxaqueño con salsa de chile pasilla",
        precio: 35,
        ingredientes: ["Masa", "Quesillo", "Chile pasilla", "Cebolla"],
        imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 2,
        especialidad: false
      }
    ],
    platillosPrincipales: [
      {
        id: 4,
        nombre: "Mole Negro Oaxaqueño",
        descripcion: "El rey de los moles con pollo, acompañado de tortillas hechas a mano",
        precio: 180,
        ingredientes: ["Pollo", "Chiles", "Chocolate", "Especias", "Tortillas"],
        imagen: "https://images.unsplash.com/photo-1612462275651-645e00e01639?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 1,
        especialidad: true
      },
      {
        id: 5,
        nombre: "Tasajo Encebollado",
        descripcion: "Carne seca oaxaqueña con cebolla morada y chiles güeros",
        precio: 150,
        ingredientes: ["Tasajo", "Cebolla morada", "Chiles güeros", "Especias"],
        imagen: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 2,
        especialidad: true
      },
      {
        id: 6,
        nombre: "Estofado de Pollo Istmeño",
        descripcion: "Pollo guisado al estilo del istmo con verduras y especies regionales",
        precio: 140,
        ingredientes: ["Pollo", "Papa", "Zanahoria", "Achiote", "Especias"],
        imagen: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 1,
        especialidad: false
      }
    ],
    caldos: [
      {
        id: 7,
        nombre: "Caldo de Gato",
        descripcion: "Caldo tradicional zapoteco con frijoles tepari y verduras de la región",
        precio: 90,
        ingredientes: ["Frijoles tepari", "Verduras", "Hierba santa", "Chile pasilla"],
        imagen: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 1,
        especialidad: true
      },
      {
        id: 8,
        nombre: "Sopa de Guías",
        descripcion: "Sopa tradicional con guías de calabaza, flor de calabaza y chepil",
        precio: 70,
        ingredientes: ["Guías de calabaza", "Flor de calabaza", "Chepil", "Masa"],
        imagen: "https://images.unsplash.com/photo-1547592666-f5c65dd6775e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        picante: 1,
        especialidad: false
      }
    ]
  });

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

  // Función para manejar acciones
  const agregarCarrito = (platillo) => {
    console.log(`Agregando ${platillo.nombre} al carrito`);
    // Agregar al carrito global y volver a la vista de orden
    actions.addItem(platillo);
    actions.setView('orden');
  };

  const volverAOrden = () => {
    actions.setView('orden');
  };

  // Componente para renderizar una categoría
  const renderizarCategoria = (titulo, platillos, icono) => (
    <div className="category-section">
      <div className="category-title">
        <h2>
          <span className="category-icon">{icono}</span>
          {titulo}
        </h2>
      </div>
      <div className="platillos-grid">
        {platillos.map(platillo => (
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
                {platillo.ingredientes.map((ingrediente, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingrediente}
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
        <h1>Menú de Comida Tradicional</h1>
        <p>Auténticos sabores de Oaxaca en cada platillo</p>
        <div className="oaxaca-badge">🌽 Cocina Oaxaqueña Tradicional 🌽</div>
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