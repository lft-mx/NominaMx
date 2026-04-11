// ============================================================
// MÓDULO ISR + SUBSIDIO
// Regla: Se calcula sobre ingreso mensual, luego se divide
// ============================================================

const CalculadorISR = {
  // Calcular ISR neto (ya con subsidio) para un periodo
  calcular(ingresoPeriodo, tipoPeriodo) {
    const periodo = CONFIG.periodos[tipoPeriodo];
    if (!periodo) return 0;
    
    const ingresoMensual = ingresoPeriodo * periodo.factorMensual;
    
    // Calcular ISR mensual bruto
    let isrMensual = 0;
    for (let i = 0; i < ISR_TABLAS_MENSUAL.limiteSuperior.length; i++) {
      if (ingresoMensual <= ISR_TABLAS_MENSUAL.limiteSuperior[i]) {
        const excedente = ingresoMensual - ISR_TABLAS_MENSUAL.limiteInferior[i];
        isrMensual = ISR_TABLAS_MENSUAL.cuotaFija[i] + (excedente * ISR_TABLAS_MENSUAL.porcentaje[i]);
        break;
      }
    }
    
    // Calcular subsidio mensual
    let subsidioMensual = 0;
    for (let i = 0; i < SUBSIDIO_TABLAS_MENSUAL.limiteSuperior.length; i++) {
      if (ingresoMensual <= SUBSIDIO_TABLAS_MENSUAL.limiteSuperior[i]) {
        subsidioMensual = SUBSIDIO_TABLAS_MENSUAL.subsidioMensual[i];
        break;
      }
    }
    
    const isrNetoMensual = Math.max(0, isrMensual - subsidioMensual);
    const isrPeriodo = isrNetoMensual * periodo.factorPeriodo;
    
    return {
      ingresoPeriodo,
      ingresoMensual,
      isrBrutoMensual: isrMensual,
      subsidioMensual,
      isrNetoMensual,
      isrPeriodo: Math.round(isrPeriodo * 100) / 100,
      metodo: "Mensual + subsidio (más común)"
    };
  },
  
  // Método directo con tabla quincenal (para comparación)
  calcularDirecto(ingresoPeriodo, tipoPeriodo) {
    let tablas;
    if (tipoPeriodo === 'mensual') tablas = ISR_TABLAS_MENSUAL;
    else if (tipoPeriodo === 'quincenal') tablas = ISR_TABLAS_QUINCENAL;
    else tablas = ISR_TABLAS_SEMANAL;
    
    for (let i = 0; i < tablas.limiteSuperior.length; i++) {
      if (ingresoPeriodo <= tablas.limiteSuperior[i]) {
        const excedente = ingresoPeriodo - tablas.limiteInferior[i];
        return Math.round((tablas.cuotaFija[i] + (excedente * tablas.porcentaje[i])) * 100) / 100;
      }
    }
    return 0;
  }
};
