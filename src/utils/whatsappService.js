/**
 * Servicio para enviar OTs por WhatsApp
 * Usa WhatsApp Web API (sin necesidad de backend)
 */

/**
 * Formatea el número de teléfono chileno para WhatsApp
 * Acepta formatos: +56912345678, 56912345678, 912345678, 12345678
 */
export const formatearTelefonoChileno = (telefono) => {
  // Limpiar el número
  let numero = telefono.replace(/\D/g, '');
  
  // Si empieza con 569, está correcto
  if (numero.startsWith('569')) {
    return numero;
  }
  
  // Si empieza con 56, agregar 9
  if (numero.startsWith('56')) {
    return '569' + numero.slice(2);
  }
  
  // Si empieza con 9 (celular)
  if (numero.startsWith('9') && numero.length === 9) {
    return '56' + numero;
  }
  
  // Si es solo el número sin código de país
  if (numero.length === 8) {
    return '569' + numero;
  }
  
  return '569' + numero;
};

/**
 * Valida que el número sea un celular chileno válido
 */
export const validarTelefonoChileno = (telefono) => {
  const numeroLimpio = telefono.replace(/\D/g, '');
  
  // Debe tener entre 8 y 12 dígitos
  if (numeroLimpio.length < 8 || numeroLimpio.length > 12) {
    return false;
  }
  
  // Si tiene código de país, debe empezar con 56
  if (numeroLimpio.length > 9 && !numeroLimpio.startsWith('56')) {
    return false;
  }
  
  return true;
};

/**
 * Genera el mensaje de WhatsApp con las OTs
 */
const generarMensajeWhatsApp = (datosCliente, otsCreadas) => {
  let mensaje = `*📱 GPS OT MANAGER - ÓRDENES DE TRABAJO*\n\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Datos del cliente
  mensaje += `👤 *CLIENTE*\n`;
  mensaje += `Nombre: ${datosCliente.nombre}\n`;
  mensaje += `RUT: ${datosCliente.rut}\n`;
  mensaje += `Fecha: ${new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n\n`;
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Resumen de OTs
  mensaje += `📝 *RESUMEN*\n`;
  mensaje += `Total de OTs: ${otsCreadas.length}\n\n`;
  
  // Detalle de cada OT
  otsCreadas.forEach((ot, index) => {
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `*OT #${index + 1}: ${ot.codigoOT}*\n\n`;
    
    // Empresa
    mensaje += `🏢 *EMPRESA*\n`;
    mensaje += `${ot.datosEmpresa?.nombreEmpresa || 'N/A'}\n`;
    mensaje += `Contacto: ${ot.datosEmpresa?.nombreContacto || 'N/A'}\n`;
    mensaje += `Ubicación: ${ot.datosEmpresa?.comuna || 'N/A'}, ${ot.datosEmpresa?.region || 'N/A'}\n\n`;
    
    // Vehículo
    mensaje += `🚗 *VEHÍCULO*\n`;
    mensaje += `Tipo: ${ot.datosVehiculo?.tipo || 'N/A'}\n`;
    mensaje += `Marca: ${ot.datosVehiculo?.marca || 'N/A'}\n`;
    mensaje += `Modelo: ${ot.datosVehiculo?.modelo || 'N/A'}\n`;
    mensaje += `Año: ${ot.datosVehiculo?.ano || 'N/A'}\n`;
    mensaje += `Color: ${ot.datosVehiculo?.color || 'N/A'}\n`;
    mensaje += `Patente: ${ot.datosVehiculo?.patente || 'Sin Patente'}\n\n`;
    
    // Servicio GPS
    mensaje += `📡 *SERVICIO GPS*\n`;
    mensaje += `Técnico: ${ot.datosGPS?.nombreTecnico || 'N/A'}\n`;
    mensaje += `Tipo: ${ot.datosGPS?.tipoServicio || 'N/A'}\n`;
    
    if (ot.datosGPS?.imeiIn) {
      mensaje += `IMEI IN: ${ot.datosGPS.imeiIn}\n`;
    }
    if (ot.datosGPS?.imeiOut) {
      mensaje += `IMEI OUT: ${ot.datosGPS.imeiOut}\n`;
    }
    if (ot.datosGPS?.ppuIn) {
      mensaje += `PPU IN: ${ot.datosGPS.ppuIn}\n`;
    }
    if (ot.datosGPS?.ppuOut) {
      mensaje += `PPU OUT: ${ot.datosGPS.ppuOut}\n`;
    }
    
    // Accesorios
    if (ot.datosGPS?.accesoriosInstalados && ot.datosGPS.accesoriosInstalados.length > 0) {
      mensaje += `\n🔧 *ACCESORIOS*\n`;
      ot.datosGPS.accesoriosInstalados.forEach(accesorio => {
        mensaje += `• ${accesorio}\n`;
      });
    }
    
    // CheckList
    if (ot.checklist && Object.keys(ot.checklist).length > 0) {
      mensaje += `\n✅ *CHECKLIST*\n`;
      const items = {
        luces: 'Luces 💡',
        radio: 'Radio 📻',
        tablero: 'Tablero 🎛️',
        checkEngine: 'Check Engine ⚠️',
        bateria: 'Batería 🔋'
      };
      
      Object.entries(ot.checklist).forEach(([key, value]) => {
        if (value.estado) {
          const icono = value.estado === 'bueno' ? '✅' : '⚠️';
          mensaje += `${icono} ${items[key]}: ${value.estado === 'bueno' ? 'OK' : 'Ver detalle'}\n`;
          if (value.detalle) {
            mensaje += `   └ ${value.detalle}\n`;
          }
        }
      });
    }
    
    mensaje += `\n`;
  });
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  mensaje += `✅ *Trabajo finalizado y firmado por el cliente*\n\n`;
  mensaje += `Gracias por confiar en GPS OT Manager\n`;
  mensaje += `Sistema de gestión de instalaciones GPS`;
  
  return mensaje;
};

/**
 * Abre WhatsApp Web con el mensaje pre-cargado
 */
export const enviarPorWhatsApp = (telefono, datosCliente, otsCreadas) => {
  try {
    // Validar teléfono
    if (!validarTelefonoChileno(telefono)) {
      throw new Error('Número de teléfono inválido');
    }
    
    // Formatear teléfono
    const numeroFormateado = formatearTelefonoChileno(telefono);
    
    // Generar mensaje
    const mensaje = generarMensajeWhatsApp(datosCliente, otsCreadas);
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Generar URL de WhatsApp
    // Para WhatsApp Web (escritorio)
    const urlWeb = `https://web.whatsapp.com/send?phone=${numeroFormateado}&text=${mensajeCodificado}`;
    
    // Para WhatsApp App (móvil)
    const urlApp = `https://wa.me/${numeroFormateado}?text=${mensajeCodificado}`;
    
    // Detectar si es móvil
    const esMobil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Abrir la URL apropiada
    const url = esMobil ? urlApp : urlWeb;
    window.open(url, '_blank');
    
    return {
      success: true,
      message: 'WhatsApp abierto correctamente',
      url
    };
    
  } catch (error) {
    console.error('Error al enviar por WhatsApp:', error);
    return {
      success: false,
      message: error.message || 'Error al abrir WhatsApp',
      error
    };
  }
};

/**
 * Genera un mensaje corto para WhatsApp (versión resumida)
 */
export const enviarResumenPorWhatsApp = (telefono, datosCliente, otsCreadas) => {
  try {
    const numeroFormateado = formatearTelefonoChileno(telefono);
    
    let mensaje = `*GPS OT MANAGER*\n\n`;
    mensaje += `Hola ${datosCliente.nombre} 👋\n\n`;
    mensaje += `Se completaron *${otsCreadas.length} OT(s)*:\n\n`;
    
    otsCreadas.forEach(ot => {
      mensaje += `✅ ${ot.codigoOT}\n`;
      mensaje += `   ${ot.datosVehiculo?.marca} ${ot.datosVehiculo?.modelo}\n`;
      mensaje += `   Patente: ${ot.datosVehiculo?.patente || 'S/P'}\n\n`;
    });
    
    mensaje += `Gracias por tu confianza! 🚗📡`;
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const esMobil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = esMobil 
      ? `https://wa.me/${numeroFormateado}?text=${mensajeCodificado}`
      : `https://web.whatsapp.com/send?phone=${numeroFormateado}&text=${mensajeCodificado}`;
    
    window.open(url, '_blank');
    
    return { success: true, url };
    
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * Guarda el historial de envíos por WhatsApp
 */
export const guardarEnvioWhatsApp = (telefono, datosCliente, otsCreadas) => {
  try {
    const historial = JSON.parse(localStorage.getItem('historial_whatsapp') || '[]');
    historial.push({
      fecha: new Date().toISOString(),
      telefono: telefono,
      cliente: {
        nombre: datosCliente.nombre,
        rut: datosCliente.rut
      },
      cantidadOTs: otsCreadas.length,
      codigosOT: otsCreadas.map(ot => ot.codigoOT)
    });
    localStorage.setItem('historial_whatsapp', JSON.stringify(historial));
    return true;
  } catch (error) {
    console.error('Error al guardar historial:', error);
    return false;
  }
};