import { useState } from 'react';
import '../styles/encuesta.css';

function Encuesta({ datosCliente, otsCreadas, navigateTo }) {
  const [encuestaCompletada, setEncuestaCompletada] = useState(false);
  const [respuestas, setRespuestas] = useState({
    calidadTrabajo: 0,
    tiempoInstalacion: 0,
    atencionTecnico: 0,
    limpiezaTrabajo: 0,
    satisfaccionGeneral: 0,
    comentarios: ''
  });

  const preguntas = [
    { id: 'calidadTrabajo', texto: '¿Cómo califica la calidad del trabajo realizado?' },
    { id: 'tiempoInstalacion', texto: '¿El tiempo de instalación fue adecuado?' },
    { id: 'atencionTecnico', texto: '¿Cómo fue la atención del técnico?' },
    { id: 'limpiezaTrabajo', texto: '¿Se mantuvo la limpieza durante el trabajo?' },
    { id: 'satisfaccionGeneral', texto: '¿Cuál es su nivel de satisfacción general?' }
  ];

  const textosRating = [
    '',
    'Muy Insatisfecho',
    'Insatisfecho',
    'Neutral',
    'Satisfecho',
    'Muy Satisfecho'
  ];

  const handleRatingChange = (preguntaId, rating) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: rating
    });
  };

  const handleComentariosChange = (valor) => {
    setRespuestas({
      ...respuestas,
      comentarios: valor
    });
  };

  const calcularProgreso = () => {
    const preguntasRespondidas = preguntas.filter(p => respuestas[p.id] > 0).length;
    return Math.round((preguntasRespondidas / preguntas.length) * 100);
  };

  const calcularPromedioEstrellas = () => {
    const total = preguntas.reduce((sum, p) => sum + respuestas[p.id], 0);
    return (total / preguntas.length).toFixed(1);
  };

  const validarEncuesta = () => {
    const preguntasSinResponder = preguntas.filter(p => respuestas[p.id] === 0);
    if (preguntasSinResponder.length > 0) {
      alert('⚠️ Por favor responda todas las preguntas antes de enviar');
      return false;
    }
    return true;
  };

  const handleEnviar = () => {
    if (!validarEncuesta()) return;

    console.log('Encuesta completada:', {
      datosCliente,
      otsCreadas,
      respuestas
    });

    alert('📧 En un entorno real, aquí se enviaría un correo a: ' + datosCliente.correo);
    
    setEncuestaCompletada(true);
  };

  const renderEstrellas = (preguntaId, ratingActual) => {
    return (
      <div>
        <div className="estrellas-container">
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              className={`estrella ${ratingActual >= rating ? 'activa' : 'inactiva'}`}
              onClick={() => handleRatingChange(preguntaId, rating)}
            >
              ★
            </span>
          ))}
        </div>
        {ratingActual > 0 && (
          <div className="rating-texto">
            {textosRating[ratingActual]}
          </div>
        )}
      </div>
    );
  };

  if (encuestaCompletada) {
    return (
      <div className="encuesta-container">
        <div className="encuesta-completada">
          <div className="encuesta-completada-icon">🎉</div>
          <h1 className="encuesta-completada-title">¡Gracias por su tiempo!</h1>
          <p className="encuesta-completada-mensaje">
            Su opinión es muy importante para nosotros
          </p>

          <div className="encuesta-resumen">
            <div className="encuesta-resumen-item">
              <span>Cliente:</span>
              <strong>{datosCliente.nombre}</strong>
            </div>
            <div className="encuesta-resumen-item">
              <span>Correo:</span>
              <strong>{datosCliente.correo}</strong>
            </div>
            <div className="encuesta-resumen-item">
              <span>OTs Realizadas:</span>
              <strong>{otsCreadas.length}</strong>
            </div>
            <div className="encuesta-resumen-item">
              <span>Calificación Promedio:</span>
              <strong>⭐ {calcularPromedioEstrellas()} / 5.0</strong>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-full"
            onClick={() => navigateTo('index')}
          >
            ✓ Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="encuesta-container">
      <div className="encuesta-header">
        <div className="encuesta-icon">⭐</div>
        <h1 className="encuesta-title">Encuesta de Satisfacción</h1>
        <p className="encuesta-subtitle">
          Queremos conocer su opinión sobre el servicio
        </p>
      </div>

      <div className="progreso-preguntas">
        <div className="progreso-preguntas-texto">
          Progreso: {calcularProgreso()}% completado
        </div>
        <div className="progreso-preguntas-barra">
          <div 
            className="progreso-preguntas-relleno"
            style={{ width: `${calcularProgreso()}%` }}
          />
        </div>
      </div>

      <div className="encuesta-form">
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="pregunta-item">
            <div className="pregunta-texto">
              {index + 1}. {pregunta.texto}
            </div>
            {renderEstrellas(pregunta.id, respuestas[pregunta.id])}
          </div>
        ))}

        <div className="comentarios-section">
          <label className="comentarios-label">
            Comentarios Adicionales (Opcional)
          </label>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Cuéntenos sobre su experiencia o sugerencias de mejora..."
            value={respuestas.comentarios}
            onChange={(e) => handleComentariosChange(e.target.value)}
          />
        </div>
      </div>

      <div className="encuesta-acciones">
        <button 
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm('¿Está seguro de cancelar la encuesta?')) {
              navigateTo('index');
            }
          }}
        >
          ← Cancelar
        </button>
        <button 
          className="btn btn-success btn-full"
          onClick={handleEnviar}
        >
          ✓ Enviar Encuesta
        </button>
      </div>
    </div>
  );
}

export default Encuesta;