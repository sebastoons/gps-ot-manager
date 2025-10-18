// src/components/HeaderCrearOT.jsx
function HeaderCrearOT({ codigoOT, onVolver }) {
  return (
    <div className="crear-ot-header">
      <div className="crear-ot-header-top">
        <h1 className="crear-ot-title">Crear Orden de Trabajo</h1>
        <button 
          className="btn btn-volver"
          onClick={onVolver}
        >
          ← Volver
        </button>
      </div>
      <div className="ot-numero" style={{ color: '#f69a00' }}>
        <span>Orden de Trabajo N°</span>
        <span className="ot-numero-badge">{codigoOT}</span>
      </div>
    </div>
  );
}

export default HeaderCrearOT;