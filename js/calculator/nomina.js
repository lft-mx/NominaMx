// ============================================================
// MÓDULO PRINCIPAL DE NÓMINA (con prima dominical y SBC auto)
// ============================================================

const CalculadoraNomina = {
  calcularBrutoANeto(datos) {
    const {
      sueldoPeriodo,
      tipoPeriodo,
      bonos = 0,
      domingosTrabajados = 0,
      infonavit = 0,
      valesDespensa = 0,
      fondoAhorro = 0,
      sbcManual = null   // Si el usuario ingresa un valor manual
    } = datos;
    
    const periodo = CONFIG.periodos[tipoPeriodo];
    const diasPeriodo = periodo.dias;
    
    // Calcular percepciones (incluye prima dominical)
    const percepciones = CalculadorPercepciones.calcular({
      sueldoPeriodo,
      diasPeriodo,
      bonos,
      domingosTrabajados,
      valesDespensa,
      fondoAhorroEmpleado: fondoAhorro
    });
    
    // Calcular SBC automático o manual
    const sbcDiario = CalculadorIMSS.calcularSBC(
      sueldoPeriodo,
      diasPeriodo,
      bonos,
      percepciones.detalle.primaDominical,
      sbcManual
    );
    
    // ISR
    const isrResult = CalculadorISR.calcular(percepciones.gravado, tipoPeriodo);
    
    // IMSS
    const imss = CalculadorIMSS.calcular(sbcDiario, diasPeriodo);
    
    // Deducciones totales
    const deducciones = isrResult.isrPeriodo + imss + infonavit + fondoAhorro;
    
    // Neto
    const neto = percepciones.total - deducciones;
    
    // ISR directo para comparación
    const isrDirecto = CalculadorISR.calcularDirecto(percepciones.gravado, tipoPeriodo);
    
    return {
      percepciones,
      sbc: {
        diario: sbcDiario,
        manual: sbcManual !== null,
        explicacion: CalculadorIMSS.explicacionSBC()
      },
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
    const periodo = CONFIG.periodos[tipoPeriodo];
    let brutoEstimado = netoDeposito;
    let isrEstimado = 0;
    let imssEstimado = 0;
    let netoCalc = 0;
    let iter = 0;
    while (Math.abs(netoCalc - netoDeposito) > 1 && iter < 10) {
      isrEstimado = CalculadorISR.calcular(brutoEstimado, tipoPeriodo).isrPeriodo;
      imssEstimado = CalculadorIMSS.calcular(sbcDiario, periodo.dias);
      netoCalc = brutoEstimado - isrEstimado - imssEstimado;
      const error = netoDeposito - netoCalc;
      brutoEstimado += error * 0.9;
      iter++;
    }
    return {
      brutoEstimado: Math.round(brutoEstimado * 100) / 100,
      isrEstimado: Math.round(isrEstimado * 100) / 100,
      imssEstimado,
      neto: netoDeposito
    };
  }
};
