function initLegal() {
  const seen = localStorage.getItem('disclaimer_seen');
  if (!seen) {
    const div = document.createElement('div');
    div.innerHTML = `<div style="position:fixed; bottom:20px; right:20px; background:#f59e0b; color:#1e293b; padding:12px 16px; border-radius:20px; font-size:12px; max-width:280px; z-index:10000; box-shadow:0 4px 12px rgba(0,0,0,0.2);"><strong>⚠️ Aviso Legal</strong><br>Herramienta informativa, no asesoría fiscal oficial.<button onclick="this.parentElement.parentElement.remove();localStorage.setItem('disclaimer_seen','true')" style="background:#fff; border:none; padding:4px 12px; margin-top:8px; border-radius:30px; cursor:pointer;">Entendido</button></div>`;
    document.body.appendChild(div);
  }
  const footer = document.getElementById('legal-footer');
  if (footer) footer.innerHTML = '<small><a href="#" style="color:inherit;">Aviso de privacidad</a> | <a href="#" style="color:inherit;">Términos de uso</a></small>';
}
document.addEventListener('DOMContentLoaded', initLegal);
