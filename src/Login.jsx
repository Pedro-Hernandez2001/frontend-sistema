import React, { useState } from 'react';
import { useApp } from './AppContext';
import './Login.css';

const Login = () => {
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.usuario) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('Enviando datos de login:', formData);
      
      // Hacer petición real al backend Node.js
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          password: formData.password
        })
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.success) {
        // Login exitoso
        console.log('Login exitoso:', data.user);
        
        // Determinar el rol del usuario
        const role = data.user.rol === 'administrador' ? 'admin' : 'mesero';
        
        // Guardar información del usuario si es necesario
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Llamar a la función de login del contexto
        actions.login(role);
        
      } else {
        // Error de autenticación
        setErrors({ general: data.message || 'Credenciales incorrectas' });
      }
      
    } catch (error) {
      console.error('Error en la petición:', error);
      setErrors({ 
        general: 'Error de conexión. Verifica que el servidor esté corriendo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="restaurant-image">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Restaurante" 
            />
          </div>
          <h1>Bienvenido</h1>
          <p>Accede al sistema de tu restaurante</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className={errors.usuario ? 'error' : ''}
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
            />
            {errors.usuario && (
              <span className="error-message">{errors.usuario}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p style={{ color: '#7f8c8d', fontSize: '12px', textAlign: 'center', margin: '10px 0 0 0' }}>
            Usa "Pedro" y "Pedro1311" para probar el login real
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;