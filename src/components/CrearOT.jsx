// src/components/CrearOT.jsx - VERSIÓN OPTIMIZADA
import { useState } from 'react';
import DatosEmpresa from './DatosEmpresa';
import CheckList from './CheckList';
import DatosGPS from './DatosGPS';
import DatosVehiculo from './DatosVehiculo';
import FormularioCliente from './FormularioCliente';
import SeccionFormulario from './SeccionFormulario';
import ModalConfirmacionOT from './ModalConfirmacionOT';
import HeaderCrearOT from './HeaderCrearOT';
import { useCrearOT } from '../hooks/useCrearOT';
import { validarCamposObligatorios } from '../utils/validaciones';
import '../styles/crearOT.css';

function CrearOT({ navigateTo, empresaData }) {
  const [mostrarModalOtraBT, setMostrarModalOtraBT] = useState(false);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);

  const {
    codigoOT,
    otsCreadas,
    datosOT,
    seccionAbierta,
    toggleSeccion,
    actualizarDatos,
    finalizarOT,
    crearNuevaOT
  } = useCrearOT(empresaData);

  const handleFinalizarOT = () => {
    const otGuardada = finalizarOT(validarCamposObligatorios);
    
    if (otGuardada) {
      setMostrarModalOtraBT(true);
    } else if (!otGuardada && otGuardada !== null) {
      alert('❌ Error al guardar la OT. Intenta nuevamente.');
    }
  };

  const handleCrearOtraBT = () => {
    crearNuevaOT();
    setMostrarModalOtraBT(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNoCrearOtraBT = () => {
    setMostrarModalOtraBT(false);
    setMostrarFormularioCliente(true);
  };

  // Si se muestra el formulario de cliente, renderizarlo
  if (mostrarFormularioCliente) {
    return (
      <FormularioCliente 
        otsCreadas={otsCreadas}
        navigateTo={navigateTo}
      />
    );
  }

  // Configuración de secciones
  const secciones = [
    {
      id: 'datosEmpresa',
      icono: '🏢',
      titulo: 'Datos de la Empresa',
      componente: (
        <DatosEmpresa 
          datos={datosOT.datosEmpresa}
          onChange={(datos) => actualizarDatos('datosEmpresa', datos)}
        />
      )
    },
    {
      id: 'datosGPS',
      icono: '📡',
      titulo: 'Datos del Servicio GPS',
      componente: (
        <DatosGPS 
          datos={datosOT.datosGPS}
          onChange={(datos) => actualizarDatos('datosGPS', datos)}
        />
      )
    },
    {
      id: 'datosVehiculo',
      icono: '🚗',
      titulo: 'Datos del Vehículo',
      componente: (
        <DatosVehiculo 
          datos={datosOT.datosVehiculo}
          onChange={(datos) => actualizarDatos('datosVehiculo', datos)}
        />
      )
    },
    {
      id: 'checklist',
      icono: '✅',
      titulo: 'CheckList del Vehículo',
      componente: (
        <CheckList 
          datos={datosOT.checklist}
          onChange={(datos) => actualizarDatos('checklist', datos)}
        />
      )
    }
  ];

  return (
    <div className="crear-ot-container">
      {/* Header */}
      <HeaderCrearOT 
        codigoOT={codigoOT}
        onVolver={() => navigateTo('index')}
      />

      {/* Formulario por secciones */}
      <form className="crear-ot-form">
        {secciones.map((seccion) => (
          <SeccionFormulario
            key={seccion.id}
            id={seccion.id}
            icono={seccion.icono}
            titulo={seccion.titulo}
            estaAbierta={seccionAbierta === seccion.id}
            onToggle={toggleSeccion}
          >
            {seccion.componente}
          </SeccionFormulario>
        ))}
      </form>

      {/* Botón de Finalizar */}
      <div className="form-actions">
        <div className="form-actions-buttons">
          <button 
            type="button"
            className="btn btn-success btn-full"
            onClick={handleFinalizarOT}
          >
            Finalizar Orden de Trabajo
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacionOT
        mostrar={mostrarModalOtraBT}
        ultimaOTCreada={otsCreadas[otsCreadas.length - 1]}
        onCrearOtra={handleCrearOtraBT}
        onFinalizar={handleNoCrearOtraBT}
      />
    </div>
  );
}

export default CrearOT;
