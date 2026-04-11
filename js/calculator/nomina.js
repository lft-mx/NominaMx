const CalculadoraNomina = {
  calcularBrutoANeto(datos) {
    const { sueldoPeriodo, tipoPeriodo, bonos = 0, domingosTrabajados = 0, infonavit = 0, valesDespensa = 0, fondoAhorro = 0, sbcManual = null } = datos;
    const periodo = CONFIG.periodos[tipoPeriodo];
    const dias = periodo.dias;
    const percepciones = CalculadorPercepciones.calcular({ sueldoPeriodo, diasPeriodo: dias, bonos, domingosTrabajados, valesDespensa, fondoAhorroEmpleado: fondoAhorro });
    const sbcDiario = CalculadorIMSS.calcularSBC(sueldoPeriodo, dias, bonos, percepciones.detalle.primaDominical, sbcManual);
    const imss = CalculadorIMSS.calcular(sbcDiario, dias);
    const isr = CalculadorISR.calcular(percepciones.gravado, tipoPeriodo);
    const deducciones = isr.isrPeriodo + imss + infonavit + fondoAhorro;
    const neto = percepciones.total - deducciones;
    const isrDirecto = CalculadorISR.calcularDirecto(percepciones.gravado, tipoPeriodo);
    return {
      percepciones, sbc: { diario: sbcDiario, manual: !!sbcManual, explicacion: CalculadorIMSS.explicacion() },
      isr, imss, infonavit, fondoAhorro, deducciones, neto: Math.round(neto * 100) / 100,
      comparacionISR: { metodoReal: isr.isrPeriodo, metodoDirecto: isrDirecto, diferencia: Math.abs(isr.isrPeriodo - isrDirecto) }
    };
  },
  calcularNetoABruto(netoDeposito, tipoPeriodo, sbcDiario) {
    const periodo = CONFIG.periodos[tipoPeriodo];
    let brutoEstimado = netoDeposito;
    let isrEstimado = 0, imssEstimado = 0, netoCalc = 0;
    for (let i = 0; i < 15; i++) {
      isrEstimado = CalculadorISR.calcular(brutoEstimado, tipoPeriodo).isrPeriodo;
      imssEstimado = CalculadorIMSS.calcular(sbcDiario, periodo.dias);
      netoCalc = brutoEstimado - isrEstimado - imssEstimado;
      const error = netoDeposito - netoCalc;
      if (Math.abs(error) < 1) break;
      brutoEstimado += error * 0.85;
    }
    return { brutoEstimado: Math.round(brutoEstimado), isrEstimado: Math.round(isrEstimado), imssEstimado, neto: netoDeposito };
  }
};
