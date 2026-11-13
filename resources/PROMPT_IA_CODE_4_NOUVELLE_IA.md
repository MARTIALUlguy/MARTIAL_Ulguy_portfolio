# Mission : corriger le portfolio React d'Ulguy Martial (tu reprends le travail d'une autre IA)

Tu arrives sur un projet existant : **tu n'as aucun historique**, tout ce qu'il te faut est ci-dessous et dans le dépôt. Lis ce document en entier, puis travaille **phase par phase**.

## 0. Contexte
- Portfolio d'Ulguy Martial (étudiant en cycle ingénieur à l'EFREI, en recherche d'alternance en développement full-stack). **React + Vite, JavaScript uniquement** (pas de TypeScript), tests **Vitest + Testing Library**. Site en ligne : https://martialulguyportfolio.vercel.app/ (déployé depuis le dépôt GitHub, preset Vite).
- Le site est un portfolio-jeu : porte d'intro, HUD, 2 onglets (« Profil » ; « Projets & compétences » avec un deck de cartes, des pioches, une défausse, des filtres), FR/EN, thèmes clair/sombre, sons, mode calme.
- Build et tests sont verts **mais** une relecture a trouvé des défauts qu'ils ne voient pas, parce que les tests moquent les hooks. C'est ta mission.
- Fichiers de référence (s'ils sont dans le dépôt) : `PROMPT_IA_CODE_3.md` (spécification complète) et `resources/maquette-v4.html` (maquette de référence, à ouvrir dans un navigateur). **Ne les relis pas en entier** : consulte-les seulement par `grep`, quand un détail de comportement te manque.

## 1. Règles
- **Économie de contexte** : ne lis pas `styles.css` (~1200 lignes) ni les gros fichiers en entier ; utilise `grep -n` et `sed -n 'a,bp'`. Pas de longs récits.
- **Si ton contexte dépasse ~70 %** : arrête-toi proprement, commit, et écris l'avancement dans `NEXT_STEPS.md` (phases faites, phase en cours, reste à faire) pour qu'une autre session reprenne.
- **Un commit par phase**, après `npm run build` et `npm test` verts.
- N'invente rien : pas de nouvelle dépendance, pas de nouveau texte visible hors i18n, pas de lien ou de donnée fictifs.
- **Ne modifie pas `src/state/cards.js`** (réducteur correct, avec un test à 500 séquences) ni son test, sauf bug prouvé que tu signales.
- Toute chaîne visible passe par `t('texte français')` (`src/data/i18n.js`, la clé est le texte français ; garde la parité FR/EN : un test existe).
- Ne coche jamais une vérification que tu n'as pas exécutée. Dis ce que tu n'as pas pu vérifier.

## 2. Carte du projet (ce qui existe)
`src/App.jsx` (orchestre) · `src/components/` : Background, Hud, Ticker, Footer, Door, Profile, Contact, Skills, Projects, Deck, Card, Piles, FilterBar, DetailDialog · `src/hooks/` : useLang `{lang,setLang,t,toggleLang}`, useTheme `{theme,toggleTheme}`, useSound `{soundLevel,toggleSound,getSoundLabel,handleUserGesture,beep,door}`, useProgress `{scrollProgress,seen,updateSeen,revLights,sectors,allSectorsOn}` · `src/data/projects.js`, `i18n.js` · `src/state/cards.js` (+ test).
Contrats à préserver : `Hud` reçoit `revLights()` et `sectors()` (tableaux) ; `Door` a les props `onIntroEnd` et `firstVisit` ; `Piles` a les props `piles, discard, onDraw` ; les cartes ont `data-i` (index du projet) et la défausse a la structure `.pl[data-k="disc"] .stack`.

## PHASE A : ménage, photo, dépendances, polices
1. Supprime : `VERIFICATION_REPORT.md` (rapport périmé d'un ancien site), `src/components/Projects.test.jsx.bak`, `Projects.test.jsx.new`, `src/state/CardsContext.jsx` (inutilisé), les dossiers `assets/css` et `assets/js` à la racine (ancien site HTML), `src/assets/hero.png` et `vite.svg`, `public/icons.svg` et `public/favicon.svg` s'ils ne sont référencés nulle part (vérifie par `grep`).
2. **Photo** : `public/profil.jpg` n'existe pas ; la photo est dans `assets/images/profil.jpg` (292 Ko). Crée `public/profil.jpg` (carré 600×600 centré sur le visage, JPEG qualité ~80, ≤ 120 Ko), puis supprime `assets/images/`. `Profile.jsx` et le `og:image` de `index.html` pointent déjà sur `/profil.jpg`.
3. **Porte** : `Door.jsx` contient un data-URI JPEG **tronqué** (≈ 660 octets, image cassée). Remplace-le par `/profil.jpg`.
4. **Dépendances** : `package.json` demande React 18, Vite 5, Vitest 2 ; `package-lock.json` et `node_modules` contiennent React 19, Vite 8, Vitest 5. `package.json` fait foi : supprime `node_modules` et le lockfile, lance `npm install`, puis build et tests. Signale tout test dont le résultat change. Ne commite ni `node_modules` ni `dist` (vérifie `.gitignore`).
5. **Polices** : `styles.css` utilise Sora et JetBrains Mono, mais `index.html` charge Nunito et Plus Jakarta Sans. Charge **Sora (500, 700, 800) et JetBrains Mono (500)** uniquement, via Google Fonts.
→ commit « phase A ».

## PHASE B : état partagé (bug critique)
Problème : chaque composant appelle `useLang()`, `useSound()`, `useProgress()` ou `useTheme()` ; ce sont de simples `useState` **locaux**, donc **non partagés**. Conséquences : le bouton FR/EN ne traduit que le HUD, le bandeau et le pied de page (les autres composants restent en français) ; « Son : coupé » ne coupe pas les bips des autres composants ; `updateSeen('c')` dans `Projects` n'allume jamais le HUD ; plusieurs `AudioContext` coexistent.
Correction :
1. Crée `src/state/AppContext.jsx` : un `AppProvider` qui détient **un seul** état pour : `lang` (+ `t`, `setLang`, `toggleLang`, met à jour `document.documentElement.lang`), `theme` (+ `toggleTheme`, attribut `data-theme` sur `<html>`, défaut = préférence système), `soundLevel` (0 coupé, 1 doux, 2 fort ; défaut 1) avec `toggleSound`, `getSoundLabel`, `handleUserGesture`, `beep`, `door` et **un seul** `AudioContext` créé au premier geste, et `progress` (`scrollProgress`, `seen`, `updateSeen`, `revLights`, `sectors`, `allSectorsOn`).
2. Réécris `useLang`, `useTheme`, `useSound`, `useProgress` comme de **fins consommateurs** du contexte, avec **les mêmes noms et valeurs de retour** (aucun composant à réécrire), levant une erreur claire hors provider.
3. `src/main.jsx` enveloppe `<App />` dans `<AppProvider>` (garde `React.StrictMode`). Dans `App.jsx`, retire les props redondantes (`lang`, `t`…) quand le composant peut utiliser le hook, sans casser les contrats de la section 2.
4. **Supprime les tests d'environnement du code de production** : `isTestEnv = typeof window === 'undefined' || !window.scrollY` (useProgress) et `!window.AudioContext` (useSound). Avec `scrollY === 0` au chargement, ils **empêchent d'attacher l'écouteur de scroll et l'IntersectionObserver**. Les tests mockent `window` à la place.
5. Défilement : écouteur `scroll` toujours attaché (passif, throttle par `requestAnimationFrame`, nettoyé au démontage). Voyants : `1 + round(scrollProgress × 9)` sur 10 (4 premiers verts, 3 rouges, 3 bleus).
6. Secteurs du HUD, clés `['0','1','c','k']` : `0` Profil vu, `1` onglet Projets vu, `c` les 6 projets en main (déjà appelé par `Projects`), `k` section Contact visible à 60 %. **L'`IntersectionObserver` (seuil 0,6) est attaché dans `Contact.jsx`** via une `ref`, nettoyé au démontage, et appelle `updateSeen('k')` (plus de `getElementById` dans le hook). `allSectorsOn` teste explicitement les 4 clés.
7. Adapte les tests existants pour envelopper les composants dans `AppProvider` (helper `src/test/renderWithProviders.jsx`).
→ commit « phase B ».

## PHASE C : cartes, pioches, défausse, focus (`Projects.jsx`, `Piles.jsx`, `Card.jsx`)
1. **Défausse** : `handleDiscard` annule **tous** les timers en cours ; deux défausses rapides laissent la première carte invisible (`.out`, opacité 0) mais **toujours dans la main**. Suis les cartes « en sortie » avec un état React (`leaving`), un timer **par carte**, ignore une 2e défausse de la même carte, et supprime la mutation directe du DOM (`classList.add('out')`, `style.setProperty`) : `Card` reçoit `isOut` et les variables `--dx/--dy` par props/style. Durée 480 ms ; en reduced-motion ou mode calme (`body.calm`), envoi immédiat.
2. **Focus** : dans `handleCardClick`, `setActiveCardRef({current: cardElement})` est écrasé par `openDialog(projectIndex)` (qui remet `undefined`) ; le focus ne revient jamais sur la carte. Passe l'élément à `openDialog` et garde-le jusqu'à la fermeture du `DetailDialog`.
3. **Pioche** : le clic appelle `onDraw` tout de suite et l'animation `fly` (présente dans le CSS) n'est jamais déclenchée. Implémente : clic sur une pioche → la carte du dessus prend la classe `fly` avec `--dx/--dy` vers le centre de la main, puis `DRAW` est envoyé après **640 ms** ; si le dessus est la carte « Bientôt », elle se retourne (classe `fl`) 1,9 s sans changer l'état ; les clics sont ignorés pendant l'animation ; reduced-motion ou mode calme : envoi immédiat. Tous les timers sont nettoyés au démontage.
4. **État conservé entre onglets** : `Projects` est démonté au changement d'onglet, donc main, défausse et filtre repartent à zéro. Garde les deux panneaux de `App.jsx` montés et masque l'inactif (`hidden` + `aria-hidden`).
→ commit « phase C ».

## PHASE D : porte d'intro (`Door.jsx`, `App.jsx`)
- Première visite (pas de `localStorage.um_seen`) : phrase « Prendre le temps, c'est apprécier. Apprécier, c'est s'investir. » mot par mot, bouton « Lever la porte », montée auto après 9 s.
- **Visites suivantes** : afficher la porte courte avec « Re-bonjour. » (EN « Welcome back. »), sans bouton, montée après **1,1 s**. Aujourd'hui, rien n'est affiché pour ces visiteurs.
- Calcule `firstVisit` / `showDoor` de façon **synchrone** (initialiseur paresseux de `useState`) pour éviter le flash du premier rendu ; ne lis plus `doorEndedRef.current` pendant le rendu.
- `prefers-reduced-motion` : pas de porte. Le lien du pied de page rejoue l'intro « première visite ».
→ commit « phase D ».

## PHASE E : tests d'intégration (sans moquer les hooks)
Dans `src/App.integration.test.jsx`, avec `renderWithProviders` et timers simulés :
1. FR → EN : le titre du `Profile`, les libellés de `Projects`, `FilterBar` et `Contact`, et le bandeau changent ; retour en FR.
2. Son « coupé » : plus aucun son émis depuis `Projects` (espionne `AudioContext`).
3. Piocher les 6 projets : le 3e secteur du HUD s'allume.
4. Événement `scroll` simulé : les voyants changent.
5. `IntersectionObserver` simulé sur `#contact` : le 4e secteur s'allume ; les 4 allumés → classe « tous » du HUD.
6. Deux défausses rapides : **les deux** cartes quittent la main.
7. Changer d'onglet puis revenir : main, défausse et filtre conservés.
8. Fermer le dialogue : le focus revient sur la carte d'origine.
9. Pioche : la carte n'arrive qu'après 640 ms ; « Bientôt » ne change pas l'état.
N'ajoute pas d'autres tests qui moquent les hooks.
→ commit « phase E ».

## PHASE F : contrôle final et rapport
Exécute et **colle les sorties réelles** de : `npm run build`, `npm test`, `grep -rnE " as const|: string|interface " src` (doit être vide), `grep -rn "isTestEnv" src` (vide hors tests), `git status --short`. Puis écris : fichiers créés / modifiés / supprimés ; ce que tu n'as **pas** pu vérifier (rendu visuel, son réel, Lighthouse) ; TODO restants pour Ulguy (PDF des CV, liens et captures d'AudioNote, stack du bridge, confirmation TypeScript pour Open Cowork, `og:image` à vérifier une fois la photo déployée).
