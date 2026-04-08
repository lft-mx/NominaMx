// ========================================
// CONTROLADOR PRINCIPAL (APP)
// Nota: Este archivo es un respaldo/coordinar
// La inicialización principal está en ui.js
// ========================================

// Esta función se ejecuta como respaldo adicional
function appReady() {
    console.log("Calculadora Laboral México 2026 - Lista");
}

// Si por alguna razón no se ejecutó el DOMContentLoaded en ui.js
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("App inicializada desde app.js");
    });
} else {
    console.log("App ya está lista");
}
