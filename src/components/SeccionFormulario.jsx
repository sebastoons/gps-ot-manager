// src/components/SeccionFormulario.jsx
function SeccionFormulario({ 
  id,
  icono, 
  titulo, 
  estaAbierta, 
  onToggle, 
  children 
}) {
  return (
    <div className="form-section">
      <div 
        className="form-section-header"
        onClick={() => onToggle(id)}
      >
        <div className="form-section-header-content">
          <span className="form-section-icon">{icono}</span>
          <h2 className="form-section-title">{titulo}</h2>
        </div>
        <span className={`form-section-toggle ${!estaAbierta ? 'collapsed' : ''}`}>
          ▼
        </span>
      </div>
      <div className={`form-section-body ${!estaAbierta ? 'collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default SeccionFormulario;