// src/utils/validaciones.js

export const validarCamposObligatorios = (datosOT) => {
  const errores = [];
  
  // Validar Datos Empresa
  if (!datosOT.datosEmpresa.nombreEmpresa?.trim()) {
    errores.push('Nombre de la Empresa');
  }
  if (!datosOT.datosEmpresa.fecha?.trim()) {
    errores.push('Fecha');
  }
  if (!datosOT.datosEmpresa.nombreContacto?.trim()) {
    errores.push('Nombre del Contacto');
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
  
  return errores;
};