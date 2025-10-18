// src/components/FiltrosBaseDatos.jsx
function FiltrosBaseDatos({ 
  busqueda, 
  setBusqueda, 
  empresaFiltro, 
  setEmpresaFiltro, 
  empresasDisponibles 
}) {
  return (
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
  );
}

export default FiltrosBaseDatos;