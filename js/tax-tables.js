// ========================================
// TABLAS ISR 2026 Y SUBSIDIO AL EMPLEO
// Basado en tablas oficiales del SAT
// Fuente: https://www.sat.gob.mx
// ========================================

// Tabla ISR 2026 (Límites inferiores, superiores, cuota fija y % excedente)
const ISR_TABLE_2026 = [
    { limiteInferior: 0.01, limiteSuperior: 8952.49, cuotaFija: 0.00, porcentajeExcedente: 1.92 },
    { limiteInferior: 8952.50, limiteSuperior: 11835.49, cuotaFija: 171.88, porcentajeExcedente: 6.40 },
    { limiteInferior: 11835.50, limiteSuperior: 15522.99, cuotaFija: 356.07, porcentajeExcedente: 10.88 },
    { limiteInferior: 15523.00, limiteSuperior: 19306.99, cuotaFija: 757.00, porcentajeExcedente: 16.00 },
    { limiteInferior: 19307.00, limiteSuperior: 24786.99, cuotaFija: 1362.49, porcentajeExcedente: 17.92 },
    { limiteInferior: 24787.00, limiteSuperior: 35085.49, cuotaFija: 2344.49, porcentajeExcedente: 21.36 },
    { limiteInferior: 35085.50, limiteSuperior: 49295.99, cuotaFija: 4544.49, porcentajeExcedente: 23.52 },
    { limiteInferior: 49296.00, limiteSuperior: 80855.99, cuotaFija: 8902.49, porcentajeExcedente: 30.00 },
    { limiteInferior: 80856.00, limiteSuperior: 127463.99, cuotaFija: 18470.49, porcentajeExcedente: 32.00 },
    { limiteInferior: 127464.00, limiteSuperior: 250000.00, cuotaFija: 33389.49, porcentajeExcedente: 34.00 },
    { limiteInferior: 250000.01, limiteSuperior: Infinity, cuotaFija: 75949.49, porcentajeExcedente: 35.00 }
];

// Tabla de Subsidio al Empleo 2026 (Mensual)
// Crédito que reduce el ISR a pagar para ingresos bajos-medios
const SUBSIDIO_EMPLEO_TABLE = [
    { limiteInferior: 0.01, limiteSuperior: 8952.49, subsidio: 407.02 },
    { limiteInferior: 8952.50, limiteSuperior: 11835.49, subsidio: 285.50 },
    { limiteInferior: 11835.50, limiteSuperior: 15522.99, subsidio: 183.78 },
    { limiteInferior: 15523.00, limiteSuperior: 19306.99, subsidio: 95.23 },
    { limiteInferior: 19307.00, limiteSuperior: Infinity, subsidio: 0.00 }
];

// Valores UMA 2026 (Unidad de Medida y Actualización)
const UMA_2026 = {
    diaria: 113.14,      // Valor diario UMA 2026
    mensual: 3441.06,    // 30.4 días aproximadamente
    anual: 41292.72
};

// Salario mínimo general 2026
const SALARIO_MINIMO_2026 = {
    general: 278.80,     // Zona general (diario)
    frontera: 419.89     // Zona libre de la frontera norte
};

/**
 * Calcula el ISR mensual según tabla SAT
 * @param {number} ingresoMensual - Ingreso gravable mensual
 * @returns {number} - ISR a pagar
 */
function calcularISR(ingresoMensual) {
    if (ingresoMensual <= 0) return 0;
    
    // Buscar el rango correspondiente
    const rango = ISR_TABLE_2026.find(r => 
        ingresoMensual >= r.limiteInferior && ingresoMensual <= r.limiteSuperior
    );
    
    if (!rango) return 0;
    
    const excedente = ingresoMensual - rango.limiteInferior;
    const isr = rango.cuotaFija + (excedente * (rango.porcentajeExcedente / 100));
    
    return Math.max(0, isr);
}

/**
 * Calcula el Subsidio al Empleo aplicable
 * @param {number} ingresoMensual - Ingreso mensual
 * @returns {number} - Subsidio al empleo
 */
function calcularSubsidioEmpleo(ingresoMensual) {
    const rango = SUBSIDIO_EMPLEO_TABLE.find(r => 
        ingresoMensual >= r.limiteInferior && ingresoMensual <= r.limiteSuperior
    );
    return rango ? rango.subsidio : 0;
}

/**
 * Calcula el ISR neto después del subsidio
 * @param {number} ingresoMensual - Ingreso mensual
 * @returns {number} - ISR neto a pagar (ISR - subsidio)
 */
function calcularISRNeto(ingresoMensual) {
    const isr = calcularISR(ingresoMensual);
    const subsidio = calcularSubsidioEmpleo(ingresoMensual);
    return Math.max(0, isr - subsidio);
}

/**
 * Obtiene el valor de UMA según periodicidad
 * @param {string} periodo - 'diario', 'mensual', 'anual'
 * @returns {number}
 */
function getUMA(periodo = 'diario') {
    return UMA_2026[periodo] || UMA_2026.diaria;
}

/**
 * Obtiene el salario mínimo según zona
 * @param {string} zona - 'general' o 'frontera'
 * @returns {number}
 */
function getSalarioMinimo(zona = 'general') {
    return SALARIO_MINIMO_2026[zona] || SALARIO_MINIMO_2026.general;
}