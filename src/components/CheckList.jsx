// src/components/CheckList.jsx - VERSIÓN COMPACTA CORREGIDA
import { useState, useEffect } from 'react';
import '../styles/checkList.css';

function CheckList({ datos, onChange }) {
  const [checklist, setChecklist] = useState({
    luces: { estado: '', detalle: '' },
    radio: { estado: '', detalle: '' },
    tablero: { estado: '', detalle: '' },
    checkEngine: { estado: '', detalle: '' },
    bateria: { estado: '', detalle: '' },
    plasticosEstetica: { estado: '', detalle: '' }
  });

  useEffect(() => {
    if (datos && typeof datos === 'object') {
      setChecklist(prevState => ({
        ...prevState,
        ...datos
      }));
    }
  }, [datos]);

  const items = [
    { key: 'luces', label: 'Luces', icon: '💡' },
    { key: 'radio', label: 'Radio', icon: '📻' },
    { key: 'tablero', label: 'Tablero', icon: '📊' },
    { key: 'checkEngine', label: 'Check Engine', icon: '⚠️' },
    { key: 'bateria', label: 'Batería', icon: '🔋' },
    { key: 'plasticosEstetica', label: 'Plásticos', icon: '✨' }
  ];

  const handleEstadoChange = (key, estado) => {
    const nuevoChecklist = {
      ...checklist,
      [key]: { ...checklist[key], estado }
    };
    setChecklist(nuevoChecklist);
    onChange(nuevoChecklist);
  };

  const handleDetalleChange = (key, detalle) => {
    const nuevoChecklist = {
      ...checklist,
      [key]: { ...checklist[key], detalle }
    };
    setChecklist(nuevoChecklist);
    onChange(nuevoChecklist);
  };

  return (
    <div className="checklist-container-compact">
      {items.map(({ key, label, icon }) => (
        <div key={key} className="checklist-item-compact">
          <div className="checklist-item-header">
            <span className="checklist-icon">{icon}</span>
            <span className="checklist-label">{label}</span>
          </div>
          
          <div className="checklist-estados">
            <button
              type="button"
              className={`estado-btn ${checklist[key]?.estado === 'bueno' ? 'bueno' : ''}`}
              onClick={() => handleEstadoChange(key, 'bueno')}
            >
              ✓
            </button>
            <button
              type="button"
              className={`estado-btn ${checklist[key]?.estado === 'regular' ? 'regular' : ''}`}
              onClick={() => handleEstadoChange(key, 'regular')}
            >
              ⚠
            </button>
          </div>

          {checklist[key]?.estado === 'regular' && (
            <input
              type="text"
              className="detalle-input-compact"
              placeholder="Especificar problema..."
              value={checklist[key]?.detalle || ''}
              onChange={(e) => handleDetalleChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CheckList;