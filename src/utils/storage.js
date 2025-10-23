// src/utils/storage.js - CON FUNCIONES DE BACKUP Y RESTORE
const STORAGE_KEY = 'gps_ots';
const COUNTER_KEY_PREFIX = 'gps_ot_counter_';
const BACKUP_KEY = 'gps_ots_backup';

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

// ============ FUNCIONES DE BACKUP Y RESTORE ============

export const crearBackup = () => {
  try {
    const ots = localStorage.getItem(STORAGE_KEY);
    const contadores = {};
    
    // Obtener todos los contadores
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(COUNTER_KEY_PREFIX)) {
        contadores[key] = localStorage.getItem(key);
      }
    }
    
    const backup = {
      ots: ots ? JSON.parse(ots) : [],
      contadores: contadores,
      fechaBackup: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_completo_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Guardar también en localStorage como respaldo automático
    localStorage.setItem(BACKUP_KEY, dataStr);
    
    return true;
  } catch (error) {
    console.error('Error al crear backup:', error);
    return false;
  }
};

export const restaurarBackup = (archivo) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        
        // Validar estructura del backup
        if (!backup.ots || !backup.contadores || !backup.version) {
          reject(new Error('Archivo de backup inválido'));
          return;
        }
        
        // Restaurar OTs
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.ots));
        
        // Restaurar contadores
        Object.keys(backup.contadores).forEach(key => {
          localStorage.setItem(key, backup.contadores[key]);
        });
        
        // Guardar copia del backup restaurado
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
        
        resolve(backup.ots.length);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(archivo);
  });
};

export const restaurarBackupAutomatico = () => {
  try {
    const backupStr = localStorage.getItem(BACKUP_KEY);
    if (!backupStr) {
      return { success: false, message: 'No hay backup automático disponible' };
    }
    
    const backup = JSON.parse(backupStr);
    
    // Restaurar OTs
    localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.ots));
    
    // Restaurar contadores
    Object.keys(backup.contadores).forEach(key => {
      localStorage.setItem(key, backup.contadores[key]);
    });
    
    return { 
      success: true, 
      message: `Se restauraron ${backup.ots.length} OTs desde el backup automático del ${new Date(backup.fechaBackup).toLocaleString('es-CL')}` 
    };
  } catch (error) {
    console.error('Error al restaurar backup automático:', error);
    return { success: false, message: 'Error al restaurar backup automático' };
  }
};