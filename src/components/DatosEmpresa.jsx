import { useState, useEffect } from 'react';
import '../styles/global.css';

function DatosEmpresa({ datos, onChange }) {
  const regionesDatos = {
    "Región Metropolitana": {
      ciudades: ["Santiago", "San Bernardo", "Puente Alto", "Maipú"],
      comunas: ["Santiago Centro", "Providencia", "Las Condes", "Vitacura", "Lo Barnechea", "Ñuñoa", "La Reina", "Peñalolén", "Macul", "La Florida", "San Joaquín", "San Miguel", "La Cisterna", "El Bosque", "La Granja", "San Ramón", "La Pintana", "Pedro Aguirre Cerda", "Lo Espejo", "Estación Central", "Cerrillos", "Maipú", "Cerro Navia", "Lo Prado", "Pudahuel", "Renca", "Quilicura", "Huechuraba", "Recoleta", "Conchalí", "Independencia", "San Bernardo", "Buin", "Paine", "Calera de Tango", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Til Til", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
    },
    "Región de Valparaíso": {
      ciudades: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota", "La Calera", "San Felipe", "Los Andes"],
      comunas: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Casablanca", "Quintero", "Puchuncaví", "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo", "Santo Domingo", "Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales", "San Felipe", "Los Andes", "Calle Larga", "Rinconada", "San Esteban"]
    },
    "Región de O'Higgins": {
      ciudades: ["Rancagua", "San Fernando", "Rengo"],
      comunas: ["Rancagua", "Machalí", "Graneros", "San Fernando", "Rengo", "Requínoa", "Olivar", "Doñihue", "Coltauco", "Coinco", "Malloa", "Quinta de Tilcoco", "San Vicente", "Pichidegua", "Peumo", "Las Cabras", "Chimbarongo", "Nancagua", "Placilla", "Santa Cruz", "Lolol", "Chépica", "Palmilla", "Peralillo"]
    },
    "Región del Maule": {
      ciudades: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Parral", "Molina"],
      comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Parral", "Molina", "San Javier", "Villa Alegre", "Yerbas Buenas", "San Clemente", "Pelarco", "Río Claro", "Pencahue", "Maule", "Empedrado", "Curepto", "Hualañé", "Licantén", "Vichuquén", "Teno", "Rauco", "Romeral", "Sagrada Familia"]
    },
    "Región de Ñuble": {
      ciudades: ["Chillán", "San Carlos", "Bulnes"],
      comunas: ["Chillán", "Chillán Viejo", "Bulnes", "San Carlos", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Treguaco", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Fabián", "San Ignacio", "San Nicolás", "Yungay", "Coihueco"]
    },
    "Región del Biobío": {
      ciudades: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante", "Coronel", "Lebu"],
      comunas: ["Concepción", "Talcahuano", "Hualpén", "Chiguayante", "San Pedro de la Paz", "Penco", "Tomé", "Coronel", "Lota", "Santa Juana", "Hualqui", "Los Ángeles", "Cabrero", "Yumbel", "Tucapel", "Antuco", "Quilleco", "Santa Bárbara", "Quilaco", "Mulchén", "Negrete", "Nacimiento", "Laja", "San Rosendo", "Lebu", "Arauco", "Curanilahue", "Los Álamos", "Cañete", "Contulmo", "Tirúa"]
    },
    "Región de La Araucanía": {
      ciudades: ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
      comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Loncoche", "Pitrufquén", "Gorbea", "Lautaro", "Perquenco", "Galvarino", "Victoria", "Traiguén", "Curacautín", "Lonquimay", "Angol", "Renaico", "Collipulli", "Los Sauces", "Purén", "Ercilla"]
    },
    "Región de Los Ríos": {
      ciudades: ["Valdivia", "La Unión"],
      comunas: ["Valdivia", "Mariquina", "Lanco", "Los Lagos", "Futrono", "La Unión", "Corral", "Máfil", "Panguipulli", "Río Bueno", "Lago Ranco", "Paillaco"]
    },
    "Región de Los Lagos": {
      ciudades: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"],
      comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón", "Chonchi", "Dalcahue", "Calbuco", "Maullín", "Los Muermos", "Fresia", "Frutillar", "Llanquihue", "Puerto Octay", "Purranque", "Río Negro", "San Pablo", "San Juan de la Costa"]
    },
    "Región de Aysén": {
      ciudades: ["Coyhaique", "Puerto Aysén"],
      comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane", "Puerto Cisnes", "Puerto Ibáñez", "Río Ibáñez", "Tortel", "Villa O'Higgins", "Guaitecas", "Lago Verde"]
    },
    "Región de Magallanes": {
      ciudades: ["Punta Arenas", "Puerto Natales", "Porvenir"],
      comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Puerto Williams", "Cabo de Hornos", "Primavera", "Timaukel", "San Gregorio", "Laguna Blanca", "Río Verde", "Torres del Paine"]
    },
    "Región de Arica y Parinacota": {
      ciudades: ["Arica"],
      comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    "Región de Tarapacá": {
      ciudades: ["Iquique", "Alto Hospicio"],
      comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara", "Camiña", "Colchane"]
    },
    "Región de Antofagasta": {
      ciudades: ["Antofagasta", "Calama", "Tocopilla"],
      comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    "Región de Atacama": {
      ciudades: ["Copiapó", "Vallenar", "Caldera"],
      comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Freirina", "Huasco", "Alto del Carmen"]
    },
    "Región de Coquimbo": {
      ciudades: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
      comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado", "Illapel", "Canela", "Los Vilos", "Salamanca"]
    }
  };

  const [ciudades, setCiudades] = useState([]);
  const [comunas, setComunas] = useState([]);

  useEffect(() => {
    if (datos.region) {
      const regionData = regionesDatos[datos.region];
      if (regionData) {
        setCiudades(regionData.ciudades);
        setComunas(regionData.comunas);
      }
    }
  }, [datos.region]);

  const handleChange = (campo, valor) => {
    if (campo === 'region') {
      onChange({
        ...datos,
        [campo]: valor,
        ciudad: '',
        comuna: ''
      });
    } else {
      onChange({
        ...datos,
        [campo]: valor
      });
    }
  };

  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Nombre de la Empresa</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: GPS Tracking Solutions"
            value={datos.nombreEmpresa || ''}
            onChange={(e) => handleChange('nombreEmpresa', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label required-field">Fecha</label>
          <input
            type="date"
            className="form-input"
            value={datos.fecha || obtenerFechaActual()}
            onChange={(e) => handleChange('fecha', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required-field">Nombre del Contacto</label>
        <input
          type="text"
          className="form-input"
          placeholder="Nombre completo del contacto"
          value={datos.nombreContacto || ''}
          onChange={(e) => handleChange('nombreContacto', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label required-field">Región</label>
        <select
          className="form-select"
          value={datos.region || ''}
          onChange={(e) => handleChange('region', e.target.value)}
        >
          <option value="">Seleccionar región</option>
          {Object.keys(regionesDatos).map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label required-field">Ciudad</label>
          <select
            className="form-select"
            value={datos.ciudad || ''}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            disabled={!datos.region}
          >
            <option value="">Seleccionar ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
          {!datos.region && (
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Primero selecciona una región
            </small>
          )}
        </div>

        <div className="form-group">
          <label className="form-label required-field">Comuna</label>
          <select
            className="form-select"
            value={datos.comuna || ''}
            onChange={(e) => handleChange('comuna', e.target.value)}
            disabled={!datos.region}
          >
            <option value="">Seleccionar comuna</option>
            {comunas.map(comuna => (
              <option key={comuna} value={comuna}>{comuna}</option>
            ))}
          </select>
          {!datos.region && (
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Primero selecciona una región
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default DatosEmpresa;