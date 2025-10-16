// src/utils/pdfService.js
// Servicio para generar PDFs de las OTs
// Requiere: npm install jspdf jspdf-autotable

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Genera un PDF profesional de una OT individual
 */
export const generarPDFOT = (ot) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Colores del tema
  const primaryColor = [102, 126, 234]; // #667eea
  const secondaryColor = [118, 75, 162]; // #764ba2
  const textColor = [15, 23, 42]; // #0f172a
  const lightBg = [248, 250, 252]; // #f8fafc

  // ========================================
  // ENCABEZADO
  // ========================================
  // Gradiente de fondo (simulado con rectángulos)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GPS OT MANAGER', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Órdenes de Trabajo', pageWidth / 2, 28, { align: 'center' });
  
  // Código de OT
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`, pageWidth / 2, 38, { align: 'center' });
  
  yPos = 55;

  // ========================================
  // INFORMACIÓN GENERAL
  // ========================================
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const fechaCreacion = new Date(ot.fechaCreacion).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.text(`Fecha de Creación: ${fechaCreacion}`, margin, yPos);
  yPos += 10;

  // ========================================
  // SECCIÓN: DATOS DE LA EMPRESA
  // ========================================
  yPos = agregarSeccion(doc, yPos, '🏢 DATOS DE LA EMPRESA', lightBg);
  
  const datosEmpresa = [
    ['Empresa:', ot.datosEmpresa?.nombreEmpresa || 'N/A'],
    ['Fecha:', ot.datosEmpresa?.fecha || 'N/A'],
    ['Contacto:', ot.datosEmpresa?.nombreContacto || 'N/A'],
    ['Región:', ot.datosEmpresa?.region || 'N/A'],
    ['Ciudad:', ot.datosEmpresa?.ciudad || 'N/A'],
    ['Comuna:', ot.datosEmpresa?.comuna || 'N/A']
  ];
  
  yPos = agregarTabla(doc, yPos, datosEmpresa);
  yPos += 5;

  // ========================================
  // SECCIÓN: DATOS DEL SERVICIO GPS
  // ========================================
  yPos = agregarSeccion(doc, yPos, '📡 DATOS DEL SERVICIO GPS', lightBg);
  
  const datosGPS = [
    ['Técnico:', ot.datosGPS?.nombreTecnico || 'N/A'],
    ['Tipo de Servicio:', ot.datosGPS?.tipoServicio || 'N/A'],
    ['PPU IN:', ot.datosGPS?.ppuIn || 'N/A'],
    ['PPU OUT:', ot.datosGPS?.ppuOut || 'N/A'],
    ['IMEI IN:', ot.datosGPS?.imeiIn || 'N/A'],
    ['IMEI OUT:', ot.datosGPS?.imeiOut || 'N/A']
  ];
  
  yPos = agregarTabla(doc, yPos, datosGPS);
  
  // Accesorios
  if (ot.datosGPS?.accesoriosInstalados && ot.datosGPS.accesoriosInstalados.length > 0) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Accesorios Instalados:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    
    ot.datosGPS.accesoriosInstalados.forEach((accesorio) => {
      doc.text(`• ${accesorio}`, margin + 5, yPos);
      yPos += 5;
    });
  }
  
  yPos += 5;

  // ========================================
  // SECCIÓN: DATOS DEL VEHÍCULO
  // ========================================
  // Verificar si necesitamos nueva página
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  yPos = agregarSeccion(doc, yPos, '🚗 DATOS DEL VEHÍCULO', lightBg);
  
  const datosVehiculo = [
    ['Tipo:', ot.datosVehiculo?.tipo || 'N/A'],
    ['Marca:', ot.datosVehiculo?.marca || 'N/A'],
    ['Modelo:', ot.datosVehiculo?.modelo || 'N/A'],
    ['Año:', ot.datosVehiculo?.ano || 'N/A'],
    ['Color:', ot.datosVehiculo?.color || 'N/A'],
    ['Patente:', ot.datosVehiculo?.patente || 'Sin Patente'],
    ['Kilometraje:', ot.datosVehiculo?.kilometraje ? `${ot.datosVehiculo.kilometraje} km` : 'N/A']
  ];
  
  yPos = agregarTabla(doc, yPos, datosVehiculo);
  
  // Observaciones del vehículo
  if (ot.datosVehiculo?.observaciones) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Observaciones:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    
    const observaciones = doc.splitTextToSize(ot.datosVehiculo.observaciones, pageWidth - margin * 2);
    doc.text(observaciones, margin, yPos);
    yPos += observaciones.length * 5 + 5;
  }

  // ========================================
  // SECCIÓN: CHECKLIST
  // ========================================
  if (ot.checklist && Object.keys(ot.checklist).length > 0) {
    // Verificar espacio
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos = agregarSeccion(doc, yPos, '✅ CHECKLIST DEL VEHÍCULO', lightBg);
    
    const itemsLabels = {
      luces: 'Luces 💡',
      radio: 'Radio 📻',
      tablero: 'Tablero 🎛️',
      checkEngine: 'Check Engine ⚠️',
      bateria: 'Batería 🔋'
    };
    
    Object.entries(ot.checklist).forEach(([key, value]) => {
      if (value.estado) {
        const icono = value.estado === 'bueno' ? '✓' : '⚠';
        const estado = value.estado === 'bueno' ? 'OK' : 'Ver detalle';
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${icono} ${itemsLabels[key]}:`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(estado, margin + 50, yPos);
        yPos += 5;
        
        if (value.detalle) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          const detalle = doc.splitTextToSize(`└ ${value.detalle}`, pageWidth - margin * 2 - 10);
          doc.text(detalle, margin + 5, yPos);
          yPos += detalle.length * 4 + 3;
          doc.setFontSize(9);
        }
      }
    });
    
    yPos += 5;
  }

  // ========================================
  // SECCIÓN: DATOS DEL CLIENTE Y FIRMA
  // ========================================
  if (ot.datosCliente) {
    // Verificar espacio
    if (yPos > 180) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos = agregarSeccion(doc, yPos, '👤 DATOS DEL CLIENTE', lightBg);
    
    const datosCliente = [
      ['Nombre:', ot.datosCliente.nombre || 'N/A'],
      ['RUT:', ot.datosCliente.rut || 'N/A'],
      ['Contacto:', ot.datosCliente.contacto || 'N/A']
    ];
    
    yPos = agregarTabla(doc, yPos, datosCliente);
    yPos += 10;
    
    // Firma
    if (ot.datosCliente.firma) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Firma del Cliente:', margin, yPos);
      yPos += 5;
      
      try {
        // Agregar imagen de firma
        doc.addImage(ot.datosCliente.firma, 'PNG', margin, yPos, 80, 30);
        yPos += 35;
      } catch (error) {
        console.error('Error al agregar firma:', error);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text('(Firma no disponible)', margin, yPos);
        yPos += 10;
      }
    }
  }

  // ========================================
  // PIE DE PÁGINA
  // ========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      '© 2025 GPS OT Manager - Sistema de gestión de instalaciones',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }

  // Guardar PDF
  const nombreArchivo = `${ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`}.pdf`;
  doc.save(nombreArchivo);
};

/**
 * Genera un PDF con múltiples OTs (para la misma empresa/cliente)
 */
export const generarPDFMultiple = (ots) => {
  const doc = new jsPDF();
  
  ots.forEach((ot, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    // Reutilizar lógica de PDF individual
    // Por simplicidad, aquí generaríamos PDFs separados
    // o implementaríamos la lógica completa para múltiples OTs
  });
  
  const nombreArchivo = `OTs_Multiple_${Date.now()}.pdf`;
  doc.save(nombreArchivo);
};

/**
 * Función auxiliar para agregar sección con título
 */
function agregarSeccion(doc, yPos, titulo, bgColor) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  
  // Fondo de la sección
  doc.setFillColor(...bgColor);
  doc.rect(margin - 2, yPos - 5, pageWidth - margin * 2 + 4, 8, 'F');
  
  // Título
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, margin, yPos);
  
  return yPos + 8;
}

/**
 * Función auxiliar para agregar tabla de datos
 */
function agregarTabla(doc, yPos, datos) {
  const margin = 15;
  
  doc.autoTable({
    startY: yPos,
    body: datos,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    },
    didDrawCell: (data) => {
      // Agregar borde sutil
      if (data.row.index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
      }
    }
  });
  
  return doc.lastAutoTable.finalY + 5;
}