import { useState, useEffect } from 'react';
import DatosEmpresa from './DatosEmpresa';
import CheckList from './CheckList';
import DatosGPS from './DatosGPS';
import DatosVehiculo from './DatosVehiculo';
import FormularioCliente from './FormularioCliente';
import '../styles/crearOT.css';
import { guardarOT, obtenerNumeroOTActual } from '../utils/storage';

function CrearOT({ navigateTo, empresaData }) {
  const [numeroOT, setNumeroOT] = useState(1);
  const [codigoOT, setCodigoOT] = useState('');
  const [otsCreadas, setOtsCreadas] = useState([]);
  const [mostrarModalOtraBT, setMostrarModalOtraBT] = useState(false);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
  const [datosEmpresaGuardados, setDatosEmpresaGuardados] = useState({});
  
  // NUEVA LÓGICA: Solo una sección abierta a la vez
  const [seccionAbierta, setSeccionAbierta] = useState('datosEmpresa');

  const [datosOT, setDatosOT] = useState({
    datosEmpresa: {},
    checklist: {},
    datosGPS: {},
    datosVehiculo: {}
  });

  useEffect(() => {
    if (empresaData) {
      const numeroActual = obtenerNumeroOTActual(empresaData.prefijo);
      setNumeroOT(numeroActual);
      setCodigoOT(`${empresaData.prefijo}${String(numeroActual).padStart(4, '0')}`);
    }
  }, [empresaData]);

  // NUEVA FUNCIÓN: Abrir/cerrar secciones (solo una abierta)
  const toggleSeccion = (seccion) => {
    setSeccionAbierta(seccionAbierta === seccion ? '' : seccion);
  };

  const validarCamposObligatorios = () => {
    const errores = [];
    
    if (!datosOT.datosEmpresa.nombreEmpresa?.trim()) errores.push('Nombre de la Empresa');
    if (!datosOT.datosEmpresa.fecha?.trim()) errores.push('Fecha');
    if (!datosOT.datosEmpresa.nombreContacto?.trim()) errores.push('Nombre del Contacto');
    if (!datosOT.datosEmpresa.region?.trim()) errores.push('Región');
    if (!datosOT.datosEmpresa.ciudad?.trim()) errores.push('Ciudad');
    if (!datosOT.datosEmpresa.comuna?.trim()) errores.push('Comuna');
    
    if (!datosOT.datosGPS.nombreTecnico?.trim()) errores.push('Nombre del Técnico');
    if (!datosOT.datosGPS.tipoServicio?.trim()) errores.push('Tipo de Servicio');
    
    if (!datosOT.datosVehiculo.tipo?.trim()) errores.push('Tipo de Vehículo');
    if (!datosOT.datosVehiculo.marca?.trim()) errores.push('Marca del Vehículo');
    if (!datosOT.datosVehiculo.modelo?.trim()) errores.push('Modelo del Vehículo');
    if (!datosOT.datosVehiculo.ano?.trim()) errores.push('Año del Vehículo');
    if (!datosOT.datosVehiculo.color?.trim()) errores.push('Color del Vehículo');
    
    return errores;
  };

  const handleFinalizarOT = () => {
    const errores = validarCamposObligatorios();
    
    if (errores.length > 0) {
      alert(`⚠️ Faltan los siguientes campos obligatorios:\n\n${errores.join('\n')}`);
      return;
    }

    if (otsCreadas.length === 0) {
      setDatosEmpresaGuardados(datosOT.datosEmpresa);
    }

    const otGuardada = guardarOT(datosOT, empresaData.prefijo);
    
    if (otGuardada) {
      setOtsCreadas([...otsCreadas, otGuardada]);
      setMostrarModalOtraBT(true);
    } else {
      alert('❌ Error al guardar la OT. Intenta nuevamente.');
    }
  };

  const handleCrearOtraBT = () => {
    const nuevoNumero = obtenerNumeroOTActual(empresaData.prefijo);
    setNumeroOT(nuevoNumero);
    setCodigoOT(`${empresaData.prefijo}${String(nuevoNumero).padStart(4, '0')}`);
    setDatosOT({
      datosEmpresa: datosEmpresaGuardados,
      checklist: {},
      datosGPS: {},
      datosVehiculo: {}
    });
    setMostrarModalOtraBT(false);
    setSeccionAbierta('datosGPS'); // Abrir GPS para nueva OT
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

  return (
    <div className="crear-ot-container">
      <div className="crear-ot-header">
        <div className="crear-ot-header-top">
          <h1 className="crear-ot-title">Crear Orden de Trabajo</h1>
          <button 
            className="btn btn-volver"
            onClick={() => navigateTo('index')}
          >
            ← Volver
          </button>
        </div>
        <div className="ot-numero" style={{ color: '#f69a00' }}>
          <span>Orden de Trabajo N°</span>
          <span className="ot-numero-badge">{codigoOT}</span>
        </div>
      </div>

      <form className="crear-ot-form">
        {/* SECCIÓN 1: DATOS EMPRESA */}
        <div className="form-section">
          <div 
            className="form-section-header"
            onClick={() => toggleSeccion('datosEmpresa')}
          >
            <div className="form-section-header-content">
              <span className="form-section-icon">🏢</span>
              <h2 className="form-section-title">Datos de la Empresa</h2>
            </div>
            <span className={`form-section-toggle ${seccionAbierta !== 'datosEmpresa' ? 'collapsed' : ''}`}>
              ▼
            </span>
          </div>
          <div className={`form-section-body ${seccionAbierta !== 'datosEmpresa' ? 'collapsed' : ''}`}>
            <DatosEmpresa 
              datos={datosOT.datosEmpresa}
              onChange={(nuevosDatos) => setDatosOT({ ...datosOT, datosEmpresa: nuevosDatos })}
            />
          </div>
        </div>

        {/* SECCIÓN 2: DATOS GPS */}
        <div className="form-section">
          <div 
            className="form-section-header"
            onClick={() => toggleSeccion('datosGPS')}
          >
            <div className="form-section-header-content">
              <span className="form-section-icon">📡</span>
              <h2 className="form-section-title">Datos del Servicio GPS</h2>
            </div>
            <span className={`form-section-toggle ${seccionAbierta !== 'datosGPS' ? 'collapsed' : ''}`}>
              ▼
            </span>
          </div>
          <div className={`form-section-body ${seccionAbierta !== 'datosGPS' ? 'collapsed' : ''}`}>
            <DatosGPS 
              datos={datosOT.datosGPS}
              onChange={(nuevosDatos) => setDatosOT({ ...datosOT, datosGPS: nuevosDatos })}
            />
          </div>
        </div>

        {/* SECCIÓN 3: DATOS VEHÍCULO */}
        <div className="form-section">
          <div 
            className="form-section-header"
            onClick={() => toggleSeccion('datosVehiculo')}
          >
            <div className="form-section-header-content">
              <span className="form-section-icon">🚗</span>
              <h2 className="form-section-title">Datos del Vehículo</h2>
            </div>
            <span className={`form-section-toggle ${seccionAbierta !== 'datosVehiculo' ? 'collapsed' : ''}`}>
              ▼
            </span>
          </div>
          <div className={`form-section-body ${seccionAbierta !== 'datosVehiculo' ? 'collapsed' : ''}`}>
            <DatosVehiculo 
              datos={datosOT.datosVehiculo}
              onChange={(nuevosDatos) => setDatosOT({ ...datosOT, datosVehiculo: nuevosDatos })}
            />
          </div>
        </div>

        {/* SECCIÓN 4: CHECKLIST */}
        <div className="form-section">
          <div 
            className="form-section-header"
            onClick={() => toggleSeccion('checklist')}
          >
            <div className="form-section-header-content">
              <span className="form-section-icon">✅</span>
              <h2 className="form-section-title">CheckList del Vehículo</h2>
            </div>
            <span className={`form-section-toggle ${seccionAbierta !== 'checklist' ? 'collapsed' : ''}`}>
              ▼
            </span>
          </div>
          <div className={`form-section-body ${seccionAbierta !== 'checklist' ? 'collapsed' : ''}`}>
            <CheckList 
              datos={datosOT.checklist}
              onChange={(nuevosDatos) => setDatosOT({ ...datosOT, checklist: nuevosDatos })}
            />
          </div>
        </div>
      </form>

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

      {mostrarModalOtraBT && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">✅</div>
              <h2 className="modal-title">¡OT Guardada Exitosamente!</h2>
              <p className="modal-description">
                La Orden de Trabajo {otsCreadas[otsCreadas.length - 1]?.codigoOT} ha sido registrada correctamente.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-primary btn-full"
                onClick={handleCrearOtraBT}
              >
                ➕ Crear Otra OT
              </button>
              <button 
                className="btn btn-secondary btn-full"
                onClick={handleNoCrearOtraBT}
              >
                Finalizar y Obtener Firma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearOT;