import '../styles/global.css';

function DatosVehiculo({ datos, onChange }) {
  const handleChange = (campo, valor) => {
    onChange({
      ...datos,
      [campo]: valor
    });
  };

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
    'Audi', 'BMW', 'BYD', 'Changan', 'Chery', 'Chevrolet', 'Chrysler', 
    'Citroën', 'Dodge', 'Fiat', 'Ford', 'Foton', 'Great Wall', 'Honda', 
    'Hyundai', 'Isuzu', 'JAC', 'Jeep', 'Kia', 'Mahindra', 'Mazda', 
    'Mercedes-Benz', 'MG', 'Mitsubishi', 'Nissan', 'Peugeot', 'RAM', 
    'Renault', 'Ssangyong', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 
    'Volvo', 'Otra'
  ].sort();

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
          <input
            type="number"
            className="form-input"
            placeholder="Ej: 2023"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={datos.ano || ''}
            onChange={(e) => handleChange('ano', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Color</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Blanco, Negro, Rojo"
            value={datos.color || ''}
            onChange={(e) => handleChange('color', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Patente</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: ABCD12"
            maxLength="6"
            style={{ textTransform: 'uppercase' }}
            value={datos.patente || ''}
            onChange={(e) => handleChange('patente', e.target.value.toUpperCase())}
          />
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