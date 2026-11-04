# ⚠️ TODOs pour Ulguy Martial

## 🚨 À FAIRE AVANT DÉPLOIEMENT (Informations que seul Ulguy peut fournir)

### 1. **Application de bridge (2025/2026)**
- **Fichier** : `assets/js/data.js`
- **Champ** : `stack: ['ia', 'camera']`
- **Action** : **Remplacer par la stack technique réelle**
- **Exemple** : `stack: ['python', 'opencv', 'flask']` (à confirmer)

### 2. **Générateur de sondages**
- **Fichier** : `assets/js/data.js`
- **Champs** :
  ```javascript
  vercelUrl: null,
  repoUrl: null,
  ```
- **Action** : Fournir les URLs réelles quand le projet sera déployé

### 3. **Open Cowork - Captures d'écran**
- **Action** : Obtenir l'accord écrit de l'entreprise (JGConsulting/jg&co) pour partager des captures
- **Emplacement** : Créer le dossier `assets/images/opencowork/` et y placer les images
- **Intégration** : Décommenter et ajouter la section "Voir plus" dans la modale Open Cowork

### 4. **Image de profil**
- **Fichier** : `assets/images/profil.jpg`
- **Action** : S'assurer que le fichier existe et est optimisé (format JPG/PNG, taille raisonnable)
- **URL** : Mettre à jour le commentaire `SITE_URL` dans `index.html` avec le domaine Vercel réel

### 5. **TypeScript dans Open Cowork**
- **Fichier** : `assets/js/data.js` → SKILLS
- **Action** : Confirmer si TypeScript a été utilisé dans Open Cowork
- **Actuellement** : TypeScript apparaît dans la stack d'Open Cowork mais pas dans les compétences (marqué TODO)
- **Si confirmé** : Ajouter "Open Cowork" à la description de TypeScript dans SKILLS

### 6. **Domaine Vercel**
- **Fichier** : `index.html` (ligne 6)
- **Action** : Remplacer `https://TODO-DOMAINE.vercel.app` par l'URL réelle du portfolio
- **Impact** : Nécessaire pour que `og:image` soit une URL absolue valide

---

## 📝 Corrections déjà appliquées

### ✅ Partie A : Bugs fonctionnels
- **A1** : Identifiants XP unifiés (`PRO_` pour les pro, `PERSO_` pour les perso) + migration v2
- **A2** : Quête "Ouvre 3 projets" avec point de décision unique
- **A3** : Quête "Teste un projet perso" atteignable via clics sur liens
- **A4** : État "fait" restauré sur les nœuds visités
- **A5** : Logos Devicon fiabilisés avec repli texte
- **A6** : Accessibilité clavier des cartes perso (boutons titres)
- **A7** : Mode sombre pour la modale Open Cowork (variables CSS)

### ✅ Partie B : Direction artistique
- **B1** : Carte Open Cowork avec mini aperçu (OC + barres vertes/oranges)
- **B2** : Modale Open Cowork avec structure demandée (en-tête noir, bandeau jaune, cartes à filets)
- **B3** : Modale Lunio avec DA lisse (dégradés, effet verre)
- **B4** : Cohérence des thèmes, pas de fuite entre modales

### ✅ Partie C : Données et contenu
- **C1** : Suppression de la duplication d'Open Cowork (contenu maintenant dans data.js)
- **C2** : Compétences réduites à 12, descriptions vérifiables uniquement
- **C3** : Métadonnées de partage avec URL absolue et TODO visible
- **C4** : Nettoyage des fichiers README.md et TODO.md

---

## 📊 Vérifications à effectuer

Avant déploiement, vérifier manuellement :

1. [ ] Ouvrir la page dans un navigateur → pas d'erreurs console
2. [ ] Nouveau utilisateur : ouvrir Open Cowork → +15 XP + quête "Ouvre Open Cowork" (+20 XP)
3. [ ] Ouvrir Lunio → +15 XP
4. [ ] Ouvrir un 3e projet → quête "3 projets" validée (+40 XP)
5. [ ] Cliquer sur "Voir en ligne" d'AudioNote → +15 XP + quête "projet perso" (+30 XP)
6. [ ] Ouvrir AudioNote → identifiant différent de Open Cowork
7. [ ] Les nœuds visités deviennent "faits" (coche ✓)
8. [ ] Navigation clavier : Tab → titre projet perso → Entrée → modale ouverte
9. [ ] Échap ferme la modale, focus restauré
10. [ ] Mode sombre (`prefers-color-scheme: dark`) → texte lisible dans toutes les modales
11. [ ] Mobile (390px) → pas de défilement horizontal
12. [ ] Pas de requêtes 404 (surtout Devicon)

---

## 🎯 Prochaines étapes

1. **Fournir les informations manquantes** (voir section 🚨 ci-dessus)
2. **Tester manuellement** (voir section 📊 ci-dessus)
3. **Déployer sur Vercel** :
   ```bash
   vercel --prod
   ```
4. **Mettre à jour le SITE_URL** dans `index.html` avec l'URL de production

---

## 📁 Fichiers modifiés

- `index.html` : Métadonnées, favicon, police Plus Jakarta Sans
- `assets/css/style.css` : Thèmes Open Cowork/Lunio, accessibilité, responsive
- `assets/js/data.js` : Structure Open Cowork, compétences, Devicon map
- `assets/js/script.js` : Système XP, modales, gestion clavier
- `TODO.md` : Ce fichier
- `README.md` : À mettre à jour

---

## ❌ Ce qui a été explicitement ENLEVÉ

- Toute mention de "CV vidéo"
- Toute mention de "classé parmi les premiers de la promotion"
- Duplication de contenu dans script.js (maintenant dans data.js)
- Descriptions de compétences non vérifiables
