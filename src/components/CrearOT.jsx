// src/components/CrearOT.jsx
import { useState, useEffect } from 'react';
import CheckList from './CheckList';
import FirmaDigital from './FirmaDigital';
import ModalConfirmacionOT from './ModalConfirmacionOT';
import { useCrearOT } from '../hooks/useCrearOT';
import { validarCamposObligatoriosPorPaso } from '../utils/validaciones';
import '../styles/crearOT.css';
import regionesData from '../data/regiones.json';

function CrearOT({ navigateTo, empresaData }) {
  const [pasoActual, setPasoActual] = useState(0);
  const [ciudades, setCiudades] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mostrarPpuOut, setMostrarPpuOut] = useState(false);
  const [mostrarImeiOut, setMostrarImeiOut] = useState(false);
  const [mostrarAccesorios, setMostrarAccesorios] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ultimaOTCreada, setUltimaOTCreada] = useState(null);
  const [tipoContacto, setTipoContacto] = useState('telefono');

  const {
    codigoOT,
    datosOT,
    actualizarDatos,
    finalizarOT,
    reiniciarFormulario
  } = useCrearOT(empresaData);

  useEffect(() => {
    if (datosOT.datosEmpresa.region) {
      const regionData = regionesData.regionesDatos[datosOT.datosEmpresa.region];
      if (regionData) {
        setCiudades(regionData.ciudades);
        setComunas(regionData.comunas);
      }
    }
  }, [datosOT.datosEmpresa.region]);

  useEffect(() => {
    if (datosOT.datosGPS?.ppuIn && datosOT.datosGPS.ppuIn.trim() !== '') {
      actualizarDatos('datosVehiculo', {
        ...datosOT.datosVehiculo,
        patente: datosOT.datosGPS.ppuIn.toUpperCase()
      });
    }
  }, [datosOT.datosGPS?.ppuIn]);

  const handleSiguiente = () => {
    const errores = validarCamposObligatoriosPorPaso(datosOT, pasoActual);
    
    if (errores.length > 0) {
      alert(`⚠️ Faltan campos obligatorios:\n\n${errores.join('\n')}`);
      return;
    }

    if (pasoActual < 3) {
      setPasoActual(pasoActual + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAtras = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCrearOT = () => {
    const errores = validarCamposObligatoriosPorPaso(datosOT, pasoActual);
    
    if (errores.length > 0) {
      alert(`⚠️ Faltan campos obligatorios:\n\n${errores.join('\n')}`);
      return;
    }

    const otGuardada = finalizarOT(() => []);
    
    if (otGuardada) {
      setUltimaOTCreada(otGuardada);
      setMostrarModal(true);
    }
  };

  const handleCrearOtra = () => {
    setMostrarModal(false);
    setUltimaOTCreada(null);
    setPasoActual(0);
    setMostrarPpuOut(false);
    setMostrarImeiOut(false);
    setMostrarAccesorios(false);
    setTipoContacto('telefono');
    reiniciarFormulario();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalizar = () => {
    setMostrarModal(false);
    alert(`✅ ¡OT ${ultimaOTCreada.codigoOT} guardada exitosamente!`);
    navigateTo('index');
  };

  const tiposServicio = ['Instalación', 'Mantención', 'Migración', 'Desinstalación', 'Visita Fallida'];
  const tecnicos = ['Sebastian Parra'];
  const marcasPopulares = ['Audi', 'BMW', 'Chevrolet', 'Citroën', 'Ford', 'Hyundai', 'Kia', 'Mazda', 'Mercedes Benz', 'Mitsubishi', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen'].sort();
  const años = [];
  for (let año = 2030; año >= 1990; año--) {
    años.push(año);
  }
  const colores = ['Amarillo', 'Azul', 'Beige', 'Blanco', 'Café', 'Gris', 'Morado', 'Naranja', 'Negro', 'Plata', 'Rojo', 'Rosa', 'Verde'];

  const accesoriosDisponibles = ['Inmovilizador', 'Edata', 'Dallas', 'Buzzer', 'Boton SOS', 'Sensor T°', 'Sensor Puerta', 'Camara', 'Cipia'];

  const handleAccesorioToggle = (accesorio) => {
    const accesoriosActuales = datosOT.datosGPS.accesoriosInstalados || [];
    const existe = accesoriosActuales.includes(accesorio);
    
    if (existe) {
      actualizarDatos('datosGPS', {
        ...datosOT.datosGPS,
        accesoriosInstalados: accesoriosActuales.filter(a => a !== accesorio)
      });
    } else {
      actualizarDatos('datosGPS', {
        ...datosOT.datosGPS,
        accesoriosInstalados: [...accesoriosActuales, accesorio]
      });
    }
  };

  const formatearRUT = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length <= 1) return rutLimpio;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
  };

  const formatearPPU = (ppu) => {
    const ppuLimpio = ppu.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (ppuLimpio.length <= 6) {
      return ppuLimpio;
    }
    return ppuLimpio.slice(0, 6);
  };

  const formatearTelefono = (telefono) => {
    const telefonoLimpio = telefono.replace(/\D/g, '');
    return telefonoLimpio.slice(0, 9);
  };

  return (
    <div className="crear-ot-container-flow">
      <div className="crear-ot-header-fixed">
        <button className="btn-volver-header" onClick={() => navigateTo('index')}>
          ← Volver
        </button>
        <div className="ot-codigo-badge">{codigoOT}</div>
      </div>

      <div className="progreso-visual">
        {[1, 2, 3, 4].map((paso, index) => (
          <div key={paso} className={`progreso-dot ${index <= pasoActual ? 'activo' : ''}`} />
        ))}
      </div>

      <div className="form-flow-container">
        {/* PASO 0: DATOS EMPRESA */}
        <div className={`form-section-flow ${pasoActual === 0 ? 'visible' : 'hidden'}`}>
          <h2 className="section-title-flow">🏢 Datos de la Empresa</h2>
          
          <input
            type="text"
            className="input-flow"
            placeholder="NOMBRE EMPRESA *"
            value={datosOT.datosEmpresa.nombreEmpresa || ''}
            onChange={(e) => actualizarDatos('datosEmpresa', { ...datosOT.datosEmpresa, nombreEmpresa: e.target.value })}
          />

          <input
            type="date"
            className="input-flow"
            value={datosOT.datosEmpresa.fecha || new Date().toISOString().split('T')[0]}
            onChange={(e) => actualizarDatos('datosEmpresa', { ...datosOT.datosEmpresa, fecha: e.target.value })}
          />

          <select
            className="select-flow"
            value={datosOT.datosEmpresa.region || ''}
            onChange={(e) => actualizarDatos('datosEmpresa', { ...datosOT.datosEmpresa, region: e.target.value, ciudad: '', comuna: '' })}
          >
            <option value="">SELECCIONAR REGIÓN *</option>
            {Object.keys(regionesData.regionesDatos).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select
            className="select-flow"
            value={datosOT.datosEmpresa.ciudad || ''}
            onChange={(e) => actualizarDatos('datosEmpresa', { ...datosOT.datosEmpresa, ciudad: e.target.value })}
            disabled={!datosOT.datosEmpresa.region}
          >
            <option value="">SELECCIONAR CIUDAD *</option>
            {ciudades.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>

          <select
            className="select-flow"
            value={datosOT.datosEmpresa.comuna || ''}
            onChange={(e) => actualizarDatos('datosEmpresa', { ...datosOT.datosEmpresa, comuna: e.target.value })}
            disabled={!datosOT.datosEmpresa.region}
          >
            <option value="">SELECCIONAR COMUNA *</option>
            {comunas.map(comuna => (
              <option key={comuna} value={comuna}>{comuna}</option>
            ))}
          </select>
        </div>

        {/* PASO 1: SERVICIO Y VEHÍCULO */}
        <div className={`form-section-flow ${pasoActual === 1 ? 'visible' : 'hidden'}`}>
          <h2 className="section-title-flow">📡🚗 Servicio y Vehículo</h2>
          
          <select
            className="select-flow"
            value={datosOT.datosGPS.nombreTecnico || ''}
            onChange={(e) => actualizarDatos('datosGPS', { ...datosOT.datosGPS, nombreTecnico: e.target.value })}
          >
            <option value="">TÉCNICO *</option>
            {tecnicos.map(tecnico => (
              <option key={tecnico} value={tecnico}>{tecnico}</option>
            ))}
          </select>

          <select
            className="select-flow"
            value={datosOT.datosGPS.tipoServicio || ''}
            onChange={(e) => actualizarDatos('datosGPS', { ...datosOT.datosGPS, tipoServicio: e.target.value })}
          >
            <option value="">SERVICIO *</option>
            {tiposServicio.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <div className="accesorios-dropdown-custom">
            <button
              type="button"
              className="accesorios-dropdown-toggle-custom"
              onClick={() => setMostrarAccesorios(!mostrarAccesorios)}
            >
              <span>
                {(datosOT.datosGPS.accesoriosInstalados || []).length > 0 
                  ? `${(datosOT.datosGPS.accesoriosInstalados || []).length} accesorios`
                  : 'Accesorios'}
              </span>
              <span className={`dropdown-arrow ${mostrarAccesorios ? 'open' : ''}`}>▼</span>
            </button>

            {mostrarAccesorios && (
              <div className="accesorios-dropdown-menu-custom">
                {accesoriosDisponibles.map((accesorio) => {
                  const seleccionado = (datosOT.datosGPS.accesoriosInstalados || []).includes(accesorio);
                  return (
                    <div
                      key={accesorio}
                      className={`accesorio-item-custom ${seleccionado ? 'selected' : ''}`}
                      onClick={() => handleAccesorioToggle(accesorio)}
                    >
                      <span className="accesorio-check-custom">{seleccionado ? '✓' : ''}</span>
                      <span>{accesorio}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="input-row-compact">
            <input
              type="text"
              className="input-flow-small"
              placeholder="PPU IN"
              maxLength="6"
              value={datosOT.datosGPS.ppuIn || ''}
              onChange={(e) => actualizarDatos('datosGPS', { ...datosOT.datosGPS, ppuIn: formatearPPU(e.target.value) })}
            />
            <label className="checkbox-inline-mini">
              <input
                type="checkbox"
                checked={mostrarPpuOut}
                onChange={(e) => {
                  setMostrarPpuOut(e.target.checked);
                  if (!e.target.checked) actualizarDatos('datosGPS', { ...datosOT.datosGPS, ppuOut: '' });
                }}
              />
              <span>PPU OUT</span>
            </label>
          </div>

          {mostrarPpuOut && (
            <input
              type="text"
              className="input-flow"
              placeholder="PPU OUT"
              maxLength="6"
              value={datosOT.datosGPS.ppuOut || ''}
              onChange={(e) => actualizarDatos('datosGPS', { ...datosOT.datosGPS, ppuOut: formatearPPU(e.target.value) })}
            />
          )}

          <div className="input-row-compact">
            <input
              type="number"
              className="input-flow-small"
              placeholder="IMEI IN"
              maxLength="15"
              value={datosOT.datosGPS.imeiIn || ''}
              onChange={(e) => actualizarDatos('datosGPS', { ...datosOT.datosGPS, imeiIn: e.target.value.replace(/\D/g, '').slice(0, 15) })}
            />
            <label className="checkbox-inline-mini">
              <input
                type="checkbox"
                checked={mostrarImeiOut}
                onChange={(e) => {
                  setMostrarImeiOut(e.target.checked);
                  if (!e.target.checked) actualizarDatos('datosGPS', { ...datosOT.datosGPS, imeiOut: '' });
                }}
              />
              <span>IMEI OUT</span>
            </label>
          </div>

          {mostrarImeiOut && (
            <input
              type="number"
              className="input-flow"
              placeholder="IMEI OUT"
              maxLength="15"
              value={datosOT.datosGPS.imeiOut || ''}
              onChange={(e) => actualizarDatos('datosGPS', { ...datosOT.datosGPS, imeiOut: e.target.value.replace(/\D/g, '').slice(0, 15) })}
            />
          )}

          <div className="separador-flow"></div>

          <select
            className="select-flow"
            value={datosOT.datosVehiculo.marca || ''}
            onChange={(e) => actualizarDatos('datosVehiculo', { ...datosOT.datosVehiculo, marca: e.target.value })}
          >
            <option value="">MARCA *</option>
            {marcasPopulares.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>

          <div className="input-row-compact">
            <input
              type="text"
              className="input-flow-small"
              placeholder="MODELO *"
              value={datosOT.datosVehiculo.modelo || ''}
              onChange={(e) => actualizarDatos('datosVehiculo', { ...datosOT.datosVehiculo, modelo: e.target.value })}
            />

            <select
              className="select-flow-small"
              value={datosOT.datosVehiculo.ano || ''}
              onChange={(e) => actualizarDatos('datosVehiculo', { ...datosOT.datosVehiculo, ano: e.target.value })}
            >
              <option value="">AÑO *</option>
              {años.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>

          <select
            className="select-flow"
            value={datosOT.datosVehiculo.color || ''}
            onChange={(e) => actualizarDatos('datosVehiculo', { ...datosOT.datosVehiculo, color: e.target.value })}
          >
            <option value="">COLOR *</option>
            {colores.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          <input
            type="number"
            className="input-flow"
            placeholder="KILOMETRAJE"
            value={datosOT.datosVehiculo.kilometraje || ''}
            onChange={(e) => actualizarDatos('datosVehiculo', { ...datosOT.datosVehiculo, kilometraje: e.target.value })}
          />

          <textarea
            className="textarea-flow-small"
            rows="2"
            placeholder="OBSERVACIONES"
            value={datosOT.datosVehiculo.observaciones || ''}
            onChange={(e) => actualizarDatos('datosVehiculo', { ...datosOT.datosVehiculo, observaciones: e.target.value })}
          />
        </div>

        {/* PASO 2: CHECKLIST */}
        <div className={`form-section-flow ${pasoActual === 2 ? 'visible' : 'hidden'}`}>
          <h2 className="section-title-flow">✅ CheckList</h2>
          <CheckList 
            datos={datosOT.checklist}
            onChange={(datos) => actualizarDatos('checklist', datos)}
          />
        </div>

        {/* PASO 3: CLIENTE Y FIRMA */}
        <div className={`form-section-flow ${pasoActual === 3 ? 'visible' : 'hidden'}`}>
          <h2 className="section-title-flow">👤 Cliente y Firma</h2>
          
          <input
            type="text"
            className="input-flow"
            placeholder="NOMBRE COMPLETO *"
            value={datosOT.datosCliente?.nombre || ''}
            onChange={(e) => actualizarDatos('datosCliente', { ...datosOT.datosCliente, nombre: e.target.value })}
          />

          <input
            type="text"
            className="input-flow"
            placeholder="RUT *"
            maxLength="12"
            value={datosOT.datosCliente?.rut || ''}
            onChange={(e) => actualizarDatos('datosCliente', { ...datosOT.datosCliente, rut: formatearRUT(e.target.value) })}
          />

          <div className="tipo-contacto-selector">
            <button
              type="button"
              className={`tipo-contacto-btn ${tipoContacto === 'telefono' ? 'activo' : ''}`}
              onClick={() => setTipoContacto('telefono')}
            >
              📱 Teléfono
            </button>
            <button
              type="button"
              className={`tipo-contacto-btn ${tipoContacto === 'correo' ? 'activo' : ''}`}
              onClick={() => setTipoContacto('correo')}
            >
              ✉️ Correo
            </button>
          </div>

          {tipoContacto === 'telefono' ? (
            <div className="input-telefono-container">
              <div className="prefijo-telefono">+56</div>
              <input
                type="tel"
                className="input-flow"
                placeholder="9 1234 5678 *"
                maxLength="9"
                value={datosOT.datosCliente?.contacto || ''}
                onChange={(e) => actualizarDatos('datosCliente', { ...datosOT.datosCliente, contacto: formatearTelefono(e.target.value) })}
              />
            </div>
          ) : (
            <input
              type="email"
              className="input-flow"
              placeholder="correo@ejemplo.com *"
              style={{ textTransform: 'none' }}
              value={datosOT.datosCliente?.contacto || ''}
              onChange={(e) => actualizarDatos('datosCliente', { ...datosOT.datosCliente, contacto: e.target.value })}
            />
          )}

          <div className="firma-container-flow-compact">
            <label className="label-flow-firma">✍️ FIRMA *</label>
            <FirmaDigital 
              onFirmaChange={(firma) => actualizarDatos('datosCliente', { ...datosOT.datosCliente, firma })} 
            />
          </div>
        </div>
      </div>

      <div className="navegacion-fixed">
        {pasoActual > 0 && (
          <button className="btn btn-secondary btn-nav" onClick={handleAtras}>
            ← Atrás
          </button>
        )}
        
        {pasoActual < 3 ? (
          <button className="btn btn-primary btn-nav" onClick={handleSiguiente}>
            Siguiente →
          </button>
        ) : (
          <button className="btn btn-success btn-nav" onClick={handleCrearOT}>
            ✓ Crear OT
          </button>
        )}
      </div>

      <ModalConfirmacionOT
        mostrar={mostrarModal}
        ultimaOTCreada={ultimaOTCreada}
        onCrearOtra={handleCrearOtra}
        onFinalizar={handleFinalizar}
      />
    </div>
  );
}

export default CrearOT;