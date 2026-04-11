// ============================================================
// MÓDULO IMSS (con cálculo automático de SBC)
// ============================================================

const CalculadorIMSS = {
  /**
   * Calcula el SBC diario automáticamente si no se proporciona manualmente.
   * @param {number} sueldoPeriodo - Sueldo base del periodo
   * @param {number} diasPeriodo - Días del periodo
   * @param {number} bonos - Bonos/comisiones del periodo
   * @param {number} primaDominical - Monto de prima dominical en el periodo
   * @param {number} sbcManual - Valor manual si el usuario lo conoce (opcional)
   * @returns {number} SBC diario
   */
  calcularSBC(sueldoPeriodo, diasPeriodo, bonos = 0, primaDominical = 0, sbcManual = null) {
    if (sbcManual !== null && sbcManual > 0) {
      return sbcManual;
    }
    // Automático: (sueldo + bonos + prima dominical) / días del periodo
    const totalGravadoPeriodo = sueldoPeriodo + bonos + primaDominical;
    let sbc = totalGravadoPeriodo / diasPeriodo;
    // Redondear a 2 decimales
    sbc = Math.round(sbc * 100) / 100;
    // No puede ser menor al salario mínimo diario
    const salarioMinimo = CONFIG.imss.salarioMinimo;
    return Math.max(sbc, salarioMinimo);
  },
  
  /**
   * Calcula el descuento IMSS para el empleado.
   * @param {number} sbcDiario - Salario Base de Cotización diario
   * @param {number} diasTrabajados - Días del periodo
   */
  calcular(sbcDiario, diasTrabajados) {
    const topeMaximo = CONFIG.imss.umaDiaria * 25;
    const sbcAjustado = Math.min(sbcDiario, topeMaximo);
    const monto = sbcAjustado * diasTrabajados * CONFIG.imss.porcentajeEmpleado;
    return Math.round(monto * 100) / 100;
  },
  
  /**
   * Explicación del SBC para mostrar al usuario.
   */
  explicacionSBC() {
    return "El Salario Base de Cotización (SBC) es el promedio diario de tus percepciones gravables (sueldo, bonos, prima dominical, etc.) de los últimos 6 meses. Si no lo conoces, la calculadora lo estima automáticamente como (sueldo + bonos + prima dominical) / días del periodo.";
  }
};
