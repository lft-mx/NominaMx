// ========================================
// SISTEMA DE TRADUCCIONES ES / EN
// ========================================

const TRANSLATIONS = {
    es: {
        mainTitle: "Calculadora Laboral México 2026",
        subtitle: "LFT · IMSS · INFONAVIT · AFORE · Fondo de Ahorro",
        
        heroSalaryTitle: "Calculadora de Salario",
        heroSalaryDesc: "ISR · IMSS · Subsidio · Neto",
        heroAforeTitle: "Proyección AFORE",
        heroAforeDesc: "¿Cuánto tendrás al retirarte?",
        
        incomeTitle: "📋 Ingresos",
        salaryBaseLabel: "Salario base diario (MXN)",
        honorariosLabel: "Honorarios (MXN/mes)",
        regaliasLabel: "Regalías (MXN/mes)",
        comisionesLabel: "Comisiones (MXN/mes)",
        rendimientosLabel: "Rendimientos financieros (MXN/mes)",
        
        periodTitle: "📅 Periodicidad de pago",
        periodTypeLabel: "Tipo de periodo",
        daysWorkedLabel: "Días trabajados",
        
        deductionsOblTitle: "📊 Deducciones obligatorias",
        deductionsAddTitle: "➕ Deducciones adicionales",
        savingsFundLabel: "Fondo de ahorro (% del salario)",
        savingsFundHelp: "Máximo 13% (tope 13x UMA)",
        infonavitLoanLabel: "Préstamo INFONAVIT (MXN/mes)",
        otherDeductionsLabel: "Otras deducciones (MXN/mes)",
        
        totalIncomeLabel: "Total de ingresos mensuales",
        dailySalaryLabel: "Equivalente diario",
        totalDeductionsLabel: "Total de deducciones",
        netSalaryLabel: "Sueldo neto mensual",
        
        employerCostTitle: "🏢 Costo total para el patrón",
        employerImssLabel: "IMSS patrón",
        employerInfonavitLabel: "INFONAVIT (5% patrón)",
        employerSavingsLabel: "Aportación fondo ahorro",
        totalCostLabel: "Costo total patrón",
        
        imssWorkerLabel: "IMSS trabajador",
        isrLabel: "ISR retenido",
        subsidioLabel: "Subsidio al empleo",
        
        toolsNote: "Próximamente: más calculadoras laborales",
        footerText: "© 2026 LFT MX — Datos basados en tablas oficiales IMSS, INFONAVIT y SAT | Actualizado 2026"
    },
    en: {
        mainTitle: "Mexico Labor Calculator 2026",
        subtitle: "LFT · IMSS · INFONAVIT · AFORE · Savings Fund",
        
        heroSalaryTitle: "Salary Calculator",
        heroSalaryDesc: "ISR · IMSS · Subsidy · Net",
        heroAforeTitle: "AFORE Projection",
        heroAforeDesc: "How much will you have at retirement?",
        
        incomeTitle: "📋 Income",
        salaryBaseLabel: "Daily base salary (MXN)",
        honorariosLabel: "Professional fees (MXN/month)",
        regaliasLabel: "Royalties (MXN/month)",
        comisionesLabel: "Commissions (MXN/month)",
        rendimientosLabel: "Investment returns (MXN/month)",
        
        periodTitle: "📅 Payment Period",
        periodTypeLabel: "Period type",
        daysWorkedLabel: "Days worked",
        
        deductionsOblTitle: "📊 Mandatory deductions",
        deductionsAddTitle: "➕ Additional deductions",
        savingsFundLabel: "Savings fund (% of salary)",
        savingsFundHelp: "Maximum 13% (cap 13x UMA)",
        infonavitLoanLabel: "INFONAVIT loan (MXN/month)",
        otherDeductionsLabel: "Other deductions (MXN/month)",
        
        totalIncomeLabel: "Total monthly income",
        dailySalaryLabel: "Daily equivalent",
        totalDeductionsLabel: "Total deductions",
        netSalaryLabel: "Monthly net salary",
        
        employerCostTitle: "🏢 Total employer cost",
        employerImssLabel: "IMSS employer",
        employerInfonavitLabel: "INFONAVIT (5% employer)",
        employerSavingsLabel: "Savings fund contribution",
        totalCostLabel: "Total employer cost",
        
        imssWorkerLabel: "IMSS employee",
        isrLabel: "ISR withheld",
        subsidioLabel: "Employment subsidy",
        
        toolsNote: "Coming soon: more labor calculators",
        footerText: "© 2026 LFT MX — Data based on official IMSS, INFONAVIT and SAT tables | Updated 2026"
    }
};

let currentLanguage = localStorage.getItem("idioma") || "es";

function t(key) {
    return TRANSLATIONS[currentLanguage][key] || key;
}