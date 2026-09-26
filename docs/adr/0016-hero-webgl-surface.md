# 0016 — Une surface de volatilité en WebGL2 brut derrière le hero

- Statut : Accepté
- Date : 2026-09-26

## Contexte

Après la refonte animée (ADR 0015), William voulait un vrai « effet waouh » dès l'arrivée
sur le site, et évoquait Three.js. Deux contraintes pèsent :

- **Budget JS initial** : 119 kB brotli sur 120. Three.js, même réduit au strict
  nécessaire (renderer, caméra, géométrie, matériau), coûte environ 150 kB.
- **Budgets Lighthouse** mesurés en émulation mobile (TBT ≤ 150 ms, LCP ≤ 2 s) : une scène
  3D chargée au démarrage les ferait sauter, surtout sur la machine de CI sans GPU.

## Décision

- Une **surface de volatilité implicite** en fil de fer, animée derrière le hero : les
  prix d'exercice en largeur, les maturités en profondeur, le « sourire » qui remonte sur
  les ailes. C'est le sujet de la réalisation la plus forte du CV (le calcul passé de 10 h
  à 5 min). La surface ondule, se creuse sous le pointeur et s'aplanit quand le hero
  défile.
- **WebGL2 écrit à la main**, sans bibliothèque : un vertex shader calcule la hauteur sur
  le GPU. Le CPU n'envoie la grille (72 × 40 points) qu'une fois, puis quelques uniformes
  par image. Les maths de caméra (perspective, lookAt, inverse, projection du pointeur sur
  le sol) sont dans `surface-math.ts`, testées unitairement.
- **Chunk séparé, chargé à la demande** (`hero-scene-runtime`, 3 kB brotli, budget 4 kB) :
  le bundle initial ne contient que la décision (`canRunHeroScene`) et l'import dynamique,
  déclenché sur `requestIdleCallback`.
- **Seulement là où elle apporte quelque chose** : écran d'au moins 64rem, pointeur précis,
  mouvement autorisé, pas d'économie de données. Les téléphones gardent le hero CSS
  (batterie, chauffe, budgets mobiles), et le code de la scène n'y est jamais téléchargé.
- **Décorative et sûre** : `aria-hidden`, sans pointeur, transparente tant qu'elle n'a pas
  dessiné. Un masque l'efface sous la colonne de texte, qui garde son contraste. Ses deux
  teintes sont lues sur les jetons du design system, et suivent donc le thème. Aucune image
  n'est dessinée quand le hero est hors écran.
- La même PR ajoute une **typographie cinétique** entre l'À propos et le Parcours : les
  trois axes en caractères géants, deux lignes qui glissent en sens opposés au défilement
  (CSS, compositeur seulement).

## Alternatives écartées

- **Three.js** : environ 150 kB pour dessiner des lignes, soit le budget dépassé cinquante
  fois pour ce besoin.
- **OGL, regl** (10 à 25 kB) : moins lourds, mais ils apportent surtout ce que 150 lignes de
  WebGL2 font déjà.
- **Scène sur tous les appareils** : sur mobile, le coût (GPU, batterie, TBT mesuré en
  émulation mobile) dépasse le gain. À reconsidérer avec des mesures sur de vrais
  téléphones.
- **Une vidéo ou un GIF** du même effet : lourd, non interactif, flou sur écran retina.

## Conséquences

- Le budget « Initial JS » ne compte plus que le bundle d'entrée (`index-*.js`) ; chaque
  chunk chargé à la demande a son propre budget.
- WebGL2 est disponible dans les deux moteurs de test (SwiftShader pour Chromium, GPU pour
  WebKit) : la scène est testée en vrai. Le test de composant lit les pixels dessinés ; l'E2E
  vérifie le dessin sur desktop, et l'absence de téléchargement sur téléphone et en
  mouvement réduit.
- Le JS initial reste à 119,8 kB sur 120 : toute nouvelle fonctionnalité devra être chargée
  à la demande ou compensée.
