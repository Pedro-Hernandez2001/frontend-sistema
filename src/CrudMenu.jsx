import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import './CrudMeseros.css'; // Reutilizamos los estilos

const CrudMenu = ({ tipo }) => {
  const { actions } = useApp();
  
  // Estado para los items del menú - INICIALIZAR VACÍO
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el formulario dinámico según el tipo
  const [formData, setFormData] = useState(getInitialFormData(tipo));
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Configuración según el tipo de menú
  const getMenuConfig = (tipo) => {
    const configs = {
      comida: {
        title: '🍽️ Gestión de Menú - Comida',
        subtitle: 'Administra los platillos del menú tradicional oaxaqueño',
        icon: '🍽️',
        itemName: 'Platillo',
        itemsName: 'Platillos'
      },
      bebida: {
        title: '🥤 Gestión de Menú - Bebidas',
        subtitle: 'Administra las bebidas tradicionales oaxaqueñas',
        icon: '🥤',
        itemName: 'Bebida',
        itemsName: 'Bebidas'
      },
      postre: {
        title: '🍰 Gestión de Menú - Postres',
        subtitle: 'Administra los postres y dulces tradicionales oaxaqueños',
        icon: '🍰',
        itemName: 'Postre',
        itemsName: 'Postres'
      }
    };
    return configs[tipo] || configs.comida;
  };

  const config = getMenuConfig(tipo);

  // Función para obtener datos iniciales del formulario según el tipo
  function getInitialFormData(tipo) {
    const base = {
      nombre: '',
      descripcion: '',
      precio: '',
      disponible: true
    };

    switch (tipo) {
      case 'comida':
        return {
          ...base,
          picante: 1,
          ingredientes: '',
          especialidad: false
        };
      case 'bebida':
        return {
          ...base,
          tamaño: '',
          alcohol: 'Sin alcohol',
          artesanal: false
        };
      case 'postre':
        return {
          ...base,
          porcion: '',
          calorias: '',
          dulzura: 2,
          casero: false
        };
      default:
        return base;
    }
  }

  // Cargar items al montar el componente
  useEffect(() => {
    console.log(`🔄 Componente CrudMenu (${tipo}) montado, cargando datos...`);
    fetchMenuItems();
  }, [tipo]);

  // Función para obtener todos los items del menú desde el backend
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📡 Haciendo petición a: http://localhost:8080/api/menu/tipo/${tipo}`);
      
      const response = await fetch(`http://localhost:8080/api/menu/tipo/${tipo}`, {
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
      console.log(`📋 ${config.itemsName} obtenidos del backend:`, data);
      console.log(`📊 Total de ${config.itemsName.toLowerCase()}:`, data.length);
      
      // ACTUALIZAR ESTADO CON DATOS REALES
      setMenuItems(data);
      setError(null);
      
    } catch (err) {
      console.error(`❌ Error al obtener ${config.itemsName.toLowerCase()}:`, err);
      setError(`Error al cargar los ${config.itemsName.toLowerCase()}: ` + err.message);
      setMenuItems([]); // Limpiar en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Agregar nuevo item
  const handleAddItem = async () => {
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log(`➕ Agregando ${config.itemName.toLowerCase()} al backend:`, formData);
      
      // Preparar datos según el tipo
      const requestData = {
        ...formData,
        tipo: tipo,
        precio: parseFloat(formData.precio)
      };

      // Agregar campos específicos según el tipo
      if (tipo === 'comida') {
        requestData.picante = parseInt(formData.picante);
        requestData.especialidad = formData.especialidad;
      } else if (tipo === 'bebida') {
        requestData.artesanal = formData.artesanal;
      } else if (tipo === 'postre') {
        requestData.dulzura = parseInt(formData.dulzura);
        requestData.casero = formData.casero;
      }
      
      const response = await fetch('http://localhost:8080/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('📨 Respuesta del servidor:', response.status);
      const result = await response.json();
      console.log('📋 Resultado:', result);

      if (result.success) {
        alert(`${config.itemName} "${formData.nombre}" agregado exitosamente`);
        
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMenuItems();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(`❌ Error agregando ${config.itemName.toLowerCase()}:`, err);
      alert(`Error al agregar ${config.itemName.toLowerCase()}: ` + err.message);
    }
  };

  // Editar item
  const handleEditItem = (item) => {
    console.log(`✏️ Editando ${config.itemName.toLowerCase()}:`, item);
    
    const baseData = {
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: item.precio.toString(),
      disponible: item.disponible
    };

    // Agregar campos específicos según el tipo
    let specificData = {};
    if (tipo === 'comida') {
      specificData = {
        picante: item.picante || 1,
        ingredientes: item.ingredientes || '',
        especialidad: item.especialidad || false
      };
    } else if (tipo === 'bebida') {
      specificData = {
        tamaño: item.tamaño || '',
        alcohol: item.alcohol || 'Sin alcohol',
        artesanal: item.artesanal || false
      };
    } else if (tipo === 'postre') {
      specificData = {
        porcion: item.porcion || '',
        calorias: item.calorias || '',
        dulzura: item.dulzura || 2,
        casero: item.casero || false
      };
    }

    setFormData({ ...baseData, ...specificData });
    setEditingId(item.id);
    setIsFormVisible(true);
  };

  // Actualizar item
  const handleUpdateItem = async () => {
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log(`📝 Actualizando ${config.itemName.toLowerCase()} ID:`, editingId, formData);
      
      // Preparar datos según el tipo
      const requestData = {
        ...formData,
        precio: parseFloat(formData.precio)
      };

      // Agregar campos específicos según el tipo
      if (tipo === 'comida') {
        requestData.picante = parseInt(formData.picante);
        requestData.especialidad = formData.especialidad;
      } else if (tipo === 'bebida') {
        requestData.artesanal = formData.artesanal;
      } else if (tipo === 'postre') {
        requestData.dulzura = parseInt(formData.dulzura);
        requestData.casero = formData.casero;
      }
      
      const response = await fetch(`http://localhost:8080/api/menu/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      console.log('📋 Resultado actualización:', result);

      if (result.success) {
        alert(`${config.itemName} actualizado exitosamente`);
        
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMenuItems();
        resetForm();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(`❌ Error actualizando ${config.itemName.toLowerCase()}:`, err);
      alert(`Error al actualizar ${config.itemName.toLowerCase()}: ` + err.message);
    }
  };

  // Eliminar item
  const handleDeleteItem = async (id) => {
    const item = menuItems.find(m => m.id === id);
    if (window.confirm(`¿Estás seguro de eliminar "${item.nombre}"?`)) {
      try {
        console.log(`🗑️ Eliminando ${config.itemName.toLowerCase()} ID:`, id);
        
        const response = await fetch(`http://localhost:8080/api/menu/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();
        console.log('📋 Resultado eliminación:', result);

        if (result.success) {
          alert(`${config.itemName} eliminado exitosamente`);
          
          // RECARGAR DATOS DESDE EL BACKEND
          await fetchMenuItems();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (err) {
        console.error(`❌ Error eliminando ${config.itemName.toLowerCase()}:`, err);
        alert(`Error al eliminar ${config.itemName.toLowerCase()}: ` + err.message);
      }
    }
  };

  // Cambiar disponibilidad
  const handleToggleDisponibilidad = async (id) => {
    const item = menuItems.find(m => m.id === id);
    const nuevaDisponibilidad = !item.disponible;
    
    try {
      console.log(`🔄 Cambiando disponibilidad del ${config.itemName.toLowerCase()} ID:`, id, 'a:', nuevaDisponibilidad);
      
      const response = await fetch(`http://localhost:8080/api/menu/${id}/disponibilidad`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disponible: nuevaDisponibilidad })
      });

      const result = await response.json();
      console.log('📋 Resultado cambio disponibilidad:', result);

      if (result.success) {
        // RECARGAR DATOS DESDE EL BACKEND
        await fetchMenuItems();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error cambiando disponibilidad:', err);
      alert('Error al cambiar disponibilidad: ' + err.message);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData(getInitialFormData(tipo));
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
    fetchMenuItems();
  };

  // Renderizar campos específicos según el tipo
  const renderSpecificFields = () => {
    switch (tipo) {
      case 'comida':
        return (
          <>
            <div className="form-group">
              <label htmlFor="picante">Nivel de picante</label>
              <select
                id="picante"
                name="picante"
                value={formData.picante}
                onChange={handleInputChange}
              >
                <option value={1}>🌶️ Suave</option>
                <option value={2}>🌶️🌶️ Medio</option>
                <option value={3}>🌶️🌶️🌶️ Picante</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ingredientes">Ingredientes (separados por comas)</label>
              <input
                type="text"
                id="ingredientes"
                name="ingredientes"
                value={formData.ingredientes}
                onChange={handleInputChange}
                placeholder="Tortilla de maíz, Frijoles, Quesillo, Carne tasajo"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="especialidad"
                  checked={formData.especialidad}
                  onChange={handleInputChange}
                />
                Especialidad de la casa
              </label>
            </div>
          </>
        );

      case 'bebida':
        return (
          <>
            <div className="form-group">
              <label htmlFor="tamaño">Tamaño *</label>
              <select
                id="tamaño"
                name="tamaño"
                value={formData.tamaño}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un tamaño</option>
                <option value="60ml">60ml</option>
                <option value="250ml">250ml</option>
                <option value="300ml">300ml</option>
                <option value="500ml">500ml</option>
                <option value="750ml">750ml</option>
                <option value="1L">1L</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="alcohol">Contenido alcohólico</label>
              <select
                id="alcohol"
                name="alcohol"
                value={formData.alcohol}
                onChange={handleInputChange}
              >
                <option value="Sin alcohol">Sin alcohol</option>
                <option value="5% Vol">5% Vol (Cerveza)</option>
                <option value="12% Vol">12% Vol (Vino)</option>
                <option value="20% Vol">20% Vol (Licor suave)</option>
                <option value="40% Vol">40% Vol (Destilado)</option>
                <option value="45% Vol">45% Vol (Mezcal fuerte)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="artesanal"
                  checked={formData.artesanal}
                  onChange={handleInputChange}
                />
                Producto artesanal
              </label>
            </div>
          </>
        );

      case 'postre':
        return (
          <>
            <div className="form-group">
              <label htmlFor="porcion">Porción *</label>
              <select
                id="porcion"
                name="porcion"
                value={formData.porcion}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una porción</option>
                <option value="Porción individual">Porción individual</option>
                <option value="Porción para compartir">Porción para compartir</option>
                <option value="1 bola">1 bola</option>
                <option value="2 bolas">2 bolas</option>
                <option value="3 bolas">3 bolas</option>
                <option value="1 pieza">1 pieza</option>
                <option value="2 piezas">2 piezas</option>
                <option value="3 piezas">3 piezas</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="calorias">Calorías (opcional)</label>
              <input
                type="text"
                id="calorias"
                name="calorias"
                value={formData.calorias}
                onChange={handleInputChange}
                placeholder="Ej: 280 cal"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dulzura">Nivel de dulzura</label>
              <select
                id="dulzura"
                name="dulzura"
                value={formData.dulzura}
                onChange={handleInputChange}
              >
                <option value={1}>🍯 Suave</option>
                <option value={2}>🍯🍯 Medio</option>
                <option value={3}>🍯🍯🍯 Muy dulce</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="casero"
                  checked={formData.casero}
                  onChange={handleInputChange}
                />
                Hecho en casa
              </label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Renderizar detalles específicos en la lista
  const renderItemDetails = (item) => {
    const baseDetails = [
      <span key="precio" className="detail-tag">💰 ${item.precio}</span>,
      <span key="disponible" className={`detail-tag ${item.disponible ? 'disponible' : 'no-disponible'}`}>
        {item.disponible ? '✅ Disponible' : '❌ No disponible'}
      </span>
    ];

    let specificDetails = [];
    
    if (tipo === 'comida') {
      if (item.picante) {
        const picanteIcons = '🌶️'.repeat(item.picante);
        specificDetails.push(<span key="picante" className="detail-tag">{picanteIcons}</span>);
      }
      if (item.especialidad) {
        specificDetails.push(
          <span key="especialidad" className="detail-tag" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f39c12' }}>
            ⭐ Especialidad
          </span>
        );
      }
    } else if (tipo === 'bebida') {
      if (item.tamaño) {
        specificDetails.push(<span key="tamaño" className="detail-tag">📏 {item.tamaño}</span>);
      }
      if (item.alcohol) {
        specificDetails.push(<span key="alcohol" className="detail-tag">🍷 {item.alcohol}</span>);
      }
      if (item.artesanal) {
        specificDetails.push(
          <span key="artesanal" className="detail-tag" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f39c12' }}>
            ⭐ Artesanal
          </span>
        );
      }
    } else if (tipo === 'postre') {
      if (item.porcion) {
        specificDetails.push(<span key="porcion" className="detail-tag">🍽️ {item.porcion}</span>);
      }
      if (item.calorias) {
        specificDetails.push(<span key="calorias" className="detail-tag">{item.calorias}</span>);
      }
      if (item.dulzura) {
        const dulzuraIcons = '🍯'.repeat(item.dulzura);
        specificDetails.push(<span key="dulzura" className="detail-tag">{dulzuraIcons}</span>);
      }
      if (item.casero) {
        specificDetails.push(
          <span key="casero" className="detail-tag" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f39c12' }}>
            🏠 Casero
          </span>
        );
      }
    }

    return [...specificDetails, ...baseDetails];
  };

  if (loading) {
    return (
      <div className="crud-meseros-container">
        <div className="crud-header">
          <button className="back-button" onClick={handleBackToAdmin}>
            ← Volver al Admin
          </button>
          <h1>{config.title}</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>🔄 Cargando {config.itemsName.toLowerCase()} desde el servidor...</p>
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
          <h1>{config.title}</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>❌ {error}</p>
          <button onClick={fetchMenuItems} style={{ marginTop: '10px', padding: '10px 20px' }}>
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
        <h1>{config.title}</h1>
        <p>{config.subtitle}</p>
      </div>

      <div className="crud-content">
        {/* Lista de items del menú */}
        <div className="meseros-list">
          <div className="list-header">
            <h2 className="list-title">
              {config.itemsName} del Menú ({menuItems.length})
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
              ➕ Agregar {config.itemName}
            </button>
          </div>

          <div className="meseros-grid">
            {menuItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{config.icon}</div>
                <h3>No hay {config.itemsName.toLowerCase()} en el menú</h3>
                <p>Agrega el primer {config.itemName.toLowerCase()} para comenzar</p>
              </div>
            ) : (
              menuItems.map(item => (
                <div key={item.id} className="mesero-item">
                  <div className="mesero-info">
                    <h3>{item.nombre}</h3>
                    <p style={{ fontSize: '14px', color: '#7f8c8d', margin: '5px 0 10px 0' }}>
                      {item.descripcion}
                    </p>
                    <div className="mesero-details">
                      {renderItemDetails(item)}
                    </div>
                    <p style={{ fontSize: '10px', color: '#95a5a6', margin: '2px 0 0 0' }}>
                      ID: {item.id} | Creado: {item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="mesero-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => handleEditItem(item)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="action-button"
                      style={{ 
                        background: item.disponible ? 'rgba(231, 76, 60, 0.1)' : 'rgba(0, 184, 148, 0.1)', 
                        color: item.disponible ? '#e74c3c' : '#00b894' 
                      }}
                      onClick={() => handleToggleDisponibilidad(item.id)}
                    >
                      {item.disponible ? '🚫 Deshabilitar' : '✅ Habilitar'}
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteItem(item.id)}
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
              {editingId ? `Editar ${config.itemName}` : `Agregar Nuevo ${config.itemName}`}
            </h3>

            <div className="form-group">
              <label htmlFor="nombre">Nombre del {config.itemName.toLowerCase()} *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder={`Ej: ${tipo === 'comida' ? 'Tlayudas Oaxaqueñas' : tipo === 'bebida' ? 'Mezcal Espadín Artesanal' : 'Flan Napolitano Oaxaqueño'}`}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder={`Describe el ${config.itemName.toLowerCase()}...`}
                rows="3"
                style={{ 
                  width: '100%', 
                  padding: '12px 15px', 
                  border: '2px solid #e1e8ed', 
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio (MXN) *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder={tipo === 'comida' ? '120' : tipo === 'bebida' ? '85' : '55'}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Campos específicos según el tipo */}
            {renderSpecificFields()}

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleInputChange}
                />
                Disponible en el menú
              </label>
            </div>

            <div className="form-actions">
              <button 
                className="form-button primary"
                onClick={editingId ? handleUpdateItem : handleAddItem}
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

export default CrudMenu;