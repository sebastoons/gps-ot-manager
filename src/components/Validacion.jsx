// src/components/Validacion.jsx - VERSIÓN SIMPLIFICADA Y RÁPIDA
import { useState, useEffect } from 'react';
import '../styles/validacion.css';

function Validacion({ navigateTo }) {
  const [mostrarPpuOut, setMostrarPpuOut] = useState(false);

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
    imeiIn: '',
    kms: '',
    ubicacion: '',
    perifericos: '',
    detalles: ''
  });

  useEffect(() => {
    const datosGuardados = localStorage.getItem('gps_validacion_temp');
    if (datosGuardados) {
      const datos = JSON.parse(datosGuardados);
      setDatosValidacion(datos);
      if (datos.ppuOut) setMostrarPpuOut(true);
    }
  }, []);

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
    let texto = `FECHA: ${obtenerFechaActual()}\n`;
    
    if (datosValidacion.cliente) texto += `CLIENTE: ${datosValidacion.cliente.toUpperCase()}\n`;
    if (datosValidacion.servicio) texto += `SERVICIO: ${datosValidacion.servicio.toUpperCase()}\n`;
    if (datosValidacion.ppuVin) texto += `PPU/VIN: ${datosValidacion.ppuVin.toUpperCase()}\n`;
    if (mostrarPpuOut && datosValidacion.ppuOut) texto += `PPU/VIN OUT: ${datosValidacion.ppuOut.toUpperCase()}\n`;
    
    if (datosValidacion.marca || datosValidacion.modelo || datosValidacion.año) {
      let marcaCompleta = [];
      if (datosValidacion.marca) marcaCompleta.push(datosValidacion.marca.toUpperCase());
      if (datosValidacion.modelo) marcaCompleta.push(datosValidacion.modelo.toUpperCase());
      if (datosValidacion.año) marcaCompleta.push(datosValidacion.año.toString().toUpperCase());
      texto += `MARCA: ${marcaCompleta.join(' ')}\n`;
    }
    
    if (datosValidacion.imeiIn) texto += `IMEI IN: ${datosValidacion.imeiIn}\n`;
    if (datosValidacion.kms) texto += `KMS/HRS: ${datosValidacion.kms}\n`;
    if (datosValidacion.ubicacion) texto += `UBICACION: ${datosValidacion.ubicacion.toUpperCase()}\n`;
    if (datosValidacion.perifericos) texto += `PERIFERICOS: ${datosValidacion.perifericos.toUpperCase()}\n`;
    if (datosValidacion.detalles) texto += `DETALLES: ${datosValidacion.detalles.toUpperCase()}\n`;
    
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
        imeiIn: '',
        kms: '',
        ubicacion: '',
        perifericos: '',
        detalles: ''
      });
      setMostrarPpuOut(false);
      localStorage.removeItem('gps_validacion_temp');
    }
  };

  const tiposServicio = ['Instalación', 'Mantención', 'Migración', 'Desinstalación', 'Visita Fallida'];
  const marcasPopulares = ['Audi', 'BMW', 'Chevrolet', 'Ford', 'Hyundai', 'Kia', 'Mazda', 'Mercedes Benz', 'Mitsubishi', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Volkswagen'].sort();
  const años = [];
  for (let año = 2030; año >= 1990; año--) {
    años.push(año);
  }

  return (
    <div className="validacion-container">
      <div className="validacion-header">
        <div className="validacion-header-top">
          <h1 className="validacion-title">Validación WhatsApp</h1>
          <button className="btn-volver" onClick={() => navigateTo('index')}>
            ← Volver
          </button>
        </div>
      </div>

      <div className="vista-previa-compacta">
        <div className="vista-previa-header">
          <span className="vista-previa-icon">📱</span>
          <h3 className="vista-previa-title">Vista Previa</h3>
        </div>
        <div className="vista-previa-contenido">
          {generarTextoWhatsApp() ? (
            <pre className="vista-previa-texto">{generarTextoWhatsApp()}</pre>
          ) : (
            <div className="vista-previa-vacia">Completa los campos...</div>
          )}
        </div>
      </div>

      <div className="validacion-formulario-compacto">
        <div className="form-group-compacto">
          <input
            type="text"
            className="form-input-compacto"
            placeholder="CLIENTE *"
            value={datosValidacion.cliente}
            onChange={(e) => handleChange('cliente', e.target.value)}
          />
        </div>

        <div className="form-group-compacto">
          <select
            className="form-select-compacto"
            value={datosValidacion.servicio}
            onChange={(e) => handleChange('servicio', e.target.value)}
          >
            <option value="">SERVICIO *</option>
            {tiposServicio.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="form-row-compacto">
          <input
            type="text"
            className="form-input-compacto"
            placeholder="PPU/VIN *"
            maxLength="20"
            style={{ textTransform: 'uppercase' }}
            value={datosValidacion.ppuVin}
            onChange={(e) => handleChange('ppuVin', e.target.value.toUpperCase())}
          />
          
          {mostrarPpuOut && (
            <input
              type="text"
              className="form-input-compacto"
              placeholder="PPU OUT"
              maxLength="20"
              style={{ textTransform: 'uppercase' }}
              value={datosValidacion.ppuOut}
              onChange={(e) => handleChange('ppuOut', e.target.value.toUpperCase())}
            />
          )}
        </div>

        <div className="form-check-inline">
          <input
            type="checkbox"
            id="checkbox-ppu-out"
            checked={mostrarPpuOut}
            onChange={(e) => {
              setMostrarPpuOut(e.target.checked);
              if (!e.target.checked) handleChange('ppuOut', '');
            }}
          />
          <label htmlFor="checkbox-ppu-out">¿PPU OUT?</label>
        </div>

        <div className="form-row-compacto">
          <select
            className="form-select-compacto"
            value={datosValidacion.marca}
            onChange={(e) => handleChange('marca', e.target.value)}
          >
            <option value="">MARCA</option>
            {marcasPopulares.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>

          <input
            type="text"
            className="form-input-compacto"
            placeholder="MODELO"
            value={datosValidacion.modelo}
            onChange={(e) => handleChange('modelo', e.target.value)}
          />
        </div>

        <div className="form-group-compacto">
          <select
            className="form-select-compacto"
            value={datosValidacion.año}
            onChange={(e) => handleChange('año', e.target.value)}
          >
            <option value="">AÑO</option>
            {años.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
        </div>

        <div className="form-group-compacto">
          <input
            type="number"
            className="form-input-compacto"
            placeholder="IMEI IN"
            maxLength="15"
            value={datosValidacion.imeiIn}
            onChange={(e) => handleChange('imeiIn', e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="form-group-compacto">
          <input
            type="text"
            className="form-input-compacto"
            placeholder="KMS/HRS"
            value={datosValidacion.kms}
            onChange={(e) => handleChange('kms', e.target.value)}
          />
        </div>

        <div className="form-group-compacto">
          <input
            type="text"
            className="form-input-compacto"
            placeholder="UBICACIÓN"
            value={datosValidacion.ubicacion}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
          />
        </div>

        <div className="form-group-compacto">
          <input
            type="text"
            className="form-input-compacto"
            placeholder="PERIFÉRICOS"
            value={datosValidacion.perifericos}
            onChange={(e) => handleChange('perifericos', e.target.value)}
          />
        </div>

        <div className="form-group-compacto">
          <textarea
            className="form-textarea-compacto"
            rows="3"
            placeholder="DETALLES"
            value={datosValidacion.detalles}
            onChange={(e) => handleChange('detalles', e.target.value)}
          />
        </div>
      </div>

      <div className="validacion-acciones-compactas">
        <button className="btn btn-secondary btn-compact" onClick={handleLimpiar}>
          🗑️
        </button>
        <button className="btn btn-info btn-compact" onClick={handleCopiar}>
          📋
        </button>
        <button className="btn btn-success btn-compact" onClick={handleExportarWhatsApp}>
          📤
        </button>
      </div>
    </div>
  );
}

export default Validacion;