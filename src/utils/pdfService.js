import { jsPDF } from 'jspdf';

export const generarPDFOT = (ot, preview = false) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 20;

    // Colores
    const azulPrimario = [0, 153, 255];
    const textoOscuro = [15, 23, 42];
    const grisClaro = [248, 250, 252];
    const grisMedio = [100, 116, 139];
    const verde = [16, 185, 129];
    const naranja = [245, 158, 11];

    // ========== HEADER CON LOGO ==========
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo SERVITRAK en esquina superior izquierda
    try {
      doc.addImage('/logos/servitrak-logo.png', 'PNG', margin, 8, 40, 12);
    } catch (error) {
      // Si no existe el logo, mostrar texto
      doc.setTextColor(...azulPrimario);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SERVITRAK', margin, 15);
    }

    // N° OT en esquina superior derecha
    const codigoOT = ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`;
    doc.setFillColor(...azulPrimario);
    doc.roundedRect(pageWidth - margin - 35, 8, 35, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(codigoOT, pageWidth - margin - 17.5, 16, { align: 'center' });

    // Título centrado
    doc.setTextColor(...azulPrimario);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDEN DE TRABAJO', pageWidth / 2, 30, { align: 'center' });
    
    yPos = 45;

    // ========== FUNCIONES AUXILIARES ==========
    const agregarSeccion = (titulo) => {
      doc.setFillColor(...grisClaro);
      doc.rect(margin, yPos - 3, pageWidth - margin * 2, 7, 'F');
      doc.setTextColor(...azulPrimario);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(titulo, margin + 2, yPos + 1);
      yPos += 9;
    };

    const agregarCampo = (label, valor, xPos = margin + 2) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      doc.text(label, xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textoOscuro);
      doc.setFontSize(8);
      doc.text(String(valor || 'N/A'), xPos, yPos + 4);
      yPos += 9;
    };

    const agregarCampoDoble = (label1, valor1, label2, valor2) => {
      const colWidth = (pageWidth - margin * 2) / 2;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      doc.text(label1, margin + 2, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textoOscuro);
      doc.setFontSize(8);
      doc.text(String(valor1 || 'N/A'), margin + 2, yPos + 4);
      
      if (label2) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...grisMedio);
        doc.text(label2, margin + colWidth + 2, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textoOscuro);
        doc.setFontSize(8);
        doc.text(String(valor2 || 'N/A'), margin + colWidth + 2, yPos + 4);
      }
      
      yPos += 9;
    };

    // ========== DATOS DE LA EMPRESA ==========
    agregarSeccion('DATOS DE LA EMPRESA');
    agregarCampoDoble('EMPRESA', ot.datosEmpresa?.nombreEmpresa, 'FECHA', ot.datosEmpresa?.fecha);
    agregarCampoDoble('REGION', ot.datosEmpresa?.region, 'CIUDAD', ot.datosEmpresa?.ciudad);
    agregarCampo('COMUNA', ot.datosEmpresa?.comuna);
    yPos += 3;

    // ========== SERVICIO GPS Y VEHÍCULO ==========
    agregarSeccion('SERVICIO Y VEHICULO');
    agregarCampoDoble('TECNICO', ot.datosGPS?.nombreTecnico, 'SERVICIO', ot.datosGPS?.tipoServicio);
    agregarCampoDoble('PPU IN', ot.datosGPS?.ppuIn, 'PPU OUT', ot.datosGPS?.ppuOut);
    agregarCampoDoble('IMEI IN', ot.datosGPS?.imeiIn, 'IMEI OUT', ot.datosGPS?.imeiOut);
    
    if (ot.datosGPS?.accesoriosInstalados?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      doc.text('ACCESORIOS:', margin + 2, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textoOscuro);
      const accesorios = ot.datosGPS.accesoriosInstalados.join(', ');
      const lineasAcc = doc.splitTextToSize(accesorios, pageWidth - margin * 2 - 4);
      lineasAcc.forEach(linea => {
        doc.text(linea, margin + 2, yPos);
        yPos += 3;
      });
      yPos += 2;
    }

    agregarCampoDoble('TIPO', ot.datosVehiculo?.tipo, 'MARCA', ot.datosVehiculo?.marca);
    agregarCampoDoble('MODELO', ot.datosVehiculo?.modelo, 'AÑO', ot.datosVehiculo?.ano);
    agregarCampoDoble('COLOR', ot.datosVehiculo?.color, 'PATENTE', ot.datosVehiculo?.patente || 'Sin Patente');
    
    if (ot.datosVehiculo?.kilometraje) {
      agregarCampo('KILOMETRAJE', `${ot.datosVehiculo.kilometraje} km`);
    }

    if (ot.datosVehiculo?.observaciones) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      doc.text('OBSERVACIONES:', margin + 2, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textoOscuro);
      const obs = doc.splitTextToSize(ot.datosVehiculo.observaciones, pageWidth - margin * 2 - 4);
      obs.forEach(linea => {
        doc.text(linea, margin + 2, yPos);
        yPos += 3;
      });
      yPos += 2;
    }
    yPos += 3;

    // ========== CHECKLIST ==========
    if (ot.checklist && Object.keys(ot.checklist).length > 0) {
      agregarSeccion('CHECKLIST');
      const labels = {
        luces: 'Luces',
        radio: 'Radio',
        tablero: 'Tablero',
        checkEngine: 'Check Engine',
        bateria: 'Bateria',
        plasticosEstetica: 'Plasticos'
      };

      const items = Object.entries(ot.checklist).filter(([_, value]) => value.estado);
      
      for (let i = 0; i < items.length; i++) {
        const [key, value] = items[i];
        
        if (value.estado === 'bueno') {
          doc.setTextColor(...verde);
          doc.setFont('helvetica', 'bold');
          doc.text('✓', margin + 2, yPos);
        } else {
          doc.setTextColor(...naranja);
          doc.setFont('helvetica', 'bold');
          doc.text('⚠', margin + 2, yPos);
        }
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textoOscuro);
        doc.setFontSize(7);
        doc.text(labels[key], margin + 8, yPos);
        yPos += 4;
        
        if (value.detalle) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(6);
          doc.setTextColor(...grisMedio);
          const detalleTexto = doc.splitTextToSize(`- ${value.detalle}`, pageWidth - margin * 2 - 10);
          detalleTexto.forEach(linea => {
            doc.text(linea, margin + 10, yPos);
            yPos += 3;
          });
          yPos += 1;
        }
      }
      yPos += 3;
    }

    // ========== CLIENTE Y FIRMA ==========
    if (ot.datosCliente) {
      agregarSeccion('CLIENTE');
      agregarCampoDoble('NOMBRE', ot.datosCliente.nombre, 'RUT', ot.datosCliente.rut);
      agregarCampo('CONTACTO', ot.datosCliente.contacto);
      yPos += 2;

      if (ot.datosCliente.firma) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...grisMedio);
        doc.text('FIRMA:', margin + 2, yPos);
        yPos += 2;
        
        try {
          doc.addImage(ot.datosCliente.firma, 'PNG', margin + 2, yPos, 50, 20);
          doc.setDrawColor(...grisMedio);
          doc.line(margin + 2, yPos + 21, margin + 52, yPos + 21);
          doc.setFontSize(6);
          doc.setFont('helvetica', 'normal');
          doc.text('Firma del Cliente', margin + 27, yPos + 24, { align: 'center' });
          yPos += 26;
        } catch (error) {
          console.error('Error al agregar firma:', error);
        }
      }
    }

    // ========== FOOTER ==========
    doc.setFontSize(6);
    doc.setTextColor(...grisMedio);
    doc.setFont('helvetica', 'normal');
    const fechaCreacion = new Date(ot.fechaCreacion).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${fechaCreacion}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text('© 2025 SERVITRAK - Sistema de Gestión OT', pageWidth / 2, pageHeight - 4, { align: 'center' });

    // ========== GUARDAR O PREVISUALIZAR ==========
    const nombreArchivo = `${codigoOT}.pdf`;
    if (preview) {
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } else {
      doc.save(nombreArchivo);
    }
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    alert(`Error al generar PDF: ${error.message}`);
    throw error;
  }
};