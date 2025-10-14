import { useState, useEffect } from 'react';
import '../styles/baseDatos.css';
import { obtenerTodasLasOTs, eliminarOT, exportarOTsJSON, obtenerEstadisticas, limpiarOTsAntiguas } from '../utils/storage';

function BaseDatos({ navigateTo }) {
  const [ots, setOts] = useState([]);
  const [otsFiltradas, setOtsFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [estadisticas, setEstadisticas] = useState({ total: 0, ultimaSemana: 0, ultimoMes: 0 });

  useEffect(() => {
    cargarOTs();
  }, []);

  useEffect(() => {
    filtrarOTs();
  }, [busqueda, ots]);

  const cargarOTs = () => {
    const otsGuardadas = obtenerTodasLasOTs();
    setOts(otsGuardadas);
    setEstadisticas(obtenerEstadisticas());
  };

  const filtrarOTs = () => {
    if (!busqueda.trim()) {
      setOtsFiltradas(ots);
      return;
    }

    const termino = busqueda.toLowerCase();
    const filtradas = ots.filter(ot => {
      return (
        ot.numeroOT?.toString().includes(termino) ||
        ot.datosVehiculo?.patente?.toLowerCase().includes(termino) ||
        ot.datosVehiculo?.marca?.toLowerCase().includes(termino) ||
        ot.datosVehiculo?.modelo?.toLowerCase().includes(termino) ||
        ot.datosGPS?.imei?.toLowerCase().includes(termino)
      );
    });

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

      <div className="busqueda-container">
        <input
          type="text"
          className="busqueda-input"
          placeholder="🔍 Buscar por N° OT, patente, marca, modelo o IMEI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {otsFiltradas.length === 0 ? (
        <div className="mensaje-vacio">
          <div className="mensaje-vacio-icon">📋</div>
          <div className="mensaje-vacio-texto">
            {busqueda ? 'No se encontraron OTs con ese criterio de búsqueda' : 'No hay órdenes de trabajo registradas'}
          </div>
          {!busqueda && (
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('crear-ot')}
            >
              ➕ Crear Primera OT
            </button>
          )}
        </div>
      ) : (
        <div className="ots-lista-container">
          {otsFiltradas.map((ot) => (
            <div key={ot.id} className="ot-card">
              <div className="ot-card-header">
                <div>
                  <div className="ot-card-numero">
                    OT N° {String(ot.numeroOT).padStart(4, '0')}
                  </div>
                  <div className="ot-card-fecha">
                    {formatearFecha(ot.fechaCreacion)}
                  </div>
                </div>
                <span className="badge badge-success">✓</span>
              </div>

              <div className="ot-card-body">
                <div className="ot-info-grid">
                  <div className="ot-info-item">
                    <span className="ot-info-label">Vehículo</span>
                    <span className="ot-info-valor">
                      {ot.datosVehiculo?.marca} {ot.datosVehiculo?.modelo}
                    </span>
                  </div>
                  <div className="ot-info-item">
                    <span className="ot-info-label">Patente</span>
                    <span className="ot-info-valor">
                      {ot.datosVehiculo?.patente || 'N/A'}
                    </span>
                  </div>
                  <div className="ot-info-item">
                    <span className="ot-info-label">GPS Modelo</span>
                    <span className="ot-info-valor">
                      {ot.datosGPS?.marca} {ot.datosGPS?.modelo}
                    </span>
                  </div>
                  <div className="ot-info-item">
                    <span className="ot-info-label">IMEI</span>
                    <span className="ot-info-valor">
                      {ot.datosGPS?.imei || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ot-card-acciones">
                <button 
                  className="btn btn-primary btn-icono"
                  onClick={() => navigateTo('detalle-ot', ot.id, false)}
                >
                  👁️ Ver
                </button>
                <button 
                  className="btn btn-secondary btn-icono"
                  onClick={() => navigateTo('detalle-ot', ot.id, true)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn btn-danger btn-icono"
                  onClick={() => handleEliminar(ot.id, ot.numeroOT)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BaseDatos;