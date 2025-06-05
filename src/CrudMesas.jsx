import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import './CrudMesas.css';

const CrudMesas = () => {
  const { actions } = useApp();
  
  // Estado para las mesas - INICIALIZAR VACÍO
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    numero: '',
    capacidad: 2,
    ubicacion: 'Interior',
    estado: 'disponible',
    descripcion: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Cargar mesas al montar el componente
  useEffect(() => {
    console.log('🔄 Componente CrudMesas montado, cargando datos...');
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

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agregar nueva mesa
  const handleAddMesa = async () => {
    if (!formData.numero) {
      alert('Por favor ingresa el número de mesa');
      return;
    }

    try {
      console.log('➕ Agregando mesa al backend:', formData);
      
      const response = await fetch('http://localhost:8080/api/mesas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📨 Respuesta del servidor:', response.status);
      const result = await response.json();
      console.log('📋 Resultado:', result);

      if (result.success) {
        alert(`Mesa "${formData.numero}" agregada exitosamente`);
        
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMesas();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error agregando mesa:', err);
      alert('Error al agregar mesa: ' + err.message);
    }
  };

  // Editar mesa
  const handleEditMesa = (mesa) => {
    console.log('✏️ Editando mesa:', mesa);
    setFormData({
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      ubicacion: mesa.ubicacion,
      estado: mesa.estado,
      descripcion: mesa.descripcion || ''
    });
    setEditingId(mesa.id);
    setIsFormVisible(true);
  };

  // Actualizar mesa
  const handleUpdateMesa = async () => {
    if (!formData.numero) {
      alert('Por favor ingresa el número de mesa');
      return;
    }

    try {
      console.log('📝 Actualizando mesa ID:', editingId, formData);
      
      const response = await fetch(`http://localhost:8080/api/mesas/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('📋 Resultado actualización:', result);

      if (result.success) {
        alert('Mesa actualizada exitosamente');
        
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMesas();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error actualizando mesa:', err);
      alert('Error al actualizar mesa: ' + err.message);
    }
  };

  // Eliminar mesa
  const handleDeleteMesa = async (id) => {
    const mesa = mesas.find(m => m.id === id);
    if (window.confirm(`¿Estás seguro de eliminar la ${mesa.numero}?`)) {
      try {
        console.log('🗑️ Eliminando mesa ID:', id);
        
        const response = await fetch(`http://localhost:8080/api/mesas/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();
        console.log('📋 Resultado eliminación:', result);

        if (result.success) {
          alert('Mesa eliminada exitosamente');
          
          // RECARGAR DATOS DESDE EL BACKEND
          await fetchMesas();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (err) {
        console.error('❌ Error eliminando mesa:', err);
        alert('Error al eliminar mesa: ' + err.message);
      }
    }
  };

  // Cambiar estado de la mesa
  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      console.log('🔄 Cambiando estado de mesa ID:', id, 'a:', nuevoEstado);
      
      const response = await fetch(`http://localhost:8080/api/mesas/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const result = await response.json();
      console.log('📋 Resultado cambio estado:', result);

      if (result.success) {
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMesas();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error cambiando estado:', err);
      alert('Error al cambiar estado: ' + err.message);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      numero: '',
      capacidad: 2,
      ubicacion: 'Interior',
      estado: 'disponible',
      descripcion: ''
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  // Volver al admin
  const handleBackToAdmin = () => {
    actions.setView('admin');
  };

  // Mostrar formulario
  const showAddForm = () => {
    resetForm();
    setIsFormVisible(true);
  };

  // Función para refrescar manualmente
  const handleRefresh = () => {
    console.log('🔄 Refrescando datos manualmente...');
    fetchMesas();
  };

  if (loading) {
    return (
      <div className="crud-meseros-container">
        <div className="crud-header">
          <button className="back-button" onClick={handleBackToAdmin}>
            ← Volver al Admin
          </button>
          <h1>🪑 Gestión de Mesas</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>🔄 Cargando mesas desde el servidor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crud-meseros-container">
        <div className="crud-header">
          <button className="back-button" onClick={handleBackToAdmin}>
            ← Volver al Admin
          </button>
          <h1>🪑 Gestión de Mesas</h1>
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
    <div className="crud-meseros-container">
      <div className="crud-header">
        <button className="back-button" onClick={handleBackToAdmin}>
          ← Volver al Admin
        </button>
        <h1>🪑 Gestión de Mesas</h1>
        <p>Configura la distribución y capacidad de las mesas</p>
      </div>

      <div className="crud-content">
        {/* Lista de mesas */}
        <div className="meseros-list">
          <div className="list-header">
            <h2 className="list-title">
              Mesas Configuradas ({mesas.length})
              <button 
                onClick={handleRefresh} 
                style={{ 
                  marginLeft: '10px', 
                  padding: '5px 10px', 
                  fontSize: '12px',
                  background: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🔄 Refrescar
              </button>
            </h2>
            <button className="add-new-button" onClick={showAddForm}>
              ➕ Agregar Mesa
            </button>
          </div>

          <div className="meseros-grid">
            {mesas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🪑</div>
                <h3>No hay mesas configuradas</h3>
                <p>Agrega la primera mesa para comenzar</p>
              </div>
            ) : (
              mesas.map(mesa => (
                <div key={mesa.id} className="mesero-item">
                  <div className="mesero-info">
                    <h3>{mesa.numero}</h3>
                    <div className="mesero-details">
                      <span className="detail-tag">👥 {mesa.capacidad} personas</span>
                      <span className="detail-tag">📍 {mesa.ubicacion}</span>
                      <span className={`detail-tag ${mesa.estado}`}>
                        {mesa.estado === 'disponible' ? '✅ Disponible' : 
                         mesa.estado === 'ocupada' ? '🔴 Ocupada' : '🟡 Reservada'}
                      </span>
                    </div>
                    {mesa.descripcion && (
                      <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '5px 0 0 0' }}>
                        {mesa.descripcion}
                      </p>
                    )}
                    <p style={{ fontSize: '10px', color: '#95a5a6', margin: '2px 0 0 0' }}>
                      ID: {mesa.id} | Creado: {mesa.fechaCreacion ? new Date(mesa.fechaCreacion).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="mesero-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => handleEditMesa(mesa)}
                    >
                      ✏️ Editar
                    </button>
                    {mesa.estado !== 'disponible' && (
                      <button 
                        className="action-button"
                        style={{ background: 'rgba(0, 184, 148, 0.1)', color: '#00b894' }}
                        onClick={() => handleChangeEstado(mesa.id, 'disponible')}
                      >
                        🔄 Liberar
                      </button>
                    )}
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteMesa(mesa.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Formulario */}
        {isFormVisible && (
          <div className="mesero-form">
            <h3 className="form-title">
              {editingId ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
            </h3>

            <div className="form-group">
              <label htmlFor="numero">Número/Nombre de Mesa *</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                placeholder="Ej: Mesa 1, Mesa VIP, etc."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacidad">Capacidad (personas) *</label>
              <select
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleInputChange}
              >
                <option value={2}>2 personas</option>
                <option value={4}>4 personas</option>
                <option value={6}>6 personas</option>
                <option value={8}>8 personas</option>
                <option value={10}>10 personas</option>
                <option value={12}>12 personas</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ubicacion">Ubicación</label>
              <select
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
              >
                <option value="Interior">Interior</option>
                <option value="Terraza">Terraza</option>
                <option value="Salón principal">Salón principal</option>
                <option value="Área VIP">Área VIP</option>
                <option value="Jardín">Jardín</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado inicial</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción (opcional)</label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ej: Mesa junto a la ventana, Mesa romántica..."
              />
            </div>

            <div className="form-actions">
              <button 
                className="form-button primary"
                onClick={editingId ? handleUpdateMesa : handleAddMesa}
              >
                {editingId ? '💾 Actualizar' : '➕ Agregar'}
              </button>
              <button 
                className="form-button secondary"
                onClick={resetForm}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudMesas;