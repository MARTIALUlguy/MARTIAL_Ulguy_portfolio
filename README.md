# Portfolio — Ulguy Martial

Portfolio interactif réalisé avec React et Vite. Le site présente mon profil, mes projets et mes compétences sous la forme d’un jeu de cartes.

## Expérience

- Une porte animée accueille les visiteurs et peut être rejouée depuis le pied de page.
- Le HUD permet de passer du profil aux projets, affiche des voyants de progression liés au défilement et des secteurs de visite.
- Le deck présente les projets sous forme de cartes. Elles peuvent être ouvertes pour consulter leurs détails, puis défaussées.
- Des pioches regroupent les projets par catégorie ; piocher ajoute une carte au deck. Une pile dédiée reçoit les cartes défaussées.
- Des filtres permettent de parcourir les projets par famille et par compétence.
- L’interface et le contenu sont disponibles en français et en anglais.
- Les thèmes clair et sombre sont pris en charge.
- Le mode calme désactive les animations ; les effets sonores peuvent être réglés ou coupés depuis le HUD.

## Technologies

- React 18 et Vite
- JavaScript et CSS
- Vitest et Testing Library pour les tests

## Développement

```bash
npm install
npm run dev
```

Commandes de validation :

```bash
npm run build
npm test
```

## TODO

- Ajouter les PDF des CV français et anglais et activer leurs boutons.
- Fournir les liens et captures d’écran d’AudioNote.
- Confirmer et compléter la stack technique de l’application de bridge.
- Confirmer l’utilisation de TypeScript dans Open Cowork.
