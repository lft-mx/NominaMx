// ============================================================
// APLICACIÓN PRINCIPAL
// Orquesta todos los módulos
// ============================================================

let modoActual = 'bruto';

function cambiarModo(modo) {
  modoActual = modo;
  const modoBrutoDiv = document.getElementById('modoBruto');
  const modoNetoDiv = document.getElementById('modoNeto');
  const tabs = document.querySelectorAll('.tab');
  
  if (modo === 'bruto') {
    modoBrutoDiv.style.display = 'block';
    modoNetoDiv.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    modoBrutoDiv.style.display = 'none';
    modoNetoDiv.style.display = 'block';
    tabs[1].classList.add('active');
    tabs[0].classList.remove('active');
  }
  
  document.getElementById('resultados').style.display = 'none';
}

function mostrarResultados(resultado, tipo) {
  const resultadosDiv = document.getElementById('resultados');
  const detalleDiv = document.getElementById('detalleResultados');
  const comparacionDiv = document.getElementById('comparacionMetodos');
  
  if (tipo === 'bruto') {
    const p = resultado.percepciones;
    const totalGravado = p.gravado;
    
    const porcentajes = {
      isr: (resultado.isr.isrPeriodo / totalGravado) * 100,
      imss: (resultado.imss / totalGravado) * 100,
      infonavit: (resultado.infonavit / totalGravado) * 100,
      fondoAhorro: (resultado.fondoAhorro / totalGravado) * 100,
      neto: (resultado.neto / totalGravado) * 100
    };
    
    renderizarGraficaPorcentajes({
      labels: ['ISR', 'IMSS', 'Infonavit', 'Fondo Ahorro', 'Neto'],
      porcentajes: [porcentajes.isr, porcentajes.imss, porcentajes.infonavit, porcentajes.fondoAhorro, porcentajes.neto],
      colores: ['#ff4d4d', '#ffa500', '#4da6ff', '#9c27b0', '#00c853']
    });
    
    detalleDiv.innerHTML = `
      <div class="resultado-item"><strong>💰 Ingreso bruto:</strong> $${totalGravado.toLocaleString()}</div>
      <div class="resultado-item"><strong>🧾 ISR (con subsidio):</strong> -$${resultado.isr.isrPeriodo.toLocaleString()}</div>
      <div class="resultado-item"><strong>🏥 IMSS:</strong> -$${resultado.imss.toLocaleString()}</div>
      <div class="resultado-item"><strong>🏠 Infonavit:</strong> -$${resultado.infonavit.toLocaleString()}</div>
      <div class="resultado-item"><strong>🏦 Fondo de ahorro:</strong> -$${resultado.fondoAhorro.toLocaleString()}</div>
      <div class="resultado-total"><strong>💵 Neto que recibes:</strong> $${resultado.neto.toLocaleString()}</div>
    `;
    
    comparacionDiv.innerHTML = `
      <h4>📊 Comparación de métodos de ISR</h4>
      <p><strong>Método real (mensual + subsidio):</strong> ISR = $${resultado.isr.isrPeriodo.toLocaleString()}</p>
      <p><strong>Método directo (tabla del periodo):</strong> ISR = $${resultado.comparacionISR.metodoDirecto.toLocaleString()}</p>
      <p><small>⚠️ La mayoría de las empresas usan el método mensual + subsidio, resultando en un ISR más bajo.</small></p>
    `;
  } else {
    // Modo neto
    const total = resultado.brutoEstimado;
    const porcentajes = {
      isr: (resultado.isrEstimado / total) * 100,
      imss: (resultado.imssEstimado / total) * 100,
      neto: (resultado.neto / total) * 100
    };
    
    renderizarGraficaPorcentajes({
      labels: ['ISR (estimado)', 'IMSS', 'Neto'],
      porcentajes: [porcentajes.isr, porcentajes.imss, porcentajes.neto],
      colores: ['#ff4d4d', '#ffa500', '#00c853']
    });
    
    detalleDiv.innerHTML = `
      <div class="resultado-item"><strong>💰 Estimación sueldo bruto:</strong> $${resultado.brutoEstimado.toLocaleString()}</div>
      <div class="resultado-item"><strong>🧾 ISR estimado:</strong> -$${resultado.isrEstimado.toLocaleString()}</div>
      <div class="resultado-item"><strong>🏥 IMSS:</strong> -$${resultado.imssEstimado.toLocaleString()}</div>
      <div class="resultado-total"><strong>💵 Neto que recibes:</strong> $${resultado.neto.toLocaleString()}</div>
    `;
    comparacionDiv.innerHTML = '<p>📌 En modo Neto, los impuestos son estimados. Usa el modo Bruto para cálculos exactos.</p>';
  }
  
  resultadosDiv.style.display = 'block';
}

function calcularHandler() {
  if (modoActual === 'bruto') {
    const sueldo = parseFloat(document.getElementById('sueldo').value) || 0;
    const tipoPeriodo = document.getElementById('periodo').value;
    const bonos = parseFloat(document.getElementById('bonos').value) || 0;
    const infonavit = parseFloat(document.getElementById('infonavit').value) || 0;
    const valesDespensa = parseFloat(document.getElementById('valesDespensa').value) || 0;
    const fondoAhorro = parseFloat(document.getElementById('fondoAhorro').value) || 0;
    const sbc = parseFloat(document.getElementById('sbc').value) || CONFIG.imss.salarioMinimo;
    
    const resultado = CalculadoraNomina.calcularBrutoANeto({
      sueldoPeriodo: sueldo,
      tipoPeriodo,
      bonos,
      infonavit,
      valesDespensa,
      fondoAhorro,
      sbcDiario: sbc
    });
    
    mostrarResultados(resultado, 'bruto');
  } else {
    const netoDeposito = parseFloat(document.getElementById('netoDeposito').value) || 0;
    const tipoPeriodo = document.getElementById('periodoNeto').value;
    const sbc = parseFloat(document.getElementById('sbcNeto').value) || CONFIG.imss.salarioMinimo;
    
    const resultado = CalculadoraNomina.calcularNetoABruto(netoDeposito, tipoPeriodo, sbc);
    mostrarResultados(resultado, 'neto');
  }
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      cambiarModo(tab.getAttribute('data-modo'));
    });
  });
  
  // Botón calcular
  document.getElementById('btnCalcular').addEventListener('click', calcularHandler);
  
  // Valores por defecto
  cambiarModo('bruto');
});
