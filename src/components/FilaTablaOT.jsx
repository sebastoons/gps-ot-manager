// src/components/FilaTablaOT.jsx - CON PREVISUALIZAR, SIN VER DETALLES
function FilaTablaOT({ 
  ot, 
  onPrevisualizar,
  onDescargar, 
  onEditar, 
  onEliminar,
  getNombreEmpresa,
  formatearFecha 
}) {
  return (
    <tr>
      <td className="ot-numero-cell">
        {ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`}
      </td>
      <td>
        <span className="empresa-badge">
          {getNombreEmpresa(ot.prefijo)}
        </span>
      </td>
      <td className="fecha-cell">{formatearFecha(ot.fechaCreacion)}</td>
      <td>{ot.datosEmpresa?.nombreEmpresa || 'N/A'}</td>
      <td className="ppu-cell">
        {ot.datosVehiculo?.patente || 'Sin PPU'}
      </td>
      <td>
        <span className="servicio-badge">
          {ot.datosGPS?.tipoServicio || 'N/A'}
        </span>
      </td>
      <td>
        <div className="acciones-cell">
          <button 
            className="btn-icono btn-preview"
            onClick={() => onPrevisualizar(ot)}
            title="Previsualizar PDF"
          >
            👁️
          </button>
          <button 
            className="btn-icono btn-descargar"
            onClick={() => onDescargar(ot)}
            title="Descargar PDF"
          >
            📥
          </button>
          <button 
            className="btn-icono btn-editar"
            onClick={() => onEditar(ot.id)}
            title="Editar"
          >
            ✏️
          </button>
          <button 
            className="btn-icono btn-eliminar"
            onClick={() => onEliminar(ot.id, ot.numeroOT)}
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaTablaOT;