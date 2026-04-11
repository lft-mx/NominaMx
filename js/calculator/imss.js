// ============================================================
// MÓDULO IMSS
// ============================================================

const CalculadorIMSS = {
  // Calcular descuento IMSS para el empleado
  calcular(sbcDiario, diasTrabajados) {
    const sbcAjustado = Math.min(sbcDiario, CONFIG.imss.umaDiaria * 25); // Tope 25 UMAS
    const monto = sbcAjustado * diasTrabajados * CONFIG.imss.porcentajeEmpleado;
    return Math.round(monto * 100) / 100;
  }
};
