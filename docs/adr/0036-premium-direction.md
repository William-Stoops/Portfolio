# 0036 — Une direction premium : la personne, la typographie, une seule couleur

- Statut : Accepté
- Date : 2026-09-28
- Remplace : 0016, 0019, 0021, 0022, 0023, 0027, 0028, 0029, 0030, 0035
- Remplace en partie : 0015 (le principe d'un mouvement expressif ; le CSS natif reste)

## Contexte

Les ADR 0015 à 0035 ont empilé des scènes : surface WebGL derrière le hero, page racontée
comme un vol avec sa ligne et son tableau des départs, globe de la Corée, salle du Summit,
ouverture en plan de cinéma, curseur, textes qui se décodent, sons. William a jugé le
résultat « trop », « pas intégré », puis, sur les prototypes suivants, « trop classique »,
« slop IA » et « on n'a pas envie de lire ». Trois constats en sont sortis :

- **Un inconnu doit tout comprendre en une seconde.** Une surface de volatilité, NRJ,
  STAXX ou le Summit ne disent rien à qui ne connaît pas William : ils vont dans la page,
  pas dans le hero.
- **Le premium tient à la retenue, pas au nombre d'effets.** Sur un moodboard de
  portfolios reconnus (Awwwards, recruteurs), William a choisi
  [dennissnellenberg.com](https://dennissnellenberg.com) comme niveau à atteindre.
- **La couleur doit avoir une hiérarchie.** Plusieurs teintes réparties partout ont perdu
  tout sens.

## Décision

S'inspirer du langage de cette référence, sans la copier : notre typographie, notre
contenu, notre calculateur.

- **Hero sombre**, centré sur la personne : le portrait de William se fond dans le fond
  anthracite, son nom immense et fin glisse **au défilement, jamais seul** (WCAG 2.2.2),
  une pastille « Basé à Paris » et le rôle. Rien d'autre.
- **Sections blanches, aérées** :
  - une phrase de profil en grand et un bouton rond ;
  - la liste des expériences et projets en très grands caractères, avec un aperçu qui suit
    le pointeur (pointeur fin seulement) ;
  - trois chiffres ;
  - des études de cas : IT-Finance (le calcul de volatilité implicite, refait en miniature
    dans le navigateur, puis la course de l'ADR 0032), STAXX (le pitch de l'ADR 0024, le
    trophée, NRJ Lille), la Corée (les photos), le parcours année par année, les
    compétences rattachées à leurs preuves.
- **Pied de page sombre**, arrondi à son arrivée : « Travaillons ensemble », un grand
  bouton rond vers le contact, le formulaire, l'heure de Paris.
- **Une seule famille**, Inter Tight (variable, auto-hébergée) : graisse fine pour les
  grands titres, normale pour le texte. Sora est retirée.
- **Palette neutre et fermée** (ADR 0009) : blanc, gris clair, anthracite. **Un seul
  accent bleu**, pour ce sur quoi on agit. Viridis reste dans les graphiques de données
  (la surface, la course). Le thème sombre passe les sections blanches en anthracite.
- **Mouvement discret**, en CSS natif autant que possible : entrées au défilement, nom qui
  glisse, boutons qui se penchent vers le pointeur, aperçu des travaux, courbe du pied de
  page. Tout s'arrête avec `prefers-reduced-motion`.
- **Retirés** : la surface WebGL (0016), le drapeau coréen (0019), le parcours en vol et sa
  ligne (0021 à 0023), le globe (0027), la salle du Summit (0028), le tableau des départs
  (0029), l'ouverture en plan de cinéma (0030), les bandeaux cinétiques, le curseur, les
  textes qui se décodent, les sons (0035). La 404 devient sobre.
- **Gardés** : la recherche rapide (0034), les coulisses (0033), les deux langues (0026),
  le thème clair ou sombre, le formulaire de contact, le pré-rendu (0011) et les budgets.

## Alternatives écartées

- **Garder les scènes en les calmant** : essayé sur quatre prototypes ; la page restait
  « pas intégrée ».
- **La surface de volatilité en tête de page**, en 3D puis en courbes : « wtf » pour un
  inconnu.
- **Une affiche en aplats et capitales condensées** : jugée « moche ».
- **Des grilles de tuiles teintées et des étiquettes flottantes** : le vocabulaire des pages
  générées par IA.
- **Copier la référence** : son contenu, sa police et ses visuels sont les siens ; on en
  reprend le langage, pas les pièces.

## Conséquences

- Le code des scènes retirées part avec elles (Knip), et leurs budgets de chunks aussi. Le
  JS initial devrait baisser.
- La refonte arrive en plusieurs PR empilées : fondations (palette, police), hero, liste
  des travaux, IT-Finance, STAXX, Corée, parcours et compétences, pied de page et contact.
  Chacune reste verte en CI.
- Le nouveau portrait, fourni par William le 2026-09-28, rejoint `docs/content/images/`.
- Les ADR remplacés gardent leur texte : leur statut renvoie ici.
- À surveiller : la lisibilité d'un nom fin sur la photo (contraste mesuré dans les tests),
  et le poids du portrait en tête de page (LCP).
