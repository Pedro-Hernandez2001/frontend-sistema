// AppContext.js - Contexto global para manejar el estado de la aplicación
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  currentView: 'login', // 'login', 'mesero', 'admin', 'orden', 'menuComida', 'menuBebida', 'menuPostre'
  userRole: null, // 'mesero', 'admin'
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
    
    login: (role) => dispatch({ type: ActionTypes.LOGIN, payload: { role } }),
    
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    
    selectMesa: (mesa) => dispatch({ type: ActionTypes.SELECT_MESA, payload: mesa }),
    
    addItem: (item) => dispatch({ type: ActionTypes.ADD_ITEM, payload: item }),
    
    removeItem: (itemId) => dispatch({ type: ActionTypes.REMOVE_ITEM, payload: itemId }),
    
    clearPedido: () => dispatch({ type: ActionTypes.CLEAR_PEDIDO }),
    
    showMenu: (menuType) => dispatch({ type: ActionTypes.SHOW_MENU, payload: menuType }),
    
    hideMenu: () => dispatch({ type: ActionTypes.HIDE_MENU }),
    
    confirmPedido: () => {
      // Aquí podrías enviar el pedido a un servidor
      console.log('Pedido confirmado:', state.pedido);
      alert(`Pedido confirmado para ${state.selectedMesa?.numero}\nTotal: $${state.pedido.total}`);
      dispatch({ type: ActionTypes.CONFIRM_PEDIDO });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export { ActionTypes };