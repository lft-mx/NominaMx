function generarInsights(resultado, tipoPeriodo) {
  const { percepciones, isr, neto, imss, infonavit, fondoAhorro } = resultado;
  const bruto = percepciones.gravado;
  const porcImpuesto = (isr.isrPeriodo / bruto) * 100;
  const porcNeto = (neto / bruto) * 100;
  let html = `<div class="insights"><h4>💡 Recomendaciones personalizadas</h4>`;
  if (porcImpuesto > 25) html += `<p>⚠️ <strong>Pagas ${porcImpuesto.toFixed(1)}% de ISR</strong>. Considera deducciones personales.</p>`;
  else if (porcImpuesto > 15) html += `<p>📉 Pagas ${porcImpuesto.toFixed(1)}% de ISR. Nivel típico.</p>`;
  else html += `<p>✅ ¡Excelente! Solo pagas ${porcImpuesto.toFixed(1)}% de ISR.</p>`;
  html += `<p>💰 <strong>De cada peso, te quedan ${porcNeto.toFixed(1)} centavos libres</strong>.</p>`;
  if (fondoAhorro > 0) html += `<p>🏦 Aportas $${fondoAhorro.toLocaleString()} a fondo de ahorro. Tu patrón duplica.</p>`;
  if (infonavit > 0) html += `<p>🏠 Pagas $${infonavit.toLocaleString()} de Infonavit. Se va a tu subcuenta de vivienda.</p>`;
  const proyeccionAnual = neto * CONFIG.periodos[tipoPeriodo].factorMensual * 12;
  html += `<p>📅 <strong>Proyección anual neta:</strong> $${proyeccionAnual.toLocaleString()} (libres de impuestos).</p>`;
  html += `</div>`;
  return html;
}
