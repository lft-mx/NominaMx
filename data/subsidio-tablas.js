// ============================================================
// TABLAS DE SUBSIDIO PARA EL EMPLEO 2026 - SAT
// ============================================================

const SUBSIDIO_TABLAS_MENSUAL = {
  limiteInferior: [0.01, 1765.63, 2650.44, 3481.77, 4352.66, 5076.25, 5942.39, 7251.25, 9182.79, 11045.63, 13531.46, 16254.29, 19514.19, 23437.96, 29172.56, 33425.55, 38037.00, 40000.00],
  subsidioMensual: [407.02, 406.83, 406.35, 405.78, 405.02, 404.07, 402.92, 401.46, 399.45, 396.84, 393.00, 387.73, 380.67, 371.20, 358.85, 346.42, 331.19, 0.00],
  limiteSuperior: [1765.62, 2650.43, 3481.76, 4352.65, 5076.24, 5942.38, 7251.24, 9182.78, 11045.62, 13531.45, 16254.28, 19514.18, 23437.95, 29172.55, 33425.54, 38036.99, 39999.99, Infinity]
};

// Tabla quincenal derivada
const SUBSIDIO_TABLAS_QUINCENAL = {
  limiteInferior: SUBSIDIO_TABLAS_MENSUAL.limiteInferior.map(v => v / 2),
  subsidioPeriodo: SUBSIDIO_TABLAS_MENSUAL.subsidioMensual.map(v => v / 2),
  limiteSuperior: SUBSIDIO_TABLAS_MENSUAL.limiteSuperior.map(v => v / 2)
};
