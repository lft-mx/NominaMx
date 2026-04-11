const STORAGE_KEY = 'nominamx_history';
function guardarCalculo(resultado, datosEntrada) {
  const history = obtenerHistorial();
  const nuevo = { id: Date.now(), fecha: new Date().toISOString(), bruto: resultado.percepciones.gravado, neto: resultado.neto, isr: resultado.isr.isrPeriodo, tipoPeriodo: datosEntrada.tipoPeriodo };
  history.unshift(nuevo);
  if (history.length > 20) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderizarHistorial();
}
function obtenerHistorial() { const data = localStorage.getItem(STORAGE_KEY); return data ? JSON.parse(data) : []; }
function limpiarHistorial() { localStorage.removeItem(STORAGE_KEY); renderizarHistorial(); }
function renderizarHistorial() {
  const container = document.getElementById('historyList');
  const dashboard = document.getElementById('dashboardPanel');
  const history = obtenerHistorial();
  if (history.length === 0) { if (container) container.innerHTML = '<p class="empty">Aún no guardas cálculos.</p>'; if (dashboard) dashboard.style.display = 'none'; return; }
  if (dashboard) dashboard.style.display = 'block';
  if (!container) return;
  container.innerHTML = history.map(item => `<div class="history-item"><div><strong>💰 $${item.bruto.toLocaleString()}</strong> → <strong class="success">$${item.neto.toLocaleString()}</strong><br><span class="history-date">${new Date(item.fecha).toLocaleDateString()} · ${item.tipoPeriodo}</span></div><div>ISR: $${item.isr.toLocaleString()}</div></div>`).join('');
}
document.addEventListener('DOMContentLoaded', () => { renderizarHistorial(); document.getElementById('clearHistoryBtn')?.addEventListener('click', limpiarHistorial); });
