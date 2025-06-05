import React from 'react';
import { useApp } from './AppContext';
import './Orden.css';

const Orden = () => {
  const { state, actions } = useApp();
  const { selectedMesa, pedido, showMenu } = state;

  const handleAddMenu = (menuType) => {
    actions.showMenu(menuType);
  };

  const handleRemoveItem = (itemId) => {
    actions.removeItem(itemId);
  };

  const handleConfirmPedido = () => {
    if (pedido.items.length === 0) {
      alert('Agrega algunos items al pedido antes de confirmar');
      return;
    }
    actions.confirmPedido();
  };

  const handleClearPedido = () => {
    if (pedido.items.length === 0) return;
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el pedido?')) {
      actions.clearPedido();
    }
  };

  const handleBackToMesas = () => {
    actions.setView('mesero');
  };

  return (
    <div className="orden-container">
      <div className="orden-header">
        <button className="back-button" onClick={handleBackToMesas}>
          ← Volver a Mesas
        </button>
        <h1>Nueva Orden</h1>
        <div className="mesa-info">
          📍 {selectedMesa?.numero} - {selectedMesa?.capacidad} personas
        </div>
      </div>

      <div className="orden-content">
        {/* Sección de Menús */}
        <div className="menus-section">
          <div className="menu-category">
            <div className="menu-header">
              <h3 className="menu-title">
                <span className="menu-icon">🍽️</span>
                Comida Tradicional
              </h3>
              <button 
                className="add-button"
                onClick={() => handleAddMenu('comida')}
              >
                +
              </button>
            </div>
            <p className="menu-description">
              Antojitos oaxaqueños, platillos principales y caldos tradicionales
            </p>
          </div>

          <div className="menu-category">
            <div className="menu-header">
              <h3 className="menu-title">
                <span className="menu-icon">🥤</span>
                Bebidas Típicas
              </h3>
              <button 
                className="add-button"
                onClick={() => handleAddMenu('bebida')}
              >
                +
              </button>
            </div>
            <p className="menu-description">
              Mezcales artesanales, aguas frescas y bebidas calientes
            </p>
          </div>

          <div className="menu-category">
            <div className="menu-header">
              <h3 className="menu-title">
                <span className="menu-icon">🍰</span>
                Postres Caseros
              </h3>
              <button 
                className="add-button"
                onClick={() => handleAddMenu('postre')}
              >
                +
              </button>
            </div>
            <p className="menu-description">
              Postres tradicionales, nieves artesanales y dulces regionales
            </p>
          </div>
        </div>

        {/* Sección del Pedido */}
        <div className="pedido-section">
          <div className="pedido-header">
            <h3 className="pedido-title">🛒 Pedido Actual</h3>
            <p className="pedido-count">
              {pedido.items.length} {pedido.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="pedido-items">
            {pedido.items.length === 0 ? (
              <div className="pedido-empty">
                <div className="pedido-empty-icon">🍽️</div>
                <p>No hay items en el pedido</p>
                <p>Agrega algunos platillos usando los botones +</p>
              </div>
            ) : (
              pedido.items.map((item) => (
                <div key={item.id} className="pedido-item">
                  <div className="item-info">
                    <h4 className="item-name">{item.nombre}</h4>
                    <div className="item-details">
                      <span>Cantidad: {item.cantidad}</span>
                      <span>Precio unitario: ${item.precio}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">
                      ${item.precio * item.cantidad}
                    </span>
                    <button 
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Eliminar item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pedido.items.length > 0 && (
            <>
              <div className="pedido-total">
                <p className="total-label">Total del Pedido</p>
                <h3 className="total-amount">${pedido.total}</h3>
              </div>

              <div className="action-buttons">
                <button 
                  className="confirm-button"
                  onClick={handleConfirmPedido}
                  disabled={pedido.items.length === 0}
                >
                  ✅ Confirmar Pedido
                </button>
                <button 
                  className="clear-button"
                  onClick={handleClearPedido}
                >
                  🗑️ Limpiar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orden;