# 0021 — Raconter la page d'accueil comme un parcours

- Statut : Accepté
- Date : 2026-09-26

## Contexte

Section après section (À propos, Parcours, Projets, IA, Corée…), la page d'accueil
empilait des blocs sans fil conducteur : la Corée arrivait après les projets, STAXX sans sa
chronologie, et le lecteur ne voyait pas le chemin de William. Celui-ci a demandé un fil
conducteur, et en a donné la chronologie (`cv-source.md`, « Chronologie ») : entrée à Epitech
en 2021, Strattt puis GDS Élec, STAXX à partir de la 3e année, Séoul en 4e année, retour en
France en 5e année (IT-Finance, NRJ Lille, Epitech Summit), promo 2026.

## Décision

- **Une section « Parcours » raconte les années d'Epitech, une escale par année** (2021 →
  2026). Chaque escale porte un titre de niveau 3 et tient les cartes qui la racontent : les
  rôles (niveau 4), l'année à Séoul, l'étude de cas STAXX. Les anciennes sections Parcours,
  Projets et Corée disparaissent ; leurs ancres (`#coree`, `#projets`) mènent aux escales.
- **Le fil est une ligne de vol** (`FlightLog`, `components/layout`) : un rail pointillé comme
  l'arc de Séoul, une traînée pleine jusqu'à un avion qui suit la ligne de lecture, un compteur
  d'années qui roule dans une colonne collante, des escales qui s'allument au passage de l'avion.
  Tout est en CSS lié au défilement, sur le compositeur, et décoratif (`aria-hidden`) : chaque
  escale dit son année et son titre en mots.
- **Deux vols mis en scène** : l'aller vers Séoul et le **retour en France**, en miroir, épinglés
  sur grand écran (`FlightScene`). L'avion du rail s'efface pendant chacun d'eux.
- **Le drapeau français rejoint la palette**, comme le drapeau coréen (ADR 0019) : `tricolore-blue`
  (`#000091`) et `tricolore-red` (`#E1000F`), les couleurs du Système de design de l'État. Le blanc
  des deux drapeaux devient un jeton commun, `flag-field`.
- **Le code du parcours est un chunk chargé à la demande** (`home-journey`), comme la Corée avant
  lui (ADR 0020) : il commence sous la ligne de flottaison et représente l'essentiel du JS de la
  page. Le JS initial passe de 126,6 kB à 118,4 kB.

## Alternatives écartées

- **Garder les sections et ajouter une frise en marge** : un repère, pas un récit ; l'ordre
  des sections contredisait toujours la chronologie.
- **Un défilement lissé (Lenis)** : écarté par William au profit du défilement natif, sans
  kilo-octet de plus ni risque pour l'accessibilité.
- **Le compteur d'années en JavaScript** : les animations additives (`animation-composition:
add`), une par escale sur sa propre timeline, font rouler les chiffres sans code.

## Conséquences

- La navigation suit le récit : À propos, Parcours, Corée, Projets, IA, Compétences, Contact.
- Les sections numérotées ne sont plus que cinq ; les escales ne sont pas numérotées.
- Un nouveau feature `journey` (escales et notes) ; la composition reste dans `app/`.
- Sans animations liées au défilement, ou en mouvement réduit, les escales se suivent
  simplement, avec leur année écrite.
