import { useState, useEffect } from 'react';
import Index from './components/Index';
import CrearOT from './components/CrearOT';
import BaseDatos from './components/BaseDatos';
import DetalleOT from './components/DetalleOT';
import PWAInstall from './components/PWAInstall';
import ErrorBoundary from './components/ErrorBoundary';
import { logger } from './utils/logger';
import './styles/global.css';

function App() {
  const [currentView, setCurrentView] = useState('index');
  const [selectedOTId, setSelectedOTId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [empresaData, setEmpresaData] = useState(null);

  // Logging para debugging
  useEffect(() => {
    console.log('App montado');
    return () => console.log('App desmontado');
  }, []);

  useEffect(() => {
    logger.log('Vista actual:', currentView); // Usar logger en lugar de console.log
  }, [currentView]);

  const navigateTo = (view, otId = null, edit = false, empresa = null) => {
    console.log('Navegando a:', view, { otId, edit, empresa });
    setCurrentView(view);
    setSelectedOTId(otId);
    setEditMode(edit);
    setEmpresaData(empresa);
  };

  const renderView = () => {
    console.log('Renderizando vista:', currentView);
    
    try {
      switch(currentView) {
        case 'index':
          return <Index navigateTo={navigateTo} />;
        case 'crear-ot':
          return <CrearOT navigateTo={navigateTo} empresaData={empresaData} />;
        case 'base-datos':
          return <BaseDatos navigateTo={navigateTo} />;
        case 'detalle-ot':
          return <DetalleOT 
            navigateTo={navigateTo} 
            otId={selectedOTId} 
            editMode={editMode}
          />;
        default:
          console.warn('Vista desconocida:', currentView);
          return <Index navigateTo={navigateTo} />;
      }
    } catch (error) {
      console.error('Error al renderizar vista:', error);
      throw error;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <PWAInstall />
        {renderView()}
      </div>
    </ErrorBoundary>
  );
}

export default App;