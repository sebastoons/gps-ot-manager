// src/components/ModalConfirmacionOT.jsx
function ModalConfirmacionOT({ 
  mostrar, 
  ultimaOTCreada, 
  onCrearOtra, 
  onFinalizar 
}) {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-icon">✅</div>
          <h2 className="modal-title">¡OT Guardada Exitosamente!</h2>
          <p className="modal-description">
            La Orden de Trabajo {ultimaOTCreada?.codigoOT} ha sido registrada correctamente.
          </p>
        </div>
        <div className="modal-actions">
          <button 
            className="btn btn-primary btn-full"
            onClick={onCrearOtra}
          >
            Crear Otra OT
          </button>
          <button 
            className="btn btn-secondary btn-full"
            onClick={onFinalizar}
          >
            Finalizar y Obtener Firma
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacionOT;