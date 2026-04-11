let modoActual = 'bruto';
function formatMoneyInput(input) { let valor = input.value.replace(/[^0-9.]/g, ''); if (valor === '') return; let numero = parseFloat(valor); if (!isNaN(numero)) input.value = '$' + numero.toLocaleString('en-US'); }
function attachMoneyFormat() { document.querySelectorAll('.money-input').forEach(inp => { inp.addEventListener('input', function() { formatMoneyInput(this); }); if (inp.value && !isNaN(parseFloat(inp.value))) inp.value = '$' + parseFloat(inp.value).toLocaleString(); }); }
function cambiarModo(modo) { modoActual = modo; document.getElementById('modoBruto').style.display = modo === 'bruto' ? 'block' : 'none'; document.getElementById('modoNeto').style.display = modo === 'neto' ? 'block' : 'none'; document.querySelectorAll('.tab').forEach(tab => { if (tab.getAttribute('data-modo') === modo) tab.classList.add('active'); else tab.classList.remove('active'); }); document.getElementById('resultados').style.display = 'none'; }
function mostrarResultados(resultado, tipo) {
  const detalleDiv = document.getElementById('detalleResultados');
  const comparacionDiv = document.getElementById('comparacionMetodos');
  const insightsDiv = document.getElementById('insights');
  const p = resultado.percepciones;
  const totalGravado = p.gravado;
  const porcentajes = { isr: (resultado.isr.isrPeriodo / totalGravado) * 100, imss: (resultado.imss / totalGravado) * 100, infonavit: (resultado.infonavit / totalGravado) * 100, fondo: (resultado.fondoAhorro / totalGravado) * 100, neto: (resultado.neto / totalGravado) * 100 };
  renderizarGrafica({ labels: ['ISR', 'IMSS', 'Infonavit', 'Fondo Ahorro', 'Neto'], porcentajes: [porcentajes.isr, porcentajes.imss, porcentajes.infonavit, porcentajes.fondo, porcentajes.neto], colores: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'] });
  detalleDiv.innerHTML = `<div class="resultado-item"><strong>💰 Ingreso bruto gravado:</strong> $${totalGravado.toLocaleString()}</div><div class="resultado-item"><strong>🧾 ISR bruto mensual:</strong> $${resultado.isr.isrBrutoMensual.toLocaleString()}</div><div class="resultado-item"><strong>🎁 Subsidio mensual:</strong> -$${resultado.isr.subsidioMensual.toLocaleString()}</div><div class="resultado-item"><strong>✅ ISR neto (a pagar):</strong> -$${resultado.isr.isrPeriodo.toLocaleString()} <small>(${resultado.isr.porcentajeImpuesto.toFixed(1)}% del bruto)</small></div><div class="resultado-item"><strong>🏥 IMSS:</strong> -$${resultado.imss.toLocaleString()}</div><div class="resultado-item"><strong>🏠 Infonavit:</strong> -$${resultado.infonavit.toLocaleString()}</div><div class="resultado-item"><strong>🏦 Fondo de ahorro:</strong> -$${resultado.fondoAhorro.toLocaleString()}</div><div class="resultado-item"><strong>📊 SBC diario:</strong> $${resultado.sbc.diario.toLocaleString()} ${resultado.sbc.manual ? '(manual)' : '(automático)'}</div><div class="resultado-total"><strong>💵 Neto que recibes:</strong> $${resultado.neto.toLocaleString()}</div>`;
  comparacionDiv.innerHTML = `<h4>📊 Comparación de métodos ISR</h4><p><strong>Método real (con subsidio fijo):</strong> ISR = $${resultado.isr.isrPeriodo.toLocaleString()}</p><p><strong>Sin subsidio:</strong> ISR = $${resultado.comparacionISR.metodoDirecto.toLocaleString()}</p><p><small>⚠️ El subsidio fijo aplica si ganas menos de $11,493 mensuales.</small></p>`;
  insightsDiv.innerHTML = generarInsights(resultado, document.getElementById('periodo').value);
  document.getElementById('resultados').style.display = 'block';
  showSimulator();
}
function calcularHandler() {
  if (modoActual === 'bruto') {
    const sueldo = parseFloat(document.getElementById('sueldo').value.replace(/[^0-9.]/g, '')) || 0;
    const tipo = document.getElementById('periodo').value;
    const bonos = parseFloat(document.getElementById('bonos').value.replace(/[^0-9.]/g, '')) || 0;
    const domingos = parseInt(document.getElementById('domingos').value) || 0;
    const infonavit = parseFloat(document.getElementById('infonavit').value.replace(/[^0-9.]/g, '')) || 0;
    const vales = parseFloat(document.getElementById('valesDespensa').value.replace(/[^0-9.]/g, '')) || 0;
    const fondo = parseFloat(document.getElementById('fondoAhorro').value.replace(/[^0-9.]/g, '')) || 0;
    let sbc = parseFloat(document.getElementById('sbc').value.replace(/[^0-9.]/g, ''));
    if (isNaN(sbc)) sbc = null;
    const resultado = CalculadoraNomina.calcularBrutoANeto({ sueldoPeriodo: sueldo, tipoPeriodo: tipo, bonos, domingosTrabajados: domingos, infonavit, valesDespensa: vales, fondoAhorro: fondo, sbcManual: sbc });
    mostrarResultados(resultado, 'bruto');
    guardarCalculo(resultado, { sueldoPeriodo: sueldo, tipoPeriodo: tipo });
  } else {
    const neto = parseFloat(document.getElementById('netoDeposito').value.replace(/[^0-9.]/g, '')) || 0;
    const tipo = document.getElementById('periodoNeto').value;
    let sbc = parseFloat(document.getElementById('sbcNeto').value.replace(/[^0-9.]/g, ''));
    if (isNaN(sbc)) sbc = CONFIG.imss.salarioMinimo;
    const resultado = CalculadoraNomina.calcularNetoABruto(neto, tipo, sbc);
    document.getElementById('detalleResultados').innerHTML = `<div class="resultado-item"><strong>💰 Estimación sueldo bruto:</strong> $${resultado.brutoEstimado.toLocaleString()}</div><div class="resultado-item"><strong>🧾 ISR estimado:</strong> -$${resultado.isrEstimado.toLocaleString()}</div><div class="resultado-item"><strong>🏥 IMSS:</strong> -$${resultado.imssEstimado.toLocaleString()}</div><div class="resultado-total"><strong>💵 Neto que recibes:</strong> $${resultado.neto.toLocaleString()}</div>`;
    document.getElementById('resultados').style.display = 'block';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  attachMoneyFormat();
  document.querySelectorAll('.tab').forEach(tab => { tab.addEventListener('click', () => cambiarModo(tab.getAttribute('data-modo'))); });
  document.getElementById('btnCalcular').addEventListener('click', calcularHandler);
  document.getElementById('guardarBtn')?.addEventListener('click', () => alert('Cálculo guardado en historial ✅'));
  cambiarModo('bruto');
});
