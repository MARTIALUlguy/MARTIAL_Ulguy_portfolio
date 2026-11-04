# Portfolio - Ulguy Martial

Portfolio statique gamifié (HTML/CSS/JS pur) déployé sur Vercel.

## Structure

```
.
├── index.html              # Page principale
├── assets/
│   ├── css/
│   │   └── style.css       # Styles (thèmes Open Cowork, Lunio, default)
│   ├── js/
│   │   ├── data.js         # Données des projets (v2)
│   │   └── script.js       # Logique du portfolio (v2)
│   └── images/
│       └── profil.jpg      # Photo de profil (TODO: à fournir)
└── resources/
    └── opencowork-reference.jpg  # Capture de référence (à remettre)
```

## Version actuelle

**Version 2** - Migration du système XP pour éviter les collisions entre projets pro et perso.

### Changements majeurs

#### Système XP (v2)
- Projets pro : `PRO_<id>` (ex: `PRO_opencowork`)
- Projets perso : `PERSO_<id>` (ex: `PERSO_audionote`)
- Migration automatique : si `localStorage` contient d'anciennes clés (`P0`, `PP_`, etc.), elles sont réinitialisées avec conservation du XP

#### Quêtes
- Ouvre 3 projets : compte uniquement les projets pro (`PRO_*`)
- Ouvre Open Cowork : +20 XP
- Teste un projet perso : +30 XP (déclenchée au premier clic sur un lien de projet perso live)

## Projets

### Projets professionnels (6)
1. **Open Cowork** - Stage jg&co (thème dédié)
2. **Application de bridge** - 2025/2026 (TODO: stack à confirmer)
3. **Stage Lunio** - 2025 (thème dédié)
4. **Jeu pédagogique** - 2025 (Godot)
5. **Application de vote** - 2024 (Java, MySQL)
6. **Site web fictif** - 2023 (HTML, CSS)

### Projets personnels (2)
1. **AudioNote** - 2026 (PWA de notes vocales)
   - Live: https://audio-notes-martial.vercel.app
   - Code: https://github.com/MARTIALUlguy/AudioNotes
2. **Générateur de sondages** - À venir (TODO: URLs)

## Compétences (12 max)

### Front
- React
- Next.js
- TypeScript
- Tailwind CSS

### Back & données
- Supabase
- Firebase
- Java
- SQL
- Django

### Outils
- Git / GitLab
- Vercel
- Godot

## Technos utilisées

### Devicon (via jsDelivr v2.16.0)
- react, nextjs, typescript, tailwindcss, vitejs
- java, firebase, supabase, postgresql, mysql
- html5, css3, javascript, python, docker, gitlab
- godot, vercel

### Badges texte (pas de Devicon disponible)
- GDScript, UML, IA, Caméra, IndexedDB, Groq, PWA

## Déploiement

```bash
# Déploiement direct (pas de build nécessaire)
vercel

# Pour production
vercel --prod
```

## Configuration requise

### Après déploiement
1. Mettre à jour `SITE_URL` dans `index.html` (ligne 6) avec le domaine Vercel réel
2. S'assurer que `assets/images/profil.jpg` existe
3. Pour Open Cowork : fournir les captures d'écran (après accord)

## Vérifications recommandées

1. Ouvrir dans un navigateur : pas d'erreurs console
2. Tester le flux XP :
   - Nouveau visiteur → ouvrir 3 projets → quête validée
   - Cliquer sur lien AudioNote → quête perso validée
3. Navigation clavier : Tab, Entrée, Échap
4. Mode sombre (`prefers-color-scheme: dark`)
5. Responsive : mobile 390px

## Notes

- **Mode sombre** : Activé automatiquement via `prefers-color-scheme: dark`
- **Animations** : Désactivées avec `prefers-reduced-motion: reduce`
- **Accessibilité** : Focus visible, contrastes ≥ 4.5:1, navigation clavier
- **Performance** : Animation uniquement sur `transform` et `opacity`, lazy loading des images
- **Pas de dépendances npm** : HTML/CSS/JS pur, Devicon via CDN

## Prochaines étapes

Voir [TODO.md](TODO.md) pour la liste des informations à fournir.
