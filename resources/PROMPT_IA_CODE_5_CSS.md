# Mission : corriger les défauts visuels du portfolio React (constatés sur captures d'écran)

Projet : portfolio React + Vite (JavaScript) d'Ulguy Martial. Build et 130 tests sont verts, **mais les tests ne voient pas le CSS** : des captures d'écran du site montrent des défauts visuels. La référence visuelle est `resources/maquette-v4.html` (ouvre-la dans un navigateur). Tu n'as aucun historique : tout est ici.

Règles : JavaScript uniquement, aucune dépendance ajoutée, économie de contexte (`grep -n`, `sed -n` ; ne lis pas `styles.css` en entier), un commit par étape après `npm run build` et `npm test` verts dont tu colles les sorties **réelles**. Si ton contexte dépasse ~70 %, commit et écris l'avancement dans `NEXT_STEPS.md`. Ne modifie pas `src/state/cards.js`.

## Défauts constatés et causes trouvées
1. **Cartes du deck illisibles** : texte blanc sur fond clair. Le CSS React ne contient **aucune règle de thème** pour `.oc .lu .br .an .gd .vt` (fonds des cartes), ni `.card.on`, `.card.fresh`, `.card.out`, `.card .hint`, `.card .dx`.
2. **Pioches cassées** : la face « Bientôt » (`.fr`) reste visible en permanence (pas de `backface-visibility:hidden` : règle `.pc span` absente) ; les dos sont gris à rayures horizontales (`.bk`, `.bk::before`, `.bk b`, `.bk small` absents ou faux) ; `.pc.top.fly`, `.pl.empty .stack`, `.fc` absents.
3. **Bandes de fond interrompues au milieu** en thème clair : `.bg2` garde `mask-image`, alors que la spec demande des bandes **continues, sans masque**.
4. **Polices serif** sur les boutons (« Lever la porte », « Me contacter », « Voir mes projets ») et le logo « UM » : les `<button>` n'héritent pas de la police et `.btn` / `.logo` n'ont pas de `font-family`.
5. **Titre minuscule** : `h1` ne fait ~27 px au lieu de `clamp(2.4rem,7vw,4.6rem)`, graisse 800 ; `h2` n'est pas stylé.
6. **Jauges vides** (Adaptabilité, Implication, Sang-froid) : le CSS attend une classe `.on` que `Profile.jsx` n'ajoute jamais (la maquette utilise `.on .st b`).
7. **Photo cassée** (texte alternatif visible) sur la porte et dans le profil, et **mauvais `alt`** : `alt={t('Départ')}` dans `Door.jsx` ET `Profile.jsx`.
8. **Étiquettes des pioches chevauchées** par la ligne « ← Main : 2/6 → » (ordre ou marges du DOM).
9. En thème **clair**, un halo flou est visible en haut à gauche : les blobs (`.bg i`) doivent avoir `opacity:0` en clair (`--bo:0`).

## ÉTAPE 1 : rattraper le CSS (défauts 1, 2, 4, 5, 6, 8)
1. Ajoute **à la fin** de `src/styles.css` le contenu intégral de `resources/maquette-rules-override.css` (règles extraites de la maquette ; les règles de structure déjà correctes — HUD, bandeau, porte, jetons — en sont exclues). Elles priment sur les règles précédentes.
2. Lance `node resources/compare-css.mjs resources/maquette-v4.html src/styles.css` : la liste restante ne doit contenir que des sélecteurs d'infrastructure (`:root`, `media(...)`, `.hud`, `.tick`, `.torch`, `#door`…). Justifie chaque autre sélecteur manquant ou ajoute-le.
3. Vérifie que **l'ordre du DOM** de l'onglet Projets est : filtres → éventail → pioches → boutons ← → (comme la maquette) ; les libellés des pioches ne doivent plus être chevauchés (`white-space:nowrap` sur `.pl .m`, marge haute de 18 px sur `.nav`).
4. Supprime dans `styles.css` les règles précédentes devenues contradictoires **seulement si** elles produisent encore un défaut visible (prouve-le avec `grep`).
→ commit « css : cartes, pioches, typographie, jauges ».

## ÉTAPE 2 : fond (défauts 3 et 9)
1. Dans `.bg2`, supprime `mask-image` et `-webkit-mask-image` (les 2 lignes autour de la ligne 156) : bandes continues sur toute la largeur, en clair **et** en sombre.
2. En thème clair, `.bg i` doit être invisible : `opacity:var(--bo)` avec `--bo:0` (clair) et `--bo:.22` (sombre), comme les jetons de la maquette. Vérifie les jetons `--bo --bs --blur --td --st1 --st2 --st3 --so` dans les 3 blocs (clair, `prefers-color-scheme: dark`, `[data-theme=dark]`).
→ commit « fond : bandes continues ».

## ÉTAPE 3 : photo et alt (défaut 7)
1. `alt` : ajoute la clé i18n `Portrait d’Ulguy Martial` (EN : `Portrait of Ulguy Martial`) et utilise-la dans `Door.jsx` et `Profile.jsx`, à la place de `t('Départ')`. (Le test de parité FR/EN doit passer.)
2. Fichier `public/profil.jpg` : il est valide (JPEG 600×600). Vérifie qu'il est **suivi par git** (`git ls-files public/profil.jpg`) et que le blob commité est intact : `git show HEAD:public/profil.jpg | file -` doit répondre « JPEG image data… 600×600 ». Le `.gitattributes` actuel est `* text=auto eol=lf` : ajoute explicitement `*.jpg binary`, `*.jpeg binary`, `*.png binary`, `*.webp binary`, `*.ico binary` pour qu'aucune conversion ne touche les images.
3. Si le test local `npm run dev` charge la photo mais pas le site en ligne, dis-le : c'est un problème de déploiement (commits non poussés ou build Vercel en échec), pas de code.
→ commit « photo et alt ».

## ÉTAPE 4 : tests de non-régression visuelle (CSS)
Ajoute `src/styles.test.js` (Vitest, lit `src/styles.css` en texte, sans navigateur) qui échoue si :
- l'un des sélecteurs `.oc .lu .br .an .gd .vt` n'a pas de propriété `background` ;
- `.bg2` contient `mask-image` ;
- `.pc span` ne contient pas `backface-visibility` ;
- `h1` ne contient pas `clamp(` ;
- `.btn` ou `.logo` n'a pas `font:` ou `font-family:` ;
- `.st b` n'a pas de `width:var(--w)` ou d'animation de remplissage.
Ajoute aussi un test de rendu : les `<img>` de `Door` et `Profile` ont un `alt` non vide différent de « Départ ».
→ commit « tests de garde CSS ».

## ÉTAPE 5 : contrôle et rapport
Colle les sorties réelles de `npm run build`, `npm test`, `node resources/compare-css.mjs …`. Liste ce que tu n'as **pas** pu vérifier (rendu dans un navigateur, son, Lighthouse). Si Playwright ou Puppeteer est disponible, prends des captures 1440×900 clair, 1440×900 sombre et 390×844 des deux onglets et décris les écarts avec la maquette ; sinon écris « captures non réalisées ».
