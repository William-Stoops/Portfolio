# 0029 — Afficher le parcours sur un tableau des départs

- Statut : Accepté
- Date : 2026-09-28

## Contexte

Troisième tableau de l'immersion visuelle (après le globe, ADR 0027, et l'Epitech Summit,
ADR 0028). Le parcours se lit déjà comme un vol : un rail, un avion, des escales par
année (ADR 0021 à 0023). William a retenu ceci : les années et les titres du parcours
s'affichent sur des panneaux à palettes, comme dans un aéroport, et les lettres défilent
puis se figent quand on arrive à une étape.

Contraintes :

- n'animer que ce que le compositeur exécute ;
- lire le texte une seule fois aux technologies d'assistance ;
- ne pas grossir le bundle initial, où vivent aussi les en-têtes des sections ;
- avoir un état final immobile et complet.

## Décision

- **Un composant `SplitFlap`** (dans `components/ui`) dessine un texte en cases de tableau.
  Chaque case contient une bande des glyphes qu'elle traverse, un par ligne. Une
  translation à pas (`steps()`, les images clés `roll-up` du compteur du Summit) les fait
  défiler un par un, sur une timeline de défilement. Au repos, la case montre son
  caractère. Elle prend toujours la largeur de ce caractère : les glyphes traversés y
  sont découpés.
- **Les glyphes viennent d'une fonction pure** (`utils/split-flap.ts`), testée :
  - une case part du caractère que le tableau montrait avant à sa place, s'il y en a un ;
  - elle traverse des glyphes de même nature et de largeur voisine : un chiffre avant un
    chiffre, une capitale étroite avant une capitale étroite ;
  - elle s'arrête sur son caractère, et une case qui garde son caractère ne bouge pas.
  - La largeur compte : dans une police proportionnelle, un glyphe large découpé dans une
    case étroite se lisait comme un trait.
  - Le tirage vient d'un générateur à graine : le HTML pré-rendu et le navigateur
    montrent les mêmes glyphes.
- **Le rail devient le tableau** : l'année sur des tuiles séparées par leur charnière, le
  libellé en petites cases. Quand une escale passe la ligne de lecture, sa ligne prend la
  place de la précédente d'un coup, et ses cases partent des caractères de celle-ci. 2024
  devient 2025 en ne tournant que son dernier chiffre, « 4e année » devient « 5e année »
  par son premier caractère. En remontant, tout retourne en arrière. Les libellés ne
  glissent plus : ce sont les cases qui portent le changement.
- **Les titres des escales** tournent lettre par lettre en arrivant, comme une
  destination, et se figent avant la ligne de lecture. `StopHeader` reçoit le titre tel
  que l'œil le voit (`visualTitle`) : seul le parcours, chargé avec son chunk, porte le
  tableau. Les en-têtes des sections gardent leurs lettres qui montent, et le bundle
  initial ne bouge pas.
- **Accessibilité** : les cases sont décoratives (`aria-hidden`). Le titre est lu une
  fois, par sa copie visuellement masquée, et le rail l'était déjà en entier. En mouvement
  réduit, ou sans animations liées au défilement, chaque case montre son caractère.

## Alternatives écartées

- **De vraies palettes qui basculent** (deux demi-cases, `rotateX`) : c'est l'image
  exacte, mais il faut quatre éléments par caractère et des centaines de couches pour
  les titres. Le défilement par pas donne le même rythme discret à bien moindre coût.
- **Un défilement continu, façon compteur** : on ne lit rien entre deux glyphes, et le
  tableau perd son claquement.
- **Brouiller le texte en JavaScript** (comme le décodage au survol) : du script à chaque
  image de défilement, alors que la timeline le fait sur le compositeur.
- **Une police à chasse fixe pour tout le tableau** : c'est fidèle aux vrais tableaux,
  mais c'est une troisième famille à charger (ADR 0013). Les chiffres du rail sont déjà
  tabulaires, et les lettres traversent des glyphes de largeur voisine.

## Conséquences

- Le chunk du parcours passe de 13,96 à 14,93 kB (budget 16). Le JS initial reste à
  120,7 kB et le CSS passe à 12,08 kB (budget 15).
- Tests :
  - unitaires pour les glyphes : nature, largeur, départ, cases immobiles, déterminisme ;
  - de composant pour les cases, les titres et le rail ;
  - E2E : la ligne du rail qui change à 2025, un titre qui tourne puis se fige, et le repos
    en mouvement réduit.
- À surveiller : le chunk du parcours approche de son budget (1,07 kB de marge). La
  prochaine fonctionnalité du parcours devra le mesurer, ou justifier un relèvement.
