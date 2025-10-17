import { useState, useEffect } from 'react';
import '../styles/baseDatos.css';
import { obtenerTodasLasOTs, eliminarOT, exportarOTsJSON, obtenerEstadisticas, limpiarOTsAntiguas } from '../utils/storage';
import { generarPDFOT } from '../utils/pdfService';

function BaseDatos({ navigateTo }) {
  const [ots, setOts] = useState([]);
  const [otsFiltradas, setOtsFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('todas');
  const [empresasDisponibles, setEmpresasDisponibles] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ total: 0, ultimaSemana: 0, ultimoMes: 0 });

  useEffect(() => {
    cargarOTs();
  }, []);

  useEffect(() => {
    filtrarOTs();
  }, [busqueda, empresaFiltro, ots]);

  const cargarOTs = () => {
    const otsGuardadas = obtenerTodasLasOTs();
    setOts(otsGuardadas);
    setEstadisticas(obtenerEstadisticas());
    
    const empresasUnicas = [...new Set(otsGuardadas.map(ot => ot.prefijo))];
    const empresasConNombre = empresasUnicas.map(prefijo => {
      return {
        prefijo: prefijo,
        nombre: getNombreEmpresa(prefijo)
      };
    });
    setEmpresasDisponibles(empresasConNombre);
  };

  const getNombreEmpresa = (prefijo) => {
    const mapaEmpresas = {
      'LWE': 'LW - Entel',
      'U': 'UGPS'
    };
    return mapaEmpresas[prefijo] || prefijo;
  };

  const filtrarOTs = () => {
    let filtradas = ots;

    if (empresaFiltro !== 'todas') {
      filtradas = filtradas.filter(ot => ot.prefijo === empresaFiltro);
    }

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      filtradas = filtradas.filter(ot => {
        return (
          ot.numeroOT?.toString().includes(termino) ||
          ot.codigoOT?.toLowerCase().includes(termino) ||
          ot.datosEmpresa?.nombreEmpresa?.toLowerCase().includes(termino) ||
          ot.datosVehiculo?.patente?.toLowerCase().includes(termino) ||
          ot.datosVehiculo?.marca?.toLowerCase().includes(termino) ||
          ot.datosVehiculo?.modelo?.toLowerCase().includes(termino) ||
          ot.datosGPS?.nombreTecnico?.toLowerCase().includes(termino) ||
          ot.datosGPS?.imeiIn?.toLowerCase().includes(termino) ||
          ot.datosGPS?.imeiOut?.toLowerCase().includes(termino)
        );
      });
    }

    setOtsFiltradas(filtradas);
  };

  const handleEliminar = (id, numeroOT) => {
    if (window.confirm(`¿Está seguro de eliminar la OT${String(numeroOT).padStart(4, '0')}?`)) {
      const resultado = eliminarOT(id);
      if (resultado) {
        alert('✓ OT eliminada correctamente');
        cargarOTs();
      } else {
        alert('❌ Error al eliminar la OT');
      }
    }
  };

  const handleLimpiarAntiguas = () => {
    if (window.confirm('¿Desea limpiar todas las OTs con más de 2 meses de antigüedad?')) {
      limpiarOTsAntiguas();
      alert('✓ OTs antiguas eliminadas');
      cargarOTs();
    }
  };

  // ✅ CORRECTO - Previsualizar PDF
  const handlePrevisualizarPDF = (ot) => {
    try {
      generarPDFOT(ot, true); // true = previsualizar
    } catch (error) {
      console.error('Error al previsualizar PDF:', error);
      alert('❌ Error al generar la previsualización del PDF.');
    }
  };

  // ✅ CORRECTO - Descargar PDF
  const handleDescargarPDF = (ot) => {
    try {
      generarPDFOT(ot, false); // false = descargar
      alert('✅ PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('❌ Error al generar el PDF.');
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="base-datos-container">
      <div className="base-datos-header">
        <div className="base-datos-header-top">
          <h1 className="base-datos-title">Base de Datos de OTs</h1>
          <button 
            className="btn btn-volver"
            onClick={() => navigateTo('index')}
          >
            ← Volver
          </button>
        </div>
      </div>

      <div className="estadisticas-container">
        <div className="estadistica-card">
          <div className="estadistica-numero">{estadisticas.total}</div>
          <div className="estadistica-label">Total OTs</div>
        </div>
        <div className="estadistica-card">
          <div className="estadistica-numero">{estadisticas.ultimaSemana}</div>
          <div className="estadistica-label">Última Semana</div>
        </div>
        <div className="estadistica-card">
          <div className="estadistica-numero">{estadisticas.ultimoMes}</div>
          <div className="estadistica-label">Último Mes</div>
        </div>
      </div>

      <div className="acciones-generales">
        <button 
          className="btn btn-primary"
          onClick={exportarOTsJSON}
        >
          📥 Exportar a JSON
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleLimpiarAntiguas}
        >
          🗑️ Limpiar OTs Antiguas
        </button>
      </div>

      <div className="filtros-container">
        <div className="filtro-empresa">
          <label className="filtro-label">Empresa GPS:</label>
          <select 
            className="filtro-select"
            value={empresaFiltro}
            onChange={(e) => setEmpresaFiltro(e.target.value)}
          >
            <option value="todas">Todas las Empresas</option>
            {empresasDisponibles.map((empresa) => (
              <option key={empresa.prefijo} value={empresa.prefijo}>
                {empresa.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="busqueda-input-container">
          <input
            type="text"
            className="busqueda-input"
            placeholder="🔍 Buscar por N° OT, empresa, patente, marca, modelo, técnico o IMEI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {otsFiltradas.length === 0 ? (
        <div className="mensaje-vacio">
          <div className="mensaje-vacio-icon">📋</div>
          <div className="mensaje-vacio-texto">
            {busqueda || empresaFiltro !== 'todas' 
              ? 'No se encontraron OTs con ese criterio de búsqueda' 
              : 'No hay órdenes de trabajo registradas'}
          </div>
          {!busqueda && empresaFiltro === 'todas' && (
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('crear-ot')}
            >
              ➕ Crear Primera OT
            </button>
          )}
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla-ots">
            <thead>
              <tr>
                <th>N° OT</th>
                <th>Empresa GPS</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Patente</th>
                <th>Técnico</th>
                <th>Servicio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {otsFiltradas.map((ot) => (
                <tr key={ot.id}>
                  <td className="ot-numero-cell">
                    <span className="badge badge-info">
                      {ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`}
                    </span>
                  </td>
                  <td>
                    <span className="empresa-badge">
                      {getNombreEmpresa(ot.prefijo)}
                    </span>
                  </td>
                  <td>{formatearFecha(ot.fechaCreacion)}</td>
                  <td>{ot.datosEmpresa?.nombreEmpresa || 'N/A'}</td>
                  <td>
                    <div className="vehiculo-info">
                      <strong>{ot.datosVehiculo?.marca || 'N/A'}</strong>
                      <span>{ot.datosVehiculo?.modelo || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="patente-badge">
                      {ot.datosVehiculo?.patente || 'Sin Patente'}
                    </span>
                  </td>
                  <td>{ot.datosGPS?.nombreTecnico || 'N/A'}</td>
                  <td>
                    <span className="servicio-badge">
                      {ot.datosGPS?.tipoServicio || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-cell">
                      {/* ✅ NUEVO: Botón Previsualizar */}
                      <button 
                        className="btn-icono btn-preview"
                        onClick={() => handlePrevisualizarPDF(ot)}
                        title="Previsualizar PDF"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-icono btn-descargar"
                        onClick={() => handleDescargarPDF(ot)}
                        title="Descargar PDF"
                      >
                        📥
                      </button>
                      <button 
                        className="btn-icono btn-ver"
                        onClick={() => navigateTo('detalle-ot', ot.id, false)}
                        title="Ver Detalles"
                      >
                        📄
                      </button>
                      <button 
                        className="btn-icono btn-editar"
                        onClick={() => navigateTo('detalle-ot', ot.id, true)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icono btn-eliminar"
                        onClick={() => handleEliminar(ot.id, ot.numeroOT)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BaseDatos;