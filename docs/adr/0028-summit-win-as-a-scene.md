# 0028 — Mettre en scène la victoire à l'Epitech Summit

- Statut : Accepté
- Date : 2026-09-28

## Contexte

Deuxième tableau de l'immersion visuelle voulue par William (après le globe, ADR 0027).
L'étude de cas STAXX se terminait sur la photo du trophée, sous la vidéo du pitch. Le CV
dit « 1er au concours Epitech Summit, pitché devant 300 personnes ». William a retenu une
scène épinglée : les projecteurs balaient la scène, les 300 places se remplissent au fil
du défilement, puis la photo du trophée apparaît. Le chiffre de 300 personnes devient
visible.

Contraintes :

- n'animer que ce que le compositeur exécute (`opacity`, `translate`, `scale`,
  `rotate`), ce que `e2e/motion.spec.ts` vérifie ;
- que tout soit complet et immobile en mouvement réduit ou sans animations liées au
  défilement ;
- ne pas alourdir la page : la section est pré-rendue en HTML ;
- ne rien afficher qui ne vienne du CV.

## Décision

- **Une scène épinglée, en CSS seulement**, sur le modèle du voyage en Corée. Les
  utilitaires `voyage-track` et `voyage-stage` deviennent `scene-track` et `scene-stage`,
  pour toute scène, et une variante Tailwind `pinned:` reprend leur condition pour la mise
  en page. La timeline `--summit` porte trois temps : la salle se remplit et le compteur
  monte (4 % → 48 %), les projecteurs cherchent puis se rejoignent (6 % → 62 %), la lumière
  se fait sur les vainqueurs (62 % → 74 %). Le moment dure ensuite jusqu'à la fin.
- **La salle** est un plan d'amphithéâtre : 300 points, un par personne, en rangs
  concentriques autour de la scène. Chaque rang compte deux places de plus que le précédent
  et couvre le même angle. Les places se prennent dans un ordre dispersé, les premiers rangs
  d'abord en moyenne. L'ordre vient d'un générateur à graine fixe, pour que le HTML
  pré-rendu et le navigateur coïncident. Chaque groupe de dix places est **un seul chemin
  SVG** (un point rond par sous-chemin `M x y h0`). La salle pèse ainsi 11 kB de balisage
  (2 kB compressés) et n'anime que 30 éléments, au rythme du compteur.
- **Le compteur** est un compteur mécanique : une bande de chiffres par colonne,
  translatée d'un cran par dizaine (`steps()`), synchronisée avec les places.
- **Les projecteurs** sont des fenêtres rondes, au bord adouci (masque statique), ouvertes
  sur une copie éclairée de la photo. La fenêtre traverse la scène pendant que la photo
  qu'elle contient se déplace en sens inverse, avec les mêmes images clés signées par
  `--sign`. La photo reste donc immobile et seule la lumière bouge, sur le compositeur.
  Les projecteurs balaient à hauteur des visages et se rejoignent sur William tenant le
  trophée. Ce point de la photo (`SUMMIT_SPOTLIGHT`) est une donnée de l'image.
- **L'obscurité de la salle** est un voile à la couleur `canvas` du thème sombre, dans les
  deux thèmes, comme une scène est dans le noir. Il se lève quand la lumière vient.
- **Accessibilité** : la photo n'est lue qu'une fois. Les copies des projecteurs sont
  muettes (`alt=""`, `aria-hidden`), et la salle et le compteur, décoratifs, répètent le
  chiffre clé. La légende reste sur le fond de la page, avec un contraste qui ne dépend
  jamais de la photo.
- **Ailleurs** : sur un petit écran, la salle se remplit au passage, sur sa propre
  timeline, et la photo reste éclairée. En mouvement réduit, tout est à l'état final.
- La timeline d'une scène épinglée a désormais un **inset nul** : l'histoire commence
  quand la scène s'épingle, et non 6rem plus tôt, marge réservée à l'en-tête que l'inset
  `auto` reprenait. Le globe de l'ADR 0027, qui lit la même timeline en script, est ainsi
  exactement synchrone avec le CSS.

## Alternatives écartées

- **Un compteur par `@property` animée** (entier interpolé et affiché par `counter()`) :
  plus simple à écrire, mais l'animation d'une propriété personnalisée tourne sur le fil
  principal, ce que le site s'interdit.
- **Des projecteurs en `clip-path` ou en `mask-position` animés** : même problème, un
  recalcul à chaque image sur le fil principal.
- **Des halos lumineux en dégradé sur la photo** : ils se lisaient comme les « taches
  lumineuses » que le design system bannit. Les fenêtres éclairent la photo elle-même.
- **Une salle en WebGL ou en canvas** : il aurait fallu du script pour 300 points que le
  SVG pré-rendu dessine sans rien charger.
- **300 cercles SVG animés un par un** : environ 50 kB de HTML et 300 animations. Les
  chemins pointillés groupés par dizaine en coûtent 11 kB et 30.
- **Mettre la vidéo du pitch dans la scène** : la photo, puis la lumière, auraient recouvert
  le bouton de lecture (WCAG 2.4.11). Le pitch reste juste avant, la scène raconte le
  résultat.

## Conséquences

- Le chunk du parcours passe de 12,23 à 13,96 kB (budget 16) et le CSS de 11,41 à
  11,95 kB (budget 15). Le JS initial ne change pas.
- La page d'accueil pré-rendue gagne 11 kB (2 kB compressés) pour la salle.
- Tests : unitaires pour la salle et le compteur, de composant (une seule image lue,
  300 places, compteur à 300, axe), et E2E. Sur ordinateur, l'E2E vérifie la scène à
  000, puis à 300 avec la salle encore dans le noir, puis la lumière. Il vérifie aussi le
  téléphone et le mouvement réduit.
- À surveiller : le coût des fenêtres masquées sur les GPU modestes. Si une mesure montre
  des images perdues, on retirera le masque adouci (bord net) avant de toucher au reste.
