import React from 'react';
import { AppProvider, useApp } from './AppContext';
import Login from './Login';
import Admin from './Admin';
import Mesero from './Mesero';
import Orden from './Orden';
import MenuComida from './MenuComida';
import MenuBebida from './MenuBebida';
import MenuPostre from './MenuPostre';
import CrudMeseros from './CrudMeseros';
import CrudMesas from './CrudMesas';
import CrudMenuComida from './CrudMenuComida';
import CrudMenuBebida from './CrudMenuBebida';
import CrudMenuPostre from './CrudMenuPostre';
import Dashboard from './Dashboard';

// Componente interno que usa el contexto
const AppContent = () => {
  const { state, actions } = useApp();

  // Manejar la navegación desde los menús
  React.useEffect(() => {
    if (state.showMenu) {
      switch (state.showMenu) {
        case 'comida':
          actions.setView('menuComida');
          break;
        case 'bebida':
          actions.setView('menuBebida');
          break;
        case 'postre':
          actions.setView('menuPostre');
          break;
        default:
          break;
      }
      actions.hideMenu();
    }
  }, [state.showMenu, actions]);

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'login':
        return <Login />;
      case 'admin':
        return <Admin />;
      case 'dashboard':
        return <Dashboard />;
      case 'crudMeseros':
        return <CrudMeseros />;
      case 'crudMesas':
        return <CrudMesas />;
      case 'crudMenuComida':
        return <CrudMenuComida />;
      case 'crudMenuBebida':
        return <CrudMenuBebida />;
      case 'crudMenuPostre':
        return <CrudMenuPostre />;
      case 'mesero':
        return <Mesero />;
      case 'orden':
        return <Orden />;
      case 'menuComida':
        return <MenuComida />;
      case 'menuBebida':
        return <MenuBebida />;
      case 'menuPostre':
        return <MenuPostre />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="restaurant-app">
      {renderCurrentView()}
    </div>
  );
};

// Componente principal que provee el contexto
const RestaurantApp = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default RestaurantApp;