// ============================================================
// MODO OSCURO / CLARO
// ============================================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
    document.getElementById('themeBtn').innerText = '☀️';
  } else {
    document.body.classList.remove('dark');
    document.getElementById('themeBtn').innerText = '🌙';
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('themeBtn').innerText = isDark ? '☀️' : '🌙';
  
  // Regenerar gráfica si existe
  if (window.chartGlobal) {
    const ctx = document.getElementById('graficaPorcentajes').getContext('2d');
    window.chartGlobal.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue('--text');
    window.chartGlobal.update();
  }
}

// Event listener
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
});
