import { useState } from 'react';
import FirmaDigital from './FirmaDigital';
import '../styles/formularioCliente.css';

function FormularioCliente({ otsCreadas, navigateTo }) {
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    rut: '',
    contacto: '',
    firma: null
  });

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
    if (!datosCliente.contacto.trim()) {
      alert('⚠️ Por favor ingrese teléfono o email del cliente');
      return false;
    }
    if (!datosCliente.firma) {
      alert('⚠️ Por favor agregue la firma del cliente');
      return false;
    }
    return true;
  };

  const handleTerminar = () => {
    if (!validarFormulario()) return;

    // Guardar datos del cliente en cada OT
    const todasLasOTs = JSON.parse(localStorage.getItem('gps_ots') || '[]');
    
    otsCreadas.forEach(otCreada => {
      const index = todasLasOTs.findIndex(ot => ot.id === otCreada.id);
      if (index !== -1) {
        todasLasOTs[index].datosCliente = {
          nombre: datosCliente.nombre,
          rut: datosCliente.rut,
          contacto: datosCliente.contacto,
          firma: datosCliente.firma,
          fechaFirma: new Date().toISOString()
        };
      }
    });
    
    localStorage.setItem('gps_ots', JSON.stringify(todasLasOTs));

    // Mensaje de éxito
    alert(
      `✅ ¡Proceso completado!\n\n` +
      `Se guardaron ${otsCreadas.length} OT(s) con la firma del cliente.\n\n` +
      `Puede encontrarlas en la Base de Datos para descargar el PDF.`
    );

    // Volver al inicio
    navigateTo('index');
  };

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
          <label className="form-label required-field">Teléfono o Email</label>
          <input
            type="text"
            className="form-input"
            placeholder="+56 9 1234 5678 o correo@ejemplo.com"
            value={datosCliente.contacto}
            onChange={(e) => handleChange('contacto', e.target.value)}
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Puedes ingresar teléfono o correo electrónico
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
          onClick={handleTerminar}
        >
          ✓ Terminar y Guardar
        </button>
      </div>
    </div>
  );
}

export default FormularioCliente;