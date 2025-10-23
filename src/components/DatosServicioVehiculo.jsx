// src/components/DatosServicioVehiculo.jsx - NUEVO COMPONENTE COMBINADO
import { useState, useEffect } from 'react';
import '../styles/global.css';

function DatosServicioVehiculo({ datosGPS, datosVehiculo, onChangeGPS, onChangeVehiculo }) {
  const [mostrarAccesorios, setMostrarAccesorios] = useState(false);

  const handleChangeGPS = (campo, valor) => {
    onChangeGPS({
      ...datosGPS,
      [campo]: valor
    });
  };

  const handleChangeVehiculo = (campo, valor) => {
    onChangeVehiculo({
      ...datosVehiculo,
      [campo]: valor
    });
  };

  const handleAccesorioToggle = (accesorio) => {
    const accesoriosActuales = datosGPS.accesoriosInstalados || [];
    const existe = accesoriosActuales.includes(accesorio);
    
    if (existe) {
      onChangeGPS({
        ...datosGPS,
        accesoriosInstalados: accesoriosActuales.filter(a => a !== accesorio)
      });
    } else {
      onChangeGPS({
        ...datosGPS,
        accesoriosInstalados: [...accesoriosActuales, accesorio]
      });
    }
  };

  // Auto-completar patente con PPU IN
  useEffect(() => {
    if (datosGPS?.ppuIn && datosGPS.ppuIn.trim() !== '') {
      onChangeVehiculo({
        ...datosVehiculo,
        patente: datosGPS.ppuIn.toUpperCase()
      });
    }
  }, [datosGPS?.ppuIn]);

  const accesoriosDisponibles = [
    'Inmovilizador', 'Edata', 'Dallas', 'Buzzer', 
    'Boton SOS', 'Sensor T°', 'Sensor Puerta', 'Camara', 'Cipia'
  ];

  const tiposServicio = [
    'Instalación', 'Mantención', 'Migración', 'Desinstalación', 'Visita Fallida'
  ];

  const tecnicos = ['Sebastian Parra'];

  const tiposVehiculo = [
    'Auto', 'Moto', 'Camioneta', 'Bus', 'Camión', 
    'Furgón', 'Van', 'SUV', 'Pickup', 'Otro'
  ];

  const marcasPopulares = [
    'Audi', 'Alfa Romeo', 'BMW', 'BYD', 'Changan', 'Chery', 'Chevrolet', 'Chrysler', 
    'Citroën', 'Cupra', 'DFSK','Dodge', 'Dongfeng', 'DS', 'Fiat', 'Ford', 'Foton', 
    'Freightlinner', 'Great Wall', 'Haval', 'Honda', 'Hyundai', 'International', 'Isuzu', 
    'JAC', 'Jaecco', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Mack', 'Mahindra', 
    'Maxus', 'Mazda', 'Mercedes Benz', 'MG', 'Mitsubishi', 'Nissan', 'Omoda', 'Opel', 
    'Peugeot', 'RAM', 'Renault', 'Scania', 'Seat', 'Skoda','Ssangyong', 'Subaru', 
    'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ].sort();

  const años = [];
  for (let año = 2030; año >= 1990; año--) {
    años.push(año);
  }

  const colores = [
    'Amarillo', 'Azul', 'Beige', 'Blanco', 'Café', 'Gris', 
    'Morado', 'Naranja', 'Negro', 'Plata', 'Rojo', 'Rosa', 'Verde'
  ];

  return (
    <div className="datos-servicio-vehiculo">
      {/* SECCIÓN SERVICIO GPS */}
      <div className="subseccion">
        <h3 className="subseccion-titulo">📡 Servicio GPS</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required-field">Técnico</label>
            <select
              className="form-select"
              value={datosGPS?.nombreTecnico || ''}
              onChange={(e) => handleChangeGPS('nombreTecnico', e.target.value)}
            >
              <option value="">Seleccionar técnico</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico} value={tecnico}>{tecnico}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required-field">Servicio</label>
            <select
              className="form-select"
              value={datosGPS?.tipoServicio || ''}
              onChange={(e) => handleChangeGPS('tipoServicio', e.target.value)}
            >
              <option value="">Seleccionar servicio</option>
              {tiposServicio.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Accesorios</label>
          <div className="accesorios-dropdown">
            <button
              type="button"
              className="accesorios-dropdown-toggle"
              onClick={() => setMostrarAccesorios(!mostrarAccesorios)}
            >
              <span>
                {(datosGPS?.accesoriosInstalados || []).length > 0 
                  ? `${(datosGPS?.accesoriosInstalados || []).length} accesorios seleccionados`
                  : 'Seleccionar accesorios'}
              </span>
              <span className={`dropdown-arrow ${mostrarAccesorios ? 'open' : ''}`}>▼</span>
            </button>

            {mostrarAccesorios && (
              <div className="accesorios-dropdown-menu">
                {accesoriosDisponibles.map((accesorio) => {
                  const seleccionado = (datosGPS?.accesoriosInstalados || []).includes(accesorio);
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

          {(datosGPS?.accesoriosInstalados || []).length > 0 && (
            <div className="accesorios-seleccionados">
              {datosGPS.accesoriosInstalados.map((accesorio) => (
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
              value={datosGPS?.ppuIn || ''}
              onChange={(e) => handleChangeGPS('ppuIn', e.target.value.toUpperCase())}
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
              value={datosGPS?.ppuOut || ''}
              onChange={(e) => handleChangeGPS('ppuOut', e.target.value.toUpperCase())}
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
              value={datosGPS?.imeiIn || ''}
              onChange={(e) => handleChangeGPS('imeiIn', e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">IMEI OUT</label>
            <input
              type="text"
              className="form-input"
              placeholder="IMEI salida"
              maxLength="15"
              value={datosGPS?.imeiOut || ''}
              onChange={(e) => handleChangeGPS('imeiOut', e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>
      </div>

      {/* SEPARADOR */}
      <div className="separador-seccion"></div>

      {/* SECCIÓN VEHÍCULO */}
      <div className="subseccion">
        <h3 className="subseccion-titulo">🚗 Datos del Vehículo</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required-field">Tipo de Vehículo</label>
            <select
              className="form-select"
              value={datosVehiculo?.tipo || ''}
              onChange={(e) => handleChangeVehiculo('tipo', e.target.value)}
            >
              <option value="">Seleccionar tipo</option>
              {tiposVehiculo.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required-field">Marca</label>
            <select
              className="form-select"
              value={datosVehiculo?.marca || ''}
              onChange={(e) => handleChangeVehiculo('marca', e.target.value)}
            >
              <option value="">Seleccionar marca</option>
              {marcasPopulares.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required-field">Modelo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Corolla, Ranger"
              value={datosVehiculo?.modelo || ''}
              onChange={(e) => handleChangeVehiculo('modelo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label required-field">Año</label>
            <select
              className="form-select"
              value={datosVehiculo?.ano || ''}
              onChange={(e) => handleChangeVehiculo('ano', e.target.value)}
            >
              <option value="">Seleccionar año</option>
              {años.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required-field">Color</label>
            <select
              className="form-select"
              value={datosVehiculo?.color || ''}
              onChange={(e) => handleChangeVehiculo('color', e.target.value)}
            >
              <option value="">Seleccionar color</option>
              {colores.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Patente</label>
            <input
              type="text"
              className="form-input"
              placeholder="Auto-completado desde PPU IN"
              maxLength="6"
              style={{ textTransform: 'uppercase' }}
              value={datosVehiculo?.patente || ''}
              onChange={(e) => handleChangeVehiculo('patente', e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Kilometraje</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ej: 45000"
            min="0"
            value={datosVehiculo?.kilometraje || ''}
            onChange={(e) => handleChangeVehiculo('kilometraje', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Detalles importantes del vehículo..."
            value={datosVehiculo?.observaciones || ''}
            onChange={(e) => handleChangeVehiculo('observaciones', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default DatosServicioVehiculo;