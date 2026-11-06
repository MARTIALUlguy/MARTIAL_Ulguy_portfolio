# Mission 3 : reproduire à l'identique la maquette v4 en React + Vite

Tu reconstruis le portfolio d'Ulguy Martial (étudiant en cycle ingénieur à l'EFREI, en recherche d'alternance en développement full-stack) en **React 18 + Vite**, déployé sur **Vercel**. Une maquette interactive validée existe : elle est la **source de vérité** visuelle et comportementale.

## 0. Fichiers de référence (à lire en premier)
- `resources/maquette-v4.html` : la maquette complète (HTML + CSS + JS). **Ouvre-la dans un navigateur**, lis son CSS et son JS. Reprends les valeurs numériques (durées, courbes, tailles, couleurs) telles quelles.
- `resources/logic-reference.js` : la logique des cartes (données `P`, `deal`, `reset`, `draw`, `discard`, filtres), version impérative. À porter en **réducteur pur** testable.
- `resources/logic-test-reference.js` : 9 scénarios de test de cette logique. À porter en tests Vitest.
- `resources/opencowork-reference.jpg` : référence visuelle de l'application Open Cowork (pour le thème de la carte et de la fenêtre de détails).

Règle d'or : **en cas de doute, la maquette fait foi**, pas ton interprétation. Ne « modernise » rien, n'ajoute aucune fonctionnalité, n'embellis pas.

## 1. Stack et contraintes
- Vite + React 18, **JavaScript** (pas de TypeScript), CSS dans un fichier global `src/styles.css` + variables CSS. Aucune librairie d'UI, d'animation, de state ni d'icônes. Zéro dépendance runtime autre que `react` et `react-dom`.
- Dev : `vitest`, `@testing-library/react`, `jsdom`.
- Polices (balises `<link>` dans `index.html`) : Sora (500/700/800) et JetBrains Mono (500), avec repli `system-ui` / `ui-monospace`.
- `npm run build` doit réussir ; sortie `dist/` ; compatible Vercel sans configuration (preset Vite).
- Animer **uniquement** `transform` et `opacity`. Écouteurs de souris/scroll `passive`. Aucun `setState` sur `pointermove` : écris les variables CSS (`--mx --my --fx --fy`) via `style.setProperty` sur `document.documentElement` depuis un `requestAnimationFrame` nettoyé au démontage.
- Respecter `prefers-reduced-motion` (pas d'intro, animations coupées) et un **Mode calme** manuel (classe `calm` sur `<body>` : `animation:none!important` partout, torche masquée).

## 2. Arborescence attendue
```
index.html            (meta, polices, favicon emoji 🏁, og + twitter:card, <html lang="fr">)
public/profil.jpg     (photo : fournie par Ulguy ; en attendant, utilise le data-URI de la maquette)
src/main.jsx  App.jsx  styles.css
src/data/projects.js  i18n.js
src/state/cards.js    (réducteur pur : main, pioches, défausse, filtres)
src/state/cards.test.js
src/hooks/  useSound.js  usePointerLight.js  useLang.js  useTheme.js  useProgress.js
src/components/  Door  Background  Hud  Ticker  Profile  Projects  FilterBar  Deck  Card  Piles  DetailDialog  Skills  Contact  Footer
```

## 3. Design tokens (exacts)
Clair (défaut si le système est clair) : `--bg #F5F1E8, --fg #14161B, --mut #5d5a52, --card #fff, --line #d9d2c3, --v #0E7C66 (accent UI, vert), --t #8A5A00 (texte coloré, ambre), --g #C9A227 (or), --st1 #D2301F, --st2 #2352D8, --st3 #fff, --so .5, --glow rgba(35,82,216,.13), --td none`.
Sombre : `--bg #14161B, --fg #F3EEE5, --mut #9a9890, --card #1D2027, --line #2c313b, --v #C9441F, --t #2F8F83, --st1 #8c2a1c, --st2 #213f94, --st3 #3a404c, --so .65, --glow rgba(255,255,255,.10), --td block`, plus blobs de fond (voir §5).
Mécanisme : attribut `data-theme="light|dark"` sur `<html>` ; sans attribut, suit `prefers-color-scheme`. Le bouton « ◐ » force le thème opposé. Définir les jetons sur `:root`, les redéfinir dans `@media (prefers-color-scheme: dark){:root:not([data-theme=light])}` et dans `:root[data-theme=dark]`.
Typographie : corps Sora 500 / 1rem / 1.6 ; libellés `.m` en JetBrains Mono 0.75rem, majuscules, `letter-spacing:.06em`.
**Les couleurs d'interface en thème clair (vert, ambre) ne doivent jamais être rouge ni bleu** (elles ne doivent pas se confondre avec les bandes de fond).

## 4. Structure de la page
- `Door` (intro), `Background`, `Hud` (sticky), `Ticker`, puis `<main>` avec **2 onglets** : « Profil » (parcours, échiquier, contact en bas) et « Projets & compétences ». Pied de page avec lien « Rejouer l'intro « première visite » ».
- Onglets : `role="tablist"`, soulignement animé (`scaleX` 0→1, .35 s). Changer d'onglet : animation `in` (.6 s, `translateY(18px)` → 0), scroll en haut en douceur, bip.
- Mise en page : `main` max 1040 px, padding 36/22/80. Hero en 2 colonnes (1.3fr / 1fr), 1 colonne sous 760 px (onglets sur une 2e ligne).

## 5. Fond animé (composant `Background`, `aria-hidden`)
1. **Blobs** (3 cercles flous, sombre uniquement) : taille 55vmax, `filter:blur(70px)`, `opacity:.22`, animation `drift` 19 s / 26 s / 31 s `alternate` (`translate(9vw,7vh) scale(1.15) rotate(20deg)`), couleurs `--v`, `--t`, `--g`. En clair : `opacity:0`.
2. **Bandes** (2 thèmes) : 3 éléments, largeur 140 %, `left:-20%`, rotation `-17deg`, **continues sur toute la largeur, sans masque**, dégradé `linear-gradient(--st1 0 52%, --st3 52% 60%, --st2 60% 100%)`, `opacity:var(--so)`. Hauteurs / `top` : 150 px / 8 %, 110 px / 58 %, 80 px / 84 %. Animation `slide` `translateX(5%)` en alternance, durées 18 s / 24 s (reverse) / 30 s. `z-index:-1`, `position:fixed`.
3. **Lumière souris** (`::after` du fond) : deux dégradés radiaux, un large (520 px, `--glow`) qui suit `--fx/--fy` avec inertie (lerp 0,08 par frame), un petit (170 px, `--v` à 32 %) qui suit `--mx/--my` directement.
4. **Torche** (sombre uniquement, masquée en `hover:none` et en mode calme) : calque fixe `z-index:20`, `pointer-events:none`, deux dégradés centrés sur `--fx/--fy` : blanc `rgba(255,255,255,.07)` rayon 300 px, et assombrissement `rgba(0,0,0,.3)` vers l'extérieur, rayon 620 px.

## 6. Intro « porte de garage » (`Door`)
- Plein écran, `z-index:100`, fond `#1b1d23`, lamelles (`repeating-linear-gradient(#0000 0 58px,#0005 58px 62px)`), photo ronde 120 px (bordure or 3 px, flottement 4 s), phrase, bouton.
- **Première visite** (clé `localStorage` `um_seen` absente) : phrase « Prendre le temps, c'est apprécier. Apprécier, c'est s'investir. » mot par mot (retard `.3 s + 0,14 s × rang`, `opacity`/`translateY(10px)`, 0,7 s) ; bouton « Lever la porte » ; montée automatique après **9 s** si pas de clic.
- **Visites suivantes** : texte « Re-bonjour. » (EN : « Welcome back. »), pas de bouton, montée après **1,1 s**.
- Montée : `translateY(-101%)`, 1,2 s, `cubic-bezier(.7,0,.2,1)`, contenu en fondu ; le `main` reçoit l'animation `zoom` (1,4 s, scale 1,05 → 1, opacity .5 → 1) ; écrit `um_seen=1` dans un try/catch.
- `prefers-reduced-motion` : la porte n'est pas affichée. Le lien de pied de page rejoue l'intro « première visite ».
- Mots séparés par `margin-right:.28em` (ne pas laisser les espaces s'effondrer).

## 7. HUD (barre sticky) et gamification discrète
De gauche à droite : logo « UM » ; onglets ; groupe de contrôles :
- **Voyants de rev** : 10 points (7 px) : les 4 premiers verts `#2fae66`, 3 suivants rouges `#e0392d`, 3 derniers bleus `#3b6cf0`. Nombre allumé = `1 + round(progressionScroll × 9)` ; recalculé au scroll (passif) et au changement d'onglet.
- **4 secteurs** (barres 14×6) : allumés (vert `#2fae66`) quand (1) Profil vu, (2) onglet Projets vu, (3) **les 6 projets sont en main** simultanément, (4) la section Contact est visible à 60 % (`IntersectionObserver`). Les 4 allumés → violet `#8a4fd8`.
- **Chrono** `MM:SS` depuis le chargement.
- **Son** : bouton cyclique coupé / doux / fort (défaut doux).
- **Mode calme** (`aria-pressed`), **langue** (affiche l'autre langue : « EN » ou « FR »), **thème** « ◐ ».
Fond du HUD : `color-mix(in srgb, var(--bg) 80%, transparent)` + `backdrop-filter:blur(12px)`, bordure basse. Boutons : bordure 1 px, rayon 8, survol : bordure `--v` et `translateY(-1px)`.

**Bandeau** (`Ticker`, sous le HUD, mono, `--mut`) : texte défilant `translateX(0 → -50%)` en 70 s linéaire, infini, contenu répété 4 fois, séparateur « ◆ ». FR : Ulguy Martial · Recherche alternance · React Native · Supabase · Java · Next.js · Cycle ingénieur · EFREI · Prêt à rouler. EN : Ulguy Martial · Seeking work-study · React Native · Supabase · Java · Next.js · Engineering degree · EFREI · Ready to race.

## 7bis. Son (`useSound`)
`AudioContext` créé au premier appel (après un geste). Niveau 0 = muet ; 1 = gain .03 (bip), 2 = gain .09.
- `beep(freq=520, dur=.08)` : oscillateur, descente exponentielle du gain à 0,0001.
- Bips : changement d'onglet `380 + 90×index` ; thème 440 ; son 600 ; pioche 220 (dur .15) ; sélection de carte 300 (.12) ; pioche « Bientôt » 250 (.2) ; filtre 340 (.1) ; ouverture détails 420 (.08).
- `door()` : bruit blanc 1,3 s filtré passe-bas (180 → 1600 Hz en 1,1 s), enveloppe de gain 0,25 s d'attaque jusqu'à `v` (.05 doux / .14 fort), plus un oscillateur dent-de-scie 55 → 95 Hz de gain `v/4`, puis un bip 140 Hz (.12) à 1,15 s. Appelé à la montée de la porte. Sur les visites automatiques (sans geste), le navigateur peut bloquer : toujours `try/catch`, ne jamais lever d'erreur.

## 8. Onglet Profil (textes FR / EN exacts)
- Surtitre mono : « Cycle ingénieur · EFREI · alternance 3 ans » / « Engineering degree · EFREI · 3-year work-study ».
- Titre : « Ulguy » (retour ligne) « Martial » (accent `--v`), `clamp(2.4rem,7vw,4.6rem)`, graisse 800.
- Ligne de rôle mono (`--t`, curseur `▍` clignotant) : machine à écrire, 70 ms/lettre à l'écriture, 30 ms à l'effacement, pause 1,6 s ; rôles FR : « développeur full-stack », « React Native & Supabase », « Java & Firebase » ; EN : « full-stack developer » (les 2 autres identiques). Préfixe `> `.
- Paragraphe : « Étudiant en cycle ingénieur à l'EFREI (équivalent Master) en Logiciels et Systèmes d'Information, je recherche un contrat d'apprentissage en développement logiciel et full-stack. » / « I am an engineering student at EFREI (Master's level) specialising in Software and Information Systems, seeking a work-study contract in software and full-stack development. »
- Boutons : « Me contacter » (défile en douceur vers `#contact`) / « Contact me » ; « Voir mes projets » (ouvre l'onglet 2) / « View my projects ».
- Citation (bordure gauche or 3 px) : « Prendre le temps, c'est apprécier. Apprécier, c'est s'investir. » / « To take one's time is to appreciate. To appreciate is to invest oneself. »
- **Photo** 240 px max, rayon 28, ombre, bordure `--line` ; inclinaison 3D à la souris (`rotateY(x×18deg) rotateX(−y×18deg)`, `perspective:700px`) + reflet radial `--sx/--sy` ; flottement permanent (`translateY(-7px)`, 6 s). Retour à plat à la sortie.
- **3 jauges** (mono) : Adaptabilité 88 %, Implication 94 %, Sang-froid 82 % (EN : Adaptability, Commitment, Composure). Remplissage animé 1,4 s à l'apparition.
- **Parcours** (4 lignes, date en mono `--v`) : « 2026 → » Cycle ingénieur EFREI, Villejuif / « Mai 2026 » Stage jg&co, Open Cowork / « 2025 » Stage Lunio, Java et Firebase / « 2023–26 » BUT Informatique, IUT d'Orsay (EN : Engineering degree, EFREI Villejuif / May 2026 Internship at jg&co, Open Cowork / Internship at Lunio, Java and Firebase / BUT Computer Science, IUT d'Orsay).
- **Échiquier** : ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ en cases alternées (34×34), le cavalier (2e case) saute tout seul toutes les 6 s (retard 2 s) et au survol de n'importe quelle case.
- **Contact** (section `#contact`) : « On s'écrit ? » / « Get in touch » ; « Disponible pour un contrat d'apprentissage en développement. » / « Available for a work-study contract in software development. » ; boutons Email `mailto:ulguym@gmail.com`, LinkedIn `https://www.linkedin.com/in/ulguy-martial-550b06292/`, GitHub `https://github.com/MARTIALUlguy` (nouvel onglet, `rel="noopener"`), « CV (FR) · PDF » et « CV (EN) · PDF ». **Les 2 boutons CV : `aria-disabled` + `TODO` tant que les PDF n'existent pas** (pas de lien `#` actif).

## 9. Onglet Projets & compétences
Titre « Le deck de projets » / « Project deck ». Sous-titre : « Ma main contient mes stages. Pioche, filtre par famille ou compétence, et clique une carte pour ses détails. » / « My hand holds my internships. Draw, filter by family or skill, and click a card for its details. »

### 9.1 Modèle de données (`projects.js`)
Reprends **tel quel** le tableau `P` de `resources/logic-reference.js` (id implicite = index) : champs `c` (classe de thème), `m` (monogramme), `l` (logo de dos), `t`, `cat` (0 stage, 1 scolaire, 2 perso), `ac` (couleur d'accent du dos), `shot` (URL de capture, `null` par défaut), `d` [fr, en], `s` [fr, en], `b` [[fr…],[en…]], `k` (tags). Constantes `CAT`, `PN`, `KE`, `FS`, `FAM` identiques. Les 6 projets : Open Cowork, Lunio (cat 0) ; Application de bridge, Jeu pédagogique, Application de vote (cat 1) ; AudioNote (cat 2).
Ne jamais inventer de données : les liens de démo / dépôt d'AudioNote restent des boutons désactivés « bientôt ».

### 9.2 Réducteur d'état (`state/cards.js`, pur, sans DOM)
État : `{ hand: [0,1], piles: { pro: [], sco: [2,3,4,'soon'], perso: [5,'soon'] }, discard: [], active: 0, filter: null }`.
Actions et règles (identiques à la référence) :
- `DRAW(k)` : `k='disc'` → reprend la dernière carte défaussée en main, active = dernière ; sinon prend `piles[k][0]` ; si c'est `'soon'` → ne change rien (l'UI joue le retournement) ; sinon l'ajoute à la fin de la main, la retire de la pioche, active = dernière.
- `DISCARD(i)` : retire `i` de la main, l'ajoute à `discard`, `active = clamp(active, 0, hand.length-1)` ; sans effet si `i` n'est pas en main.
- `SELECT(i)` / `NEXT` / `PREV` : modifient `active` (cyclique si main non vide).
- `DEAL(key, predicate)` : `hand` = indices des projets qui satisfont le prédicat ; `discard` vidée ; les autres projets retournent dans la pioche de leur famille (`pro`, `sco`, `perso` selon `cat`) ; `'soon'` est ajouté à la fin de `sco` et de `perso` ; `active=0` ; `filter=key`.
- `RESET` : état initial. Re-cliquer le filtre actif = `RESET`.
Filtres : familles `Stages (cat 0)`, `Scolaires (cat 1)`, `Perso (cat 2)`, `Tous` ; compétences `React, Supabase, Java, Firebase, Godot, SQL, TypeScript, IA` (un projet correspond si l'un de ses tags **contient** le texte). Le bouton « Réinitialiser » n'apparaît que si un filtre est actif.

### 9.3 Main (éventail) et cartes
- Conteneur `.deck` hauteur 440 px, `position:relative`. Carte : 300 px (max 70vw) × 380 px, rayon 22, padding 22 (bas 46), `position:absolute; left:50%; top:10px`.
- Pour l'écart `o = index − active` et `a = |o|` : `transform: translateX(calc(-50% + o×64px)) translateY(a×8px) rotate(o×5deg) scale(1 − a×.05)` ; `z-index: 10 − a` ; transition `transform .7s cubic-bezier(.2,.9,.25,1), filter .5s` ; cartes non actives : `filter:brightness(.8) saturate(.85)`.
- Carte active : animation `dw` (.7 s, part de `translateX(-50%) translateY(90px) rotate(-9deg) scale(.9)`) ; au survol `translateX(-50%) translateY(-8px) rotate(0)`.
- Nouvelles cartes (« fresh ») : même animation `dw` en `backwards`, avec `animation-delay = rang × 70 ms`, puis classe retirée à `animationend`. Une carte qui devient active rejoue `dw`.
- Contenu : monogramme, titre `h3` 1,5 rem, date (mono), résumé, puces dont la 1re est la catégorie (fond blanc, texte `#14161B`), indice « Détails → » (bas gauche) et bouton « Défausser » (bas droite), visibles seulement sur la carte active.
- Thèmes des cartes (faces) : `oc` fond `#1a1a1a` + bandeau jaune `#ffd60a` de 110 px en haut + monogramme foncé à gauche ; `lu` dégradé `150deg #22b8cf → #f08a4b` ; `br` radial `#2c7a63 → #173f33` ; `an` dégradé `160deg #2F8F83 → #1b4f55` ; `gd` `150deg #478cbf → #2a4f73` ; `vt` `150deg #8a4fd8 → #4a2a86`. Texte blanc.
- Clic : sur une carte non active → la rend active ; sur la carte active → ouvre les détails. Entrée au clavier = clic (cartes `tabIndex=0`). Main vide : cadre pointillé avec « Main vide · pioche une carte » / « Empty hand · draw a card ».
- Boutons ← / → (cycle) et compteur mono « Main : n/6 » / « Hand: n/6 ».

### 9.4 Pioches et défausse (`Piles`)
Rangée centrée sous la main (gap 40). Une pioche par famille non vide (`pro` n'apparaît que si elle contient des cartes), puis toujours la **Défausse**. Chaque pioche : pile de 92×128 px, libellé mono « Nom · n » (n = cartes réelles, `+` si une carte « Bientôt » reste), flottement 5 s.
- Carte du dessus = **dos** : bandes diagonales `linear-gradient(110deg,#1d2027 0 26%, var(--ac) 26% 48%, #fff 48% 53%, var(--st2) 53% 72%, #1d2027 72%)`, bordure or 2 px, badge logo (`l`) centré, mention « capture à venir » / « screenshot soon ». **Si `shot` est renseigné** : le dos devient `background:url(shot) center/cover` sans badge ni mention. Jusqu'à 2 cartes dessous, décalées et inclinées.
- Clic (ou Entrée) sur une pioche : la carte du dessus **vole** vers le centre de la main (variables `--dx --dy` calculées depuis `getBoundingClientRect`, animation 0,65 s : `translate`, `rotateY(180deg)`, `scale(2.4)`, fondu), puis après **640 ms** l'action `DRAW` est envoyée et la carte apparaît dans la main. Si le dessus est « Bientôt » : la carte se retourne (`rotateY(180deg)`, face rouge `--v` « Bientôt / Coming soon ») 1,9 s puis revient ; aucune action.
- **Défausse** : face visible de la dernière carte défaussée (couleur du projet, monogramme) ; clic → `DRAW('disc')`. Vide : cadre pointillé.
- Défausser : l'animation `out` (0,48 s : vers la défausse, `rotate(25deg) scale(.22)`, fondu) puis `DISCARD` envoyé après 480 ms ; **si reduced-motion ou mode calme, envoi immédiat** (délai 0). Prévoir une garde si le composant est démonté entre-temps (annuler les `setTimeout`).

### 9.5 Barre de filtres (`FilterBar`)
Libellés mono « Familles » / « Families » puis 4 puces, « Compétences » / « Skills » puis 8 puces, puis « Réinitialiser » / « Reset » si actif. Puces : pilule 99 px, bordure `--line`, `aria-pressed` ; pressée = fond `--fg`, texte `--bg`. Un clic envoie `DEAL` (bip 340) ; les cartes arrivent avec le décalage de 70 ms.

### 9.6 Fenêtre de détails (`DetailDialog`, `<dialog>` natif)
`showModal()` ; largeur min(520px, 92vw), rayon 22, ouverture `in` .35 s, fond `::backdrop` `#000a` ; clic sur le fond ou Échap ferme ; au `close`, le focus revient sur la carte d'origine. En-tête de 150 px mini aux couleurs de la carte (classe de thème), monogramme, titre 1,6 rem, « date · catégorie ». Corps : résumé, liste à puces `b`, tags en `.chip`, puis boutons : pour `cat 2`, deux boutons désactivés « Voir en ligne · bientôt » / « Code · bientôt » (EN : « Live demo · soon », « Code · soon ») ; pour tous, « Défausser la carte » / « Discard card » (ferme, puis défausse). Bouton ✕ (aria-label « Fermer »).

### 9.7 Compétences (sous le deck, titre « Compétences » / « Skills »)
Sous-titre « Regroupées par usage, pas par pourcentage. » / « Grouped by use, not by percentage. » Trois groupes (libellé mono) : Front / Front-end : React / React Native, Next.js, JavaScript ; Back et données / Back-end and data : Supabase, Firebase, Java, Python, SQL, Django ; Outils et méthodes / Tools and methods : Git / GitLab, Docker, Agile, UML. Puces avec halo local qui suit le pointeur (`--cx/--cy`, 90 px, `--t` à 28 %) et soulèvement au survol (`translateY(-4px) rotate(-1.5deg)`).

## 10. Internationalisation
`i18n.js` : `{ fr: {...}, en: {...} }` + hook `useLang` (état `fr` par défaut, met à jour `<html lang>`). **Toutes** les chaînes visibles passent par `t('clé')` (y compris celles des données `d`, `s`, `b`, `CAT`, `PN`, libellés ARIA, tickers, rôles, intro). L'anglais est **formel**. Les noms propres, technologies et sigles restent identiques. Typographie française : apostrophe `’`, guillemets « » (FR) et “ ” (EN). Un test doit vérifier que chaque clé existe dans les deux langues.

## 11. Accessibilité et performance
- Ordre de tabulation logique, `:focus-visible` (2 px `--v`, décalage 3 px), contrastes ≥ 4,5:1 (vérifier les 2 thèmes), cibles ≥ 32 px.
- Rôles : `tablist/tab/tabpanel`, pioches `role="button"` + libellé, `aria-live` poli pour le compteur de main (facultatif).
- Pas de layout thrash ; `will-change` seulement sur les cartes actives ; nettoyer tous les timers, observers et `requestAnimationFrame`.
- Images : `width/height` explicites, `alt` renseignés.

## 12. Pièges déjà rencontrés (à éviter)
- Collision d'identifiants (ex. une variable `T` utilisée pour deux choses) : nommer clairement, pas de variables globales.
- Identifiants XP/état partagés entre familles : ici, tout passe par des **indices de projet uniques** dans le réducteur.
- Un gestionnaire de clic sur la carte ne doit pas avaler les clics des boutons internes (« Défausser » arrête la propagation).
- Rendre les textes des cartes via la langue courante à chaque rendu (pas de texte figé dans le DOM).

## 13. Tests obligatoires (Vitest)
1. Port des 9 scénarios de `logic-test-reference.js` sur le réducteur : départ ; filtre React → [0,5] avec pro=[1], perso=['soon'] ; famille Scolaires → [2,3,4] avec pro=[0,1] ; reset ; pioche scolaire → main [0,1,2] et active=2 ; défausse de Lunio ; reprise depuis la défausse ; « Tous » → 6 cartes ; défausses multiples avec `active` borné.
2. Pioche « Bientôt » : `DRAW` ne change pas l'état.
3. Aucune carte n'est jamais dupliquée ni perdue : `hand ∪ piles ∪ discard` contient toujours les 6 projets exactement une fois (hors `'soon'`), après toute séquence aléatoire d'actions (test par propriété avec 500 séquences).
4. i18n : clés fr = clés en.
5. Rendu (Testing Library) : le clic sur une pioche déclenche l'ajout après le délai (timers simulés) ; la carte active ouvre le dialog ; le bouton Défausser retire la carte ; le filtre met `aria-pressed`.
Les tests doivent **réellement tourner** (`npm test`).

## 14. TODO à laisser visibles (ne rien inventer)
`public/profil.jpg` à fournir ; URL absolue `og:image` (`https://TODO-DOMAINE.vercel.app/profil.jpg`) ; PDF des CV ; liens Vercel / GitHub d'AudioNote ; captures d'écran (`shot`) ; stack exacte du bridge ; confirmation TypeScript pour Open Cowork.

## 15. Rapport final attendu
Liste des fichiers créés ; résultat de `npm run build` et `npm test` (collé tel quel) ; liste de ce qui **n'a pas** pu être vérifié (rendu visuel, Lighthouse, son) ; écarts éventuels avec la maquette, avec la raison ; TODO restants. Ne coche jamais une vérification que tu n'as pas exécutée.

## 16. Interdits
Pas de CV vidéo, pas de « classé parmi les premiers de la promotion », pas de noms de collègues ou de clients, pas de technologie ou de lien inventés, pas de librairie supplémentaire, pas de changement de palette ni de texte par rapport à ce document et à la maquette.
