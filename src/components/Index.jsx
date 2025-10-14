import { useState } from 'react';
import ModalEmpresa from './ModalEmpresa';
import '../styles/index.css';

function Index({ navigateTo }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleCrearOT = () => {
    setMostrarModal(true);
  };

  const handleSeleccionarEmpresa = (datosEmpresa) => {
    navigateTo('crear-ot', null, false, datosEmpresa);
  };

  return (
    <div className="index-container">
      <div className="index-header">
        <h1 className="index-title">GPS OT Manager</h1>
        <p className="index-subtitle">Sistema de Órdenes de Trabajo</p>
      </div>

      <div className="index-menu">
        <div 
          className="index-menu-item"
          onClick={handleCrearOT}
        >
          <span className="index-menu-icon">📝</span>
          <h2 className="index-menu-title">Crear Orden de Trabajo</h2>
          <p className="index-menu-description">
            Registra una nueva instalación de GPS con checklist completo
          </p>
        </div>

        <div 
          className="index-menu-item"
          onClick={() => navigateTo('base-datos')}
        >
          <span className="index-menu-icon">📊</span>
          <h2 className="index-menu-title">Base de Datos</h2>
          <p className="index-menu-description">
            Consulta, edita o elimina órdenes de trabajo existentes
          </p>
        </div>
      </div>

      <div className="index-footer">
        <p>© 2025 GPS OT Manager - Sistema de gestión de instalaciones</p>
      </div>

      {mostrarModal && (
        <ModalEmpresa
          onSeleccionar={handleSeleccionarEmpresa}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default Index;