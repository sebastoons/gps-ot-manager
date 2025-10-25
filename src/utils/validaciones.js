// src/utils/validaciones.js
export const validarCamposObligatoriosPorPaso = (datosOT, paso) => {
  const errores = [];
  
  switch(paso) {
    case 0:
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
      
    case 1:
      if (!datosOT.datosGPS.nombreTecnico?.trim()) {
        errores.push('Nombre del Técnico');
      }
      if (!datosOT.datosGPS.tipoServicio?.trim()) {
        errores.push('Tipo de Servicio');
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
      
    case 2:
      break;

    case 3:
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
  
  if (!datosOT.datosGPS.nombreTecnico?.trim()) {
    errores.push('Nombre del Técnico');
  }
  if (!datosOT.datosGPS.tipoServicio?.trim()) {
    errores.push('Tipo de Servicio');
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