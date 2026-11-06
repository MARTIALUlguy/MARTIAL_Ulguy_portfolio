/**
 * Composant Footer - Pied de page
 * Affiche le copyright et un bouton pour rejouer l'intro
 */
export default function Footer({ lang, t, onReplayIntro }) {
  return (
    <footer className="m">
      {t('© 2026 Ulguy Martial · Brétigny-sur-Orge (91)')}
      {onReplayIntro && (
        <>
          {' · '}
          <button id="replay" onClick={onReplayIntro} className="m">
            {t('Rejouer l’intro « première visite »')}
          </button>
        </>
      )}
    </footer>
  );
}
