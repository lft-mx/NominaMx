// ============================================================
// MÓDULO PERCEPCIONES
// Maneja sueldos, bonos, vales de despensa (exentos), fondo de ahorro
// ============================================================

const CalculadorPercepciones = {
  calcular({
    sueldoPeriodo,
    bonos = 0,
    valesDespensa = 0,
    fondoAhorroEmpleado = 0
  }) {
    // Los vales de despensa tienen un límite exento mensual
    const valesExentos = Math.min(valesDespensa, CONFIG.valesDespensa.limiteMensualExento);
    const valesGravados = Math.max(0, valesDespensa - valesExentos);
    
    // Fondo de ahorro: generalmente exento hasta 13% del salario anual
    // Simplificado: consideramos exento si no excede cierto límite
    const fondoAhorroExento = fondoAhorroEmpleado;
    
    const totalGravado = sueldoPeriodo + bonos + valesGravados;
    const totalExento = valesExentos + fondoAhorroExento;
    
    return {
      gravado: totalGravado,
      exento: totalExento,
      total: totalGravado + totalExento,
      detalle: {
        sueldo: sueldoPeriodo,
        bonos,
        vales: { total: valesDespensa, exento: valesExentos, gravado: valesGravados },
        fondoAhorro: { total: fondoAhorroEmpleado, exento: fondoAhorroExento, gravado: 0 }
      }
    };
  }
};
