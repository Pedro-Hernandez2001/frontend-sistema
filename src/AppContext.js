// AppContext.js - Contexto global para manejar el estado de la aplicación
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  currentView: 'login', // 'login', 'mesero', 'admin', 'orden', 'menuComida', 'menuBebida', 'menuPostre'
  userRole: null, // 'mesero', 'admin'
  currentUser: null,
  selectedMesa: null,
  pedido: {
    mesa: null,
    items: [],
    total: 0
  },
  showMenu: null // null, 'comida', 'bebida', 'postre'
};

// Tipos de acciones
const ActionTypes = {
  SET_VIEW: 'SET_VIEW',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SELECT_MESA: 'SELECT_MESA',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_PEDIDO: 'CLEAR_PEDIDO',
  SHOW_MENU: 'SHOW_MENU',
  HIDE_MENU: 'HIDE_MENU',
  CONFIRM_PEDIDO: 'CONFIRM_PEDIDO'
};

// Reducer para manejar las acciones
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_VIEW:
      return {
        ...state,
        currentView: action.payload
      };
      
    case ActionTypes.LOGIN:
      return {
        ...state,
        userRole: action.payload.role,
         currentUser: action.payload.user, 
        currentView: action.payload.role === 'admin' ? 'admin' : 'mesero'
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        currentView: 'login'
      };
      
    case ActionTypes.SELECT_MESA:
      return {
        ...state,
        selectedMesa: action.payload,
        pedido: {
          ...state.pedido,
          mesa: action.payload
        },
        currentView: 'orden'
      };
      
    case ActionTypes.ADD_ITEM:
      const newItem = {
        ...action.payload,
        id: Date.now() + Math.random(), // ID único
        cantidad: 1
      };
      
      // Verificar si el item ya existe
      const existingItemIndex = state.pedido.items.findIndex(
        item => item.nombre === newItem.nombre
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Si existe, incrementar cantidad
        updatedItems = state.pedido.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        updatedItems = [...state.pedido.items, newItem];
      }
      
      const newTotal = updatedItems.reduce(
        (total, item) => total + (item.precio * item.cantidad), 0
      );
      
      return {
        ...state,
        pedido: {
          ...state.pedido,
          items: updatedItems,
          total: newTotal
        }
      };
      
    case ActionTypes.REMOVE_ITEM:
      const filteredItems = state.pedido.items.filter(
        item => item.id !== action.payload
      );
      
      const updatedTotal = filteredItems.reduce(
        (total, item) => total + (item.precio * item.cantidad), 0
      );
      
      return {
        ...state,
        pedido: {
          ...state.pedido,
          items: filteredItems,
          total: updatedTotal
        }
      };
      
    case ActionTypes.CLEAR_PEDIDO:
      return {
        ...state,
        pedido: {
          mesa: state.selectedMesa,
          items: [],
          total: 0
        }
      };
      
    case ActionTypes.SHOW_MENU:
      return {
        ...state,
        showMenu: action.payload
      };
      
    case ActionTypes.HIDE_MENU:
      return {
        ...state,
        showMenu: null
      };
      
    case ActionTypes.CONFIRM_PEDIDO:
      return {
        ...state,
        pedido: {
          mesa: null,
          items: [],
          total: 0
        },
        currentView: 'mesero',
        selectedMesa: null,
        showMenu: null
      };
      
    default:
      return state;
  }
};

// Crear contexto
const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

// Proveedor del contexto
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Acciones
  const actions = {
    setView: (view) => dispatch({ type: ActionTypes.SET_VIEW, payload: view }),
    
    login: (user, role) => dispatch({ type: ActionTypes.LOGIN, payload: { user, role } }),
    
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    
    selectMesa: (mesa) => dispatch({ type: ActionTypes.SELECT_MESA, payload: mesa }),
    
    addItem: (item) => dispatch({ type: ActionTypes.ADD_ITEM, payload: item }),
    
    removeItem: (itemId) => dispatch({ type: ActionTypes.REMOVE_ITEM, payload: itemId }),
    
    clearPedido: () => dispatch({ type: ActionTypes.CLEAR_PEDIDO }),
    
    showMenu: (menuType) => dispatch({ type: ActionTypes.SHOW_MENU, payload: menuType }),
    
    hideMenu: () => dispatch({ type: ActionTypes.HIDE_MENU }),
    
    confirmPedido: async () => {
      try {
        // Preparar los datos del pedido
        const pedidoData = {
          mesa_id: state.selectedMesa?.id || state.selectedMesa,  // depende si selectedMesa es objeto o solo id
          mesero_id: state.currentUser?.id,
          estado: 'pendiente',
          total: state.pedido.total
          // fecha_creacion se asigna en la BD automáticamente
        };

        // Enviar la orden al backend
        const response = await fetch('http://localhost:8080/api/ordenes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pedidoData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Error al crear la orden');
        }

        console.log('Orden creada:', result);
        alert(`Pedido confirmado para mesa ${state.selectedMesa?.numero || pedidoData.mesa_id}\nTotal: $${state.pedido.total}`);

        // Limpiar pedido y volver a vista mesero
        dispatch({ type: ActionTypes.CONFIRM_PEDIDO });

      } catch (error) {
        alert('No se pudo crear la orden: ' + error.message);
        console.error(error);
      }
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export { ActionTypes };