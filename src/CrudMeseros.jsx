import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import './CrudMeseros.css';

const CrudMeseros = () => {
  const { actions } = useApp();
  
  // Estado para los meseros - INICIALIZAR VACÍO
  const [meseros, setMeseros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    nombre: '',
    telefono: '',
    turno: 'matutino',
    estado: 'activo'
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Cargar meseros al montar el componente
  useEffect(() => {
    console.log('🔄 Componente CrudMeseros montado, cargando datos...');
    fetchMeseros();
  }, []);

  // Función para obtener todos los meseros desde el backend
  const fetchMeseros = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Haciendo petición a: http://localhost:8080/api/meseros');
      
      const response = await fetch('http://localhost:8080/api/meseros', {
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
      console.log('📋 Meseros obtenidos del backend:', data);
      console.log('📊 Total de meseros:', data.length);
      
      // ACTUALIZAR ESTADO CON DATOS REALES
      setMeseros(data);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error al obtener meseros:', err);
      setError('Error al cargar los meseros: ' + err.message);
      setMeseros([]); // Limpiar en caso de error
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

  // Agregar nuevo mesero
  const handleAddMesero = async () => {
    if (!formData.nombre || !formData.usuario || !formData.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log('➕ Agregando mesero al backend:', formData);
      
      const response = await fetch('http://localhost:8080/api/meseros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fechaIngreso: new Date().toISOString().split('T')[0]
        })
      });

      console.log('📨 Respuesta del servidor:', response.status);
      const result = await response.json();
      console.log('📋 Resultado:', result);

      if (result.success) {
        alert(`Mesero "${formData.nombre}" agregado exitosamente`);
        
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMeseros();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error agregando mesero:', err);
      alert('Error al agregar mesero: ' + err.message);
    }
  };

  // Editar mesero
  const handleEditMesero = (mesero) => {
    console.log('✏️ Editando mesero:', mesero);
    setFormData({
      usuario: mesero.usuario,
      password: '', // No mostramos la contraseña actual
      nombre: mesero.nombre,
      telefono: mesero.telefono || '',
      turno: mesero.turno,
      estado: mesero.estado || 'activo'
    });
    setEditingId(mesero.id);
    setIsFormVisible(true);
  };

  // Actualizar mesero
  const handleUpdateMesero = async () => {
    if (!formData.nombre || !formData.usuario) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log('📝 Actualizando mesero ID:', editingId, formData);
      
      const response = await fetch(`http://localhost:8080/api/meseros/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('📋 Resultado actualización:', result);

      if (result.success) {
        alert('Mesero actualizado exitosamente');
        
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMeseros();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error actualizando mesero:', err);
      alert('Error al actualizar mesero: ' + err.message);
    }
  };

  // Eliminar mesero
  const handleDeleteMesero = async (id) => {
    const mesero = meseros.find(m => m.id === id);
    if (window.confirm(`¿Estás seguro de eliminar a ${mesero.nombre}?`)) {
      try {
        console.log('🗑️ Eliminando mesero ID:', id);
        
        const response = await fetch(`http://localhost:8080/api/meseros/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();
        console.log('📋 Resultado eliminación:', result);

        if (result.success) {
          alert('Mesero eliminado exitosamente');
          
          // RECARGAR DATOS DESDE EL BACKEND
          await fetchMeseros();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (err) {
        console.error('❌ Error eliminando mesero:', err);
        alert('Error al eliminar mesero: ' + err.message);
      }
    }
  };

  // Cambiar estado del mesero
  const handleToggleEstado = async (id) => {
    const mesero = meseros.find(m => m.id === id);
    const nuevoEstado = mesero.estado === 'activo' ? 'inactivo' : 'activo';
    
    try {
      console.log('🔄 Cambiando estado del mesero ID:', id, 'a:', nuevoEstado);
      
      const response = await fetch(`http://localhost:8080/api/meseros/${id}/estado`, {
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
        await fetchMeseros();
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
      usuario: '',
      password: '',
      nombre: '',
      telefono: '',
      turno: 'matutino',
      estado: 'activo'
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
    fetchMeseros();
  };

  if (loading) {
    return (
      <div className="crud-meseros-container">
        <div className="crud-header">
          <button className="back-button" onClick={handleBackToAdmin}>
            ← Volver al Admin
          </button>
          <h1>👥 Gestión de Meseros</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>🔄 Cargando meseros desde el servidor...</p>
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
          <h1>👥 Gestión de Meseros</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>❌ {error}</p>
          <button onClick={fetchMeseros} style={{ marginTop: '10px', padding: '10px 20px' }}>
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
        <h1>👥 Gestión de Meseros</h1>
        <p>Administra el personal de servicio del restaurante</p>
      </div>

      <div className="crud-content">
        {/* Lista de meseros */}
        <div className="meseros-list">
          <div className="list-header">
            <h2 className="list-title">
              Meseros Registrados ({meseros.length})
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
              ➕ Agregar Mesero
            </button>
          </div>

          <div className="meseros-grid">
            {meseros.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No hay meseros registrados</h3>
                <p>Agrega el primer mesero para comenzar</p>
              </div>
            ) : (
              meseros.map(mesero => (
                <div key={mesero.id} className="mesero-item">
                  <div className="mesero-info">
                    <h3>{mesero.nombre}</h3>
                    <div className="mesero-details">
                      <span className="detail-tag">👤 {mesero.usuario}</span>
                      <span className="detail-tag">📱 {mesero.telefono || 'Sin teléfono'}</span>
                      <span className="detail-tag">🕐 {mesero.turno}</span>
                      <span className={`detail-tag ${mesero.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                        {mesero.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </div>
                    {mesero.fechaIngreso && (
                      <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '5px 0 0 0' }}>
                        Fecha de ingreso: {mesero.fechaIngreso}
                      </p>
                    )}
                    <p style={{ fontSize: '10px', color: '#95a5a6', margin: '2px 0 0 0' }}>
                      ID: {mesero.id} | Creado: {mesero.fechaCreacion ? new Date(mesero.fechaCreacion).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="mesero-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => handleEditMesero(mesero)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="action-button"
                      style={{ 
                        background: mesero.estado === 'activo' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(0, 184, 148, 0.1)', 
                        color: mesero.estado === 'activo' ? '#e74c3c' : '#00b894' 
                      }}
                      onClick={() => handleToggleEstado(mesero.id)}
                    >
                      {mesero.estado === 'activo' ? '🚫 Desactivar' : '✅ Activar'}
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteMesero(mesero.id)}
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
              {editingId ? 'Editar Mesero' : 'Agregar Nuevo Mesero'}
            </h3>

            <div className="form-group">
              <label htmlFor="nombre">Nombre completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez López"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="usuario">Usuario *</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                placeholder="Ej: juan.perez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {editingId ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={editingId ? 'Nueva contraseña...' : 'Contraseña...'}
                required={!editingId}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ej: 951-123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="turno">Turno</label>
              <select
                id="turno"
                name="turno"
                value={formData.turno}
                onChange={handleInputChange}
              >
                <option value="matutino">Matutino (6:00 - 14:00)</option>
                <option value="vespertino">Vespertino (14:00 - 22:00)</option>
                <option value="nocturno">Nocturno (22:00 - 6:00)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                className="form-button primary"
                onClick={editingId ? handleUpdateMesero : handleAddMesero}
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

export default CrudMeseros;