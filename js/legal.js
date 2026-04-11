// ============================================================
// DISCLAIMER LEGAL Y COOKIES
// ============================================================

function initLegal() {
  // Disclaimer flotante (solo una vez)
  const hasSeenDisclaimer = localStorage.getItem('disclaimer_seen');
  if (!hasSeenDisclaimer) {
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.id = 'legalDisclaimer';
    disclaimerDiv.innerHTML = `
      <div style="position:fixed; bottom:20px; right:20px; background:#ff9800; color:#1a1a2e; padding:12px 16px; border-radius:12px; font-size:12px; max-width:300px; z-index:10000; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        <strong>⚠️ Aviso Legal</strong><br>
        Esta herramienta es informativa. Los cálculos son estimaciones.<br>
        No constituye asesoría fiscal oficial.
        <button onclick="this.parentElement.parentElement.remove();localStorage.setItem('disclaimer_seen','true')" style="background:#fff; border:none; padding:4px 8px; margin-top:8px; border-radius:6px; cursor:pointer;">Entendido</button>
      </div>
    `;
    document.body.appendChild(disclaimerDiv);
  }
  
  // Footer legal
  const legalFooter = document.getElementById('legal-footer');
  if (legalFooter) {
    legalFooter.innerHTML = `<small><a href="#" style="color:inherit;">Aviso de privacidad</a> | <a href="#" style="color:inherit;">Términos de uso</a></small>`;
  }
}

document.addEventListener('DOMContentLoaded', initLegal);
