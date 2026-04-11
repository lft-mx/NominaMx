// ============================================================
// MÓDULO PERCEPCIONES (con prima dominical)
// ============================================================

const CalculadorPercepciones = {
  /**
   * @param {Object} datos
   * @param {number} datos.sueldoPeriodo - Sueldo base del periodo
   * @param {number} datos.diasPeriodo - Días del periodo (15, 30, 7)
   * @param {number} datos.bonos - Bonos/comisiones
   * @param {number} datos.domingosTrabajados - Número de domingos trabajados en el periodo
   * @param {number} datos.valesDespensa - Monto de vales (exento)
   * @param {number} datos.fondoAhorroEmpleado - Aportación empleado (exento)
   */
  calcular({
    sueldoPeriodo,
    diasPeriodo,
    bonos = 0,
    domingosTrabajados = 0,
    valesDespensa = 0,
    fondoAhorroEmpleado = 0
  }) {
    // Salario diario
    const salarioDiario = sueldoPeriodo / diasPeriodo;
    
    // Prima dominical: 25% del salario diario por cada domingo
    const primaDominical = salarioDiario * 0.25 * domingosTrabajados;
    
    // Percepciones gravadas: sueldo + bonos + prima dominical
    const gravado = sueldoPeriodo + bonos + primaDominical;
    
    // Exentas: vales de despensa (hasta límite mensual) y fondo de ahorro
    const valesExentos = Math.min(valesDespensa, CONFIG.valesDespensa.limiteMensualExento);
    const exento = valesExentos + fondoAhorroEmpleado;
    
    return {
      gravado,
      exento,
      total: gravado + exento,
      detalle: {
        sueldo: sueldoPeriodo,
        bonos,
        primaDominical,
        vales: { total: valesDespensa, exento: valesExentos, gravado: 0 },
        fondoAhorro: { total: fondoAhorroEmpleado, exento: fondoAhorroEmpleado, gravado: 0 }
      }
    };
  }
};
