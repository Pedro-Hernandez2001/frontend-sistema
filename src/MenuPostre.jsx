import React, { useState } from 'react';
import { useApp } from './AppContext';
import './MenuPostre.css';

const MenuPostre = () => {
  const { actions } = useApp();
  const [postres] = useState({
    tradicionales: [
      {
        id: 1,
        nombre: "Flan Napolitano Oaxaqueño",
        descripcion: "Flan tradicional con leche condensada y caramelo de piloncillo",
        precio: 55,
        porcion: "Porción individual",
        calorias: "280 cal",
        imagen: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 3,
        casero: true
      },
      {
        id: 2,
        nombre: "Nicuatole",
        descripcion: "Postre prehispánico de maíz con canela y azúcar, tradicional de Oaxaca",
        precio: 40,
        porcion: "Porción individual",
        calorias: "180 cal",
        imagen: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 2,
        casero: true
      },
      {
        id: 3,
        nombre: "Buñuelos con Miel",
        descripcion: "Buñuelos crujientes con miel de abeja y canela en polvo",
        precio: 45,
        porcion: "3 piezas",
        calorias: "320 cal",
        imagen: "https://images.unsplash.com/photo-1587241321921-91a834d6d191?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 3,
        casero: true
      }
    ],
    helados: [
      {
        id: 4,
        nombre: "Nieve de Leche Quemada",
        descripcion: "Helado artesanal con sabor a leche quemada, especialidad oaxaqueña",
        precio: 35,
        porcion: "2 bolas",
        calorias: "200 cal",
        imagen: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 2,
        casero: true
      },
      {
        id: 5,
        nombre: "Nieve de Tuna",
        descripcion: "Helado de tuna roja, fruta típica de la región oaxaqueña",
        precio: 30,
        porcion: "2 bolas",
        calorias: "150 cal",
        imagen: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 2,
        casero: true
      },
      {
        id: 6,
        nombre: "Nieve de Mamey",
        descripcion: "Helado cremoso de mamey con toque de vainilla natural",
        precio: 35,
        porcion: "2 bolas",
        calorias: "190 cal",
        imagen: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 2,
        casero: true
      }
    ],
    dulcesRegionales: [
      {
        id: 7,
        nombre: "Cocada Oaxaqueña",
        descripcion: "Dulce tradicional de coco rallado con leche condensada y canela",
        precio: 25,
        porcion: "2 piezas",
        calorias: "160 cal",
        imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 3,
        casero: true
      },
      {
        id: 8,
        nombre: "Alegría de Amaranto",
        descripcion: "Dulce prehispánico de amaranto con miel de piloncillo y cacahuates",
        precio: 20,
        porcion: "1 barra",
        calorias: "140 cal",
        imagen: "https://images.unsplash.com/photo-1559656914-a30970c1affd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 2,
        casero: true
      },
      {
        id: 9,
        nombre: "Jamoncillo de Pepita",
        descripcion: "Dulce de pepita de calabaza con azúcar morena, receta ancestral",
        precio: 30,
        porcion: "3 cubitos",
        calorias: "200 cal",
        imagen: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        dulzura: 3,
        casero: true
      }
    ]
  });

  // Función para obtener los íconos de dulzura
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

  // Función para manejar acciones
  const agregarCarrito = (postre) => {
    console.log(`Agregando ${postre.nombre} al carrito`);
    alert(`${postre.nombre} agregado al carrito - ${postre.precio}`);
  };

  // Componente para renderizar una categoría
  const renderizarCategoria = (titulo, postres, icono) => (
    <div className="postre-section">
      <div className="postre-category-title">
        <h2>
          <span className="postre-icon">{icono}</span>
          {titulo}
        </h2>
      </div>
      <div className="postres-grid">
        {postres.map(postre => (
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
};

export default MenuPostre;