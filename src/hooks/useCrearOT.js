// src/hooks/useCrearOT.js
import { useState, useEffect } from 'react';
import { guardarOT, obtenerNumeroOTActual } from '../utils/storage';

export const useCrearOT = (empresaData) => {
  const [numeroOT, setNumeroOT] = useState(1);
  const [codigoOT, setCodigoOT] = useState('');
  const [datosEmpresaGuardados, setDatosEmpresaGuardados] = useState({});
  const [tecnicoGuardado, setTecnicoGuardado] = useState('');
  
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

    // Guardar datos de la empresa y técnico
    setDatosEmpresaGuardados(datosOT.datosEmpresa);
    setTecnicoGuardado(datosOT.datosGPS.nombreTecnico);

    const otGuardada = guardarOT(datosOT, empresaData.prefijo);
    
    return otGuardada;
  };

  const reiniciarFormulario = () => {
    // Incrementar número de OT
    const nuevoNumero = obtenerNumeroOTActual(empresaData.prefijo);
    setNumeroOT(nuevoNumero);
    setCodigoOT(`${empresaData.prefijo}${String(nuevoNumero).padStart(4, '0')}`);

    // Reiniciar datos pero manteniendo empresa y técnico
    setDatosOT({
      datosEmpresa: { ...datosEmpresaGuardados },
      checklist: {
        luces: { estado: '', detalle: '' },
        radio: { estado: '', detalle: '' },
        tablero: { estado: '', detalle: '' },
        checkEngine: { estado: '', detalle: '' },
        bateria: { estado: '', detalle: '' },
        plasticosEstetica: { estado: '', detalle: '' }
      },
      datosGPS: { 
        nombreTecnico: tecnicoGuardado,
        tipoServicio: '',
        ppuIn: '',
        ppuOut: '',
        imeiIn: '',
        imeiOut: '',
        accesoriosInstalados: []
      },
      datosVehiculo: {},
      datosCliente: {}
    });
  };

  return {
    numeroOT,
    codigoOT,
    datosOT,
    actualizarDatos,
    finalizarOT,
    reiniciarFormulario
  };
};