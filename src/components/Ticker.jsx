/**
 * Composant Ticker - Bandeau défilant sous le HUD
 * Texte défilant avec animation linéaire infinie
 */
export default function Ticker({ lang, t }) {
  const getTickerText = () => {
    if (lang === 'en') {
      return [
        'Ulguy Martial',
        'Seeking work-study',
        'React Native',
        'Supabase',
        'Java',
        'Next.js',
        'Engineering degree · EFREI',
        'Ready to race'
      ];
    } else {
      return [
        'Ulguy Martial',
        'Recherche alternance',
        'React Native',
        'Supabase',
        'Java',
        'Next.js',
        'Cycle ingénieur · EFREI',
        'Prêt à rouler'
      ];
    }
  };

  const texts = getTickerText();
  const content = (texts.join('  ◆  ') + '  ◆  ').repeat(4);

  return (
    <div className="tick m" aria-hidden="true">
      <div>{content}</div>
    </div>
  );
}
