import { useEffect } from 'react';
import '../styles/global.css';

function DatosVehiculo({ datos, onChange, ppuIn }) {
  const handleChange = (campo, valor) => {
    onChange({
      ...datos,
      [campo]: valor
    });
  };

  // Auto-completar patente con PPU IN cuando cambia
  useEffect(() => {
    if (ppuIn && ppuIn.trim() !== '') {
      // Actualizar patente con el valor completo de ppuIn
      onChange({
        ...datos,
        patente: ppuIn.toUpperCase()
      });
    } else if (!ppuIn || ppuIn.trim() === '') {
      // Si ppuIn está vacío, limpiar también la patente
      onChange({
        ...datos,
        patente: ''
      });
    }
  }, [ppuIn]);

  const tiposVehiculo = [
    'Auto',
    'Moto',
    'Camioneta',
    'Bus',
    'Camión',
    'Furgón',
    'Van',
    'SUV',
    'Pickup',
    'Otro'
  ];

  const marcasPopulares = [
    'Audi', 'Alfa Romeo', 'BMW', 'BYD', 'Changan', 'Chery', 'Chevrolet', 'Chrysler', 
    'Citroën', 'Cupra', 'DFSK','Dodge', 'Dongfeng', 'DS', 'Fiat', 'Ford', 'Foton', 'Freightlinner', 'Great Wall', 
    'Haval', 'Honda', 'Hyundai', 'International', 'Isuzu', 'JAC', 'Jaecco', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Mack', 'Mahindra', 
    'Maxus', 'Mazda', 'Mercedes Benz', 'MG', 'Mitsubishi', 'Nissan', 'Omoda', 'Opel', 'Peugeot', 'RAM', 
    'Renault', 'Scania', 'Seat', 'Skoda','Ssangyong', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 
    'Volvo',
  ].sort();

  // Generar años del 1990 al 2030
  const años = [];
  for (let año = 2030; año >= 1990; año--) {
    años.push(año);
  }

  // Colores ordenados alfabéticamente
  const colores = [
    'Amarillo',
    'Azul',
    'Beige',
    'Blanco',
    'Café',
    'Gris',
    'Morado',
    'Naranja',
    'Negro',
    'Plata',
    'Rojo',
    'Rosa',
    'Verde'
  ];

  const handlePatenteChange = (valor) => {
    patenteAutocompletadaRef.current = false;
    handleChange('patente', valor.toUpperCase());
  };

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Tipo de Vehículo</label>
          <select
            className="form-select"
            value={datos.tipo || ''}
            onChange={(e) => handleChange('tipo', e.target.value)}
          >
            <option value="">Seleccionar tipo</option>
            {tiposVehiculo.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label required-field">Marca</label>
          <select
            className="form-select"
            value={datos.marca || ''}
            onChange={(e) => handleChange('marca', e.target.value)}
          >
            <option value="">Seleccionar marca</option>
            {marcasPopulares.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Modelo</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Corolla, Ranger"
            value={datos.modelo || ''}
            onChange={(e) => handleChange('modelo', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Año</label>
          <select
            className="form-select"
            value={datos.ano || ''}
            onChange={(e) => handleChange('ano', e.target.value)}
          >
            <option value="">Seleccionar año</option>
            {años.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Color</label>
          <select
            className="form-select"
            value={datos.color || ''}
            onChange={(e) => handleChange('color', e.target.value)}
          >
            <option value="">Seleccionar color</option>
            {colores.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Patente</label>
          <input
            type="text"
            className="form-input"
            placeholder="Auto-completado desde PPU IN"
            maxLength="6"
            style={{ textTransform: 'uppercase' }}
            value={datos.patente || ''}
            onChange={(e) => handlePatenteChange(e.target.value)}
          />
          {ppuIn && ppuIn.trim() !== '' && (
            <small style={{ color: '#438de5', fontSize: '0.55em', marginTop: '2px', display: 'block' }}>
              ✓ Copiado desde PPU IN: {ppuIn}
            </small>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Kilometraje</label>
        <input
          type="number"
          className="form-input"
          placeholder="Ej: 45000"
          min="0"
          value={datos.kilometraje || ''}
          onChange={(e) => handleChange('kilometraje', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Observaciones</label>
        <textarea
          className="form-textarea"
          rows="4"
          placeholder="Detalles importantes del vehículo..."
          value={datos.observaciones || ''}
          onChange={(e) => handleChange('observaciones', e.target.value)}
        />
      </div>
    </div>
  );
}

export default DatosVehiculo;