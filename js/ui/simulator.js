let simActive = false;
function initSimulator() {
  const slider = document.getElementById('simSlider');
  if (!slider) return;
  slider.addEventListener('input', function() {
    const bruto = parseFloat(this.value);
    document.getElementById('simBruto').innerText = '$' + bruto.toLocaleString();
    const resultado = CalculadoraNomina.calcularBrutoANeto({
      sueldoPeriodo: bruto, tipoPeriodo: document.getElementById('periodo').value,
      bonos: parseFloat(document.getElementById('bonos').value.replace(/[^0-9.]/g, '')) || 0,
      domingosTrabajados: parseInt(document.getElementById('domingos').value) || 0,
      infonavit: parseFloat(document.getElementById('infonavit').value.replace(/[^0-9.]/g, '')) || 0,
      valesDespensa: parseFloat(document.getElementById('valesDespensa').value.replace(/[^0-9.]/g, '')) || 0,
      fondoAhorro: parseFloat(document.getElementById('fondoAhorro').value.replace(/[^0-9.]/g, '')) || 0,
      sbcManual: parseFloat(document.getElementById('sbc').value.replace(/[^0-9.]/g, '')) || null
    });
    document.getElementById('simNeto').innerText = '$' + resultado.neto.toLocaleString();
    const porc = (resultado.isr.isrPeriodo / bruto) * 100;
    const insightDiv = document.getElementById('simInsight');
    if (porc > 20) insightDiv.innerText = '⚠️ Pagas más del 20% de impuestos. Revisa deducciones.';
    else if (porc > 10) insightDiv.innerText = `📊 Pagas ${porc.toFixed(1)}% de impuestos.`;
    else insightDiv.innerText = '✅ Excelente, pagas pocos impuestos.';
  });
}
function showSimulator() {
  const panel = document.getElementById('simulatorPanel');
  if (panel) panel.style.display = 'block';
  if (!simActive) { initSimulator(); simActive = true; }
}
