import { jsPDF } from 'jspdf';

export const generarPDFOT = (ot, preview = false) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    let yPos = 15;

    // Colores
    const azulPrimario = [67, 141, 229];
    const textoOscuro = [15, 23, 42];
    const grisClaro = [248, 250, 252];
    const grisMedio = [156, 163, 175];

    // Mapeo de logos según prefijo
    const logosEmpresas = {
      'LWE': '/logos/lw-entel.png',
      'U': '/logos/ugps.png'
    };

    const verificarEspacio = (espacioNecesario) => {
      if (yPos + espacioNecesario > pageHeight - 15) {
        doc.addPage();
        yPos = 15;
        return true;
      }
      return false;
    };

    // ========== HEADER COMPACTO CON LOGO ==========
    doc.setFillColor(...azulPrimario);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Intentar cargar el logo
    const logoPath = logosEmpresas[ot.prefijo];
    if (logoPath) {
      try {
        // Agregar logo (ajusta el tamaño según tu logo)
        doc.addImage(logoPath, 'PNG', margin, 9, 40, 15);
      } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
      }
    }

    // Título y código OT
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDEN DE TRABAJO', pageWidth / 2, 15, { align: 'center' });
    
    const codigoOT = ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`;
    doc.setFontSize(14);
    doc.text(codigoOT, pageWidth / 2, 23, { align: 'center' });
    
    // Fecha
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const fechaCreacion = new Date(ot.fechaCreacion).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Fecha: ${fechaCreacion}`, pageWidth - margin, 30, { align: 'right' });
    
    yPos = 42;

    // ========== FUNCIÓN PARA SECCIONES COMPACTAS ==========
    const agregarSeccionCompacta = (titulo, icono = '') => {
      doc.setFillColor(...grisClaro);
      doc.rect(margin, yPos - 3, pageWidth - margin * 2, 6, 'F');
      doc.setTextColor(...textoOscuro);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`${icono} ${titulo}`, margin + 2, yPos);
      yPos += 7;
    };

    // ========== FUNCIÓN PARA FILAS EN DOS COLUMNAS ==========
    const agregarFilaDosColumnas = (label1, valor1, label2, valor2) => {
      const colWidth = (pageWidth - margin * 2) / 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      
      // Columna 1
      doc.text(label1, margin + 2, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textoOscuro);
      doc.setFontSize(8);
      doc.text(String(valor1 || 'N/A'), margin + 2, yPos + 3.5);
      
      // Columna 2
      if (label2) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...grisMedio);
        doc.text(label2, margin + colWidth + 2, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textoOscuro);
        doc.setFontSize(8);
        doc.text(String(valor2 || 'N/A'), margin + colWidth + 2, yPos + 3.5);
      }
      
      yPos += 8;
    };

    // ========== DATOS DE LA EMPRESA ==========
    agregarSeccionCompacta('DATOS DE LA EMPRESA', '🏢');
    agregarFilaDosColumnas('EMPRESA', ot.datosEmpresa?.nombreEmpresa, 'FECHA', ot.datosEmpresa?.fecha);
    agregarFilaDosColumnas('CONTACTO', ot.datosEmpresa?.nombreContacto, 'REGIÓN', ot.datosEmpresa?.region);
    agregarFilaDosColumnas('CIUDAD', ot.datosEmpresa?.ciudad, 'COMUNA', ot.datosEmpresa?.comuna);
    yPos += 2;

    // ========== DATOS DEL SERVICIO GPS ==========
    agregarSeccionCompacta('SERVICIO GPS', '📡');
    agregarFilaDosColumnas('TÉCNICO', ot.datosGPS?.nombreTecnico, 'SERVICIO', ot.datosGPS?.tipoServicio);
    agregarFilaDosColumnas('PPU IN', ot.datosGPS?.ppuIn, 'PPU OUT', ot.datosGPS?.ppuOut);
    agregarFilaDosColumnas('IMEI IN', ot.datosGPS?.imeiIn, 'IMEI OUT', ot.datosGPS?.imeiOut);

    // Accesorios en línea compacta
    if (ot.datosGPS?.accesoriosInstalados?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      doc.text('ACCESORIOS:', margin + 2, yPos);
      yPos += 3;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textoOscuro);
      const accesorios = ot.datosGPS.accesoriosInstalados.join(', ');
      const lineasAcc = doc.splitTextToSize(accesorios, pageWidth - margin * 2 - 4);
      lineasAcc.forEach(linea => {
        doc.text(linea, margin + 2, yPos);
        yPos += 3;
      });
      yPos += 1;
    }
    yPos += 2;

    // ========== DATOS DEL VEHÍCULO ==========
    agregarSeccionCompacta('VEHÍCULO', '🚗');
    agregarFilaDosColumnas('TIPO', ot.datosVehiculo?.tipo, 'MARCA', ot.datosVehiculo?.marca);
    agregarFilaDosColumnas('MODELO', ot.datosVehiculo?.modelo, 'AÑO', ot.datosVehiculo?.ano);
    agregarFilaDosColumnas('COLOR', ot.datosVehiculo?.color, 'PATENTE', ot.datosVehiculo?.patente || 'Sin Patente');
    
    if (ot.datosVehiculo?.kilometraje) {
      agregarFilaDosColumnas('KILOMETRAJE', `${ot.datosVehiculo.kilometraje} km`, '', '');
    }

    // Observaciones compactas
    if (ot.datosVehiculo?.observaciones) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...grisMedio);
      doc.text('OBSERVACIONES:', margin + 2, yPos);
      yPos += 3;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textoOscuro);
      const obs = doc.splitTextToSize(ot.datosVehiculo.observaciones, pageWidth - margin * 2 - 4);
      obs.forEach(linea => {
        doc.text(linea, margin + 2, yPos);
        yPos += 3;
      });
      yPos += 1;
    }
    yPos += 2;

    // ========== CHECKLIST COMPACTO ==========
    if (ot.checklist && Object.keys(ot.checklist).length > 0) {
      agregarSeccionCompacta('CHECKLIST', '✅');
      const labels = {
        luces: 'Luces',
        radio: 'Radio',
        tablero: 'Tablero',
        checkEngine: 'Check Engine',
        bateria: 'Batería'
      };

      // Mostrar en dos columnas
      const items = Object.entries(ot.checklist).filter(([_, value]) => value.estado);
      for (let i = 0; i < items.length; i += 2) {
        const [key1, value1] = items[i];
        const icono1 = value1.estado === 'bueno' ? '✓' : '⚠';
        const texto1 = `${icono1} ${labels[key1]}`;
        
        let texto2 = '';
        if (items[i + 1]) {
          const [key2, value2] = items[i + 1];
          const icono2 = value2.estado === 'bueno' ? '✓' : '⚠';
          texto2 = `${icono2} ${labels[key2]}`;
        }
        
        const colWidth = (pageWidth - margin * 2) / 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...textoOscuro);
        doc.text(texto1, margin + 2, yPos);
        if (texto2) {
          doc.text(texto2, margin + colWidth + 2, yPos);
        }
        yPos += 4;
        
        // Detalles si existen
        if (value1.detalle) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(6);
          doc.text(`> ${value1.detalle}`, margin + 4, yPos);
          yPos += 3;
        }
        if (items[i + 1] && items[i + 1][1].detalle) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(6);
          doc.text(`> ${items[i + 1][1].detalle}`, margin + colWidth + 4, yPos);
          yPos += 3;
        }
      }
      yPos += 2;
    }

    // ========== DATOS DEL CLIENTE Y FIRMA ==========
    if (ot.datosCliente) {
      agregarSeccionCompacta('CLIENTE', '👤');
      agregarFilaDosColumnas('NOMBRE', ot.datosCliente.nombre, 'RUT', ot.datosCliente.rut);
      agregarFilaDosColumnas('CONTACTO', ot.datosCliente.contacto, '', '');
      yPos += 2;

      // Firma compacta
      if (ot.datosCliente.firma) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...grisMedio);
        doc.text('FIRMA:', margin + 2, yPos);
        yPos += 2;
        
        try {
          // Firma más pequeña
          doc.addImage(ot.datosCliente.firma, 'PNG', margin + 2, yPos, 50, 20);
          
          // Línea debajo de la firma
          doc.setDrawColor(...grisMedio);
          doc.line(margin + 2, yPos + 21, margin + 52, yPos + 21);
          doc.setFontSize(6);
          doc.setFont('helvetica', 'normal');
          doc.text('Firma del Cliente', margin + 27, yPos + 24, { align: 'center' });
          yPos += 26;
        } catch (error) {
          console.error('Error al agregar firma:', error);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7);
          doc.text('(Firma no disponible)', margin + 2, yPos);
          yPos += 8;
        }
      }
    }

    // ========== FOOTER ==========
    doc.setFontSize(6);
    doc.setTextColor(...grisMedio);
    doc.setFont('helvetica', 'normal');
    doc.text('© 2025 GPS OT Manager - Sistema de Gestión de Órdenes de Trabajo', pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text(`Página 1 de 1`, pageWidth / 2, pageHeight - 4, { align: 'center' });

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