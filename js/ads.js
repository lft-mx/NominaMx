// ============================================
// PUBLICIDAD (Google AdSense)
// ============================================
function initAds() {
  // Push inicial para cargar todos los anuncios
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch(e) {
    console.warn('AdSense no cargado aún');
  }
  
  // Lazy loading: cargar anuncios solo cuando entran en viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ad = entry.target;
        if (ad.querySelector('.adsbygoogle')) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch(e) {}
        }
        observer.unobserve(ad);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.ad-container').forEach(ad => {
    observer.observe(ad);
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initAds);
