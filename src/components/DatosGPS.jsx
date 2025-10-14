import { useState } from 'react';
import '../styles/global.css';

function DatosGPS({ datos, onChange }) {
  const [mostrarAccesorios, setMostrarAccesorios] = useState(false);

  const handleChange = (campo, valor) => {
    onChange({
      ...datos,
      [campo]: valor
    });
  };

  const handleAccesorioToggle = (accesorio) => {
    const accesoriosActuales = datos.accesoriosInstalados || [];
    const existe = accesoriosActuales.includes(accesorio);
    
    if (existe) {
      onChange({
        ...datos,
        accesoriosInstalados: accesoriosActuales.filter(a => a !== accesorio)
      });
    } else {
      onChange({
        ...datos,
        accesoriosInstalados: [...accesoriosActuales, accesorio]
      });
    }
  };

  const accesoriosDisponibles = [
    'Antena GPS Externa',
    'Micrófono',
    'Botón de Pánico',
    'Sensor de Combustible',
    'Sensor de Temperatura',
    'Cámara',
    'Relay de Corte de Motor',
    'Lector RFID',
    'Sensor de Puerta',
    'Parlante',
    'Batería Auxiliar'
  ];

  const tiposServicio = [
    'Instalación',
    'Mantención',
    'Migración',
    'Desinstalación',
    'Visita Fallida'
  ];

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Nombre del Técnico</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nombre completo del técnico"
            value={datos.nombreTecnico || ''}
            onChange={(e) => handleChange('nombreTecnico', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Tipo de Servicio</label>
          <select
            className="form-select"
            value={datos.tipoServicio || ''}
            onChange={(e) => handleChange('tipoServicio', e.target.value)}
          >
            <option value="">Seleccionar servicio</option>
            {tiposServicio.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Accesorios Instalados</label>
        <div className="accesorios-dropdown">
          <button
            type="button"
            className="accesorios-dropdown-toggle"
            onClick={() => setMostrarAccesorios(!mostrarAccesorios)}
          >
            <span>
              {(datos.accesoriosInstalados || []).length > 0 
                ? `${(datos.accesoriosInstalados || []).length} accesorios seleccionados`
                : 'Seleccionar accesorios'}
            </span>
            <span className={`dropdown-arrow ${mostrarAccesorios ? 'open' : ''}`}>▼</span>
          </button>

          {mostrarAccesorios && (
            <div className="accesorios-dropdown-menu">
              {accesoriosDisponibles.map((accesorio) => {
                const seleccionado = (datos.accesoriosInstalados || []).includes(accesorio);
                return (
                  <div
                    key={accesorio}
                    className={`accesorio-item ${seleccionado ? 'selected' : ''}`}
                    onClick={() => handleAccesorioToggle(accesorio)}
                  >
                    <span className="accesorio-check">{seleccionado ? '✓' : ''}</span>
                    <span className="accesorio-nombre">{accesorio}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(datos.accesoriosInstalados || []).length > 0 && (
          <div className="accesorios-seleccionados">
            {datos.accesoriosInstalados.map((accesorio) => (
              <span key={accesorio} className="accesorio-badge">
                {accesorio}
                <button
                  type="button"
                  className="accesorio-remove"
                  onClick={() => handleAccesorioToggle(accesorio)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">PPU IN</label>
          <input
            type="text"
            className="form-input"
            placeholder="Patente entrada"
            maxLength="6"
            style={{ textTransform: 'uppercase' }}
            value={datos.ppuIn || ''}
            onChange={(e) => handleChange('ppuIn', e.target.value.toUpperCase())}
          />
        </div>

        <div className="form-group">
          <label className="form-label">PPU OUT</label>
          <input
            type="text"
            className="form-input"
            placeholder="Patente salida"
            maxLength="6"
            style={{ textTransform: 'uppercase' }}
            value={datos.ppuOut || ''}
            onChange={(e) => handleChange('ppuOut', e.target.value.toUpperCase())}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">IMEI IN</label>
          <input
            type="text"
            className="form-input"
            placeholder="IMEI entrada"
            maxLength="15"
            value={datos.imeiIn || ''}
            onChange={(e) => handleChange('imeiIn', e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">IMEI OUT</label>
          <input
            type="text"
            className="form-input"
            placeholder="IMEI salida"
            maxLength="15"
            value={datos.imeiOut || ''}
            onChange={(e) => handleChange('imeiOut', e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>
    </div>
  );
}

export default DatosGPS;