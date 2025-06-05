import React, { useState } from 'react';
import { useApp } from './AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { actions } = useApp();
  
  // Estado para las estadísticas del dashboard
  const [stats] = useState({
    resumenDiario: {
      ordenes: 47,
      ventasTotal: 8950,
      mesasOcupadas: 6,
      meserosActivos: 4
    },
    ordenesRecientes: [
      {
        id: 'ORD-001',
        mesa: 'Mesa 3',
        mesero: 'Juan Pérez',
        items: 4,
        total: 280,
        estado: 'en_preparacion',
        hora: '14:30'
      },
      {
        id: 'ORD-002',
        mesa: 'Mesa 1',
        mesero: 'María González',
        items: 2,
        total: 150,
        estado: 'lista',
        hora: '14:25'
      },
      {
        id: 'ORD-003',
        mesa: 'Mesa 7',
        mesero: 'Carlos Ruiz',
        items: 6,
        total: 420,
        estado: 'pendiente',
        hora: '14:20'
      },
      {
        id: 'ORD-004',
        mesa: 'Mesa 4',
        mesero: 'Juan Pérez',
        items: 3,
        total: 200,
        estado: 'entregada',
        hora: '14:15'
      }
    ],
    platillosPopulares: [
      { nombre: 'Tlayudas Oaxaqueñas', ventas: 12, porcentaje: 25 },
      { nombre: 'Mole Negro', ventas: 8, porcentaje: 17 },
      { nombre: 'Mezcal Espadín', ventas: 15, porcentaje: 31 },
      { nombre: 'Agua de Jamaica', ventas: 10, porcentaje: 21 },
      { nombre: 'Flan Napolitano', ventas: 6, porcentaje: 13 }
    ],
    ventasPorHora: [
      { hora: '08:00', ventas: 450 },
      { hora: '10:00', ventas: 680 },
      { hora: '12:00', ventas: 1200 },
      { hora: '14:00', ventas: 1850 },
      { hora: '16:00', ventas: 980 },
      { hora: '18:00', ventas: 1650 },
      { hora: '20:00', ventas: 2140 }
    ]
  });

  // Volver al admin
  const handleBackToAdmin = () => {
    actions.setView('admin');
  };

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#f39c12',
      en_preparacion: '#3498db',
      lista: '#e67e22',
      entregada: '#27ae60',
      cancelada: '#e74c3c'
    };
    return colores[estado] || '#95a5a6';
  };

  // Obtener texto del estado
  const getEstadoTexto = (estado) => {
    const textos = {
      pendiente: 'Pendiente',
      en_preparacion: 'En Preparación',
      lista: 'Lista',
      entregada: 'Entregada',
      cancelada: 'Cancelada'
    };
    return textos[estado] || estado;
  };

  return (
    <div className="crud-meseros-container">
      <div className="crud-header">
        <button className="back-button" onClick={handleBackToAdmin}>
          ← Volver al Admin
        </button>
        <h1>📊 Dashboard Ejecutivo</h1>
        <p>Resumen de actividad y estadísticas del restaurante</p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gap: '25px' }}>
        
        {/* Tarjetas de resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="mesero-form" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
            <h3 style={{ color: '#3498db', margin: '0 0 5px 0' }}>{stats.resumenDiario.ordenes}</h3>
            <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>Órdenes del día</p>
          </div>
          
          <div className="mesero-form" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>💰</div>
            <h3 style={{ color: '#27ae60', margin: '0 0 5px 0' }}>${stats.resumenDiario.ventasTotal.toLocaleString()}</h3>
            <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>Ventas del día</p>
          </div>
          
          <div className="mesero-form" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🪑</div>
            <h3 style={{ color: '#e67e22', margin: '0 0 5px 0' }}>{stats.resumenDiario.mesasOcupadas}/12</h3>
            <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>Mesas ocupadas</p>
          </div>
          
          <div className="mesero-form" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>👥</div>
            <h3 style={{ color: '#9b59b6', margin: '0 0 5px 0' }}>{stats.resumenDiario.meserosActivos}</h3>
            <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>Meseros activos</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
          
          {/* Órdenes recientes */}
          <div className="meseros-list">
            <div className="list-header">
              <h2 className="list-title">📋 Órdenes Recientes</h2>
            </div>
            
            <div className="meseros-grid">
              {stats.ordenesRecientes.map(orden => (
                <div key={orden.id} className="mesero-item">
                  <div className="mesero-info">
                    <h3>{orden.id}</h3>
                    <div className="mesero-details">
                      <span className="detail-tag">🪑 {orden.mesa}</span>
                      <span className="detail-tag">👨‍🍳 {orden.mesero}</span>
                      <span className="detail-tag">📦 {orden.items} items</span>
                      <span className="detail-tag">💰 ${orden.total}</span>
                      <span className="detail-tag">🕐 {orden.hora}</span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span 
                        style={{ 
                          background: `${getEstadoColor(orden.estado)}20`, 
                          color: getEstadoColor(orden.estado),
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          border: `1px solid ${getEstadoColor(orden.estado)}40`
                        }}
                      >
                        {getEstadoTexto(orden.estado)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platillos populares */}
          <div className="mesero-form">
            <h3 className="form-title">🍽️ Más Populares Hoy</h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {stats.platillosPopulares.map((platillo, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                      {platillo.nombre}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {platillo.ventas} ventas
                    </div>
                  </div>
                  <div style={{ 
                    background: '#667eea', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {platillo.porcentaje}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de ventas por hora */}
        <div className="meseros-list">
          <div className="list-header">
            <h2 className="list-title">📈 Ventas por Hora</h2>
          </div>
          
          <div style={{ padding: '20px', display: 'grid', gap: '15px' }}>
            {stats.ventasPorHora.map((venta, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ minWidth: '60px', fontWeight: '600', color: '#2c3e50' }}>
                  {venta.hora}
                </div>
                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '30px',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      width: `${(venta.ventas / 2500) * 100}%`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '10px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    ${venta.ventas}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mesero-form">
          <h3 className="form-title">⚡ Acciones Rápidas</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button 
              className="form-button primary"
              onClick={() => actions.setView('admin')}
              style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              👥 Gestionar Meseros
            </button>
            <button 
              className="form-button primary"
              onClick={() => actions.setView('admin')}
              style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              🪑 Configurar Mesas
            </button>
            <button 
              className="form-button primary"
              onClick={() => actions.setView('admin')}
              style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              🍽️ Editar Menús
            </button>
            <button 
              className="form-button secondary"
              onClick={() => alert('Próximamente: Reportes detallados')}
              style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              📊 Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;