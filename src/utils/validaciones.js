// src/utils/validaciones.js - CORREGIDO SIN NOMBRE CONTACTO
export const validarCamposObligatoriosPorPaso = (datosOT, paso) => {
  const errores = [];
  
  switch(paso) {
    case 0: // Datos Empresa
      if (!datosOT.datosEmpresa.nombreEmpresa?.trim()) {
        errores.push('Nombre de la Empresa');
      }
      if (!datosOT.datosEmpresa.fecha?.trim()) {
        errores.push('Fecha');
      }
      if (!datosOT.datosEmpresa.region?.trim()) {
        errores.push('Región');
      }
      if (!datosOT.datosEmpresa.ciudad?.trim()) {
        errores.push('Ciudad');
      }
      if (!datosOT.datosEmpresa.comuna?.trim()) {
        errores.push('Comuna');
      }
      break;
      
    case 1: // Datos Servicio y Vehículo
      if (!datosOT.datosGPS.nombreTecnico?.trim()) {
        errores.push('Nombre del Técnico');
      }
      if (!datosOT.datosGPS.tipoServicio?.trim()) {
        errores.push('Tipo de Servicio');
      }
      if (!datosOT.datosVehiculo.tipo?.trim()) {
        errores.push('Tipo de Vehículo');
      }
      if (!datosOT.datosVehiculo.marca?.trim()) {
        errores.push('Marca del Vehículo');
      }
      if (!datosOT.datosVehiculo.modelo?.trim()) {
        errores.push('Modelo del Vehículo');
      }
      if (!datosOT.datosVehiculo.ano?.trim()) {
        errores.push('Año del Vehículo');
      }
      if (!datosOT.datosVehiculo.color?.trim()) {
        errores.push('Color del Vehículo');
      }
      break;
      
    case 2: // CheckList (opcional)
      // El checklist es opcional, no hay validaciones obligatorias
      break;

    case 3: // Datos Cliente
      if (!datosOT.datosCliente?.nombre?.trim()) {
        errores.push('Nombre del Cliente');
      }
      if (!datosOT.datosCliente?.rut?.trim()) {
        errores.push('RUT del Cliente');
      }
      if (!datosOT.datosCliente?.contacto?.trim()) {
        errores.push('Teléfono o Email del Cliente');
      }
      if (!datosOT.datosCliente?.firma) {
        errores.push('Firma del Cliente');
      }
      break;
  }
  
  return errores;
};

export const validarCamposObligatorios = (datosOT) => {
  const errores = [];
  
  // Validar Datos Empresa
  if (!datosOT.datosEmpresa.nombreEmpresa?.trim()) {
    errores.push('Nombre de la Empresa');
  }
  if (!datosOT.datosEmpresa.fecha?.trim()) {
    errores.push('Fecha');
  }
  if (!datosOT.datosEmpresa.region?.trim()) {
    errores.push('Región');
  }
  if (!datosOT.datosEmpresa.ciudad?.trim()) {
    errores.push('Ciudad');
  }
  if (!datosOT.datosEmpresa.comuna?.trim()) {
    errores.push('Comuna');
  }
  
  // Validar Datos GPS
  if (!datosOT.datosGPS.nombreTecnico?.trim()) {
    errores.push('Nombre del Técnico');
  }
  if (!datosOT.datosGPS.tipoServicio?.trim()) {
    errores.push('Tipo de Servicio');
  }
  
  // Validar Datos Vehículo
  if (!datosOT.datosVehiculo.tipo?.trim()) {
    errores.push('Tipo de Vehículo');
  }
  if (!datosOT.datosVehiculo.marca?.trim()) {
    errores.push('Marca del Vehículo');
  }
  if (!datosOT.datosVehiculo.modelo?.trim()) {
    errores.push('Modelo del Vehículo');
  }
  if (!datosOT.datosVehiculo.ano?.trim()) {
    errores.push('Año del Vehículo');
  }
  if (!datosOT.datosVehiculo.color?.trim()) {
    errores.push('Color del Vehículo');
  }

  // Validar Datos Cliente
  if (!datosOT.datosCliente?.nombre?.trim()) {
    errores.push('Nombre del Cliente');
  }
  if (!datosOT.datosCliente?.rut?.trim()) {
    errores.push('RUT del Cliente');
  }
  if (!datosOT.datosCliente?.contacto?.trim()) {
    errores.push('Teléfono o Email del Cliente');
  }
  if (!datosOT.datosCliente?.firma) {
    errores.push('Firma del Cliente');
  }
  
  return errores;
};