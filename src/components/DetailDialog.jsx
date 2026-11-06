import { useEffect, useRef, useCallback } from 'react';
import { useLang } from '../hooks/useLang';
import { P, CAT } from '../data/projects';

/**
 * Composant DetailDialog - Fenêtre de détails d'un projet
 * Utilise <dialog> natif avec showModal, fermeture par ✕, fond et Échap
 * Retour du focus sur la carte d'origine
 */
export default function DetailDialog({ projectIndex, onClose, onDiscard, focusRef }) {
  const { t, lang } = useLang();
  const dialogRef = useRef(null);
  const project = P[projectIndex];

  // Fermer avec Échap
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
      // Retour du focus sur la carte d'origine
      if (focusRef?.current) {
        focusRef.current.focus();
      }
    }
  }, [onClose, focusRef]);

  // Gestion de la fermeture
  const handleClose = useCallback(() => {
    onClose();
    // Retour du focus sur la carte d'origine
    if (focusRef?.current) {
      focusRef.current.focus();
    }
  }, [onClose, focusRef]);

  // Fermer au clic sur le fond
  const handleBackdropClick = useCallback((e) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  }, [handleClose]);

  // Gestion du clic sur Défausser
  const handleDiscardClick = useCallback(() => {
    handleClose();
    // Petit délai pour laisser le dialog se fermer avant de défausser
    setTimeout(() => {
      onDiscard(projectIndex);
    }, 50);
  }, [handleClose, onDiscard, projectIndex]);

  // Effet pour gérer le focus et les événements
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Ouvrir le dialog
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    }

    // Focus sur le dialog
    if (typeof dialog.focus === 'function') {
      dialog.focus();
    }

    // Ajouter l'écouteur de touche
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Fermer le dialog quand onClose change (pour ré-ouvrir)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !projectIndex && projectIndex !== 0 && projectIndex !== undefined) {
      dialog.close();
    }
  }, [projectIndex]);

  if (projectIndex === undefined || projectIndex === null) {
    return null;
  }

  // Styles de l'en-tête selon le thème
  const headerStyle = {
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    ...(project.c === 'oc' && {
      background: '#1a1a1a',
      borderBottom: '4px solid #ffd60a'
    }),
    ...(project.c === 'lu' && {
      background: 'linear-gradient(150deg, #22b8cf, #f08a4b)'
    }),
    ...(project.c === 'br' && {
      background: 'radial-gradient(circle, #2c7a63, #173f33)'
    }),
    ...(project.c === 'an' && {
      background: 'linear-gradient(160deg, #2F8F83, #1b4f55)'
    }),
    ...(project.c === 'gd' && {
      background: 'linear-gradient(150deg, #478cbf, #2a4f73)'
    }),
    ...(project.c === 'vt' && {
      background: 'linear-gradient(150deg, #8a4fd8, #4a2a86)'
    })
  };

  return (
    <dialog
      ref={dialogRef}
      className="dbd"
      onClick={handleBackdropClick}
      style={{
        width: 'min(520px, 92vw)',
        borderRadius: '22px',
        border: 'none',
        background: 'var(--bg2)',
        color: 'var(--fg)',
        padding: '0',
        boxShadow: '0 24px 40px -22px #000a'
      }}
    >
      {/* En-tête */}
      <div style={headerStyle}>
        <span style={{ font: '800 3rem', fontFamily: 'Sora, sans-serif' }}>
          {project.m}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0', font: '800 1.6rem', fontFamily: 'Sora, sans-serif' }}>
            {project.t}
          </h2>
          <span className="m" style={{ opacity: 0.8, fontSize: '.85rem' }}>
            {t(project.d[lang === 'fr' ? 0 : 1])} · {t(CAT[project.cat][lang === 'fr' ? 0 : 1])}
          </span>
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: '24px' }}>
        {/* Résumé */}
        <p style={{ margin: '0 0 20px', opacity: 0.92, lineHeight: '1.6' }}>
          {t(project.s[lang === 'fr' ? 0 : 1])}
        </p>

        {/* Puces */}
        {project.b && project.b[lang === 'fr' ? 0 : 1] && (
          <ul style={{ margin: '0 0 20px', paddingLeft: '20px' }}>
            {project.b[lang === 'fr' ? 0 : 1].map((bullet, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{t(bullet)}</li>
            ))}
          </ul>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {project.k.map((tag, i) => (
            <span
              key={i}
              className="chip"
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--line)',
                borderRadius: '99px',
                padding: '4px 12px',
                fontSize: '.75rem',
                opacity: 0.8
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {/* Pour la catégorie 2 (Perso), boutons désactivés */}
          {project.cat === 2 && (
            <>
              <button
                type="button"
                className="btn"
                aria-disabled="true"
                disabled
                style={{
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }}
              >
                {t('Voir en ligne')}
                <span style={{ fontSize: '.7rem', opacity: 0.6, marginLeft: '4px' }}>
                  {t('bientôt')}
                </span>
              </button>
              <button
                type="button"
                className="btn"
                aria-disabled="true"
                disabled
                style={{
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }}
              >
                {t('Code')}
                <span style={{ fontSize: '.7rem', opacity: 0.6, marginLeft: '4px' }}>
                  {t('bientôt')}
                </span>
              </button>
            </>
          )}

          {/* Bouton Défausser la carte */}
          <button
            type="button"
            className="btn"
            onClick={handleDiscardClick}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              color: 'var(--fg)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {t('Défausser la carte')}
          </button>
        </div>
      </div>

      {/* Bouton de fermeture */}
      <button
        type="button"
        className="close"
        onClick={handleClose}
        aria-label={t('Fermer')}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%'
        }}
      >
        ✕
      </button>
    </dialog>
  );
}
