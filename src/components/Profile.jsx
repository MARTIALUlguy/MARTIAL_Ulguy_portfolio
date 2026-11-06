import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';

/**
 * Composant Profile - Onglet Profil
 * Contient : hero, rôle en machine à écrire, photo, jauges, parcours, échiquier
 */
export default function Profile({ onTabChange }) {
  const { t, lang } = useLang();
  const { updateSeen } = useProgress();
  
  // Photo URL - à remplacer par public/profil.jpg quand disponible
  const photoUrl = '/profil.jpg';
  
  // Référence pour la photo
  const photoRef = useRef(null);
  
  // State pour le texte du rôle (machine à écrire)
  const [roleText, setRoleText] = useState('> ');
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  
  // Rôles à afficher
  const roles = {
    fr: ['développeur full-stack', 'React Native & Supabase', 'Java & Firebase'],
    en: ['full-stack developer', 'React Native & Supabase', 'Java & Firebase']
  };
  
  // Animation de la machine à écrire
  useEffect(() => {
    const rolesList = roles[lang];
    const currentRole = rolesList[roleIndex];
    
    if (!currentRole) return;
    
    const timer = setTimeout(() => {
      if (isDeleting) {
        // Effacement
        if (charIndex > 0) {
          setCharIndex(prev => prev - 1);
          setRoleText('> ' + currentRole.slice(0, charIndex - 1));
        } else {
          // Passer au rôle suivant
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % rolesList.length);
          setCharIndex(0);
        }
      } else {
        // Écriture
        if (charIndex < currentRole.length) {
          setCharIndex(prev => prev + 1);
          setRoleText('> ' + currentRole.slice(0, charIndex + 1));
        } else {
          // Attendre puis commencer l'effacement
          setTimeout(() => {
            setIsDeleting(true);
          }, 1600);
        }
      }
    }, isDeleting ? 30 : 70);
    
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, lang, roles]);
  
  // Reset l'animation quand la langue change
  useEffect(() => {
    setRoleText('> ');
    setCharIndex(0);
    setRoleIndex(0);
    setIsDeleting(false);
  }, [lang]);
  
  // Gestion de l'inclinaison 3D de la photo (sans setState dans pointermove)
  useEffect(() => {
    const photo = photoRef.current;
    if (!photo) return;
    
    let rafId = null;
    let mx = 0, my = 0;
    
    const handlePointerMove = (e) => {
      const rect = photo.getBoundingClientRect();
      mx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      my = (e.clientY - rect.top - rect.height / 2) / rect.height;
    };
    
    const updateTransform = () => {
      if (mx !== 0 || my !== 0) {
        photo.style.transform = `rotateY(${mx * 18}deg) rotateX(${-my * 18}deg) translateY(-7px)`;
        photo.style.setProperty('--sx', `${(mx + 1) * 50}%`);
        photo.style.setProperty('--sy', `${(-my + 1) * 50}%`);
      } else {
        photo.style.transform = 'translateY(-7px)';
      }
      rafId = requestAnimationFrame(updateTransform);
    };
    
    photo.addEventListener('pointermove', handlePointerMove, { passive: true });
    photo.addEventListener('pointerenter', updateTransform, { passive: true });
    photo.addEventListener('pointerleave', () => {
      photo.style.transform = 'translateY(-7px)';
      mx = 0;
      my = 0;
    });
    
    // Initialiser la position
    photo.style.transform = 'translateY(-7px)';
    
    return () => {
      photo.removeEventListener('pointermove', handlePointerMove);
      photo.removeEventListener('pointerenter', updateTransform);
      photo.removeEventListener('pointerleave', () => {});
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  
  // Marquer le profil comme vu
  useEffect(() => {
    updateSeen('0');
  }, [updateSeen]);
  
  // Gestion du clic sur "Voir mes projets"
  const handleViewProjects = useCallback(() => {
    onTabChange(1);
  }, [onTabChange]);
  
  // Gestion du scroll vers contact
  const handleContactClick = useCallback((e) => {
    e.preventDefault();
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Jauges
  const gauges = {
    fr: [
      { label: 'Adaptabilité', value: 88 },
      { label: 'Implication', value: 94 },
      { label: 'Sang-froid', value: 82 }
    ],
    en: [
      { label: 'Adaptability', value: 88 },
      { label: 'Commitment', value: 94 },
      { label: 'Composure', value: 82 }
    ]
  };
  
  // Parcours
  const timeline = {
    fr: [
      { date: '2026 →', text: 'Cycle ingénieur EFREI, Villejuif' },
      { date: 'Mai 2026', text: 'Stage jg&co, Open Cowork' },
      { date: '2025', text: 'Stage Lunio, Java et Firebase' },
      { date: '2023–26', text: 'BUT Informatique, IUT d’Orsay' }
    ],
    en: [
      { date: '2026 →', text: 'Engineering degree, EFREI Villejuif' },
      { date: 'May 2026', text: 'Internship at jg&co, Open Cowork' },
      { date: '2025', text: 'Internship at Lunio, Java and Firebase' },
      { date: '2023–26', text: 'BUT Computer Science, IUT d’Orsay' }
    ]
  };
  
  // Échiquier
  const chessPieces = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
  
  return (
    <section className="p on">
      <div className="hero">
        <div>
          {/* Surtitre */}
          <p className="m" style={{ color: 'var(--mut)' }}>
            {t('Cycle ingénieur · EFREI · alternance 3 ans')}
          </p>
          
          {/* Titre */}
          <h1>
            Ulguy<br />
            <em style={{ color: 'var(--v)' }}>Martial</em>
          </h1>
          
          {/* Rôle (machine à écrire) */}
          <p className="role m" style={{ color: 'var(--t)' }}>
            {roleText}<span className="blink">▍</span>
          </p>
          
          {/* Paragraphe */}
          <p>
            {t('Étudiant en cycle ingénieur à l’EFREI (équivalent Master) en Logiciels et Systèmes d’Information, je recherche un contrat d’apprentissage en développement logiciel et full-stack.')}
          </p>
          
          {/* Boutons */}
          <div className="row">
            <a 
              href="#contact" 
              className="btn" 
              onClick={handleContactClick}
            >
              {t('Me contacter')}
            </a>
            <button 
              className="btn o" 
              onClick={handleViewProjects}
            >
              {t('Voir mes projets')}
            </button>
          </div>
          
          {/* Citation */}
          <p className="quote">
            {t('« Prendre le temps, c’est apprécier. Apprécier, c’est s’investir. »')}
          </p>
        </div>
        
        {/* Photo */}
        <div className="tilt">
          <div className="ph" ref={photoRef}>
            <img 
              src={photoUrl}
              alt={t('Départ')}
              width="240"
              height="240"
              style={{ maxWidth: 'min(240px, 60vw)' }}
            />
          </div>
        </div>
      </div>
      
      {/* Jauges */}
      <div className="stats m">
        {gauges[lang].map((gauge, i) => (
          <div key={i} className="st">
            <span>{gauge.label}</span>
            <div>
              <b style={{ '--w': `${gauge.value}%` }}></b>
            </div>
          </div>
        ))}
      </div>
      
      {/* Parcours */}
      <div className="time">
        {timeline[lang].map((item, i) => (
          <div key={i}>
            <span className="m" style={{ color: 'var(--v)' }}>{item.date}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      
      {/* Échiquier */}
      <div 
        className="chess" 
        title={t('Un seul coup en tête : le cavalier')}
      >
        {chessPieces.map((piece, i) => (
          <i key={i}>{piece}</i>
        ))}
      </div>
    </section>
  );
}
