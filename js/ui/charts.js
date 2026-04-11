let chartGlobal = null;
function renderizarGrafica(datos) {
  const ctx = document.getElementById('graficaPorcentajes').getContext('2d');
  if (chartGlobal) chartGlobal.destroy();
  const textColor = getComputedStyle(document.body).getPropertyValue('--text');
  chartGlobal = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: datos.labels, datasets: [{ data: datos.porcentajes, backgroundColor: datos.colores, borderWidth: 0, hoverOffset: 10 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 11 } } }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}%` } } } }
  });
}
