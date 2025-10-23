// src/components/BaseDatos.jsx - CON SISTEMA DE BACKUP
import { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/baseDatos.css';
import { 
  obtenerTodasLasOTs, 
  eliminarOT, 
  exportarOTsJSON, 
  obtenerEstadisticas, 
  limpiarOTsAntiguas,
  crearBackup,
  restaurarBackup,
  restaurarBackupAutomatico
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
  const inputFileRef = useRef(null);

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

  // ============ FUNCIONES DE BACKUP ============
  
  const handleCrearBackup = useCallback(() => {
    if (crearBackup()) {
      alert('✅ Backup creado exitosamente\n\nEl archivo se ha descargado y también se guardó un respaldo automático.');
    } else {
      alert('❌ Error al crear el backup');
    }
  }, []);

  const handleSeleccionarArchivo = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  const handleRestaurarBackup = useCallback((event) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    if (!archivo.name.endsWith('.json')) {
      alert('❌ Por favor selecciona un archivo JSON válido');
      return;
    }

    if (window.confirm('⚠️ ¿Estás seguro de restaurar este backup?\n\nEsto reemplazará todos los datos actuales.')) {
      restaurarBackup(archivo)
        .then((cantidadOTs) => {
          alert(`✅ Backup restaurado exitosamente\n\nSe restauraron ${cantidadOTs} OTs`);
          cargarOTs();
          event.target.value = '';
        })
        .catch((error) => {
          console.error('Error al restaurar backup:', error);
          alert(`❌ Error al restaurar el backup:\n\n${error.message}`);
          event.target.value = '';
        });
    } else {
      event.target.value = '';
    }
  }, [cargarOTs]);

  const handleRestaurarBackupAutomatico = useCallback(() => {
    if (window.confirm('⚠️ ¿Deseas restaurar el último backup automático?\n\nEsto reemplazará todos los datos actuales.')) {
      const resultado = restaurarBackupAutomatico();
      if (resultado.success) {
        alert(`✅ ${resultado.message}`);
        cargarOTs();
      } else {
        alert(`❌ ${resultado.message}`);
      }
    }
  }, [cargarOTs]);

  return (
    <div className="base-datos-container">
      {/* Header mejorado */}
      <div className="base-datos-header">
        <div className="base-datos-header-top">
          <h1 className="base-datos-title">Base de Datos</h1>
          <button 
            className="btn-volver"
            onClick={() => navigateTo('index')}
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <EstadisticasOT estadisticas={estadisticas} />

      {/* Sistema de Backup/Restore */}
      <div className="acciones-backup">
        <div className="acciones-backup-titulo">
          💾 Sistema de Respaldo
        </div>
        <div className="acciones-backup-botones">
          <button 
            className="btn-backup"
            onClick={handleCrearBackup}
          >
            📥 Crear Backup
          </button>
          <button 
            className="btn-restore"
            onClick={handleSeleccionarArchivo}
          >
            📤 Restaurar Backup
          </button>
        </div>
        <button 
          className="btn btn-secondary"
          style={{ fontSize: '0.65em', padding: '6px' }}
          onClick={handleRestaurarBackupAutomatico}
        >
          🔄 Restaurar Último Backup Automático
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept=".json"
          className="input-restore"
          onChange={handleRestaurarBackup}
        />
      </div>

      {/* Acciones Generales */}
      <div className="acciones-generales">
        <button 
          className="btn btn-primary"
          onClick={exportarOTsJSON}
        >
          📥 Exportar JSON
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleLimpiarAntiguas}
        >
          🗑️ Limpiar Antiguas
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

      {/* Tabla */}
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