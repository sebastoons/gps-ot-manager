import { useRef, useState, useEffect } from 'react';

function FirmaDigital({ onFirmaChange }) {
  const canvasRef = useRef(null);
  const [estaDibujando, setEstaDibujando] = useState(false);
  const [firmaVacia, setFirmaVacia] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const obtenerPosicion = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const iniciarDibujo = (e) => {
    e.preventDefault();
    setEstaDibujando(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = obtenerPosicion(e);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const dibujar = (e) => {
    if (!estaDibujando) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = obtenerPosicion(e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setFirmaVacia(false);
  };

  const finalizarDibujo = (e) => {
    if (!estaDibujando) return;
    e.preventDefault();
    
    setEstaDibujando(false);
    const canvas = canvasRef.current;
    const firmaDataURL = canvas.toDataURL('image/png');
    onFirmaChange(firmaDataURL);
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFirmaVacia(true);
    onFirmaChange(null);
  };

  return (
    <div>
      <div className="firma-canvas-container">
        <canvas
          ref={canvasRef}
          className="firma-canvas"
          onMouseDown={iniciarDibujo}
          onMouseMove={dibujar}
          onMouseUp={finalizarDibujo}
          onMouseLeave={finalizarDibujo}
          onTouchStart={iniciarDibujo}
          onTouchMove={dibujar}
          onTouchEnd={finalizarDibujo}
        />
        {firmaVacia && (
          <div className="firma-placeholder">
           Firme aquí con su dedo o lápiz
          </div>
        )}
      </div>
      
      <div className="firma-actions">
        <button 
          type="button"
          className="btn btn-limpiar-firma"
          onClick={limpiarFirma}
        >
          Limpiar Firma
        </button>
      </div>
    </div>
  );
}

export default FirmaDigital;