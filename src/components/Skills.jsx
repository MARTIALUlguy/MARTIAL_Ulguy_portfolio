import { useRef, useEffect, useCallback } from 'react';
import { useLang } from '../hooks/useLang';

/**
 * Composant Skills - Compétences
 * 3 groupes : Front, Back et données, Outils et méthodes
 * Puces avec halo local (--cx/--cy)
 */
export default function Skills() {
  const { t, lang } = useLang();
  
  // Groupes de compétences
  const skillGroups = {
    fr: [
      {
        title: 'Front',
        skills: ['React / React Native', 'Next.js', 'JavaScript']
      },
      {
        title: 'Back et données',
        skills: ['Supabase', 'Firebase', 'Java', 'Python', 'SQL', 'Django']
      },
      {
        title: 'Outils et méthodes',
        skills: ['Git / GitLab', 'Docker', 'Agile', 'UML']
      }
    ],
    en: [
      {
        title: 'Front-end',
        skills: ['React / React Native', 'Next.js', 'JavaScript']
      },
      {
        title: 'Back-end and data',
        skills: ['Supabase', 'Firebase', 'Java', 'Python', 'SQL', 'Django']
      },
      {
        title: 'Tools and methods',
        skills: ['Git / GitLab', 'Docker', 'Agile', 'UML']
      }
    ]
  };
  
  // Gestion du pointermove sur les chips
  const handleChipPointerMove = useCallback((e, chipRef) => {
    if (!chipRef.current) return;
    const rect = chipRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    chipRef.current.style.setProperty('--cx', `${cx}px`);
    chipRef.current.style.setProperty('--cy', `${cy}px`);
  }, []);

  return (
    <section>
      <h2>Compétences</h2>
      <p className="sub">
        {t('Regroupées par usage, pas par pourcentage.')}
      </p>
      
      {skillGroups[lang].map((group, groupIndex) => (
        <div key={groupIndex}>
          <p className="m">{t(group.title)}</p>
          <div className="chips">
            {group.skills.map((skill, skillIndex) => {
              const chipRef = useRef(null);
              return (
                <span
                  key={skillIndex}
                  ref={chipRef}
                  className="chip"
                  onPointerMove={(e) => handleChipPointerMove(e, chipRef)}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
