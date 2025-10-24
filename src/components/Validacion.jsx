// src/components/Validacion.jsx
import { useState, useEffect } from 'react';
import '../styles/validacion.css';

function Validacion({ navigateTo }) {
  const [mostrarPpuOut, setMostrarPpuOut] = useState(false);
  const [mostrarKms, setMostrarKms] = useState(false);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(false);
  const [mostrarPerifericos, setMostrarPerifericos] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Función para obtener fecha actual en formato dd-mm-yyyy
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  const [datosValidacion, setDatosValidacion] = useState({
    cliente: '',
    servicio: '',
    ppuVin: '',
    ppuOut: '',
    marca: '',
    modelo: '',
    año: '',
    gpsIn: '',
    kmsHrs: '',
    ubicacion: '',
    perifericos: '',
    detalles: ''
  });

  // Cargar datos guardados al montar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('gps_validacion_temp');
    if (datosGuardados) {
      const datos = JSON.parse(datosGuardados);
      setDatosValidacion(datos);
      
      // Restaurar checkboxes
      if (datos.ppuOut) setMostrarPpuOut(true);
      if (datos.kmsHrs) setMostrarKms(true);
      if (datos.ubicacion) setMostrarUbicacion(true);
      if (datos.perifericos) setMostrarPerifericos(true);
      if (datos.detalles) setMostrarDetalles(true);
    }
  }, []);

  // Guardar automáticamente
  useEffect(() => {
    localStorage.setItem('gps_validacion_temp', JSON.stringify(datosValidacion));
  }, [datosValidacion]);

  const handleChange = (campo, valor) => {
    setDatosValidacion({
      ...datosValidacion,
      [campo]: valor
    });
  };

  const generarTextoWhatsApp = () => {
    let texto = '';
    
    // Fecha siempre al inicio con la fecha actual del sistema
    texto += `Fecha: ${obtenerFechaActual()}\n`;
    
    if (datosValidacion.cliente) texto += `cliente: ${datosValidacion.cliente}\n`;
    if (datosValidacion.servicio) texto += `Servicio: ${datosValidacion.servicio}\n`;
    if (datosValidacion.ppuVin) texto += `Ppu/Vin: ${datosValidacion.ppuVin}\n`;
    if (mostrarPpuOut && datosValidacion.ppuOut) texto += `Ppu/Vin Out: ${datosValidacion.ppuOut}\n`;
    
    // Construir marca completa
    if (datosValidacion.marca || datosValidacion.modelo || datosValidacion.año) {
      let marcaCompleta = [];
      if (datosValidacion.marca) marcaCompleta.push(datosValidacion.marca);
      if (datosValidacion.modelo) marcaCompleta.push(datosValidacion.modelo);
      if (datosValidacion.año) marcaCompleta.push(datosValidacion.año);
      texto += `Marca: ${marcaCompleta.join(' ')}\n`;
    }
    
    if (datosValidacion.gpsIn) texto += `Gps In: ${datosValidacion.gpsIn}\n`;
    if (mostrarKms && datosValidacion.kmsHrs) texto += `Kms/Hrs : ${datosValidacion.kmsHrs}\n`;
    if (mostrarUbicacion && datosValidacion.ubicacion) texto += `Ubicación: ${datosValidacion.ubicacion}\n`;
    if (mostrarPerifericos && datosValidacion.perifericos) texto += `Periféricos: ${datosValidacion.perifericos}\n`;
    if (mostrarDetalles && datosValidacion.detalles) texto += `Detalles: ${datosValidacion.detalles}\n`;
    
    return texto.trim();
  };

  const handleCopiar = () => {
    const texto = generarTextoWhatsApp();
    if (!texto) {
      alert('⚠️ No hay datos para copiar');
      return;
    }
    
    navigator.clipboard.writeText(texto).then(() => {
      alert('✅ Texto copiado al portapapeles');
    }).catch(() => {
      alert('❌ Error al copiar texto');
    });
  };

  const handleExportarWhatsApp = () => {
    const texto = generarTextoWhatsApp();
    if (!texto) {
      alert('⚠️ No hay datos para exportar');
      return;
    }
    
    const textoEncoded = encodeURIComponent(texto);
    const url = `https://wa.me/?text=${textoEncoded}`;
    window.open(url, '_blank');
  };

  const handleLimpiar = () => {
    if (window.confirm('¿Está seguro de limpiar todos los datos?')) {
      setDatosValidacion({
        cliente: '',
        servicio: '',
        ppuVin: '',
        ppuOut: '',
        marca: '',
        modelo: '',
        año: '',
        gpsIn: '',
        kmsHrs: '',
        ubicacion: '',
        perifericos: '',
        detalles: ''
      });
      setMostrarPpuOut(false);
      setMostrarKms(false);
      setMostrarUbicacion(false);
      setMostrarPerifericos(false);
      setMostrarDetalles(false);
      localStorage.removeItem('gps_validacion_temp');
    }
  };

  const tiposServicio = [
    'Instalación',
    'Mantención',
    'Migración',
    'Desinstalación',
    'Visita Fallida'
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

  // Generar años del 1990 al 2030
  const años = [];
  for (let año = 2030; año >= 1990; año--) {
    años.push(año);
  }

  return (
    <div className="validacion-container">
      {/* Header */}
      <div className="validacion-header">
        <div className="validacion-header-top">
          <h1 className="validacion-title">Validación WhatsApp</h1>
          <button 
            className="btn-volver"
            onClick={() => navigateTo('index')}
          >
            ← Volver
          </button>
        </div>
        <p className="validacion-subtitle">
          Crea un formato rápido para compartir información
        </p>
      </div>

      {/* Vista previa */}
      <div className="vista-previa">
        <div className="vista-previa-header">
          <span className="vista-previa-icon">📱</span>
          <h3 className="vista-previa-title">Vista Previa WhatsApp</h3>
        </div>
        <div className="vista-previa-contenido">
          {generarTextoWhatsApp() ? (
            <pre className="vista-previa-texto">{generarTextoWhatsApp()}</pre>
          ) : (
            <div className="vista-previa-vacia">
              Completa los campos para ver la vista previa
            </div>
          )}
        </div>
      </div>

      {/* Formulario */}
      <div className="validacion-formulario">
        {/* Fecha como campo de solo lectura */}
        <div className="form-group">
          <label className="form-label">Fecha</label>
          <div className="fecha-readonly">
            <span className="fecha-icon">📅</span>
            <span className="fecha-texto">{obtenerFechaActual()}</span>
          </div>
          <small style={{ 
            display: 'block', 
            marginTop: '6px', 
            fontSize: '0.6em', 
            color: 'var(--text-secondary)',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            La fecha se actualiza automáticamente con el día actual
          </small>
        </div>

        <div className="form-group">
          <label className="form-label required-field">Cliente</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nombre de la empresa o cliente"
            value={datosValidacion.cliente}
            onChange={(e) => handleChange('cliente', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Servicio</label>
          <select
            className="form-select"
            value={datosValidacion.servicio}
            onChange={(e) => handleChange('servicio', e.target.value)}
          >
            <option value="">Seleccionar servicio</option>
            {tiposServicio.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required-field">PPU/VIN</label>
            <input
              type="text"
              className="form-input"
              placeholder="TDRP80"
              maxLength="20"
              style={{ textTransform: 'uppercase' }}
              value={datosValidacion.ppuVin}
              onChange={(e) => handleChange('ppuVin', e.target.value.toUpperCase())}
            />
          </div>

          <div className="form-group">
            <div className="form-check" style={{ marginBottom: '8px' }}>
              <input
                type="checkbox"
                id="checkbox-ppu-out-val"
                className="form-check-input"
                checked={mostrarPpuOut}
                onChange={(e) => {
                  setMostrarPpuOut(e.target.checked);
                  if (!e.target.checked) handleChange('ppuOut', '');
                }}
              />
              <label htmlFor="checkbox-ppu-out-val" className="form-check-label">
                ¿PPU/VIN OUT?
              </label>
            </div>
            {mostrarPpuOut && (
              <>
                <label className="form-label">PPU/VIN OUT</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Patente o VIN salida"
                  maxLength="20"
                  style={{ textTransform: 'uppercase' }}
                  value={datosValidacion.ppuOut}
                  onChange={(e) => handleChange('ppuOut', e.target.value.toUpperCase())}
                />
              </>
            )}
          </div>
        </div>

        {/* Marca, Modelo y Año */}
        <div className="seccion-vehiculo">
          <h3 className="seccion-titulo">Datos del Vehículo</h3>
          
          <div className="form-group">
            <label className="form-label">Marca</label>
            <select
              className="form-select"
              value={datosValidacion.marca}
              onChange={(e) => handleChange('marca', e.target.value)}
            >
              <option value="">Seleccionar marca</option>
              {marcasPopulares.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Modelo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Corolla, Axor, Ranger"
              value={datosValidacion.modelo}
              onChange={(e) => handleChange('modelo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Año</label>
            <select
              className="form-select"
              value={datosValidacion.año}
              onChange={(e) => handleChange('año', e.target.value)}
            >
              <option value="">Seleccionar año</option>
              {años.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">GPS IN</label>
          <input
            type="text"
            className="form-input"
            placeholder="Número de GPS o IMEI"
            value={datosValidacion.gpsIn}
            onChange={(e) => handleChange('gpsIn', e.target.value)}
          />
        </div>

        {/* Campos opcionales */}
        <div className="campos-opcionales">
          <h3 className="campos-opcionales-titulo">Campos Opcionales</h3>
          
          {/* Kms/Hrs primero */}
          <div className="form-check">
            <input
              type="checkbox"
              id="checkbox-kms"
              className="form-check-input"
              checked={mostrarKms}
              onChange={(e) => {
                setMostrarKms(e.target.checked);
                if (!e.target.checked) handleChange('kmsHrs', '');
              }}
            />
            <label htmlFor="checkbox-kms" className="form-check-label">
              Agregar Kms/Hrs
            </label>
          </div>
          {mostrarKms && (
            <div className="form-group" style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="177159"
                value={datosValidacion.kmsHrs}
                onChange={(e) => handleChange('kmsHrs', e.target.value)}
              />
            </div>
          )}

          {/* Ubicación segundo */}
          <div className="form-check">
            <input
              type="checkbox"
              id="checkbox-ubicacion"
              className="form-check-input"
              checked={mostrarUbicacion}
              onChange={(e) => {
                setMostrarUbicacion(e.target.checked);
                if (!e.target.checked) handleChange('ubicacion', '');
              }}
            />
            <label htmlFor="checkbox-ubicacion" className="form-check-label">
              Agregar Ubicación
            </label>
          </div>
          {mostrarUbicacion && (
            <div className="form-group" style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="arriba de fusilera copiloto"
                value={datosValidacion.ubicacion}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
              />
            </div>
          )}

          <div className="form-check">
            <input
              type="checkbox"
              id="checkbox-perifericos"
              className="form-check-input"
              checked={mostrarPerifericos}
              onChange={(e) => {
                setMostrarPerifericos(e.target.checked);
                if (!e.target.checked) handleChange('perifericos', '');
              }}
            />
            <label htmlFor="checkbox-perifericos" className="form-check-label">
              Agregar Periféricos
            </label>
          </div>
          {mostrarPerifericos && (
            <div className="form-group" style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Básico"
                value={datosValidacion.perifericos}
                onChange={(e) => handleChange('perifericos', e.target.value)}
              />
            </div>
          )}

          <div className="form-check">
            <input
              type="checkbox"
              id="checkbox-detalles"
              className="form-check-input"
              checked={mostrarDetalles}
              onChange={(e) => {
                setMostrarDetalles(e.target.checked);
                if (!e.target.checked) handleChange('detalles', '');
              }}
            />
            <label htmlFor="checkbox-detalles" className="form-check-label">
              Agregar Detalles
            </label>
          </div>
          {mostrarDetalles && (
            <div className="form-group" style={{ marginTop: '8px' }}>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="accesorios externos. Detalles por uso."
                value={datosValidacion.detalles}
                onChange={(e) => handleChange('detalles', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="validacion-acciones">
        <button 
          className="btn btn-secondary"
          onClick={handleLimpiar}
        >
          🗑️ Limpiar
        </button>
        <button 
          className="btn btn-info"
          onClick={handleCopiar}
        >
          📋 Copiar
        </button>
        <button 
          className="btn btn-success"
          onClick={handleExportarWhatsApp}
        >
          📤 Exportar a WhatsApp
        </button>
      </div>
    </div>
  );
}

export default Validacion;