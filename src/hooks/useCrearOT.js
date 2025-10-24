// src/hooks/useCrearOT.js - COMPLETO CON datosCliente
import { useState, useEffect } from 'react';
import { guardarOT, obtenerNumeroOTActual } from '../utils/storage';

export const useCrearOT = (empresaData) => {
  const [numeroOT, setNumeroOT] = useState(1);
  const [codigoOT, setCodigoOT] = useState('');
  const [otsCreadas, setOtsCreadas] = useState([]);
  const [datosEmpresaGuardados, setDatosEmpresaGuardados] = useState({});
  const [seccionAbierta, setSeccionAbierta] = useState('datosEmpresa');
  
  const [datosOT, setDatosOT] = useState({
    datosEmpresa: {},
    checklist: {},
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

  const toggleSeccion = (seccion) => {
    setSeccionAbierta(seccionAbierta === seccion ? '' : seccion);
  };

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

  const crearNuevaOT = () => {
    const nuevoNumero = obtenerNumeroOTActual(empresaData.prefijo);
    setNumeroOT(nuevoNumero);
    setCodigoOT(`${empresaData.prefijo}${String(nuevoNumero).padStart(4, '0')}`);
    setDatosOT({
      datosEmpresa: datosEmpresaGuardados,
      checklist: {},
      datosGPS: {},
      datosVehiculo: {},
      datosCliente: {}
    });
    setSeccionAbierta('datosGPS');
  };

  return {
    numeroOT,
    codigoOT,
    otsCreadas,
    datosOT,
    seccionAbierta,
    toggleSeccion,
    actualizarDatos,
    finalizarOT,
    crearNuevaOT
  };
};