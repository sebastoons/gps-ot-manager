// src/components/BaseDatos.jsx - VERSIÓN COMPLETA CORREGIDA
import { useState, useEffect, useCallback } from 'react';
import '../styles/baseDatos.css';
import { 
  obtenerTodasLasOTs, 
  eliminarOT, 
  exportarOTsJSON, 
  obtenerEstadisticas, 
  limpiarOTsAntiguas 
} from '../utils/storage';
import { generarPDFOT } from '../utils/pdfService';
import { formatearFecha, getNombreEmpresa, obtenerEmpresasUnicas } from '../utils/formatters';
import { useFiltrosOT } from '../hooks/useFiltrosOT';
import EstadisticasOT from './EstadisticasOT';
import FiltrosBaseDatos from './FiltrosBaseDatos';
import FilaTablaOT from './FilaTablaOT';

function BaseDatos({ navigateTo }) {
  const [ots, setOts] = useState([]);
  const [empresasDisponibles, setEmpresasDisponibles] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ total: 0, ultimaSemana: 0, ultimoMes: 0 });

  const { 
    otsFiltradas, 
    busqueda, 
    setBusqueda, 
    empresaFiltro, 
    setEmpresaFiltro 
  } = useFiltrosOT(ots);

  useEffect(() => {
    cargarOTs();
  }, []);

  const cargarOTs = useCallback(() => {
    const otsGuardadas = obtenerTodasLasOTs();
    setOts(otsGuardadas);
    setEstadisticas(obtenerEstadisticas());
    setEmpresasDisponibles(obtenerEmpresasUnicas(otsGuardadas));
  }, []);

  const handleEliminar = useCallback((id, numeroOT) => {
    if (window.confirm(`¿Está seguro de eliminar la OT${String(numeroOT).padStart(4, '0')}?`)) {
      if (eliminarOT(id)) {
        alert('✓ OT eliminada correctamente');
        cargarOTs();
      } else {
        alert('❌ Error al eliminar la OT');
      }
    }
  }, [cargarOTs]);

  const handleLimpiarAntiguas = useCallback(() => {
    if (window.confirm('¿Desea limpiar todas las OTs con más de 2 meses de antigüedad?')) {
      limpiarOTsAntiguas();
      alert('✓ OTs antiguas eliminadas');
      cargarOTs();
    }
  }, [cargarOTs]);

  const handlePrevisualizarPDF = useCallback((ot) => {
    try {
      generarPDFOT(ot, true);
    } catch (error) {
      console.error('Error al previsualizar PDF:', error);
      alert('❌ Error al generar la previsualización del PDF.');
    }
  }, []);

  const handleDescargarPDF = useCallback((ot) => {
    try {
      generarPDFOT(ot, false);
      alert('✅ PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('❌ Error al generar el PDF.');
    }
  }, []);

  return (
    <div className="base-datos-container">
      {/* Header */}
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

      {/* Estadísticas */}
      <EstadisticasOT estadisticas={estadisticas} />

      {/* Acciones Generales */}
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

      {/* Filtros */}
      <FiltrosBaseDatos
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        empresaFiltro={empresaFiltro}
        setEmpresaFiltro={setEmpresaFiltro}
        empresasDisponibles={empresasDisponibles}
      />

      {/* Tabla Simplificada */}
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
                <th>Empresa</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>PPU</th>
                <th>Servicio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {otsFiltradas.map((ot) => (
                <FilaTablaOT
                  key={ot.id}
                  ot={ot}
                  onPrevisualizar={handlePrevisualizarPDF}
                  onDescargar={handleDescargarPDF}
                  onEditar={(id) => navigateTo('detalle-ot', id, true)}
                  onEliminar={handleEliminar}
                  getNombreEmpresa={getNombreEmpresa}
                  formatearFecha={formatearFecha}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BaseDatos;