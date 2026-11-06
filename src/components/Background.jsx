import { useEffect } from 'react';

/**
 * Composant Background - Fond animé
 * Contient : blobs (sombre uniquement), bandes colorées, lumière souris, torche
 */
export default function Background() {
  useEffect(() => {
    // Initialisation des variables CSS pour la lumière souris
    const root = document.documentElement;
    let mx = window.innerWidth / 2;
    let my = 300;
    let fx = mx;
    let fy = my;

    const updateMousePosition = (e) => {
      mx = e.clientX;
      my = e.clientY;
      root.style.setProperty('--mx', mx + 'px');
      root.style.setProperty('--my', my + 'px');
    };

    const animate = () => {
      // Lerp pour la lumière principale (inertie)
      fx += (mx - fx) * 0.08;
      fy += (my - fy) * 0.08;
      root.style.setProperty('--fx', fx + 'px');
      root.style.setProperty('--fy', fy + 'px');
      requestAnimationFrame(animate);
    };

    // Ajouter l'écouteur de mouvement de souris
    window.addEventListener('pointermove', updateMousePosition, { passive: true });
    
    // Démarrer l'animation
    const animId = requestAnimationFrame(animate);

    // Nettoyage
    return () => {
      window.removeEventListener('pointermove', updateMousePosition);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Blobs (cercles flous) */}
      <div className="bg" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </div>
      
      {/* Bandes colorées */}
      <div className="bg2" aria-hidden="true">
        <u></u>
        <u></u>
        <u></u>
      </div>
      
      {/* Torche */}
      <div className="torch" aria-hidden="true"></div>
    </>
  );
}
