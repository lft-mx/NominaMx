const CalculadorPercepciones = {
  calcular({ sueldoPeriodo, diasPeriodo, bonos = 0, domingosTrabajados = 0, valesDespensa = 0, fondoAhorroEmpleado = 0 }) {
    const salarioDiario = sueldoPeriodo / diasPeriodo;
    const primaDominical = salarioDiario * CONFIG.primaDominicalPorcentaje * domingosTrabajados;
    const gravado = sueldoPeriodo + bonos + primaDominical;
    const valesExentos = Math.min(valesDespensa, CONFIG.valesDespensa.limiteMensualExento);
    const exento = valesExentos + fondoAhorroEmpleado;
    return {
      gravado,
      exento,
      total: gravado + exento,
      detalle: { sueldo: sueldoPeriodo, bonos, primaDominical, vales: { total: valesDespensa, exento: valesExentos }, fondoAhorro: fondoAhorroEmpleado }
    };
  }
};
