// src/utils/formatters.js

export const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-CL', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
};

export const getNombreEmpresa = (prefijo) => {
  const mapaEmpresas = {
    'LWE': 'LW - Entel',
    'U': 'UGPS'
  };
  return mapaEmpresas[prefijo] || prefijo;
};

export const obtenerEmpresasUnicas = (ots) => {
  const empresasUnicas = [...new Set(ots.map(ot => ot.prefijo))];
  return empresasUnicas.map(prefijo => ({
    prefijo: prefijo,
    nombre: getNombreEmpresa(prefijo)
  }));
};