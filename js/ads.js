// ============================================================
// PUBLICIDAD (Google AdSense)
// ============================================================

function initAds() {
  // Push inicial para todos los ads
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch(e) {
    console.warn('AdSense not loaded');
  }
  
  // Lazy loading con Intersection Observer
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

document.addEventListener('DOMContentLoaded', initAds);
