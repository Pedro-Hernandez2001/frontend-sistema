import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import './Mesero.css';

const Mesero = () => {
  const { actions } = useApp();
  
  // Estado para las mesas - INICIALIZAR VACÍO
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar mesas al montar el componente
  useEffect(() => {
    console.log('🔄 Componente Mesero montado, cargando mesas...');
    fetchMesas();
  }, []);

  // Función para obtener todas las mesas desde el backend
  const fetchMesas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Haciendo petición a: http://localhost:8080/api/mesas');
      
      const response = await fetch('http://localhost:8080/api/mesas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📨 Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📋 Mesas obtenidas del backend:', data);
      console.log('📊 Total de mesas:', data.length);
      
      // ACTUALIZAR ESTADO CON DATOS REALES
      setMesas(data);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error al obtener mesas:', err);
      setError('Error al cargar las mesas: ' + err.message);
      setMesas([]); // Limpiar en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      actions.logout();
    }
  };
  const { state } = useApp();
  const { currentUser } = state;

  // Función para cambiar el estado de una mesa
  const cambiarEstadoMesa = async (mesaId, nuevoEstado) => {
      try {
        console.log('🔄 Cambiando estado de mesa ID:', mesaId, 'a:', nuevoEstado);

        // Si el estado es 'ocupada' creamos la orden primero
        if (nuevoEstado === 'ocupada') {
          if (!currentUser || !currentUser.id) {
            alert('No hay mesero logueado para asignar la orden.');
            return;
          }

          const ordenResponse = await fetch('http://localhost:8080/api/ordenes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mesa_id: mesaId,
              mesero_id: currentUser.id,
              estado: 'pendiente',
              total: 0
            }),
          });

          const ordenResult = await ordenResponse.json();

          if (!ordenResponse.ok) {
            throw new Error(ordenResult.message || 'Error al crear la orden');
          }

          alert(`Orden creada para mesa ${mesaId} correctamente.`);
        }

        // Cambiar el estado de la mesa
        const response = await fetch(`http://localhost:8080/api/mesas/${mesaId}/estado`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: nuevoEstado })
        });

        const result = await response.json();
        console.log('📋 Resultado cambio estado:', result);

        if (result.success) {
          await fetchMesas(); // asegúrate de que esta función también esté definida en tu componente

          const mesa = mesas.find(m => m.id === mesaId);
          alert(`${mesa.numero} ahora está ${nuevoEstado}`);
        } else {
          alert('Error: ' + result.message);
        }
      } catch (err) {
        console.error('❌ Error cambiando estado:', err);
        alert('Error al cambiar estado: ' + err.message);
      }
};


  // Función para manejar la selección de mesa
  const seleccionarMesa = (mesa) => {
    console.log('Mesa seleccionada:', mesa);
    
    // Solo permitir seleccionar mesas disponibles u ocupadas
    if (mesa.estado === 'reservada') {
      alert('Esta mesa está reservada. Primero debes cambiar su estado.');
      return;
    }
    
    // Si la mesa está disponible, cambiarla a ocupada automáticamente
    if (mesa.estado === 'disponible') {
      if (window.confirm(`¿Quieres ocupar la ${mesa.numero} para tomar una orden?`)) {
        cambiarEstadoMesa(mesa.id, 'ocupada').then(() => {
          // Después de ocupar la mesa, navegar a la orden
          setTimeout(() => {
            actions.selectMesa(mesa);
          }, 500);
        });
      }
    } else {
      // Si ya está ocupada, ir directamente a la orden
      actions.selectMesa(mesa);
    }
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    const estados = {
      disponible: 'Disponible',
      ocupada: 'Ocupada',
      reservada: 'Reservada'
    };
    return estados[estado] || estado;
  };

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    const colores = {
      disponible: '#27ae60',
      ocupada: '#e74c3c',
      reservada: '#f39c12'
    };
    return colores[estado] || '#95a5a6';
  };

  // Función para obtener los botones de acción según el estado
  const obtenerAcciones = (mesa) => {
    switch (mesa.estado) {
      case 'disponible':
        return (
          <>
            <button 
              className="mesa-button primary"
              onClick={(e) => {
                e.stopPropagation();
                cambiarEstadoMesa(mesa.id, 'ocupada');
              }}
            >
              🪑 Ocupar
            </button>
            <button 
              className="mesa-button secondary"
              onClick={(e) => {
                e.stopPropagation();
                cambiarEstadoMesa(mesa.id, 'reservada');
              }}
            >
              📅 Reservar
            </button>
          </>
        );
      case 'ocupada':
        return (
          <>
            <button 
              className="mesa-button primary"
              onClick={(e) => {
                e.stopPropagation();
                seleccionarMesa(mesa);
              }}
            >
              📋 Ver Orden
            </button>
            <button 
              className="mesa-button secondary"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`¿Liberar ${mesa.numero}? Se perderán las órdenes pendientes.`)) {
                  cambiarEstadoMesa(mesa.id, 'disponible');
                }
              }}
            >
              ✅ Liberar
            </button>
          </>
        );
      case 'reservada':
        return (
          <>
            <button 
              className="mesa-button primary"
              onClick={(e) => {
                e.stopPropagation();
                cambiarEstadoMesa(mesa.id, 'ocupada');
              }}
            >
              🪑 Ocupar
            </button>
            <button 
              className="mesa-button secondary"
              onClick={(e) => {
                e.stopPropagation();
                cambiarEstadoMesa(mesa.id, 'disponible');
              }}
            >
              ❌ Cancelar Reserva
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // Función para refrescar manualmente
  const handleRefresh = () => {
    console.log('🔄 Refrescando mesas manualmente...');
    fetchMesas();
  };

  if (loading) {
    return (
      <div className="mesero-container">
        <div className="mesero-header">
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
          <h1>Gestión de Mesas</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>🔄 Cargando mesas desde el servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mesero-container">
        <div className="mesero-header">
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
          <h1>Gestión de Mesas</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>❌ {error}</p>
          <button onClick={fetchMesas} style={{ marginTop: '10px', padding: '10px 20px' }}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mesero-container">
      <div className="mesero-header">
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
        <h1>Gestión de Mesas</h1>
        <p>Administra el estado de las mesas del restaurante</p>
        <button 
          onClick={handleRefresh} 
          style={{ 
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(52, 152, 219, 0.1)',
            color: '#3498db',
            border: '2px solid rgba(52, 152, 219, 0.2)',
            padding: '10px 15px',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔄 Refrescar
        </button>
      </div>

      <div className="mesas-grid">
        {mesas.map((mesa) => (
          <div 
            key={mesa.id}
            className="mesa-card"
            onClick={() => seleccionarMesa(mesa)}
            style={{ cursor: 'pointer' }}
          >
            <div className="mesa-image">
              <div style={{
                width: '100%',
                height: '150px',
                background: `linear-gradient(135deg, ${obtenerColorEstado(mesa.estado)}20, ${obtenerColorEstado(mesa.estado)}40)`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: obtenerColorEstado(mesa.estado)
              }}>
                {mesa.estado === 'disponible' ? '🪑' : 
                 mesa.estado === 'ocupada' ? '👥' : '📅'}
              </div>
            </div>
            
            <div className="mesa-info">
              <h3 className="mesa-numero">{mesa.numero}</h3>
              <p className="mesa-capacidad">
                👥 {mesa.capacidad} {mesa.capacidad === 1 ? 'persona' : 'personas'}
              </p>
              <p className="mesa-ubicacion">
                📍 {mesa.ubicacion}
              </p>
              
              <div 
                className={`mesa-estado ${mesa.estado}`}
                style={{ 
                  background: `${obtenerColorEstado(mesa.estado)}20`,
                  color: obtenerColorEstado(mesa.estado),
                  border: `2px solid ${obtenerColorEstado(mesa.estado)}40`
                }}
              >
                <span 
                  className={`estado-indicator ${mesa.estado}`}
                  style={{ backgroundColor: obtenerColorEstado(mesa.estado) }}
                ></span>
                {obtenerTextoEstado(mesa.estado)}
              </div>

              {mesa.descripcion && (
                <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '5px 0' }}>
                  {mesa.descripcion}
                </p>
              )}
              
              <div className="mesa-actions">
                {obtenerAcciones(mesa)}
              </div>

              <p style={{ fontSize: '10px', color: '#95a5a6', margin: '5px 0 0 0' }}>
                ID: {mesa.id} | Actualizada: {mesa.fechaActualizacion ? new Date(mesa.fechaActualizacion).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {mesas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No hay mesas disponibles</h3>
          <p>Contacta al administrador para configurar las mesas</p>
        </div>
      )}
    </div>
  );
};

export default Mesero;