// src/components/CrearOT.jsx
import { useState } from 'react';
import DatosEmpresa from './DatosEmpresa';
import CheckList from './CheckList';
import DatosServicioVehiculo from './DatosServicioVehiculo';
import ModalConfirmacionOT from './ModalConfirmacionOT';
import FormularioCliente from './FormularioCliente';
import { useCrearOT } from '../hooks/useCrearOT';
import { validarCamposObligatoriosPorPaso } from '../utils/validaciones';
import '../styles/crearOT.css';

function CrearOT({ navigateTo, empresaData }) {
  const [pasoActual, setPasoActual] = useState(0);
  const [mostrarModalOtraBT, setMostrarModalOtraBT] = useState(false);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);

  const {
    codigoOT,
    otsCreadas,
    datosOT,
    actualizarDatos,
    finalizarOT,
    crearNuevaOT
  } = useCrearOT(empresaData);

  const pasos = [
    {
      id: 'datosEmpresa',
      titulo: 'Datos de la Empresa',
      icono: '🏢',
      componente: (
        <DatosEmpresa 
          datos={datosOT.datosEmpresa}
          onChange={(datos) => actualizarDatos('datosEmpresa', datos)}
        />
      )
    },
    {
      id: 'datosServicioVehiculo',
      titulo: 'Servicio y Vehículo',
      icono: '🚗',
      componente: (
        <DatosServicioVehiculo 
          datosGPS={datosOT.datosGPS}
          datosVehiculo={datosOT.datosVehiculo}
          onChangeGPS={(datos) => actualizarDatos('datosGPS', datos)}
          onChangeVehiculo={(datos) => actualizarDatos('datosVehiculo', datos)}
        />
      )
    },
    {
      id: 'checklist',
      titulo: 'CheckList del Vehículo',
      icono: '✅',
      componente: (
        <CheckList 
          datos={datosOT.checklist}
          onChange={(datos) => actualizarDatos('checklist', datos)}
        />
      )
    }
  ];

  const handleSiguiente = () => {
    const errores = validarCamposObligatoriosPorPaso(datosOT, pasoActual);
    
    if (errores.length > 0) {
      alert(`⚠️ Faltan los siguientes campos obligatorios:\n\n${errores.join('\n')}`);
      return;
    }

    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAtras = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalizarOT = () => {
    const otGuardada = finalizarOT(() => []);
    
    if (otGuardada) {
      setMostrarModalOtraBT(true);
    } else if (!otGuardada && otGuardada !== null) {
      alert('❌ Error al guardar la OT. Intenta nuevamente.');
    }
  };

  const handleCrearOtraBT = () => {
    crearNuevaOT();
    setMostrarModalOtraBT(false);
    setPasoActual(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNoCrearOtraBT = () => {
    setMostrarModalOtraBT(false);
    setMostrarFormularioCliente(true);
  };

  if (mostrarFormularioCliente) {
    return (
      <FormularioCliente 
        otsCreadas={otsCreadas}
        navigateTo={navigateTo}
      />
    );
  }

  const pasoActualData = pasos[pasoActual];

  return (
    <div className="crear-ot-container">
      {/* Header mejorado */}
      <div className="crear-ot-header">
        <div className="header-top-row">
          <button 
            className="btn-volver-header"
            onClick={() => navigateTo('index')}
          >
            ← Volver
          </button>
          <div className="ot-codigo-badge">
            {codigoOT}
          </div>
        </div>
        <h1 className="crear-ot-title">Crear Orden de Trabajo</h1>
      </div>

      {/* Indicador de progreso */}
      <div className="progreso-pasos">
        {pasos.map((paso, index) => (
          <div 
            key={paso.id}
            className={`paso-indicador ${index === pasoActual ? 'activo' : ''} ${index < pasoActual ? 'completado' : ''}`}
          >
            <div className="paso-numero">{index + 1}</div>
            <div className="paso-linea"></div>
          </div>
        ))}
      </div>

      {/* Contenido del paso actual con animación */}
      <div className="paso-container">
        <div className="paso-header">
          <span className="paso-icono">{pasoActualData.icono}</span>
          <h2 className="paso-titulo">{pasoActualData.titulo}</h2>
        </div>
        
        <div className="paso-contenido">
          {pasoActualData.componente}
        </div>
      </div>

      {/* Botones de navegación fijos */}
      <div className="navegacion-pasos">
        {pasoActual > 0 && (
          <button 
            type="button"
            className="btn btn-secondary btn-navegacion"
            onClick={handleAtras}
          >
            ← Atrás
          </button>
        )}
        
        {pasoActual < pasos.length - 1 ? (
          <button 
            type="button"
            className="btn btn-primary btn-navegacion"
            onClick={handleSiguiente}
          >
            Siguiente →
          </button>
        ) : (
          <button 
            type="button"
            className="btn btn-success btn-navegacion"
            onClick={handleFinalizarOT}
          >
            Finalizar OT
          </button>
        )}
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