import { useState } from 'react';
import '../styles/checkList.css';

function CheckList({ datos, onChange }) {
  const itemsChecklist = [
    { id: 'luces', label: 'Luces', icon: '💡' },
    { id: 'radio', label: 'Radio', icon: '📻' },
    { id: 'tablero', label: 'Tablero', icon: '🎛️' },
    { id: 'checkEngine', label: 'Check Engine', icon: '⚠️' },
    { id: 'bateria', label: 'Batería', icon: '🔋' }
  ];

  const handleEstadoChange = (itemId, estado) => {
    onChange({
      ...datos,
      [itemId]: {
        estado: estado,
        detalle: datos[itemId]?.detalle || ''
      }
    });
  };

  const handleDetalleChange = (itemId, detalle) => {
    onChange({
      ...datos,
      [itemId]: {
        estado: datos[itemId]?.estado || '',
        detalle: detalle
      }
    });
  };

  const calcularResumen = () => {
    const total = itemsChecklist.length;
    const buenos = itemsChecklist.filter(item => datos[item.id]?.estado === 'bueno').length;
    const conDetalles = itemsChecklist.filter(item => datos[item.id]?.estado === 'detalle').length;
    return { total, buenos, conDetalles };
  };

  const resumen = calcularResumen();

  return (
    <div className="checklist-container">
      {itemsChecklist.map((item) => {
        const estadoActual = datos[item.id]?.estado || '';
        
        return (
          <div 
            key={item.id} 
            className={`checklist-item-nuevo ${estadoActual}`}
          >
            <div className="checklist-item-header-nuevo">
              <span className="checklist-icon">{item.icon}</span>
              <span className="checklist-label-nuevo">{item.label}</span>
            </div>

            <div className="checklist-estados">
              <button
                type="button"
                className={`estado-btn estado-bueno ${estadoActual === 'bueno' ? 'active' : ''}`}
                onClick={() => handleEstadoChange(item.id, 'bueno')}
              >
                ✓
              </button>
              <button
                type="button"
                className={`estado-btn estado-detalle ${estadoActual === 'detalle' ? 'active' : ''}`}
                onClick={() => handleEstadoChange(item.id, 'detalle')}
              >
                ⚠
              </button>
            </div>

            {estadoActual === 'detalle' && (
              <div className="checklist-detalle-input">
                <label className="form-label">Detalle del problema</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Describe el problema o detalle encontrado..."
                  value={datos[item.id]?.detalle || ''}
                  onChange={(e) => handleDetalleChange(item.id, e.target.value)}
                />
              </div>
            )}
          </div>
        );
      })}

      <div className="checklist-resumen">
        <div className="checklist-resumen-texto">
          Resumen del CheckList
        </div>
        <div className="checklist-resumen-numeros">
          <div className="checklist-resumen-item">
            <span className="checklist-resumen-numero" style={{ color: '#10b981' }}>{resumen.buenos}</span>
            <span className="checklist-resumen-label">En Buen Estado</span>
          </div>
          <div className="checklist-resumen-item">
            <span className="checklist-resumen-numero" style={{ color: '#f59e0b' }}>{resumen.conDetalles}</span>
            <span className="checklist-resumen-label">Con Detalles</span>
          </div>
          <div className="checklist-resumen-item">
            <span className="checklist-resumen-numero">{resumen.total}</span>
            <span className="checklist-resumen-label">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckList;