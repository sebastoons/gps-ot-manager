import { useState } from 'react';
import FirmaDigital from './FirmaDigital';
import '../styles/formularioCliente.css';

function FormularioCliente({ otsCreadas, navigateTo }) {
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    rut: '',
    correo: '',
    firma: null
  });

  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);

  const handleChange = (campo, valor) => {
    setDatosCliente({
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

  const validarFormulario = () => {
    if (!datosCliente.nombre.trim()) {
      alert('⚠️ Por favor ingrese el nombre del cliente');
      return false;
    }
    if (!datosCliente.rut.trim()) {
      alert('⚠️ Por favor ingrese el RUT del cliente');
      return false;
    }
    if (!datosCliente.correo.trim()) {
      alert('⚠️ Por favor ingrese el correo del cliente');
      return false;
    }
    if (!datosCliente.correo.includes('@')) {
      alert('⚠️ Por favor ingrese un correo válido');
      return false;
    }
    if (!datosCliente.firma) {
      alert('⚠️ Por favor agregue la firma del cliente');
      return false;
    }
    return true;
  };

  const handleEnviar = () => {
    if (!validarFormulario()) return;
    
    // Simular envío de correo con las OTs
    const resumenOTs = otsCreadas.map(ot => 
      `OT ${ot.codigoOT}: ${ot.datosVehiculo.tipo} ${ot.datosVehiculo.marca} ${ot.datosVehiculo.modelo}`
    ).join('\n');
    
    alert(`✓ OT(s) enviada(s) exitosamente a: ${datosCliente.correo}\n\n` +
          `Resumen:\n${resumenOTs}\n\n` +
          `La encuesta de satisfacción será enviada posteriormente por correo o WhatsApp.`);
    
    console.log('Datos del cliente:', datosCliente);
    console.log('OTs creadas:', otsCreadas);
    
    // Redirigir directamente al inicio después de enviar
    navigateTo('index');
  };

  if (mostrarEncuesta) {
    // Ya no se muestra la encuesta aquí
    return null;
  }

  return (
    <div className="formulario-cliente-container">
      <div className="formulario-cliente-header">
        <div className="formulario-cliente-icon">📋</div>
        <h1 className="formulario-cliente-title">Datos del Cliente</h1>
        <p className="formulario-cliente-subtitle">
          Complete la información y obtenga la firma del cliente
        </p>
      </div>

      <div className="ots-resumen">
        <h3 className="ots-resumen-title">
          📝 Órdenes de Trabajo Realizadas ({otsCreadas.length})
        </h3>
        <div className="ots-lista">
          {otsCreadas.map((ot, index) => (
            <div key={index} className="ot-item">
              <div>
                <div className="ot-item-numero">
                  {ot.codigoOT}
                </div>
                <div className="ot-item-vehiculo">
                  {ot.datosVehiculo.tipo} - {ot.datosVehiculo.marca} {ot.datosVehiculo.modelo}
                </div>
              </div>
              <span className="badge badge-success">✓</span>
            </div>
          ))}
        </div>
      </div>

      <div className="formulario-cliente-form">
        <h3 className="ots-resumen-title">
          👤 Información del Cliente
        </h3>

        <div className="form-group">
          <label className="form-label required-field">Nombre Completo</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nombre y apellidos del cliente"
            value={datosCliente.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">RUT</label>
          <input
            type="text"
            className="form-input"
            placeholder="12.345.678-9"
            maxLength="12"
            value={datosCliente.rut}
            onChange={(e) => handleRutChange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Correo Electrónico</label>
          <input
            type="email"
            className="form-input"
            placeholder="cliente@ejemplo.com"
            value={datosCliente.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Se enviará un resumen de las OTs a este correo
          </small>
        </div>
      </div>

      <div className="firma-section">
        <h3 className="firma-section-title">
          ✍️ Firma del Cliente
        </h3>
        <FirmaDigital onFirmaChange={(firma) => handleChange('firma', firma)} />
      </div>

      <div className="formulario-acciones">
        <button 
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm('¿Está seguro de cancelar? Se perderán los datos del cliente.')) {
              navigateTo('index');
            }
          }}
        >
          ← Cancelar
        </button>
        <button 
          className="btn btn-success btn-full"
          onClick={handleEnviar}
        >
          ✓ Enviar OT al Cliente
        </button>
      </div>
    </div>
  );
}

export default FormularioCliente;