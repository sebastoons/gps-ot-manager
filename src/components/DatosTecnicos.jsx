import '../styles/global.css';

function DatosTecnicos({ datos, onChange }) {
  const handleChange = (campo, valor) => {
    onChange({
      ...datos,
      [campo]: valor
    });
  };

  const handleAccesorioChange = (accesorio, checked) => {
    const accesoriosActuales = datos.accesorios || [];
    if (checked) {
      onChange({
        ...datos,
        accesorios: [...accesoriosActuales, accesorio]
      });
    } else {
      onChange({
        ...datos,
        accesorios: accesoriosActuales.filter(a => a !== accesorio)
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
    'Sensor de Puerta'
  ];

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Ubicación de Instalación</label>
          <select
            className="form-select"
            value={datos.ubicacionInstalacion || ''}
            onChange={(e) => handleChange('ubicacionInstalacion', e.target.value)}
          >
            <option value="">Seleccionar ubicación</option>
            <option value="bajo-tablero">Bajo Tablero</option>
            <option value="consola-central">Consola Central</option>
            <option value="compartimiento-motor">Compartimiento del Motor</option>
            <option value="cajon-fusibles">Cajón de Fusibles</option>
            <option value="maletero">Maletero</option>
            <option value="techo">Techo</option>
            <option value="otra">Otra Ubicación</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label required-field">Tipo de Instalación</label>
          <select
            className="form-select"
            value={datos.tipoInstalacion || ''}
            onChange={(e) => handleChange('tipoInstalacion', e.target.value)}
          >
            <option value="">Seleccionar tipo</option>
            <option value="cableado-directo">Cableado Directo</option>
            <option value="fusible">Conexión por Fusible</option>
            <option value="bateria-principal">Batería Principal</option>
            <option value="bateria-interna">Batería Interna del GPS</option>
            <option value="odb2">Conector ODB2</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Voltaje de Conexión</label>
          <select
            className="form-select"
            value={datos.voltaje || '12V'}
            onChange={(e) => handleChange('voltaje', e.target.value)}
          >
            <option value="12V">12V</option>
            <option value="24V">24V</option>
            <option value="48V">48V</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amperaje del Fusible</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: 5A, 10A"
            value={datos.amperaje || ''}
            onChange={(e) => handleChange('amperaje', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Accesorios Instalados</label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-xs)'
        }}>
          {accesoriosDisponibles.map((accesorio) => (
            <div key={accesorio} className="form-check">
              <input
                type="checkbox"
                id={`accesorio-${accesorio}`}
                className="form-check-input"
                checked={(datos.accesorios || []).includes(accesorio)}
                onChange={(e) => handleAccesorioChange(accesorio, e.target.checked)}
              />
              <label htmlFor={`accesorio-${accesorio}`} className="form-check-label">
                {accesorio}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Otros Accesorios</label>
        <input
          type="text"
          className="form-input"
          placeholder="Especificar otros accesorios no listados..."
          value={datos.otrosAccesorios || ''}
          onChange={(e) => handleChange('otrosAccesorios', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tiempo de Instalación (minutos)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ej: 60"
            min="0"
            value={datos.tiempoInstalacion || ''}
            onChange={(e) => handleChange('tiempoInstalacion', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Técnico Responsable</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nombre del técnico"
            value={datos.tecnicoResponsable || ''}
            onChange={(e) => handleChange('tecnicoResponsable', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Detalles Técnicos Adicionales</label>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Información técnica adicional sobre la instalación..."
          value={datos.detallesTecnicos || ''}
          onChange={(e) => handleChange('detallesTecnicos', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Pruebas Realizadas</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <div className="form-check">
            <input
              type="checkbox"
              id="prueba-encendido"
              className="form-check-input"
              checked={datos.pruebaEncendido || false}
              onChange={(e) => handleChange('pruebaEncendido', e.target.checked)}
            />
            <label htmlFor="prueba-encendido" className="form-check-label">
              Prueba de Encendido
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="prueba-senal"
              className="form-check-input"
              checked={datos.pruebaSenal || false}
              onChange={(e) => handleChange('pruebaSenal', e.target.checked)}
            />
            <label htmlFor="prueba-senal" className="form-check-label">
              Prueba de Señal GPS
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="prueba-comunicacion"
              className="form-check-input"
              checked={datos.pruebaComunicacion || false}
              onChange={(e) => handleChange('pruebaComunicacion', e.target.checked)}
            />
            <label htmlFor="prueba-comunicacion" className="form-check-label">
              Prueba de Comunicación con Plataforma
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatosTecnicos;