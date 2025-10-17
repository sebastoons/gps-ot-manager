import { jsPDF } from 'jspdf';

export const generarPDFOT = (ot, preview = false) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 20;

    const azulPrimario = [67, 141, 229];
    const textoOscuro = [15, 23, 42];
    const grisClaro = [248, 250, 252];

    const verificarEspacio = (espacioNecesario) => {
      if (yPos + espacioNecesario > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        return true;
      }
      return false;
    };

    const agregarSeccion = (titulo) => {
      verificarEspacio(15);
      doc.setFillColor(...grisClaro);
      doc.rect(margin - 2, yPos - 5, pageWidth - margin * 2 + 4, 8, 'F');
      doc.setTextColor(...textoOscuro);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(titulo, margin, yPos);
      yPos += 10;
    };

    const agregarFila = (label, valor) => {
      verificarEspacio(7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...textoOscuro);
      doc.text(label, margin + 2, yPos);
      doc.setFont('helvetica', 'normal');
      const valorTexto = valor || 'N/A';
      doc.text(String(valorTexto), margin + 55, yPos);
      yPos += 6;
    };

    const agregarLinea = () => {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
    };

    doc.setFillColor(...azulPrimario);
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('GPS OT MANAGER', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Ordenes de Trabajo', pageWidth / 2, 28, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const codigoOT = ot.codigoOT || `OT${String(ot.numeroOT).padStart(4, '0')}`;
    doc.text(codigoOT, pageWidth / 2, 38, { align: 'center' });
    yPos = 55;

    doc.setTextColor(...textoOscuro);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const fechaCreacion = new Date(ot.fechaCreacion).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Fecha: ${fechaCreacion}`, margin, yPos);
    yPos += 8;
    agregarLinea();

    agregarSeccion('DATOS DE LA EMPRESA');
    agregarFila('Empresa:', ot.datosEmpresa?.nombreEmpresa);
    agregarFila('Fecha:', ot.datosEmpresa?.fecha);
    agregarFila('Contacto:', ot.datosEmpresa?.nombreContacto);
    agregarFila('Region:', ot.datosEmpresa?.region);
    agregarFila('Ciudad:', ot.datosEmpresa?.ciudad);
    agregarFila('Comuna:', ot.datosEmpresa?.comuna);
    yPos += 3;
    agregarLinea();

    agregarSeccion('DATOS DEL SERVICIO GPS');
    agregarFila('Tecnico:', ot.datosGPS?.nombreTecnico);
    agregarFila('Servicio:', ot.datosGPS?.tipoServicio);
    agregarFila('PPU IN:', ot.datosGPS?.ppuIn);
    agregarFila('PPU OUT:', ot.datosGPS?.ppuOut);
    agregarFila('IMEI IN:', ot.datosGPS?.imeiIn);
    agregarFila('IMEI OUT:', ot.datosGPS?.imeiOut);

    if (ot.datosGPS?.accesoriosInstalados?.length > 0) {
      yPos += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Accesorios:', margin + 2, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      ot.datosGPS.accesoriosInstalados.forEach((acc) => {
        verificarEspacio(5);
        doc.text(`- ${acc}`, margin + 7, yPos);
        yPos += 5;
      });
    }
    yPos += 3;
    agregarLinea();

    agregarSeccion('DATOS DEL VEHICULO');
    agregarFila('Tipo:', ot.datosVehiculo?.tipo);
    agregarFila('Marca:', ot.datosVehiculo?.marca);
    agregarFila('Modelo:', ot.datosVehiculo?.modelo);
    agregarFila('Ano:', ot.datosVehiculo?.ano);
    agregarFila('Color:', ot.datosVehiculo?.color);
    agregarFila('Patente:', ot.datosVehiculo?.patente || 'Sin Patente');
    if (ot.datosVehiculo?.kilometraje) {
      agregarFila('Kilometraje:', `${ot.datosVehiculo.kilometraje} km`);
    }

    if (ot.datosVehiculo?.observaciones) {
      yPos += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Observaciones:', margin + 2, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const obs = doc.splitTextToSize(ot.datosVehiculo.observaciones, pageWidth - margin * 2 - 4);
      obs.forEach(linea => {
        verificarEspacio(5);
        doc.text(linea, margin + 2, yPos);
        yPos += 5;
      });
    }
    yPos += 3;
    agregarLinea();

    if (ot.checklist && Object.keys(ot.checklist).length > 0) {
      agregarSeccion('CHECKLIST DEL VEHICULO');
      const labels = {
        luces: 'Luces',
        radio: 'Radio',
        tablero: 'Tablero',
        checkEngine: 'Check Engine',
        bateria: 'Bateria'
      };
      Object.entries(ot.checklist).forEach(([key, value]) => {
        if (value.estado) {
          verificarEspacio(8);
          const icono = value.estado === 'bueno' ? '[OK]' : '[!]';
          const estado = value.estado === 'bueno' ? 'OK' : 'Ver detalle';
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text(`${icono} ${labels[key]}:`, margin + 2, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(estado, margin + 55, yPos);
          yPos += 5;
          if (value.detalle) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            const det = doc.splitTextToSize(`> ${value.detalle}`, pageWidth - margin * 2 - 10);
            det.forEach(linea => {
              verificarEspacio(4);
              doc.text(linea, margin + 7, yPos);
              yPos += 4;
            });
            yPos += 2;
            doc.setFontSize(9);
          }
        }
      });
      yPos += 3;
      agregarLinea();
    }

    if (ot.datosCliente) {
      agregarSeccion('DATOS DEL CLIENTE');
      agregarFila('Nombre:', ot.datosCliente.nombre);
      agregarFila('RUT:', ot.datosCliente.rut);
      agregarFila('Contacto:', ot.datosCliente.contacto);
      yPos += 5;
      if (ot.datosCliente.firma) {
        verificarEspacio(40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Firma:', margin + 2, yPos);
        yPos += 5;
        try {
          doc.addImage(ot.datosCliente.firma, 'PNG', margin + 2, yPos, 80, 30);
          yPos += 35;
        } catch (error) {
          console.error('Error firma:', error);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.text('(Firma no disponible)', margin + 2, yPos);
          yPos += 10;
        }
      }
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pagina ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text('(c) 2025 GPS OT Manager', pageWidth / 2, pageHeight - 5, { align: 'center' });
    }

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
    console.error('Error PDF:', error);
    alert(`Error: ${error.message}`);
    throw error;
  }
};