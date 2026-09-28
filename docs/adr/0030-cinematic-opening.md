# 0030 — Ouvrir la page comme un plan de cinéma

- Statut : Remplacé par l’[ADR 0036](0036-premium-direction.md)
- Date : 2026-09-28

## Contexte

Dernier des quatre tableaux de l'immersion visuelle (après les ADR 0027 à 0029). La
surface de volatilité du hero (ADR 0016) apparaissait en fondu, déjà en place, et
s'aplanissait en s'élevant quand on défilait. William a retenu une ouverture de cinéma :
au chargement, la surface s'élève comme un paysage que la caméra survole avant de se poser
derrière son nom ; au défilement, on « plonge » du hero vers la section À propos.

Contraintes :

- le hero porte le plus grand élément de la page : ses textes doivent être peints dès le
  premier affichage (LCP, `e2e/motion.spec.ts`) ;
- la scène ne tourne que sur grand écran, avec un pointeur précis et le mouvement autorisé
  (ADR 0016), et son chunk a un budget ;
- rien ne doit bouger en mouvement réduit.

## Décision

- **La caméra devient une fonction pure** (`heroCamera`), testée. Sa pose de repos est
  exactement celle du hero d'avant. Deux paramètres s'y ajoutent, de 0 à 1 :
  - `intro` : la caméra part de haut et de loin derrière la surface, et vient se poser
    dans le cadrage du hero ;
  - `dive` : la caméra descend parmi les vagues et le champ s'élargit un peu.
- **L'arrivée** : dès la première image de la scène, en 2,8 s (sortie cubique), la
  caméra vole et la surface s'élève d'un quart de son relief à la totalité (`u_rise`
  dans le shader). Le canvas l'indique quand la caméra s'est posée (`data-landed`). Le
  final de la page garde sa surface posée, sans arrivée.
- **La plongée** : quand le hero défile, la caméra ne monte plus, elle plonge, de plus en
  plus vite (carré du défilement), la surface à peine plus calme. En même temps, le
  contenu du hero vient vers le lecteur et le dépasse (`hero-dive` : un peu plus grand,
  un peu plus haut), jusqu'à À propos.
  - Seules des transformations sont animées, et rien ne s'efface : les textes du hero
    gardent leur premier affichage.
  - Sa timeline de vue n'a pas d'inset, pour que la plongée commence quand le contenu
    quitte le haut de l'écran, et non dès le chargement. L'inset `auto` reprenait la
    marge réservée à l'en-tête, déjà rencontrée avec les scènes épinglées (ADR 0028).
- **En mouvement réduit**, la scène ne tourne pas (ADR 0016) et le contenu ne bouge pas.

## Alternatives écartées

- **Faire apparaître les textes du hero en fondu avec la caméra** : spectaculaire, mais un
  texte qui part d'une opacité nulle n'est compté comme peint qu'après coup. Il a déjà
  fait dépasser le budget LCP au site (ADR 0015).
- **Retarder la page jusqu'à la fin du vol** (écran d'introduction) : la page doit se lire
  tout de suite. Le vol accompagne l'entrée des lettres, il ne la retarde pas.
- **Piloter la plongée en script sur le contenu** : la timeline de défilement le fait sur
  le compositeur, et la caméra lit déjà le défilement dans sa boucle.
- **Une plongée qui efface le hero** (fondu en sortie) : c'est un fondu de plus sur de
  grands textes, pour un effet que la transformation donne déjà.

## Conséquences

- Le chunk de la scène du hero passe à 3,95 kB, outils WebGL compris. Son budget passe de
  4 à 4,5 kB : il reste chargé au repos du navigateur, sur grand écran seulement, et ne
  pèse ni sur le LCP ni sur le TBT mobiles. Le JS initial ne bouge pas (120,65 kB) et le
  CSS reste à 12,09 kB.
- Tests :
  - unitaires pour la caméra : repos, balancement, arrivée, plongée ;
  - E2E : la caméra en vol puis posée, le contenu qui plonge au défilement sur tous les
    écrans, rien en mouvement réduit ;
  - le contrôle du LCP de `motion.spec.ts` passe toujours.
