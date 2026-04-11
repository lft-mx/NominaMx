const CalculadorIMSS = {
  calcularSBC(sueldoPeriodo, diasPeriodo, bonos = 0, primaDominical = 0, sbcManual = null) {
    if (sbcManual !== null && sbcManual > 0) return sbcManual;
    const totalGravado = sueldoPeriodo + bonos + primaDominical;
    let sbc = totalGravado / diasPeriodo;
    sbc = Math.round(sbc * 100) / 100;
    return Math.max(sbc, CONFIG.imss.salarioMinimo);
  },
  calcular(sbcDiario, diasTrabajados) {
    const topeMaximo = CONFIG.imss.umaDiaria * CONFIG.imss.topeUma;
    const sbcAjustado = Math.min(sbcDiario, topeMaximo);
    const monto = sbcAjustado * diasTrabajados * CONFIG.imss.porcentajeEmpleado;
    return Math.round(monto * 100) / 100;
  },
  explicacion() {
    return "El SBC es el promedio diario de tus percepciones gravables (sueldo + bonos + prima dominical). Si no lo sabes, lo calculamos automáticamente.";
  }
};
