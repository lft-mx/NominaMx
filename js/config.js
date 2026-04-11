// ============================================================
// CONFIGURACIÓN GLOBAL
// ============================================================

const CONFIG = {
  version: '2.0.0',
  anioFiscal: 2026,
  
  // Topes IMSS
  imss: {
    porcentajeEmpleado: 0.01025, // 0.40% + 0.625% = 1.025%
    salarioMinimo: 278.80,
    umaDiaria: 108.40
  },
  
  // Períodos
  periodos: {
    mensual: { dias: 30, factorMensual: 1, factorPeriodo: 1 },
    quincenal: { dias: 15, factorMensual: 2, factorPeriodo: 0.5 },
    semanal: { dias: 7, factorMensual: 4.33, factorPeriodo: 0.2309 }
  },
  
  // Límites exención vales de despensa
  valesDespensa: {
    limiteMensualExento: 975.60  // 30% UMA diaria * 30
  }
};
