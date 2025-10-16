import emailjs from '@emailjs/browser';

// Configuración de EmailJS
// Necesitas registrarte en https://www.emailjs.com/ y obtener estos valores
const EMAILJS_CONFIG = {
  serviceId: 'service_59ppuoq', // Obtener de EmailJS
  templateId: 'template_301vyvy', // Obtener de EmailJS
  publicKey: 'TS0WAsv9dJw4iBXKo' // Obtener de EmailJS
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

/**
 * Genera el HTML de las OTs para el correo
 */
const generarHTMLOTs = (otsCreadas) => {
  return otsCreadas.map(ot => `
    <div style="border: 2px solid #667eea; border-radius: 8px; padding: 15px; margin-bottom: 15px; background-color: #f8f9ff;">
      <h3 style="color: #667eea; margin: 0 0 10px 0;">${ot.codigoOT}</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px; font-weight: bold;">Empresa:</td>
          <td style="padding: 5px;">${ot.datosEmpresa?.nombreEmpresa || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Contacto:</td>
          <td style="padding: 5px;">${ot.datosEmpresa?.nombreContacto || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Fecha:</td>
          <td style="padding: 5px;">${ot.datosEmpresa?.fecha || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Vehículo:</td>
          <td style="padding: 5px;">${ot.datosVehiculo?.marca} ${ot.datosVehiculo?.modelo} ${ot.datosVehiculo?.ano}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Patente:</td>
          <td style="padding: 5px;">${ot.datosVehiculo?.patente || 'Sin Patente'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Color:</td>
          <td style="padding: 5px;">${ot.datosVehiculo?.color || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Tipo:</td>
          <td style="padding: 5px;">${ot.datosVehiculo?.tipo || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Técnico:</td>
          <td style="padding: 5px;">${ot.datosGPS?.nombreTecnico || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">Servicio:</td>
          <td style="padding: 5px;">${ot.datosGPS?.tipoServicio || 'N/A'}</td>
        </tr>
        ${ot.datosGPS?.imeiIn ? `
        <tr>
          <td style="padding: 5px; font-weight: bold;">IMEI IN:</td>
          <td style="padding: 5px;">${ot.datosGPS.imeiIn}</td>
        </tr>
        ` : ''}
        ${ot.datosGPS?.imeiOut ? `
        <tr>
          <td style="padding: 5px; font-weight: bold;">IMEI OUT:</td>
          <td style="padding: 5px;">${ot.datosGPS.imeiOut}</td>
        </tr>
        ` : ''}
      </table>
      ${ot.datosGPS?.accesoriosInstalados && ot.datosGPS.accesoriosInstalados.length > 0 ? `
        <div style="margin-top: 10px;">
          <strong>Accesorios:</strong> ${ot.datosGPS.accesoriosInstalados.join(', ')}
        </div>
      ` : ''}
    </div>
  `).join('');
};

/**
 * Genera resumen de checklist
 */
const generarResumenChecklist = (checklist) => {
  if (!checklist || Object.keys(checklist).length === 0) {
    return '<p>No se realizó checklist</p>';
  }

  const items = {
    luces: 'Luces 💡',
    radio: 'Radio 📻',
    tablero: 'Tablero 🎛️',
    checkEngine: 'Check Engine ⚠️',
    bateria: 'Batería 🔋'
  };

  return Object.entries(checklist)
    .filter(([key, value]) => value.estado)
    .map(([key, value]) => {
      const color = value.estado === 'bueno' ? '#10b981' : '#f59e0b';
      const icono = value.estado === 'bueno' ? '✓' : '⚠';
      return `
        <div style="padding: 8px; margin: 5px 0; background-color: ${value.estado === 'bueno' ? '#f0fdf4' : '#fffbeb'}; border-left: 3px solid ${color}; border-radius: 4px;">
          <strong>${icono} ${items[key]}</strong>
          ${value.detalle ? `<br><em style="color: #666;">${value.detalle}</em>` : ''}
        </div>
      `;
    }).join('');
};

/**
 * Envía el correo con las OTs al cliente
 */
export const enviarOTsPorCorreo = async (datosCliente, otsCreadas) => {
  try {
    // Validar datos
    if (!datosCliente.correo || !datosCliente.nombre) {
      throw new Error('Faltan datos del cliente');
    }

    if (!otsCreadas || otsCreadas.length === 0) {
      throw new Error('No hay OTs para enviar');
    }

    // Preparar datos para el template
    const templateParams = {
      to_email: datosCliente.correo,
      to_name: datosCliente.nombre,
      cliente_rut: datosCliente.rut,
      cantidad_ots: otsCreadas.length,
      ots_html: generarHTMLOTs(otsCreadas),
      fecha_envio: new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      firma_imagen: datosCliente.firma || '',
      // Incluir checklist de la primera OT como ejemplo
      checklist_html: otsCreadas[0]?.checklist ? generarResumenChecklist(otsCreadas[0].checklist) : ''
    };

    // Enviar correo usando EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('Correo enviado exitosamente:', response);
    return {
      success: true,
      message: 'Correo enviado exitosamente',
      response
    };

  } catch (error) {
    console.error('Error al enviar correo:', error);
    return {
      success: false,
      message: error.message || 'Error al enviar el correo',
      error
    };
  }
};

/**
 * Envía correo de prueba
 */
export const enviarCorreoPrueba = async (emailDestino) => {
  try {
    const templateParams = {
      to_email: emailDestino,
      to_name: 'Cliente de Prueba',
      message: 'Este es un correo de prueba del sistema GPS OT Manager'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      'template_prueba', // Necesitas crear este template en EmailJS
      templateParams
    );

    return {
      success: true,
      response
    };
  } catch (error) {
    console.error('Error en correo de prueba:', error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Genera PDF de las OTs (requiere librería adicional)
 * Esta es una función placeholder - necesitarías jsPDF o similar
 */
export const generarPDFOTs = (otsCreadas, datosCliente) => {
  console.log('Generación de PDF no implementada aún');
  // Aquí iría la lógica para generar PDF con jsPDF
  return null;
};