// Données des projets - exactes d'après resources/logic-reference.js

export const CAT = [['Stage', 'Internship'], ['Scolaire', 'School'], ['Perso', 'Personal']];

export const PN = {
  pro: ['Stages', 'Internships'],
  sco: ['Projets scolaires', 'School projects'],
  perso: ['Projets perso', 'Personal projects'],
  disc: ['Défausse', 'Discard']
};

export const KE = {
  IA: 'AI',
  Caméra: 'Camera'
};

// Constantes des filtres
// Familles : Stages (cat 0), Scolaires (cat 1), Perso (cat 2), Tous
export const FAM = [
  ['Stages', 'Internships', p => p.cat === 0],
  ['Scolaires', 'School', p => p.cat === 1],
  ['Perso', 'Personal', p => p.cat === 2],
  ['Tous', 'All', p => true]
];

// Compétences pour les filtres
export const FS = ['React', 'Supabase', 'Java', 'Firebase', 'Godot', 'SQL', 'TypeScript', 'IA'];

// Tableau des projets P
// id implicite = index
// Champs : c (classe de thème), m (monogramme), l (logo de dos), t, cat (0 stage, 1 scolaire, 2 perso),
//          ac (couleur d'accent du dos), shot (URL de capture, null par défaut),
//          d [fr, en], s [fr, en], b [[fr…],[en…]], k (tags)
export const P = [
  {
    c: 'oc',
    m: 'OC',
    l: 'OC',
    t: 'Open Cowork',
    cat: 0,
    ac: '#ffd60a',
    shot: null,
    d: ['Stage jg&co · 2026', 'Internship at jg&co · 2026'],
    s: [
      'Application communautaire pour les coworkings de Paris-Saclay : entraide, café surprise, messagerie temps réel, dashboard.',
      'Community app for the coworking spaces of Paris-Saclay: peer help, surprise coffee, real-time messaging and an admin dashboard.'
    ],
    b: [
      [
        'Maquettes et direction artistique de l’application',
        'Comptes, rôles et sécurité (Supabase)',
        'Entraide, café surprise et messagerie temps réel',
        'Tableau de bord d’administration'
      ],
      [
        'Mock-ups and art direction of the app',
        'Accounts, roles and security (Supabase)',
        'Peer help, surprise coffee and real-time messaging',
        'Admin dashboard'
      ]
    ],
    k: ['React Native', 'Next.js', 'Supabase']
  },
  {
    c: 'lu',
    m: 'Lu',
    l: 'Lu',
    t: 'Lunio',
    cat: 0,
    ac: '#22b8cf',
    shot: null,
    d: ['Stage · 2025', 'Internship · 2025'],
    s: [
      'Application de cahier de doléances, développée en équipe de 4 avec Java et Firebase.',
      'Grievance-register application built in a team of four with Java and Firebase.'
    ],
    b: [
      [
        'Fonctionnalités en Java',
        'Base de données Firebase',
        'Diagrammes UML (Visual Paradigm)',
        'Conception et tests'
      ],
      [
        'Features developed in Java',
        'Firebase database',
        'UML diagrams (Visual Paradigm)',
        'Design and testing'
      ]
    ],
    k: ['Java', 'Firebase', 'UML']
  },
  {
    c: 'br',
    m: '♠',
    l: '♠',
    t: 'Application de bridge',
    cat: 1,
    ac: '#2c7a63',
    shot: null,
    d: ['Projet scolaire · 2025/26', 'School project · 2025/26'],
    s: [
      'Enregistre une partie en direct par caméra et propose des coups grâce à l’IA.',
      'Records a live game through a camera and suggests moves using AI.'
    ],
    b: [
      [
        'Capture vidéo d’une partie en présentiel',
        'Suivi de la partie en direct',
        'Suggestions de coups par IA'
      ],
      [
        'Video capture of an in-person game',
        'Live game tracking',
        'AI-powered move suggestions'
      ]
    ],
    k: ['IA', 'Caméra']
  },
  {
    c: 'gd',
    m: 'Go',
    l: 'Go',
    t: 'Jeu pédagogique',
    cat: 1,
    ac: '#478cbf',
    shot: null,
    d: ['Projet scolaire · 2025', 'School project · 2025'],
    s: [
      'Jeu pédagogique mathématique au tour par tour, conçu en 1 mois avec Godot.',
      'Turn-based educational maths game designed in one month with Godot.'
    ],
    b: [
      [
        'Conception d’un jeu au tour par tour',
        'Réalisé en 1 mois',
        'Prise en main de Godot et GDScript'
      ],
      [
        'Design of a turn-based game',
        'Completed in one month',
        'Learning Godot and GDScript'
      ]
    ],
    k: ['Godot', 'GDScript']
  },
  {
    c: 'vt',
    m: '✓',
    l: '✓',
    t: 'Application de vote',
    cat: 1,
    ac: '#8a4fd8',
    shot: null,
    d: ['Projet scolaire · 2024', 'School project · 2024'],
    s: [
      'API et base de données opérationnelles, livrées dans un temps réduit.',
      'Working API and database delivered within a short timeframe.'
    ],
    b: [
      [
        'API avec base de données opérationnelle',
        'Livraison dans un temps réduit'
      ],
      [
        'API with a working database',
        'Delivered within a short timeframe'
      ]
    ],
    k: ['API', 'SQL']
  },
  {
    c: 'an',
    m: 'AN',
    l: 'AN',
    t: 'AudioNote',
    cat: 2,
    ac: '#2F8F83',
    shot: null,
    d: ['Projet perso', 'Personal project'],
    s: [
      'Application PWA de notes vocales avec transcription automatique en français.',
      'Voice-notes PWA with automatic French transcription.'
    ],
    b: [
      [
        'Enregistrement et écoute des notes vocales',
        'Transcription automatique en français'
      ],
      [
        'Recording and playback of voice notes',
        'Automatic French transcription'
      ]
    ],
    k: ['React', 'TypeScript', 'Vite']
  }
];
