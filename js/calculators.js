// ========================================
// LÓGICA DE CÁLCULOS (con Fondo de Ahorro)
// ========================================

/**
 * Calcula la deducción por Fondo de Ahorro
 * @param {number} salarioMensual - Salario mensual
 * @param {number} porcentaje - Porcentaje del salario (máx 13%)
 * @returns {Object} - Deducción trabajador y aportación patrón
 */
function calcularFondoAhorro(salarioMensual, porcentaje) {
    const umaMensual = getUMA('mensual');
    const topeMensual = umaMensual * 13;
    
    let baseCalculo = Math.min(salarioMensual, topeMensual);
    let porcentajeReal = Math.min(porcentaje, 13);
    
    const aportacionTrabajador = baseCalculo * (porcentajeReal / 100);
    const aportacionPatron = aportacionTrabajador;
    
    return {
        porcentajeAplicado: porcentajeReal,
        baseCalculo,
        aportacionTrabajador,
        aportacionPatron,
        totalAhorroMensual: aportacionTrabajador + aportacionPatron
    };
}

/**
 * Calcula el sueldo neto completo con fondo de ahorro
 */
function calcularSueldoNeto(params) {
    const {
        dailyWage,
        honorarios = 0,
        regalias = 0,
        comisiones = 0,
        rendimientos = 0,
        infonavitLoan = 0,
        otherDeductions = 0,
        savingsFundPercent = 0
    } = params;
    
    const salarioMensual = dailyWage * 30.4;
    const ingresoMensualTotal = salarioMensual + honorarios + regalias + comisiones + rendimientos;
    const equivalenteDiario = ingresoMensualTotal / 30.4;
    
    const imssTrabajador = calcularDeduccionIMSS_Trabajador(dailyWage);
    const isr = calcularISRNeto(ingresoMensualTotal);
    const subsidio = calcularSubsidioEmpleo(ingresoMensualTotal);
    const fondoAhorro = calcularFondoAhorro(salarioMensual, savingsFundPercent);
    
    const totalDeducciones = imssTrabajador + isr + infonavitLoan + otherDeductions + fondoAhorro.aportacionTrabajador;
    const sueldoNeto = ingresoMensualTotal - totalDeducciones;
    
    const costoPatronalBase = calcularCostoPatronalTotal(dailyWage);
    const costoPatronalTotal = {
        imssPatron: costoPatronalBase.imssPatron.totalMensual,
        infonavitPatron: costoPatronalBase.infonavitMensual,
        fondoAhorroPatron: fondoAhorro.aportacionPatron,
        total: costoPatronalBase.totalMensual + fondoAhorro.aportacionPatron
    };
    
    return {
        ingresos: {
            salarioBaseMensual: salarioMensual,
            honorarios,
            regalias,
            comisiones,
            rendimientos,
            totalMensual: ingresoMensualTotal,
            equivalenteDiario
        },
        deducciones: {
            imss: imssTrabajador,
            isr,
            subsidio,
            fondoAhorro: fondoAhorro.aportacionTrabajador,
            infonavitLoan,
            otherDeductions,
            total: totalDeducciones
        },
        fondoAhorroDetalle: fondoAhorro,
        sueldoNeto,
        costoPatronal: costoPatronalTotal
    };
}

/**
 * Calcula proyección AFORE
 */
function calcularProyeccionAfore(salarioMensual, edadActual, edadRetiro, rendimientoAnual) {
    const anosHastaRetiro = edadRetiro - edadActual;
    if (anosHastaRetiro <= 0) return null;
    
    const salarioDiario = salarioMensual / 30.4;
    const aportacionPatronalDiaria = calcularCuotasIMSS_Patron(salarioDiario).ceav;
    const aportacionPatronalMensual = aportacionPatronalDiaria * 30.4;
    const aportacionTrabajadorDiaria = calcularCuotasIMSS_Trabajador(salarioDiario).ceav;
    const aportacionTrabajadorMensual = aportacionTrabajadorDiaria * 30.4;
    
    let cuotaSocialDiaria = 0;
    const vecesUMA = salarioDiario / getUMA('diario');
    if (vecesUMA <= 4.00) {
        if (vecesUMA <= 1.5) cuotaSocialDiaria = 10.75;
        else if (vecesUMA <= 2.0) cuotaSocialDiaria = 10.00;
        else if (vecesUMA <= 2.5) cuotaSocialDiaria = 9.25;
        else if (vecesUMA <= 3.0) cuotaSocialDiaria = 8.50;
        else if (vecesUMA <= 3.5) cuotaSocialDiaria = 7.75;
        else cuotaSocialDiaria = 7.00;
    }
    const cuotaSocialMensual = cuotaSocialDiaria * 30.4;
    
    const aportacionTotalMensual = aportacionPatronalMensual + aportacionTrabajadorMensual + cuotaSocialMensual;
    const tasaMensual = rendimientoAnual / 100 / 12;
    const meses = anosHastaRetiro * 12;
    
    let saldoFinal = 0;
    for (let i = 0; i < meses; i++) {
        saldoFinal = (saldoFinal + aportacionTotalMensual) * (1 + tasaMensual);
    }
    
    const pensionMensual = saldoFinal * 0.04;
    
    return {
        aportacionPatronalMensual,
        aportacionTrabajadorMensual,
        cuotaSocialMensual,
        aportacionTotalMensual,
        saldoFinal,
        pensionMensual,
        anosAportacion: anosHastaRetiro
    };
}

/**
 * Simula elegibilidad para crédito INFONAVIT
 */
function simularCreditoInfonavit(salarioMensual, puntuacion, empleoVigente, mesesCotizados) {
    const esCandidato = puntuacion >= 116 && mesesCotizados >= 12 && empleoVigente;
    
    if (!esCandidato) {
        let razon = "";
        if (!empleoVigente) razon = "No tiene empleo formal vigente";
        else if (mesesCotizados < 12) razon = `Faltan ${12 - mesesCotizados} meses de cotización (mínimo 12)`;
        else if (puntuacion < 116) razon = `Puntuación insuficiente (${puntuacion}/116 mínimo)`;
        else razon = "No cumple requisitos mínimos";
        
        return {
            esCandidato: false,
            razon,
            montoCredito: 0,
            mensualidadEstimada: 0
        };
    }
    
    const factorCredito = Math.min(3.5, 2.5 + (puntuacion - 116) / 50);
    const montoCredito = salarioMensual * 12 * factorCredito;
    const mensualidadEstimada = salarioMensual * 0.30;
    
    return {
        esCandidato: true,
        montoCredito,
        mensualidadEstimada,
        puntuacion,
        mesesCotizados
    };
}

function formatCurrency(value) {
    return "$" + value.toLocaleString("en-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}