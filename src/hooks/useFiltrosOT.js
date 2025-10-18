// src/hooks/useFiltrosOT.js
import { useState, useEffect } from 'react';

export const useFiltrosOT = (ots) => {
  const [otsFiltradas, setOtsFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('todas');

  useEffect(() => {
    filtrarOTs();
  }, [busqueda, empresaFiltro, ots]);

  const filtrarOTs = () => {
    let filtradas = ots;

    // Filtrar por empresa
    if (empresaFiltro !== 'todas') {
      filtradas = filtradas.filter(ot => ot.prefijo === empresaFiltro);
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      filtradas = filtradas.filter(ot => {
        return (
          ot.numeroOT?.toString().includes(termino) ||
          ot.codigoOT?.toLowerCase().includes(termino) ||
          ot.datosEmpresa?.nombreEmpresa?.toLowerCase().includes(termino) ||
          ot.datosVehiculo?.patente?.toLowerCase().includes(termino) ||
          ot.datosVehiculo?.marca?.toLowerCase().includes(termino) ||
          ot.datosVehiculo?.modelo?.toLowerCase().includes(termino) ||
          ot.datosGPS?.nombreTecnico?.toLowerCase().includes(termino) ||
          ot.datosGPS?.imeiIn?.toLowerCase().includes(termino) ||
          ot.datosGPS?.imeiOut?.toLowerCase().includes(termino)
        );
      });
    }

    setOtsFiltradas(filtradas);
  };

  return {
    otsFiltradas,
    busqueda,
    setBusqueda,
    empresaFiltro,
    setEmpresaFiltro
  };
};