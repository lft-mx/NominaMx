// ============================================================
// MÓDULO PRINCIPAL DE NÓMINA
// Integra todos los cálculos
// ============================================================

const CalculadoraNomina = {
  calcularBrutoANeto(datos) {
    const {
      sueldoPeriodo,
      tipoPeriodo,
      bonos = 0,
      infonavit = 0,
      valesDespensa = 0,
      fondoAhorro = 0,
      sbcDiario
    } = datos;
    
    const periodo = CONFIG.periodos[tipoPeriodo];
    const diasTrabajados = periodo.dias;
    
    // 1. Percepciones
    const percepciones = CalculadorPercepciones.calcular({
      sueldoPeriodo,
      bonos,
      valesDespensa,
      fondoAhorroEmpleado: fondoAhorro
    });
    
    // 2. ISR
    const isrResult = CalculadorISR.calcular(percepciones.gravado, tipoPeriodo);
    
    // 3. IMSS
    const imss = CalculadorIMSS.calcular(sbcDiario, diasTrabajados);
    
    // 4. Deducciones totales
    const deducciones = isrResult.isrPeriodo + imss + infonavit + fondoAhorro;
    
    // 5. Neto
    const neto = percepciones.total - deducciones;
    
    // 6. Método directo para comparación
    const isrDirecto = CalculadorISR.calcularDirecto(percepciones.gravado, tipoPeriodo);
    
    return {
      percepciones,
      isr: isrResult,
      imss,
      infonavit,
      fondoAhorro,
      deducciones,
      neto: Math.round(neto * 100) / 100,
      comparacionISR: {
        metodoReal: isrResult.isrPeriodo,
        metodoDirecto: isrDirecto,
        diferencia: Math.abs(isrResult.isrPeriodo - isrDirecto)
      }
    };
  },
  
  calcularNetoABruto(netoDeposito, tipoPeriodo, sbcDiario) {
    // Estimación inversa simplificada
    const periodo = CONFIG.periodos[tipoPeriodo];
    const factorEstimado = 0.85; // Aproximación
    const estimadoBruto = netoDeposito / factorEstimado;
    const imssEstimado = CalculadorIMSS.calcular(sbcDiario, periodo.dias);
    const isrEstimado = estimadoBruto * 0.10;
    
    return {
      brutoEstimado: Math.round(estimadoBruto * 100) / 100,
      isrEstimado: Math.round(isrEstimado * 100) / 100,
      imssEstimado,
      neto: netoDeposito
    };
  }
};
