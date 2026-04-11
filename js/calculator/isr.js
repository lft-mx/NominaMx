// ============================================================
// MÓDULO ISR + SUBSIDIO FIJO 2026
// ============================================================

const SUBSIDIO_MENSUAL_MAXIMO = 535.65;    // 15.02% de UMA mensual 2026
const LIMITE_INGRESO_SUBSIDIO = 11492.66;  // Límite para recibir subsidio

const CalculadorISR = {
  /**
   * Calcula el ISR neto con subsidio fijo.
   */
  calcular(ingresoGravadoPeriodo, tipoPeriodo) {
    const factores = {
      mensual: { aMensual: 1, aPeriodo: 1 },
      quincenal: { aMensual: 2, aPeriodo: 0.5 },
      semanal: { aMensual: 4.33, aPeriodo: 0.2309 }
    };
    const factor = factores[tipoPeriodo] || factores.quincenal;
    
    // Ingreso mensual
    const ingresoMensual = ingresoGravadoPeriodo * factor.aMensual;
    
    // ISR bruto mensual (sin subsidio)
    let isrBrutoMensual = 0;
    for (let i = 0; i < ISR_TABLAS_MENSUAL.limiteSuperior.length; i++) {
      if (ingresoMensual <= ISR_TABLAS_MENSUAL.limiteSuperior[i]) {
        const excedente = ingresoMensual - ISR_TABLAS_MENSUAL.limiteInferior[i];
        isrBrutoMensual = ISR_TABLAS_MENSUAL.cuotaFija[i] + (excedente * ISR_TABLAS_MENSUAL.porcentaje[i]);
        break;
      }
    }
    isrBrutoMensual = Math.round(isrBrutoMensual * 100) / 100;
    
    // Subsidio mensual (fijo si ingreso <= límite)
    let subsidioMensual = 0;
    if (ingresoMensual <= LIMITE_INGRESO_SUBSIDIO) {
      subsidioMensual = SUBSIDIO_MENSUAL_MAXIMO;
    }
    subsidioMensual = Math.min(subsidioMensual, isrBrutoMensual); // No puede ser mayor que el ISR
    
    // ISR neto mensual
    let isrNetoMensual = isrBrutoMensual - subsidioMensual;
    if (isrNetoMensual < 0) isrNetoMensual = 0;
    isrNetoMensual = Math.round(isrNetoMensual * 100) / 100;
    
    // Convertir a periodo
    const isrPeriodo = Math.round(isrNetoMensual * factor.aPeriodo * 100) / 100;
    
    return {
      ingresoPeriodo: ingresoGravadoPeriodo,
      ingresoMensual,
      isrBrutoMensual,
      subsidioMensual,
      isrNetoMensual,
      isrPeriodo,
      metodo: "Subsidio fijo 2026 (15.02% UMA)"
    };
  },
  
  /**
   * Método directo (tabla del periodo, sin subsidio) para comparación.
   */
  calcularDirecto(ingresoPeriodo, tipoPeriodo) {
    let tabla;
    if (tipoPeriodo === 'mensual') tabla = ISR_TABLAS_MENSUAL;
    else if (tipoPeriodo === 'quincenal') tabla = ISR_TABLAS_QUINCENAL;
    else tabla = ISR_TABLAS_SEMANAL;
    
    for (let i = 0; i < tabla.limiteSuperior.length; i++) {
      if (ingresoPeriodo <= tabla.limiteSuperior[i]) {
        const excedente = ingresoPeriodo - tabla.limiteInferior[i];
        return Math.round((tabla.cuotaFija[i] + (excedente * tabla.porcentaje[i])) * 100) / 100;
      }
    }
    return 0;
  }
};
