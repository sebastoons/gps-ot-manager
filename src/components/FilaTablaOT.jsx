// src/components/FilaTablaOT.jsx
function FilaTablaOT({ 
  ot, 
  onPrevisualizar, 
  onDescargar, 
  onVer, 
  onEditar, 
  onEliminar,
  getNombreEmpresa,
  formatearFecha 
}) {
  return (
    <tr>
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
            className="btn-icono btn-ver"
            onClick={() => onVer(ot.id)}
            title="Ver Detalles"
          >
            📄
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