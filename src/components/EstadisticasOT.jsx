// src/components/EstadisticasOT.jsx
function EstadisticasOT({ estadisticas }) {
  return (
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
  );
}

export default EstadisticasOT;