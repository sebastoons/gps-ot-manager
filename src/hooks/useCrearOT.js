// src/hooks/useCrearOT.js - CORREGIDO PARA FINALIZAR CORRECTAMENTE
import { useState, useEffect } from 'react';
import { guardarOT, obtenerNumeroOTActual } from '../utils/storage';

export const useCrearOT = (empresaData) => {
  const [numeroOT, setNumeroOT] = useState(1);
  const [codigoOT, setCodigoOT] = useState('');
  const [otsCreadas, setOtsCreadas] = useState([]);
  const [datosEmpresaGuardados, setDatosEmpresaGuardados] = useState({});
  
  const [datosOT, setDatosOT] = useState({
    datosEmpresa: {},
    checklist: {
      luces: { estado: '', detalle: '' },
      radio: { estado: '', detalle: '' },
      tablero: { estado: '', detalle: '' },
      checkEngine: { estado: '', detalle: '' },
      bateria: { estado: '', detalle: '' },
      plasticosEstetica: { estado: '', detalle: '' }
    },
    datosGPS: {},
    datosVehiculo: {},
    datosCliente: {}
  });

  useEffect(() => {
    if (empresaData) {
      const numeroActual = obtenerNumeroOTActual(empresaData.prefijo);
      setNumeroOT(numeroActual);
      setCodigoOT(`${empresaData.prefijo}${String(numeroActual).padStart(4, '0')}`);
    }
  }, [empresaData]);

  const actualizarDatos = (seccion, nuevosDatos) => {
    setDatosOT({ ...datosOT, [seccion]: nuevosDatos });
  };

  const finalizarOT = (validaciones) => {
    const errores = validaciones(datosOT);
    
    if (errores.length > 0) {
      alert(`⚠️ Faltan los siguientes campos obligatorios:\n\n${errores.join('\n')}`);
      return null;
    }

    if (otsCreadas.length === 0) {
      setDatosEmpresaGuardados(datosOT.datosEmpresa);
    }

    const otGuardada = guardarOT(datosOT, empresaData.prefijo);
    
    if (otGuardada) {
      setOtsCreadas([...otsCreadas, otGuardada]);
      return otGuardada;
    }
    
    return null;
  };

  return {
    numeroOT,
    codigoOT,
    otsCreadas,
    datosOT,
    actualizarDatos,
    finalizarOT
  };
};