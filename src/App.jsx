import { useState } from 'react';
import Index from './components/Index';
import CrearOT from './components/CrearOT';
import BaseDatos from './components/BaseDatos';
import DetalleOT from './components/DetalleOT';
import './styles/global.css';

function App() {
  const [currentView, setCurrentView] = useState('index');
  const [selectedOTId, setSelectedOTId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [empresaData, setEmpresaData] = useState(null);

  const navigateTo = (view, otId = null, edit = false, empresa = null) => {
    setCurrentView(view);
    setSelectedOTId(otId);
    setEditMode(edit);
    setEmpresaData(empresa);
  };

  const renderView = () => {
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
        return <Index navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
    </div>
  );
}

export default App;