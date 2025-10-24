// src/components/CrearOT.jsx - COMPLETO CON PASO 4
import { useState } from 'react';
import DatosEmpresa from './DatosEmpresa';
import CheckList from './CheckList';
import DatosServicioVehiculo from './DatosServicioVehiculo';
import FirmaDigital from './FirmaDigital';
import ModalConfirmacionOT from './ModalConfirmacionOT';
import { useCrearOT } from '../hooks/useCrearOT';
import { validarCamposObligatoriosPorPaso } from '../utils/validaciones';
import '../styles/crearOT.css';

function CrearOT({ navigateTo, empresaData }) {
  const [pasoActual, setPasoActual] = useState(0);
  const [mostrarModalOtraBT, setMostrarModalOtraBT] = useState(false);

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
    },
    {
      id: 'datosCliente',
      titulo: 'Datos del Cliente',
      icono: '👤',
      componente: (
        <FormularioClienteIntegrado 
          datosCliente={datosOT.datosCliente}
          onChange={(datos) => actualizarDatos('datosCliente', datos)}
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
    const errores = validarCamposObligatoriosPorPaso(datosOT, pasoActual);
    
    if (errores.length > 0) {
      alert(`⚠️ Faltan los siguientes campos obligatorios:\n\n${errores.join('\n')}`);
      return;
    }

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
    navigateTo('index');
  };

  const pasoActualData = pasos[pasoActual];

  return (
    <div className="crear-ot-container">
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

      <div className="paso-container">
        <div className="paso-header">
          <span className="paso-icono">{pasoActualData.icono}</span>
          <h2 className="paso-titulo">{pasoActualData.titulo}</h2>
        </div>
        
        <div className="paso-contenido">
          {pasoActualData.componente}
        </div>
      </div>

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
            ✓ Finalizar OT
          </button>
        )}
      </div>

      <ModalConfirmacionOT
        mostrar={mostrarModalOtraBT}
        ultimaOTCreada={otsCreadas[otsCreadas.length - 1]}
        onCrearOtra={handleCrearOtraBT}
        onFinalizar={handleNoCrearOtraBT}
      />
    </div>
  );
}

// Componente interno para el paso 4
function FormularioClienteIntegrado({ datosCliente, onChange }) {
  const handleChange = (campo, valor) => {
    onChange({
      ...datosCliente,
      [campo]: valor
    });
  };

  const formatearRUT = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length <= 1) return rutLimpio;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
  };

  const handleRutChange = (valor) => {
    const rutFormateado = formatearRUT(valor);
    handleChange('rut', rutFormateado);
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label required-field">Nombre Completo</label>
        <input
          type="text"
          className="form-input"
          placeholder="Nombre y apellidos del cliente"
          value={datosCliente?.nombre || ''}
          onChange={(e) => handleChange('nombre', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">RUT</label>
          <input
            type="text"
            className="form-input"
            placeholder="12.345.678-9"
            maxLength="12"
            value={datosCliente?.rut || ''}
            onChange={(e) => handleRutChange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Teléfono o Email</label>
          <input
            type="text"
            className="form-input"
            placeholder="+56 9 1234 5678 o correo@ejemplo.com"
            value={datosCliente?.contacto || ''}
            onChange={(e) => handleChange('contacto', e.target.value)}
          />
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 153, 255, 0.12)',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
        marginTop: '20px'
      }}>
        <h3 style={{
          fontFamily: 'var(--font-subtitle)',
          fontSize: '1em',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textTransform: 'uppercase',
          fontWeight: '700',
          letterSpacing: '0.5px',
          paddingBottom: '12px',
          borderBottom: '2px solid var(--color-primary)'
        }}>
          ✍️ Firma del Cliente
        </h3>
        <FirmaDigital 
          onFirmaChange={(firma) => handleChange('firma', firma)} 
        />
        {!datosCliente?.firma && (
          <small style={{ 
            color: 'var(--color-danger)', 
            fontSize: '0.75em', 
            marginTop: '8px',
            display: 'block',
            textAlign: 'center'
          }}>
            * La firma del cliente es obligatoria para finalizar la OT
          </small>
        )}
      </div>
    </div>
  );
}

export default CrearOT;