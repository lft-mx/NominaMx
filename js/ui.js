// ========================================
// UI - Manejo de interfaz (COMPLETO)
// ========================================

// Elementos del DOM
const dailyWageInput = document.getElementById("dailyWageInput");
const honorariosInput = document.getElementById("honorariosInput");
const regaliasInput = document.getElementById("regaliasInput");
const comisionesInput = document.getElementById("comisionesInput");
const rendimientosInput = document.getElementById("rendimientosInput");
const infonavitLoanInput = document.getElementById("infonavitLoanInput");
const otherDeductionsInput = document.getElementById("otherDeductionsInput");
const savingsFundPercentInput = document.getElementById("savingsFundPercentInput");
const calcSalaryBtn = document.getElementById("calcSalaryBtn");

// Resultados principales
const totalIncomeSpan = document.getElementById("totalIncome");
const dailyEquivalentSpan = document.getElementById("dailyEquivalent");
const totalDeductionsSpan = document.getElementById("totalDeductions");
const netSalarySpan = document.getElementById("netSalary");
const imssWorkerSpan = document.getElementById("imssWorkerValue") || document.getElementById("imssWorkerSpan");
const isrAmountSpan = document.getElementById("isrValue") || document.getElementById("isrAmountSpan");
const subsidioAmountSpan = document.getElementById("subsidioValue") || document.getElementById("subsidioAmountSpan");

// Costo patronal
const employerImssSpan = document.getElementById("employerImss");
const employerInfonavitSpan = document.getElementById("employerInfonavit");
const employerSavingsSpan = document.getElementById("employerSavings");
const totalEmployerCostSpan = document.getElementById("totalEmployerCost");

// AFORE
const aforeSalaryInput = document.getElementById("aforeSalaryInput");
const currentAgeInput = document.getElementById("currentAgeInput");
const retirementAgeInput = document.getElementById("retirementAgeInput");
const returnRateInput = document.getElementById("returnRateInput");
const calcAforeBtn = document.getElementById("calcAforeBtn");
const patronalMonthlySpan = document.getElementById("patronalMonthly");
const workerMonthlySpan = document.getElementById("workerMonthly");
const finalBalanceSpan = document.getElementById("finalBalance");
const monthlyPensionSpan = document.getElementById("monthlyPension");

// INFONAVIT
const infonavitSalaryInput = document.getElementById("infonavitSalaryInput");
const puntuacionInput = document.getElementById("puntuacionInput");
const empleoVigenteSelect = document.getElementById("empleoVigenteSelect");
const mesesCotizadosInput = document.getElementById("mesesCotizadosInput");
const calcInfonavitBtn = document.getElementById("calcInfonavitBtn");
const creditAmountSpan = document.getElementById("creditAmount");
const monthlyPaymentSpan = document.getElementById("monthlyPayment");
const candidateStatusSpan = document.getElementById("candidateStatus");

function handleSalaryCalculation() {
    const dailyWage = parseFloat(dailyWageInput?.value) || 0;
    const honorarios = parseFloat(honorariosInput?.value) || 0;
    const regalias = parseFloat(regaliasInput?.value) || 0;
    const comisiones = parseFloat(comisionesInput?.value) || 0;
    const rendimientos = parseFloat(rendimientosInput?.value) || 0;
    const infonavitLoan = parseFloat(infonavitLoanInput?.value) || 0;
    const otherDeductions = parseFloat(otherDeductionsInput?.value) || 0;
    const savingsFundPercent = parseFloat(savingsFundPercentInput?.value) || 0;
    
    const result = calcularSueldoNeto({
        dailyWage,
        honorarios,
        regalias,
        comisiones,
        rendimientos,
        infonavitLoan,
        otherDeductions,
        savingsFundPercent
    });
    
    if (totalIncomeSpan) totalIncomeSpan.innerText = formatCurrency(result.ingresos.totalMensual);
    if (dailyEquivalentSpan) dailyEquivalentSpan.innerText = formatCurrency(result.ingresos.equivalenteDiario);
    if (totalDeductionsSpan) totalDeductionsSpan.innerText = formatCurrency(result.deducciones.total);
    if (netSalarySpan) netSalarySpan.innerText = formatCurrency(result.sueldoNeto);
    if (imssWorkerSpan) imssWorkerSpan.innerText = formatCurrency(result.deducciones.imss);
    if (isrAmountSpan) isrAmountSpan.innerText = formatCurrency(result.deducciones.isr);
    if (subsidioAmountSpan) subsidioAmountSpan.innerText = formatCurrency(result.deducciones.subsidio);
    
    if (employerImssSpan) employerImssSpan.innerText = formatCurrency(result.costoPatronal.imssPatron);
    if (employerInfonavitSpan) employerInfonavitSpan.innerText = formatCurrency(result.costoPatronal.infonavitPatron);
    if (employerSavingsSpan) employerSavingsSpan.innerText = formatCurrency(result.costoPatronal.fondoAhorroPatron);
    if (totalEmployerCostSpan) totalEmployerCostSpan.innerText = formatCurrency(result.costoPatronal.total);
}

function handleAforeCalculation() {
    const salary = parseFloat(aforeSalaryInput?.value) || 0;
    const currentAge = parseInt(currentAgeInput?.value) || 30;
    const retirementAge = parseInt(retirementAgeInput?.value) || 65;
    const returnRate = parseFloat(returnRateInput?.value) || 6.5;
    
    const result = calcularProyeccionAfore(salary, currentAge, retirementAge, returnRate);
    
    if (result && patronalMonthlySpan) {
        patronalMonthlySpan.innerText = formatCurrency(result.aportacionPatronalMensual);
        workerMonthlySpan.innerText = formatCurrency(result.aportacionTrabajadorMensual);
        finalBalanceSpan.innerText = formatCurrency(result.saldoFinal);
        monthlyPensionSpan.innerText = formatCurrency(result.pensionMensual);
    }
}

function handleInfonavitCalculation() {
    const salary = parseFloat(infonavitSalaryInput?.value) || 0;
    const puntuacion = parseInt(puntuacionInput?.value) || 0;
    const empleoVigente = empleoVigenteSelect?.value === "si";
    const mesesCotizados = parseInt(mesesCotizadosInput?.value) || 0;
    
    const result = simularCreditoInfonavit(salary, puntuacion, empleoVigente, mesesCotizados);
    
    if (creditAmountSpan) {
        if (result.esCandidato) {
            creditAmountSpan.innerText = formatCurrency(result.montoCredito);
            monthlyPaymentSpan.innerText = formatCurrency(result.mensualidadEstimada);
            candidateStatusSpan.innerText = "✅ Sí, eres candidato";
            candidateStatusSpan.style.color = "#10b981";
        } else {
            creditAmountSpan.innerText = "$0.00";
            monthlyPaymentSpan.innerText = "$0.00";
            candidateStatusSpan.innerText = `❌ No: ${result.razon}`;
            candidateStatusSpan.style.color = "#ef4444";
        }
    }
}

function switchTab(tabId) {
    const panels = document.querySelectorAll(".calculator-panel");
    panels.forEach(panel => panel.classList.remove("active-panel"));
    
    const activePanel = document.getElementById(`${tabId}Panel`);
    if (activePanel) activePanel.classList.add("active-panel");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("modo", isDark ? "dark" : "light");
    const modoBtn = document.getElementById("modo-btn");
    if (modoBtn) modoBtn.innerText = isDark ? "☀️" : "🌙";
}

function toggleLanguage() {
    currentLanguage = currentLanguage === "es" ? "en" : "es";
    localStorage.setItem("idioma", currentLanguage);
    
    const langSwitch = document.getElementById("langSwitch");
    if (langSwitch) {
        if (currentLanguage === "en") langSwitch.classList.add("en");
        else langSwitch.classList.remove("en");
    }
    
    updateAllUITexts();
    handleSalaryCalculation();
}

function updateAllUITexts() {
    document.getElementById("mainTitle").innerText = t("mainTitle");
    document.getElementById("subtitle").innerText = t("subtitle");
    document.getElementById("heroSalaryTitle").innerText = t("heroSalaryTitle");
    document.getElementById("heroSalaryDesc").innerText = t("heroSalaryDesc");
    document.getElementById("heroAforeTitle").innerText = t("heroAforeTitle");
    document.getElementById("heroAforeDesc").innerText = t("heroAforeDesc");
    document.getElementById("incomeTitle").innerText = t("incomeTitle");
    document.getElementById("salaryBaseLabel").innerText = t("salaryBaseLabel");
    document.getElementById("honorariosLabel").innerText = t("honorariosLabel");
    document.getElementById("regaliasLabel").innerText = t("regaliasLabel");
    document.getElementById("comisionesLabel").innerText = t("comisionesLabel");
    document.getElementById("rendimientosLabel").innerText = t("rendimientosLabel");
    document.getElementById("periodTitle").innerText = t("periodTitle");
    document.getElementById("periodTypeLabel").innerText = t("periodTypeLabel");
    document.getElementById("daysWorkedLabel").innerText = t("daysWorkedLabel");
    document.getElementById("deductionsOblTitle").innerText = t("deductionsOblTitle");
    document.getElementById("deductionsAddTitle").innerText = t("deductionsAddTitle");
    document.getElementById("savingsFundLabel").innerText = t("savingsFundLabel");
    document.getElementById("savingsFundHelp").innerText = t("savingsFundHelp");
    document.getElementById("infonavitLoanLabel").innerText = t("infonavitLoanLabel");
    document.getElementById("otherDeductionsLabel").innerText = t("otherDeductionsLabel");
    document.getElementById("totalIncomeLabel").innerText = t("totalIncomeLabel");
    document.getElementById("dailySalaryLabel").innerText = t("dailySalaryLabel");
    document.getElementById("totalDeductionsLabel").innerText = t("totalDeductionsLabel");
    document.getElementById("netSalaryLabel").innerText = t("netSalaryLabel");
    document.getElementById("employerCostTitle").innerText = t("employerCostTitle");
    document.getElementById("employerImssLabel").innerText = t("employerImssLabel");
    document.getElementById("employerInfonavitLabel").innerText = t("employerInfonavitLabel");
    document.getElementById("employerSavingsLabel").innerText = t("employerSavingsLabel");
    document.getElementById("totalCostLabel").innerText = t("totalCostLabel");
    document.getElementById("imssWorkerLabel").innerText = t("imssWorkerLabel");
    document.getElementById("isrLabel").innerText = t("isrLabel");
    document.getElementById("subsidioLabel").innerText = t("subsidioLabel");
    document.getElementById("toolsNote").innerText = t("toolsNote");
    document.getElementById("footerText").innerText = t("footerText");
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("modo");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        const modoBtn = document.getElementById("modo-btn");
        if (modoBtn) modoBtn.innerText = "☀️";
    }
}

function applySavedLanguage() {
    const savedLang = localStorage.getItem("idioma");
    if (savedLang === "en") {
        currentLanguage = "en";
        const langSwitch = document.getElementById("langSwitch");
        if (langSwitch) langSwitch.classList.add("en");
    }
    updateAllUITexts();
}

function setupCollapsibles() {
    document.querySelectorAll('.collapse-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.dataset.collapse;
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.toggle('collapsed');
                btn.innerText = target.classList.contains('collapsed') ? '+' : '−';
            }
        });
    });
}

function setupMoreTools() {
    const moreBtn = document.getElementById('moreToolsBtn');
    const moreContent = document.getElementById('moreToolsContent');
    if (moreBtn && moreContent) {
        moreBtn.addEventListener('click', () => {
            moreContent.classList.toggle('open');
            const arrow = moreBtn.querySelector('.arrow');
            if (arrow) arrow.innerText = moreContent.classList.contains('open') ? '▲' : '▼';
        });
    }
}

function setupHeroCards() {
    const openSalaryBtn = document.getElementById('openSalaryBtn');
    const openAforeBtn = document.getElementById('openAforeBtn');
    if (openSalaryBtn) openSalaryBtn.addEventListener('click', () => switchTab('salary'));
    if (openAforeBtn) openAforeBtn.addEventListener('click', () => switchTab('afore'));
}

function setupEventListeners() {
    if (calcSalaryBtn) calcSalaryBtn.addEventListener("click", handleSalaryCalculation);
    if (calcAforeBtn) calcAforeBtn.addEventListener("click", handleAforeCalculation);
    if (calcInfonavitBtn) calcInfonavitBtn.addEventListener("click", handleInfonavitCalculation);
    
    const inputs = [dailyWageInput, honorariosInput, regaliasInput, comisionesInput, rendimientosInput, infonavitLoanInput, otherDeductionsInput, savingsFundPercentInput];
    inputs.forEach(input => {
        if (input) input.addEventListener("input", handleSalaryCalculation);
    });
    
    const modoBtn = document.getElementById("modo-btn");
    if (modoBtn) modoBtn.addEventListener("click", toggleTheme);
    
    const langSwitch = document.getElementById("langSwitch");
    if (langSwitch) langSwitch.addEventListener("click", toggleLanguage);
}

function init() {
    applySavedTheme();
    applySavedLanguage();
    handleSalaryCalculation();
    handleAforeCalculation();
    handleInfonavitCalculation();
    setupEventListeners();
    setupCollapsibles();
    setupMoreTools();
    setupHeroCards();
}

document.addEventListener("DOMContentLoaded", init);