// src/components/FirmaDigital.jsx - AJUSTADO PARA NO SALIR DEL RECUADRO
import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../styles/firmaDigital.css';

function FirmaDigital({ onFirmaChange, firmaInicial }) {
  const sigCanvas = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (firmaInicial && sigCanvas.current) {
      sigCanvas.current.fromDataURL(firmaInicial);
      setIsEmpty(false);
    }
  }, [firmaInicial]);

  const limpiarFirma = () => {
    sigCanvas.current.clear();
    setIsEmpty(true);
    onFirmaChange(null);
  };

  const handleEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.toDataURL('image/png');
      setIsEmpty(false);
      onFirmaChange(dataURL);
    }
  };

  return (
    <div className="firma-digital-wrapper">
      <div className="firma-canvas-container">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'firma-canvas'
          }}
          backgroundColor="rgba(255, 255, 255, 1)"
          penColor="#000000"
          minWidth={1}
          maxWidth={2.5}
          onEnd={handleEnd}
        />
        {isEmpty && (
          <div className="firma-placeholder">
            ✍️ Firme aquí
          </div>
        )}
      </div>
      
      <button 
        type="button"
        className="btn-limpiar-firma" 
        onClick={limpiarFirma}
      >
        🗑️ Limpiar
      </button>
    </div>
  );
}

export default FirmaDigital;