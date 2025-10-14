import { useState, useEffect } from 'react';
import CheckList from './CheckList';
import DatosGPS from './DatosGPS';
import DatosTecnicos from './DatosTecnicos';
import DatosVehiculo from './DatosVehiculo';
import '../styles/detalleOT.css';
import { obtenerOTPorId, actualizarOT } from '../utils/storage';

function DetalleOT({ navigateTo, otId, editMode }) {
  const [ot, setOt] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(editMode);
  const [datosEditados, setDatosEditados] = useState(null);

  useEffect(() => {
    if (otId) {
      const otEncontrada = obtenerOTPorId(otId);
      if (otEncontrada) {
        setOt(otEncontrada);
        setDatosEditados(otEncontrada);
      } else {
        alert('❌ No se encontró la OT');
        navigateTo('base-datos');
      }
    }
  }, [otId]);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGuardarCambios = () => {
    const resultado = actualizarOT(otId, datosEditados);
    if (resultado) {
      alert('✓ OT actualizada correctamente');
      setOt(datosEditados);
      setModoEdicion(false);
    } else {
      alert('❌ Error al actualizar la OT');
    }
  };

  const handleCancelarEdicion = () => {
    if (window.confirm('¿Desea cancelar los cambios?')) {
      setDatosEditados(ot);
      setModoEdicion(false);
    }
  };

  if (!ot) {
    return (
      <div className="detalle-ot-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const datosActuales = modoEdicion ? datosEditados : ot;

  return (
    <div className="detalle-ot-container">
      <div className="detalle-ot-header">
        <div className="detalle-ot-header-top">
          <h1 className="detalle-ot-title">
            OT{String(ot.numeroOT).padStart(4, '0')}
          </h1>
          <button 
            className="btn btn-volver"
            onClick={() => navigateTo('base-datos')}
          >
            ← Volver
          </button>
        </div>
        <div className="detalle-ot-info">
          <div>📅 Creada: {formatearFecha(ot.fechaCreacion)}</div>
          {ot.fechaModificacion !== ot.fechaCreacion && (
            <div>✏️ Modificada: {formatearFecha(ot.fechaModificacion)}</div>
          )}
        </div>
      </div>

      {modoEdicion && (
        <div className="modo-edicion">
          ✏️ MODO EDICIÓN ACTIVADO
        </div>
      )}

      {modoEdicion ? (
        <div>
          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              ✅ CheckList del Vehículo
            </h2>
            <CheckList 
              datos={datosActuales.checklist}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, checklist: nuevosDatos })}
            />
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              📡 Datos del GPS
            </h2>
            <DatosGPS 
              datos={datosActuales.datosGPS}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, datosGPS: nuevosDatos })}
            />
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              🔧 Datos Técnicos de Instalación
            </h2>
            <DatosTecnicos 
              datos={datosActuales.datosTecnicos}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, datosTecnicos: nuevosDatos })}
            />
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              🚗 Datos del Vehículo
            </h2>
            <DatosVehiculo 
              datos={datosActuales.datosVehiculo}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, datosVehiculo: nuevosDatos })}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              ✅ CheckList del Vehículo
            </h2>
            <div className="checklist-detalle">
              {Object.entries(datosActuales.checklist || {}).map(([key, value]) => (
                value.checked && (
                  <div key={key} className="checklist-detalle-item checked">
                    <span className="checklist-detalle-icon">✓</span>
                    <div className="checklist-detalle-content">
                      <div className="checklist-detalle-label">{key}</div>
                      {value.observaciones && (
                        <div className="checklist-detalle-obs">{value.observaciones}</div>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              📡 Datos del GPS
            </h2>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Marca</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.marca || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Modelo</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.modelo || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">IMEI</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.imei || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Número de SIM</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.numeroSim || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Operador</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.operador || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Plan de Datos</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.planDatos || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Estado</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.estadoGPS || 'N/A'}</span>
              </div>
            </div>
            {datosActuales.datosGPS?.observaciones && (
              <div className="detalle-item" style={{ marginTop: 'var(--spacing-md)' }}>
                <span className="detalle-label">Observaciones</span>
                <span className="detalle-valor">{datosActuales.datosGPS.observaciones}</span>
              </div>
            )}
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              🔧 Datos Técnicos de Instalación
            </h2>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Ubicación de Instalación</span>
                <span className="detalle-valor">{datosActuales.datosTecnicos?.ubicacionInstalacion || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Tipo de Instalación</span>
                <span className="detalle-valor">{datosActuales.datosTecnicos?.tipoInstalacion || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Voltaje</span>
                <span className="detalle-valor">{datosActuales.datosTecnicos?.voltaje || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Amperaje</span>
                <span className="detalle-valor">{datosActuales.datosTecnicos?.amperaje || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Tiempo de Instalación</span>
                <span className="detalle-valor">{datosActuales.datosTecnicos?.tiempoInstalacion ? `${datosActuales.datosTecnicos.tiempoInstalacion} min` : 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Técnico Responsable</span>
                <span className="detalle-valor">{datosActuales.datosTecnicos?.tecnicoResponsable || 'N/A'}</span>
              </div>
            </div>
            {datosActuales.datosTecnicos?.accesorios && datosActuales.datosTecnicos.accesorios.length > 0 && (
              <div className="detalle-item" style={{ marginTop: 'var(--spacing-md)' }}>
                <span className="detalle-label">Accesorios Instalados</span>
                <div className="accesorios-lista">
                  {datosActuales.datosTecnicos.accesorios.map((acc, index) => (
                    <span key={index} className="accesorio-badge">{acc}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              🚗 Datos del Vehículo
            </h2>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Marca</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.marca || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Modelo</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.modelo || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Año</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.ano || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Patente</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.patente || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Color</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.color || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Tipo</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.tipo || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Kilometraje</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.kilometraje ? `${datosActuales.datosVehiculo.kilometraje} km` : 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Propietario</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.propietario || 'N/A'}</span>
              </div>
            </div>
            {datosActuales.datosVehiculo?.observaciones && (
              <div className="detalle-item" style={{ marginTop: 'var(--spacing-md)' }}>
                <span className="detalle-label">Observaciones</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo.observaciones}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="detalle-acciones">
        {modoEdicion ? (
          <>
            <button 
              className="btn btn-secondary"
              onClick={handleCancelarEdicion}
            >
              ✕ Cancelar
            </button>
            <button 
              className="btn btn-success"
              onClick={handleGuardarCambios}
            >
              ✓ Guardar Cambios
            </button>
          </>
        ) : (
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => navigateTo('base-datos')}
            >
              ← Volver al Listado
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setModoEdicion(true)}
            >
              ✏️ Editar OT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DetalleOT;