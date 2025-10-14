import { useState } from 'react';
import '../styles/modalEmpresa.css';

function ModalEmpresa({ onSeleccionar, onCancelar }) {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [otraEmpresa, setOtraEmpresa] = useState('');

  const empresasPredefinidas = [
    { nombre: 'LW - Entel', prefijo: 'LWE' },
    { nombre: 'UGPS', prefijo: 'U' }
  ];

  const handleSeleccionar = () => {
    if (empresaSeleccionada === 'otra' && !otraEmpresa.trim()) {
      alert('⚠️ Por favor ingresa el nombre de la empresa');
      return;
    }

    let empresa, prefijo;

    if (empresaSeleccionada === 'otra') {
      empresa = otraEmpresa.trim();
      const palabras = empresa.split(' ');
      prefijo = palabras.map(p => p[0].toUpperCase()).join('');
    } else {
      const empresaData = empresasPredefinidas.find(e => e.prefijo === empresaSeleccionada);
      empresa = empresaData.nombre;
      prefijo = empresaData.prefijo;
    }

    onSeleccionar({ empresa, prefijo });
  };

  return (
    <div className="modal-empresa-overlay">
      <div className="modal-empresa-content">
        <div className="modal-empresa-header">
          <h2 className="modal-empresa-title">Seleccionar Empresa</h2>
          <p className="modal-empresa-subtitle">
            Elige la empresa para esta orden de trabajo
          </p>
        </div>

        <div className="empresas-grid">
          {empresasPredefinidas.map((emp) => (
            <div
              key={emp.prefijo}
              className={`empresa-option ${empresaSeleccionada === emp.prefijo ? 'selected' : ''}`}
              onClick={() => setEmpresaSeleccionada(emp.prefijo)}
            >
              <div className="empresa-nombre">{emp.nombre}</div>
            </div>
          ))}

          <div
            className={`empresa-option ${empresaSeleccionada === 'otra' ? 'selected' : ''}`}
            onClick={() => setEmpresaSeleccionada('otra')}
          >
            <div className="empresa-nombre">Otra</div>
          </div>
        </div>

        {empresaSeleccionada === 'otra' && (
          <div className="otra-empresa-input">
            <label className="form-label">Nombre de la Empresa</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Tech Solutions"
              value={otraEmpresa}
              onChange={(e) => setOtraEmpresa(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="modal-empresa-acciones">
          <button
            className="btn btn-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="btn btn-success btn-full"
            onClick={handleSeleccionar}
            disabled={!empresaSeleccionada}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEmpresa;