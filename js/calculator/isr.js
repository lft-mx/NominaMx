const CalculadorISR = {
  calcular(ingresoGravadoPeriodo, tipoPeriodo) {
    const factor = CONFIG.periodos[tipoPeriodo];
    const ingresoMensual = ingresoGravadoPeriodo * factor.factorMensual;
    
    // ISR bruto mensual con tabla oficial
    let isrBrutoMensual = 0;
    for (let i = 0; i < ISR_TABLAS_MENSUAL.limiteSuperior.length; i++) {
      if (ingresoMensual <= ISR_TABLAS_MENSUAL.limiteSuperior[i]) {
        const excedente = ingresoMensual - ISR_TABLAS_MENSUAL.limiteInferior[i];
        isrBrutoMensual = ISR_TABLAS_MENSUAL.cuotaFija[i] + (excedente * ISR_TABLAS_MENSUAL.porcentaje[i]);
        break;
      }
    }
    isrBrutoMensual = Math.round(isrBrutoMensual * 100) / 100;
    
    // Subsidio fijo mensual (solo si ingreso mensual <= límite)
    let subsidioMensual = 0;
    if (ingresoMensual <= CONFIG.limiteIngresoSubsidio) {
      subsidioMensual = CONFIG.subsidioMensualMaximo;
    }
    // El subsidio no puede ser mayor que el ISR bruto
    subsidioMensual = Math.min(subsidioMensual, isrBrutoMensual);
    
    const isrNetoMensual = Math.max(0, isrBrutoMensual - subsidioMensual);
    const isrPeriodo = Math.round(isrNetoMensual * factor.factorPeriodo * 100) / 100;
    
    return {
      ingresoPeriodo: ingresoGravadoPeriodo,
      ingresoMensual,
      isrBrutoMensual,
      subsidioMensual,
      isrNetoMensual,
      isrPeriodo,
      porcentajeImpuesto: (isrPeriodo / ingresoGravadoPeriodo) * 100
    };
  },
  
  calcularDirecto(ingresoPeriodo, tipoPeriodo) {
    let tabla;
    if (tipoPeriodo === 'mensual') tabla = ISR_TABLAS_MENSUAL;
    else {
      const factor = CONFIG.periodos[tipoPeriodo];
      tabla = {
        limiteInferior: ISR_TABLAS_MENSUAL.limiteInferior.map(v => v * factor.factorPeriodo),
        cuotaFija: ISR_TABLAS_MENSUAL.cuotaFija.map(v => v * factor.factorPeriodo),
        porcentaje: ISR_TABLAS_MENSUAL.porcentaje,
        limiteSuperior: ISR_TABLAS_MENSUAL.limiteSuperior.map(v => v * factor.factorPeriodo)
      };
    }
    for (let i = 0; i < tabla.limiteSuperior.length; i++) {
      if (ingresoPeriodo <= tabla.limiteSuperior[i]) {
        const excedente = ingresoPeriodo - tabla.limiteInferior[i];
        return Math.round((tabla.cuotaFija[i] + (excedente * tabla.porcentaje[i])) * 100) / 100;
      }
    }
    return 0;
  }
};
