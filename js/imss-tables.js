// ========================================
// TABLAS IMSS 2026 (Cuotas obrero-patronales)
// Basado en Ley del Seguro Social y Reforma 2020-2030
// Fuentes: IMSS, DOF
// ========================================

// Tabla de cuotas patronales para Cesantía en Edad Avanzada y Vejez (CEAV) 2026
const CEAV_PATRONAL_TABLE_2026 = [
    { limiteInferior: 0, limiteSuperior: 1.00, tipo: 'SM', porcentaje: 3.150 },
    { limiteInferior: 1.01, limiteSuperior: 1.50, tipo: 'UMA', porcentaje: 3.676 },
    { limiteInferior: 1.51, limiteSuperior: 2.00, tipo: 'UMA', porcentaje: 4.851 },
    { limiteInferior: 2.01, limiteSuperior: 2.50, tipo: 'UMA', porcentaje: 5.556 },
    { limiteInferior: 2.51, limiteSuperior: 3.00, tipo: 'UMA', porcentaje: 6.026 },
    { limiteInferior: 3.01, limiteSuperior: 3.50, tipo: 'UMA', porcentaje: 6.361 },
    { limiteInferior: 3.51, limiteSuperior: 4.00, tipo: 'UMA', porcentaje: 6.613 },
    { limiteInferior: 4.01, limiteSuperior: Infinity, tipo: 'UMA', porcentaje: 7.513 }
];

// Cuotas fijas del IMSS (Enfermedades y Maternidad)
const CUOTA_FIJA_IMSS = {
    patron: 20.40,      // % sobre UMA (diario)
    trabajador: 0.00
};

// Cuotas adicionales para SBC > 3 UMA
const CUOTA_ADICIONAL_IMSS = {
    patron: 1.10,
    trabajador: 0.40
};

// Invalidez y Vida
const INVALIDEZ_VIDA = {
    patron: 1.75,
    trabajador: 0.625
};

// Retiro
const RETIRO = {
    patron: 2.00,
    trabajador: 0.00
};

// Guarderías y Prestaciones Sociales
const GUARDERIAS = {
    patron: 1.00,
    trabajador: 0.00
};

// INFONAVIT
const INFONAVIT_APORTACION = {
    patron: 5.00,
    trabajador: 0.00
};

// Riesgos de Trabajo (prima media Clase I)
const RIESGO_TRABAJO = {
    porcentajeBase: 0.54355
};

function getRangoCEAV(salarioDiario) {
    const umaDiaria = getUMA('diario');
    const smDiario = getSalarioMinimo('general');
    const vecesUMA = salarioDiario / umaDiaria;
    
    for (const rango of CEAV_PATRONAL_TABLE_2026) {
        if (vecesUMA >= rango.limiteInferior && vecesUMA <= rango.limiteSuperior) {
            return rango;
        }
    }
    return CEAV_PATRONAL_TABLE_2026[CEAV_PATRONAL_TABLE_2026.length - 1];
}

function calcularCuotaPatronalCV(salarioDiario) {
    const rango = getRangoCEAV(salarioDiario);
    return rango.porcentaje;
}

function calcularCuotaObreraCV() {
    return 1.125;
}

function calcularCuotasIMSS_Trabajador(salarioDiario) {
    const umaDiaria = getUMA('diario');
    const tresUMA = umaDiaria * 3;
    
    let cuotaAdicional = 0;
    if (salarioDiario > tresUMA) {
        const excedente = salarioDiario - tresUMA;
        cuotaAdicional = excedente * (CUOTA_ADICIONAL_IMSS.trabajador / 100);
    }
    
    const invalidezVida = salarioDiario * (INVALIDEZ_VIDA.trabajador / 100);
    const ceav = salarioDiario * (calcularCuotaObreraCV() / 100);
    const totalDiario = cuotaAdicional + invalidezVida + ceav;
    
    return {
        cuotaAdicional,
        invalidezVida,
        ceav,
        totalDiario,
        totalMensual: totalDiario * 30.4
    };
}

function calcularCuotasIMSS_Patron(salarioDiario) {
    const umaDiaria = getUMA('diario');
    const tresUMA = umaDiaria * 3;
    
    const cuotaFija = umaDiaria * (CUOTA_FIJA_IMSS.patron / 100);
    
    let cuotaAdicional = 0;
    if (salarioDiario > tresUMA) {
        const excedente = salarioDiario - tresUMA;
        cuotaAdicional = excedente * (CUOTA_ADICIONAL_IMSS.patron / 100);
    }
    
    const invalidezVida = salarioDiario * (INVALIDEZ_VIDA.patron / 100);
    const porcentajeCV = calcularCuotaPatronalCV(salarioDiario);
    const ceav = salarioDiario * (porcentajeCV / 100);
    const retiro = salarioDiario * (RETIRO.patron / 100);
    const guarderias = salarioDiario * (GUARDERIAS.patron / 100);
    const riesgos = salarioDiario * (RIESGO_TRABAJO.porcentajeBase / 100);
    
    const totalDiario = cuotaFija + cuotaAdicional + invalidezVida + ceav + retiro + guarderias + riesgos;
    
    return {
        cuotaFija,
        cuotaAdicional,
        invalidezVida,
        ceav,
        retiro,
        guarderias,
        riesgos,
        porcentajeCV,
        totalDiario,
        totalMensual: totalDiario * 30.4
    };
}

function calcularAportacionInfonavit(salarioDiario) {
    return salarioDiario * (INFONAVIT_APORTACION.patron / 100);
}

function calcularCostoPatronalTotal(salarioDiario) {
    const imssPatron = calcularCuotasIMSS_Patron(salarioDiario);
    const infonavit = calcularAportacionInfonavit(salarioDiario);
    
    return {
        imssPatron,
        infonavitDiario: infonavit,
        infonavitMensual: infonavit * 30.4,
        totalDiario: imssPatron.totalDiario + infonavit,
        totalMensual: (imssPatron.totalDiario + infonavit) * 30.4
    };
}

function calcularDeduccionIMSS_Trabajador(salarioDiario) {
    const cuotas = calcularCuotasIMSS_Trabajador(salarioDiario);
    return cuotas.totalMensual;
}