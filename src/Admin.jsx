import React, { useState } from 'react';
import { useApp } from './AppContext';
import './Admin.css';

const Admin = () => {
  const { actions } = useApp();
  
  // Estados para las estadísticas (simuladas)
  const [stats, setStats] = useState({
    meseros: { total: 8, activos: 6 },
    mesas: { total: 12, ocupadas: 4 },
    comida: { total: 45, populares: 12 },
    bebidas: { total: 28, populares: 8 },
    postres: { total: 15, populares: 5 }
  });

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      actions.logout();
    }
  };

  // Funciones para manejar las acciones CRUD
  const handleMeseros = (action) => {
    console.log(`Acción ${action} para meseros`);
    switch(action) {
      case 'ver':
        actions.setView('crudMeseros');
        break;
      case 'agregar':
        actions.setView('crudMeseros');
        break;
      default:
        break;
    }
  };

  const handleMesas = (action) => {
    console.log(`Acción ${action} para mesas`);
    switch(action) {
      case 'ver':
        actions.setView('crudMesas');
        break;
      case 'configurar':
        actions.setView('crudMesas');
        break;
      default:
        break;
    }
  };

  const handleComida = (action) => {
    console.log(`Acción ${action} para menú de comida`);
    switch(action) {
      case 'ver':
        actions.setView('crudMenuComida');
        break;
      case 'agregar':
        actions.setView('crudMenuComida');
        break;
      default:
        break;
    }
  };

  const handleBebidas = (action) => {
    console.log(`Acción ${action} para bebidas`);
    switch(action) {
      case 'ver':
        actions.setView('crudMenuBebida');
        break;
      case 'agregar':
        actions.setView('crudMenuBebida');
        break;
      default:
        break;
    }
  };

  const handlePostres = (action) => {
    console.log(`Acción ${action} para postres`);
    switch(action) {
      case 'ver':
        actions.setView('crudMenuPostre');
        break;
      case 'agregar':
        actions.setView('crudMenuPostre');
        break;
      default:
        break;
    }
  };

  const handleDashboard = () => {
    actions.setView('dashboard');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button 
          className="logout-button" 
          onClick={handleLogout}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(231, 76, 60, 0.1)',
            color: '#e74c3c',
            border: '2px solid rgba(231, 76, 60, 0.2)',
            padding: '10px 15px',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🚪 Cerrar Sesión
        </button>
        <h1>Panel de Administración</h1>
        <p>Gestiona todos los aspectos de tu restaurante desde un solo lugar</p>
      </div>

      <div className="admin-grid">
        {/* Card Dashboard */}
        <div className="admin-card dashboard" style={{'--card-color-1': '#667eea', '--card-color-2': '#764ba2'}}>
          <div className="card-icon">
            📊
          </div>
          <h3 className="card-title">Dashboard Ejecutivo</h3>
          <p className="card-description">
            Visualiza estadísticas, reportes y resumen de actividad del restaurante
          </p>
          
          <div className="card-stats">
            <div className="stat-item">
              <div className="stat-number">47</div>
              <div className="stat-label">Órdenes hoy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$8,950</div>
              <div className="stat-label">Ventas</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button primary"
              onClick={handleDashboard}
            >
              📈 Ver Dashboard
            </button>
          </div>
        </div>

        {/* Card de Meseros */}
        <div className="admin-card meseros">
          <div className="card-icon">
            👥
          </div>
          <h3 className="card-title">Gestión de Meseros</h3>
          <p className="card-description">
            Administra el personal de servicio, horarios y asignaciones de mesas
          </p>
          
          <div className="card-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.meseros.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.meseros.activos}</div>
              <div className="stat-label">Activos</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button primary"
              onClick={() => handleMeseros('ver')}
            >
              👁️ Ver Meseros
            </button>
            <button 
              className="action-button secondary"
              onClick={() => handleMeseros('agregar')}
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        {/* Card de Mesas */}
        <div className="admin-card mesas">
          <div className="card-icon">
            🪑
          </div>
          <h3 className="card-title">Configuración de Mesas</h3>
          <p className="card-description">
            Configura la distribución, capacidad y estado de las mesas del restaurante
          </p>
          
          <div className="card-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.mesas.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.mesas.ocupadas}</div>
              <div className="stat-label">Ocupadas</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button primary"
              onClick={() => handleMesas('ver')}
            >
              🏗️ Ver Mesas
            </button>
            <button 
              className="action-button secondary"
              onClick={() => handleMesas('configurar')}
            >
              ⚙️ Configurar
            </button>
          </div>
        </div>

        {/* Card de Menú de Comida */}
        <div className="admin-card comida">
          <div className="card-icon">
            🍽️
          </div>
          <h3 className="card-title">Menú de Comida</h3>
          <p className="card-description">
            Gestiona platillos principales, entradas, ingredientes y precios
          </p>
          
          <div className="card-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.comida.total}</div>
              <div className="stat-label">Platillos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.comida.populares}</div>
              <div className="stat-label">Populares</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button primary"
              onClick={() => handleComida('ver')}
            >
              📋 Ver Menú
            </button>
            <button 
              className="action-button secondary"
              onClick={() => handleComida('agregar')}
            >
              🍴 Agregar Platillo
            </button>
          </div>
        </div>

        {/* Card de Bebidas */}
        <div className="admin-card bebidas">
          <div className="card-icon">
            🥤
          </div>
          <h3 className="card-title">Menú de Bebidas</h3>
          <p className="card-description">
            Administra bebidas alcohólicas, refrescos, jugos y bebidas calientes
          </p>
          
          <div className="card-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.bebidas.total}</div>
              <div className="stat-label">Bebidas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.bebidas.populares}</div>
              <div className="stat-label">Populares</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button primary"
              onClick={() => handleBebidas('ver')}
            >
              🍹 Ver Bebidas
            </button>
            <button 
              className="action-button secondary"
              onClick={() => handleBebidas('agregar')}
            >
              ➕ Agregar Bebida
            </button>
          </div>
        </div>

        {/* Card de Postres */}
        <div className="admin-card postres">
          <div className="card-icon">
            🍰
          </div>
          <h3 className="card-title">Menú de Postres</h3>
          <p className="card-description">
            Gestiona postres, dulces, helados y especialidades dulces de la casa
          </p>
          
          <div className="card-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.postres.total}</div>
              <div className="stat-label">Postres</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.postres.populares}</div>
              <div className="stat-label">Populares</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-button primary"
              onClick={() => handlePostres('ver')}
            >
              🧁 Ver Postres
            </button>
            <button 
              className="action-button secondary"
              onClick={() => handlePostres('agregar')}
            >
              🍪 Agregar Postre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;