import { useState, useEffect } from 'react';
import CheckList from './CheckList';
import DatosGPS from './DatosGPS';
import DatosVehiculo from './DatosVehiculo';
import DatosEmpresa from './DatosEmpresa';
import { generarPDFOT } from '../utils/pdfService';
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

  // ✅ CORRECTO - Descargar PDF desde DetalleOT
  const handleDescargarPDF = () => {
    try {
      generarPDFOT(ot, false); // false = descargar
      alert('✅ PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('❌ Error al generar el PDF. Por favor intente nuevamente.');
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
            {datosActuales.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`}
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
              🏢 Datos de la Empresa
            </h2>
            <DatosEmpresa 
              datos={datosActuales.datosEmpresa}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, datosEmpresa: nuevosDatos })}
            />
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              📡 Datos del Servicio GPS
            </h2>
            <DatosGPS 
              datos={datosActuales.datosGPS}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, datosGPS: nuevosDatos })}
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

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              ✅ CheckList del Vehículo
            </h2>
            <CheckList 
              datos={datosActuales.checklist}
              onChange={(nuevosDatos) => setDatosEditados({ ...datosActuales, checklist: nuevosDatos })}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              🏢 Datos de la Empresa
            </h2>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Empresa</span>
                <span className="detalle-valor">{datosActuales.datosEmpresa?.nombreEmpresa || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Fecha</span>
                <span className="detalle-valor">{datosActuales.datosEmpresa?.fecha || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Contacto</span>
                <span className="detalle-valor">{datosActuales.datosEmpresa?.nombreContacto || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Región</span>
                <span className="detalle-valor">{datosActuales.datosEmpresa?.region || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Ciudad</span>
                <span className="detalle-valor">{datosActuales.datosEmpresa?.ciudad || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Comuna</span>
                <span className="detalle-valor">{datosActuales.datosEmpresa?.comuna || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              📡 Datos del Servicio GPS
            </h2>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label">Técnico</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.nombreTecnico || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Tipo de Servicio</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.tipoServicio || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">PPU IN</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.ppuIn || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">PPU OUT</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.ppuOut || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">IMEI IN</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.imeiIn || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">IMEI OUT</span>
                <span className="detalle-valor">{datosActuales.datosGPS?.imeiOut || 'N/A'}</span>
              </div>
            </div>
            {datosActuales.datosGPS?.accesoriosInstalados && datosActuales.datosGPS.accesoriosInstalados.length > 0 && (
              <div className="detalle-item" style={{ marginTop: 'var(--spacing-md)' }}>
                <span className="detalle-label">Accesorios Instalados</span>
                <div className="accesorios-lista">
                  {datosActuales.datosGPS.accesoriosInstalados.map((acc, index) => (
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
                <span className="detalle-label">Tipo</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.tipo || 'N/A'}</span>
              </div>
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
                <span className="detalle-valor">{datosActuales.datosVehiculo?.patente || 'Sin Patente'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Color</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.color || 'N/A'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Kilometraje</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo?.kilometraje ? `${datosActuales.datosVehiculo.kilometraje} km` : 'N/A'}</span>
              </div>
            </div>
            {datosActuales.datosVehiculo?.observaciones && (
              <div className="detalle-item" style={{ marginTop: 'var(--spacing-md)' }}>
                <span className="detalle-label">Observaciones</span>
                <span className="detalle-valor">{datosActuales.datosVehiculo.observaciones}</span>
              </div>
            )}
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccion-title">
              ✅ CheckList del Vehículo
            </h2>
            <div className="checklist-detalle">
              {Object.entries(datosActuales.checklist || {}).map(([key, value]) => {
                const itemsLabels = {
                  luces: 'Luces 💡',
                  radio: 'Radio 📻',
                  tablero: 'Tablero 🎛️',
                  checkEngine: 'Check Engine ⚠️',
                  bateria: 'Batería 🔋'
                };
                
                return value.estado && (
                  <div key={key} className={`checklist-detalle-item ${value.estado}`}>
                    <span className="checklist-detalle-icon">
                      {value.estado === 'bueno' ? '✓' : '⚠'}
                    </span>
                    <div className="checklist-detalle-content">
                      <div className="checklist-detalle-label">{itemsLabels[key] || key}</div>
                      {value.detalle && (
                        <div className="checklist-detalle-obs">{value.detalle}</div>
                      )}
                    </div>
                  </div>
                );
              })}
              {Object.keys(datosActuales.checklist || {}).length === 0 && (
                <p className="detalle-valor">No se registró checklist</p>
              )}
            </div>
          </div>

          {/* Datos del Cliente y Firma */}
          {datosActuales.datosCliente && (
            <div className="detalle-seccion">
              <h2 className="detalle-seccion-title">
                👤 Datos del Cliente
              </h2>
              <div className="detalle-grid">
                <div className="detalle-item">
                  <span className="detalle-label">Nombre</span>
                  <span className="detalle-valor">{datosActuales.datosCliente.nombre}</span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">RUT</span>
                  <span className="detalle-valor">{datosActuales.datosCliente.rut}</span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Contacto</span>
                  <span className="detalle-valor">{datosActuales.datosCliente.contacto}</span>
                </div>
              </div>
              
              {datosActuales.datosCliente.firma && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <span className="detalle-label">Firma del Cliente</span>
                  <div style={{ 
                    marginTop: 'var(--spacing-sm)', 
                    padding: 'var(--spacing-sm)', 
                    border: '2px solid var(--border-color)', 
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'inline-block'
                  }}>
                    <img 
                      src={datosActuales.datosCliente.firma} 
                      alt="Firma del cliente" 
                      style={{ 
                        maxWidth: '300px', 
                        height: 'auto',
                        display: 'block'
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          )}
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
              className="btn btn-info"
              onClick={handleDescargarPDF}
            >
              📥 Descargar PDF
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