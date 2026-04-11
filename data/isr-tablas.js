// ============================================================
// TABLAS ISR 2026 - SAT (Mensual)
// Fuente: Anexo 8 de la Resolución Miscelánea Fiscal 2026
// ============================================================

const ISR_TABLAS_MENSUAL = {
  limiteInferior: [0.01, 746.05, 6332.06, 11128.02, 12935.83, 15487.72, 31283.72, 61234.80, 109474.12, 163027.37, 435000.01],
  cuotaFija: [0.00, 0.00, 839.46, 1765.62, 2192.18, 2819.44, 6891.61, 15090.66, 30865.86, 53125.18, 157964.18],
  porcentaje: [0.0192, 0.0640, 0.1088, 0.1600, 0.1792, 0.2136, 0.2352, 0.3000, 0.3200, 0.3400, 0.3500],
  limiteSuperior: [746.04, 6332.05, 11128.01, 12935.82, 15487.71, 31283.71, 61234.79, 109474.11, 163027.36, 435000.00, Infinity]
};

// Tablas derivadas para quincenal
const ISR_TABLAS_QUINCENAL = {
  limiteInferior: ISR_TABLAS_MENSUAL.limiteInferior.map(v => v / 2),
  cuotaFija: ISR_TABLAS_MENSUAL.cuotaFija.map(v => v / 2),
  porcentaje: [...ISR_TABLAS_MENSUAL.porcentaje],
  limiteSuperior: ISR_TABLAS_MENSUAL.limiteSuperior.map(v => v / 2)
};

// Tablas derivadas para semanal
const ISR_TABLAS_SEMANAL = {
  limiteInferior: ISR_TABLAS_MENSUAL.limiteInferior.map(v => v / 4.33),
  cuotaFija: ISR_TABLAS_MENSUAL.cuotaFija.map(v => v / 4.33),
  porcentaje: [...ISR_TABLAS_MENSUAL.porcentaje],
  limiteSuperior: ISR_TABLAS_MENSUAL.limiteSuperior.map(v => v / 4.33)
};
