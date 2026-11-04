// ============================================
// PORTFOLIO DATA - Ulguy Martial
// ============================================

// PROJECTS_PRO : Stages et projets scolaires
const PROJECTS_PRO = [
  {
    id: 'opencowork',
    title: 'Open Cowork',
    date: '30 mars–15 mai puis 1er juillet–28 août 2026',
    icon: '🏢',
    summary: 'Application de coworking communautaire inspirée du coworking Le 30 (Massy), pensée pour relier les espaces de Paris-Saclay.',
    context: 'Stage chez JGConsulting (jg&co). Première version en production pour le coworking pilote.',
    tagline: 'Rencontrez vos voisins.',
    subtitle: 'Découvrez les talents de votre coworking',
    work: [
      { title: 'Maquettes et direction artistique', text: 'Conçues avec Google Stitch, inspirée de la charte Paris-Saclay avec une touche « jeu »' },
      { title: 'Comptes et rôles', text: 'Connexion par code email (sans mot de passe), 4 niveaux de rôle, sécurité RLS sur Supabase' },
      { title: 'Entraide', text: 'Publications « Propose / Cherche » (3 actives max, expiration 30 jours) et Café surprise (tirage hebdo lundi 8h)' },
      { title: 'Messagerie temps réel', text: 'Indicateur de saisie, envoi optimiste, notifications push/email, présence fiabilisée (signal toutes les 2 min)' },
      { title: 'Modération', text: 'Signalements, filtre de mots interdits via déclencheur PostgreSQL' },
      { title: 'Tableau de bord admin', text: 'Tri/recherche/pagination côté base, filtres, page santé, statistiques (Next.js)' },
      { title: 'Autres', text: 'Tour guidé, tests automatisés, documentation, module réunions résumées par IA (n8n, désactivé)' }
    ],
    challenge: 'Un test avec 1 500 comptes a déclenché des milliers d’emails de bienvenue ; protection centrale ajoutée pour bloquer les adresses de test. Leçon : séparer test et production.',
    stack: ['react', 'nextjs', 'supabase', 'postgresql', 'typescript', 'vercel'],
    theme: 'opencowork'
  },
  {
    id: 'bridge',
    title: 'Application de bridge',
    date: '2025/2026 · Projet scolaire',
    icon: '🃏',
    summary: 'Filme une partie de bridge jouée en présentiel, suis-la en direct et reçois des coups proposés par une IA.',
    bullets: [
      'Capture caméra',
      'Suivi de partie en direct',
      'Suggestions par IA'
    ],
    // TODO: stack à confirmer par Ulguy
    stack: ['ia', 'camera'],
    theme: 'default'
  },
  {
    id: 'lunio',
    title: 'Stage Lunio',
    date: 'Juin–août 2025 · Vouneuil-sous-Biard',
    icon: '📝',
    summary: 'Application de cahier de doléances, en équipe de 4.',
    bullets: [
      'Fonctionnalités en Java',
      'Base de données Firebase',
      'Diagrammes UML (Visual Paradigm)',
      'Conception et tests'
    ],
    stack: ['java', 'firebase', 'gitlab', 'uml'],
    theme: 'lunio'
  },
  {
    id: 'godot',
    title: 'Jeu pédagogique',
    date: '2025 · Projet scolaire',
    icon: '🎮',
    summary: 'Jeu mathématique au tour par tour, conçu en 1 mois avec Godot.',
    bullets: [
      'Game design',
      'Prise en main de Godot',
      'Gestion du temps'
    ],
    stack: ['godot', 'gdscript'],
    theme: 'default'
  },
  {
    id: 'vote',
    title: 'Application de vote',
    date: '2024 · Projet scolaire',
    icon: '🗳️',
    summary: 'API avec base de données opérationnelle, livrée dans un temps réduit.',
    bullets: [
      'API',
      'Base de données',
      'Livraison rapide'
    ],
    stack: ['java', 'mysql'],
    theme: 'default'
  },
  {
    id: 'site-web',
    title: 'Site web fictif',
    date: '2023 · Projet scolaire',
    icon: '🌐',
    summary: 'Premier site complet, pour apprendre les bases du web.',
    bullets: [
      'Structure HTML',
      'Mise en page CSS'
    ],
    stack: ['html5', 'css3'],
    theme: 'default'
  }
];

// PROJECTS_PERSO : Projets personnels
const PROJECTS_PERSO = [
  {
    id: 'audionote',
    title: 'AudioNote',
    date: '2026',
    icon: '🎤',
    summary: 'Application PWA de notes vocales avec transcription automatique. Enregistrez, écoutez, transcrivez en français.',
    bullets: [
      'Capture audio via API navigateur (getUserMedia, MediaRecorder)',
      'Choix du format audio selon les capacités du navigateur (prise en compte iOS Safari)',
      'Sauvegarde locale des enregistrements dans IndexedDB avant transcription',
      'Transcription française par le modèle whisper-large-v3-turbo de Groq',
      'Consultation, lecture, téléchargement et suppression des enregistrements',
      'Affichage et copie du texte transcrit, relance des transcriptions échouées',
      'Installation comme PWA avec mise en cache des ressources statiques',
      'Mode hors ligne pour l\'historique (transcription nécessite une connexion)',
      'Fonction serverless Vercel pour protéger la clé API Groq'
    ],
    stack: ['react', 'typescript', 'tailwindcss', 'vitejs', 'indexeddb', 'groq', 'pwa', 'vercel'],
    vercelUrl: 'https://audio-notes-martial.vercel.app',
    repoUrl: 'https://github.com/MARTIALUlguy/AudioNotes',
    status: 'live',
    theme: 'default'
  },
  {
    id: 'sondages',
    title: 'Générateur de sondages',
    date: 'À venir',
    icon: '📊',
    summary: 'Créez des sondages avec des liens partageables.',
    bullets: [
      'Création de sondages personnalisés',
      'Liens partageables uniques',
      'Visualisation des résultats'
    ],
    stack: ['react', 'supabase', 'vercel'],
    // TODO: Ulguy doit fournir les URLs
    vercelUrl: null,
    repoUrl: null,
    status: 'soon',
    theme: 'default'
  }
];

// SKILLS : Compétences avec descriptions (max 12, vérifiables uniquement)
const SKILLS = [
  // Front
  ['React', 'Open Cowork (React Native), AudioNote'],
  ['Next.js', 'Open Cowork (dashboard administration)'],
  ['TypeScript', 'AudioNote'],
  ['Tailwind CSS', 'AudioNote'],
  
  // Back & données
  ['Supabase', 'Open Cowork : base de données et dashboard'],
  ['Firebase', 'Stage Lunio'],
  ['Java', 'Stage Lunio, Application de vote'],
  ['SQL', 'MySQL, PostgreSQL, Supabase'],
  ['Django', 'Projet en équipe'],
  
  // Outils
  ['Git / GitLab', 'Utilisé en équipe au quotidien'],
  ['Vercel', 'Déploiement Open Cowork, AudioNote'],
  ['Godot', 'Jeu pédagogique']
];

// QUESTS : Quêtes disponibles
const QUESTS = [
  ['Ouvre 3 projets', 'p3', 40],
  ['Découvre 3 badges', 'b3', 30],
  ['Contacte-moi', 'ct', 50],
  ['Ouvre Open Cowork', 'oc', 20],
  ['Teste un projet perso', 'pp', 30]
];

// Devicon mappings: tech name -> [icon name, variant]
// Variants: 'original', 'original-wordmark', 'plain', 'plain-wordmark'
const DEVICON_MAP = {
  // Exact matches
  'react': ['react', 'original-wordmark'],
  'nextjs': ['nextjs', 'original'],
  'typescript': ['typescript', 'original'],
  'tailwindcss': ['tailwindcss', 'original'],
  'vitejs': ['vitejs', 'original'],
  'java': ['java', 'original'],
  'python': ['python', 'original'],
  'javascript': ['javascript', 'original'],
  'html5': ['html5', 'original'],
  'css3': ['css3', 'original'],
  'mysql': ['mysql', 'original-wordmark'],
  'postgresql': ['postgresql', 'original'],
  'firebase': ['firebase', 'plain'],
  'supabase': ['supabase', 'original'],
  'gitlab': ['gitlab', 'original'],
  'godot': ['godot', 'original'],
  'docker': ['docker', 'original'],
  'vercel': ['vercel', 'original'],
  
  // Text badges (no Devicon available)
  'gdscript': null,
  'uml': null,
  'ia': null,
  'camera': null,
  'indexeddb': null,
  'groq': null,
  'pwa': null
};
