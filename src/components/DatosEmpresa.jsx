import { useState, useEffect } from 'react';
import '../styles/global.css';
import regionesData from '../data/regiones.json'; // ✅ Importar JSON

function DatosEmpresa({ datos, onChange }) {
  const [ciudades, setCiudades] = useState([]);
  const [comunas, setComunas] = useState([]);

  useEffect(() => {
    if (datos.region) {
      const regionData = regionesData.regionesDatos[datos.region];
      if (regionData) {
        setCiudades(regionData.ciudades);
        setComunas(regionData.comunas);
      }
    }
  }, [datos.region]);

  const handleChange = (campo, valor) => {
    if (campo === 'region') {
      onChange({
        ...datos,
        [campo]: valor,
        ciudad: '',
        comuna: ''
      });
    } else {
      onChange({
        ...datos,
        [campo]: valor
      });
    }
  };

  const obtenerFechaActual = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Nombre de la Empresa</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: GPS Tracking Solutions"
            value={datos.nombreEmpresa || ''}
            onChange={(e) => handleChange('nombreEmpresa', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Fecha</label>
          <input
            type="date"
            className="form-input"
            value={datos.fecha || obtenerFechaActual()}
            onChange={(e) => handleChange('fecha', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required-field">Nombre del Contacto</label>
        <input
          type="text"
          className="form-input"
          placeholder="Nombre completo del contacto"
          value={datos.nombreContacto || ''}
          onChange={(e) => handleChange('nombreContacto', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label required-field">Región</label>
        <select
          className="form-select"
          value={datos.region || ''}
          onChange={(e) => handleChange('region', e.target.value)}
        >
          <option value="">Seleccionar región</option>
          {Object.keys(regionesData.regionesDatos).map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Ciudad</label>
          <select
            className="form-select"
            value={datos.ciudad || ''}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            disabled={!datos.region}
          >
            <option value="">Seleccionar ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label required-field">Comuna</label>
          <select
            className="form-select"
            value={datos.comuna || ''}
            onChange={(e) => handleChange('comuna', e.target.value)}
            disabled={!datos.region}
          >
            <option value="">Seleccionar comuna</option>
            {comunas.map(comuna => (
              <option key={comuna} value={comuna}>{comuna}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default DatosEmpresa;