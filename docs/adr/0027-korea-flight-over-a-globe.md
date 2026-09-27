# 0027 — Faire voler l'avion de la Corée au-dessus d'un globe

- Statut : Accepté
- Date : 2026-09-27

## Contexte

William veut « plus d'immersion visuelle ». Premier chantier retenu : le vol France → Séoul
et le vol retour, qui traversent aujourd'hui un arc plat en SVG. Il a choisi un vrai globe
en 3D qui tourne au défilement, et des continents tirés d'une vraie carte (Natural Earth).
Les contraintes restent celles de l'ADR 0016 :

- JS initial à 120,8 kB sur 125 : le globe ne peut rien y ajouter ;
- la scène est épinglée et racontée en CSS sur une timeline de défilement (`motion.css`,
  `voyage-*`) : l'avion, le drapeau et la salutation doivent rester synchronisés ;
- une feature n'importe jamais une autre feature : le code WebGL du hero ne peut pas être
  réutilisé tel quel depuis la Corée.

## Décision

- **Un globe en points, en WebGL2 brut.** Les continents sont 4 216 points sur une grille
  régulière de la sphère (1,6° entre deux points). Chaque point est testé une fois contre
  les polygones Natural Earth 1:50m, par un script (`pnpm globe`), et seul le résultat est
  livré : un bit par point, 2,7 kB (environ 1 kB compressé). `world-atlas` est une
  dépendance de développement, le build n'en dépend pas.
- **La route suit le vrai grand cercle** Paris → Séoul (80,6°, environ 8 970 km, par la
  Sibérie), en arc au-dessus du sol. La partie volée s'allume dans la couleur d'accent.
  Le globe tourne avec le vol : la France est à gauche au décollage et Séoul à droite à
  l'atterrissage. Il arrive en tournant quand la scène entre à l'écran. Le vol retour en
  est le miroir.
- **Le script lit la timeline du CSS.** L'avion et les lieux sont du HTML placés à chaque
  image par projection. Leur avancement se calcule sur la position de la piste, avec la
  même plage (`contain 5%` → `contain 45%`), le même `ease-in-out` et les mêmes images clés
  d'altitude que `motion.css`. Un test lit `motion.css` et vérifie que les deux restent
  alignés : l'avion se pose quand le drapeau se déploie.
- **Uniquement là où la scène est épinglée** : mouvement autorisé, écran d'au moins 64rem
  de large et 40rem de haut, animations liées au défilement prises en charge, pas
  d'économie de données. Ailleurs, et sans WebGL2, l'arc plat reste. Le globe remplace
  l'arc sans changer d'éléments (le canvas survit à l'aller-retour) : il prend un côté de
  la scène, et en face se trouvent les mots du départ, le drapeau et la salutation.
- **Chargé à l'approche** : le hook ne contient que la décision. Le moteur, la carte et le
  rendu forment le chunk `flight-globe-runtime`, téléchargé 800 px avant la scène. Le
  globe ne dessine qu'au défilement, et seulement quand la scène est proche.
- **Le code WebGL devient partagé** : matrices, compilation des shaders, lecture des
  teintes, suivi du thème, économie de données et déclenchement « à l'approche » passent
  du hero à `src/utils` et `src/lib`. Rolldown les réunit dans un chunk nommé `webgl`,
  chargé avec la première des deux scènes, sous un nom stable pour ses budgets.
- **Décoratif** : `aria-hidden`, comme l'arc. Le texte dit déjà où va le vol. Les teintes
  viennent des jetons (`fg-subtle` pour les terres, `border-input` pour la route à venir,
  `accent` pour la route volée), et le corps du globe est un disque `surface` au filet
  `border`, qui garde la sphère lisible au-dessus des océans.

## Alternatives écartées

- **three.js ou globe.gl** : 150 kB et plus pour des points sur une sphère. C'est le
  budget dépassé des dizaines de fois (même raisonnement que l'ADR 0016).
- **Un GeoJSON ou un TopoJSON livré** et rastérisé dans le navigateur : 100 à 500 kB, pour
  une carte qui ne change jamais. Le masque précalculé en donne l'essentiel en 1 kB.
- **Une texture (image de la Terre)** : lourde, floue à l'agrandissement, et d'une
  esthétique étrangère au reste du site, fait de points et de filets.
- **Des continents approximés à la main** : faux dès qu'on regarde la Corée ou le Japon.
  Le point de départ est un grand cercle réel : la carte doit l'être aussi.
- **Piloter l'avion en CSS** comme sur l'arc : une rotation CSS ne suit pas un grand
  cercle projeté sur une sphère qui tourne. La projection se calcule en script, mais la
  chronologie reste celle du CSS.

## Conséquences

- Nouveaux budgets : globe et outils WebGL partagés à 4,96 kB (budget 6 kB), et scène du
  hero, outils compris, à 3,65 kB (budget 4 kB). Le JS initial ne change pas (120,69 kB) et
  le chunk du parcours passe de 11,04 à 12,23 kB (budget 16).
- Le moteur du globe est testé dans un vrai Chromium avec WebGL2 : l'avion décolle de la
  France, survole la Sibérie, se pose sur Séoul, et part vers l'ouest au retour. Les E2E
  vérifient le globe sur ordinateur et l'arc sur téléphone et tablette. En mouvement
  réduit, aucun octet du globe n'est chargé.
- Les exports partagés avec le script de génération sont marqués `@internal` : c'est la
  seule exception à Knip en production, justifiée dans `knip.config.ts`.
- Les mentions légales créditent Natural Earth (domaine public), à côté des polices et des
  icônes.
- À surveiller : le coût de 4 216 points sur les GPU intégrés. Si une mesure montre des
  images perdues au défilement, on réduira la densité de la grille (`pnpm globe` avec un
  pas plus large).
