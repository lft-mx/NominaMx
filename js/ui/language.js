// ============================================================
// IDIOMA (ES / EN)
// ============================================================

const texts = {
  es: {
    titulo: '💰 Calculadora Laboral México',
    btnCalcular: '🔢 Calcular sueldo neto',
    resumenTitulo: '📊 Resumen de nómina',
    placeholderSueldo: 'Ej: 8500',
    placeholderBonos: 'Ej: 500',
    placeholderInfonavit: 'Ej: 300',
    placeholderVales: 'Ej: 800',
    placeholderFondo: 'Ej: 500',
    placeholderSBC: 'Ej: 350',
    placeholderNeto: 'Ej: 7200'
  },
  en: {
    titulo: '💰 Mexico Labor Calculator',
    btnCalcular: '🔢 Calculate net salary',
    resumenTitulo: '📊 Payroll Summary',
    placeholderSueldo: 'Ex: 8500',
    placeholderBonos: 'Ex: 500',
    placeholderInfonavit: 'Ex: 300',
    placeholderVales: 'Ex: 800',
    placeholderFondo: 'Ex: 500',
    placeholderSBC: 'Ex: 350',
    placeholderNeto: 'Ex: 7200'
  }
};

let currentLang = localStorage.getItem('language') || 'es';

function applyLanguage() {
  const t = texts[currentLang];
  document.getElementById('titulo').innerText = t.titulo;
  document.getElementById('btnCalcular').innerText = t.btnCalcular;
  document.getElementById('resumenTitulo').innerHTML = t.resumenTitulo;
  
  // Placeholders
  document.getElementById('sueldo').placeholder = t.placeholderSueldo;
  document.getElementById('bonos').placeholder = t.placeholderBonos;
  document.getElementById('infonavit').placeholder = t.placeholderInfonavit;
  document.getElementById('valesDespensa').placeholder = t.placeholderVales;
  document.getElementById('fondoAhorro').placeholder = t.placeholderFondo;
  document.getElementById('sbc').placeholder = t.placeholderSBC;
  document.getElementById('netoDeposito').placeholder = t.placeholderNeto;
  document.getElementById('sbcNeto').placeholder = t.placeholderSBC;
  
  const langSwitch = document.getElementById('langSwitch');
  if (currentLang === 'en') {
    langSwitch.classList.add('en');
  } else {
    langSwitch.classList.remove('en');
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  localStorage.setItem('language', currentLang);
  applyLanguage();
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
  document.getElementById('langSwitch').addEventListener('click', toggleLanguage);
});
