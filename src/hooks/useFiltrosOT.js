// src/hooks/useFiltrosOT.js
import { useState, useMemo } from 'react';

export const useFiltrosOT = (ots) => {
  const [busqueda, setBusqueda] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('todas');

  // Usar useMemo en lugar de useEffect para evitar ciclos infinitos
  const otsFiltradas = useMemo(() => {
    let filtradas = [...ots];

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

    return filtradas;
  }, [ots, busqueda, empresaFiltro]); // Dependencias claras

  return {
    otsFiltradas,
    busqueda,
    setBusqueda,
    empresaFiltro,
    setEmpresaFiltro
  };
};