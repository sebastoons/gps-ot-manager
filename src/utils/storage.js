const STORAGE_KEY = 'gps_ots';
const COUNTER_KEY_PREFIX = 'gps_ot_counter_';

export const obtenerNumeroOTActual = (prefijo) => {
  const contador = localStorage.getItem(COUNTER_KEY_PREFIX + prefijo);
  if (!contador) {
    localStorage.setItem(COUNTER_KEY_PREFIX + prefijo, '1');
    return 1;
  }
  return parseInt(contador);
};

export const incrementarContadorOT = (prefijo) => {
  const contador = obtenerNumeroOTActual(prefijo);
  localStorage.setItem(COUNTER_KEY_PREFIX + prefijo, (contador + 1).toString());
  return contador;
};

export const guardarOT = (ot, prefijo) => {
  try {
    const ots = obtenerTodasLasOTs();
    const numeroOT = incrementarContadorOT(prefijo);
    const codigoOT = `${prefijo}${String(numeroOT).padStart(4, '0')}`;
    const nuevaOT = {
      ...ot,
      numeroOT: numeroOT,
      codigoOT: codigoOT,
      prefijo: prefijo,
      id: `OT-${Date.now()}`,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };
    ots.push(nuevaOT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ots));
    return nuevaOT;
  } catch (error) {
    console.error('Error al guardar OT:', error);
    return null;
  }
};

export const obtenerTodasLasOTs = () => {
  try {
    const ots = localStorage.getItem(STORAGE_KEY);
    if (!ots) {
      return [];
    }
    const todasLasOTs = JSON.parse(ots);
    return filtrarOTsUltimosDosUmeses(todasLasOTs);
  } catch (error) {
    console.error('Error al obtener OTs:', error);
    return [];
  }
};

export const filtrarOTsUltimosDosUmeses = (ots) => {
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - 2);
  
  return ots.filter(ot => {
    const fechaOT = new Date(ot.fechaCreacion);
    return fechaOT >= fechaLimite;
  });
};

export const obtenerOTPorId = (id) => {
  const ots = obtenerTodasLasOTs();
  return ots.find(ot => ot.id === id);
};

export const actualizarOT = (id, datosActualizados) => {
  try {
    const ots = obtenerTodasLasOTs();
    const index = ots.findIndex(ot => ot.id === id);
    
    if (index === -1) {
      return false;
    }
    
    ots[index] = {
      ...ots[index],
      ...datosActualizados,
      fechaModificacion: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ots));
    return true;
  } catch (error) {
    console.error('Error al actualizar OT:', error);
    return false;
  }
};

export const eliminarOT = (id) => {
  try {
    const ots = obtenerTodasLasOTs();
    const otsFiltradas = ots.filter(ot => ot.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(otsFiltradas));
    return true;
  } catch (error) {
    console.error('Error al eliminar OT:', error);
    return false;
  }
};

export const limpiarOTsAntiguas = () => {
  try {
    const ots = obtenerTodasLasOTs();
    const otsFiltradas = filtrarOTsUltimosDosUmeses(ots);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(otsFiltradas));
    return true;
  } catch (error) {
    console.error('Error al limpiar OTs antiguas:', error);
    return false;
  }
};

export const exportarOTsJSON = () => {
  const ots = obtenerTodasLasOTs();
  const dataStr = JSON.stringify(ots, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ots_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const obtenerEstadisticas = () => {
  const ots = obtenerTodasLasOTs();
  return {
    total: ots.length,
    ultimaSemana: ots.filter(ot => {
      const fecha = new Date(ot.fechaCreacion);
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);
      return fecha >= hace7Dias;
    }).length,
    ultimoMes: ots.filter(ot => {
      const fecha = new Date(ot.fechaCreacion);
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      return fecha >= hace30Dias;
    }).length
  };
};