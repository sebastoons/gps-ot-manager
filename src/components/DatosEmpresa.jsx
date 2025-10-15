import { useState, useEffect } from 'react';
import '../styles/global.css';

function DatosEmpresa({ datos, onChange }) {
  const regionesDatos = {
    "Región Metropolitana": {
      ciudades: ["Santiago", "San Bernardo", "Puente Alto", "Maipú"],
      comunas: ["Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago Centro", "Talagante", "Til Til", "Vitacura"]
    },
    "Región de Valparaíso": {
      ciudades: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota", "La Calera", "San Felipe", "Los Andes"],
      comunas: ["Algarrobo", "Calle Larga", "Cartagena", "Casablanca", "Concón", "El Quisco", "El Tabo", "Hijuelas", "La Calera", "La Cruz", "Los Andes", "Nogales", "Puchuncaví", "Quilpué", "Quillota", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar"]
    },
    "Región de O'Higgins": {
      ciudades: ["Rancagua", "San Fernando", "Rengo"],
      comunas: ["Chépica", "Chimbarongo", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Lolol", "Machalí", "Malloa", "Nancagua", "Olivar", "Palmilla", "Peralillo", "Peumo", "Pichidegua", "Placilla", "Quinta de Tilcoco", "Rancagua", "Rengo", "Requínoa", "San Fernando", "San Vicente", "Santa Cruz"]
    },
    "Región del Maule": {
      ciudades: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Parral", "Molina"],
      comunas: ["Cauquenes", "Chanco", "Colbún", "Constitución", "Curepto", "Curicó", "Empedrado", "Hualañé", "Licantén", "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro", "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Talca", "Teno", "Vichuquén", "Villa Alegre", "Yerbas Buenas"]
    },
    "Región de Ñuble": {
      ciudades: ["Chillán", "San Carlos", "Bulnes"],
      comunas: ["Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"]
    },
    "Región del Biobío": {
      ciudades: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante", "Coronel", "Lebu"],
      comunas: ["Alto Biobío", "Antuco", "Arauco", "Cabrero", "Cañete", "Chiguayante", "Concepción", "Contulmo", "Coronel", "Curanilahue", "Florida", "Hualpén", "Hualqui", "Laja", "Lebu", "Los Álamos", "Los Ángeles", "Lota", "Mulchén", "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", "Santa Bárbara", "Santa Juana", "Talcahuano", "Tirúa", "Tomé", "Tucapel", "Yumbel"]
    },
    "Región de La Araucanía": {
      ciudades: ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
      comunas: ["Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Purén", "Renaico", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica"]
    },
    "Región de Los Ríos": {
      ciudades: ["Valdivia", "La Unión"],
      comunas: ["Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno", "Valdivia"]
    },
    "Región de Los Lagos": {
      ciudades: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"],
      comunas: ["Ancud", "Calbuco", "Castro", "Chaitén", "Chonchi", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia", "Frutillar", "Futaleufú", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Osorno", "Palena", "Puerto Montt", "Puerto Octay", "Puerto Varas", "Puqueldón", "Purranque", "Puyehue", "Queil", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"]
    },
    "Región de Aysén": {
      ciudades: ["Coyhaique", "Puerto Aysén"],
      comunas: ["Aysén", "Chile Chico", "Cisnes", "Cochrane", "Coyhaique", "Guaitecas", "Lago Verde", "O'Higgins", "Río Ibáñez", "Tortel"]
    },
    "Región de Magallanes": {
      ciudades: ["Punta Arenas", "Puerto Natales", "Porvenir"],
      comunas: ["Antártica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", "Primavera", "Punta Arenas", "Río Verde", "San Gregorio", "Timaukel", "Torres del Paine"]
    },
    "Región de Arica y Parinacota": {
      ciudades: ["Arica"],
      comunas: ["Arica", "Camarones", "General Lagos", "Putre"]
    },
    "Región de Tarapacá": {
      ciudades: ["Iquique", "Alto Hospicio"],
      comunas: ["Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"]
    },
    "Región de Antofagasta": {
      ciudades: ["Antofagasta", "Calama", "Tocopilla"],
      comunas: ["Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"]
    },
    "Región de Atacama": {
      ciudades: ["Copiapó", "Vallenar", "Caldera"],
      comunas: ["Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"]
    },
    "Región de Coquimbo": {
      ciudades: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
      comunas: ["Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paiguano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"]
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
        </div>
      </div>
    </div>
  );
}

export default DatosEmpresa;