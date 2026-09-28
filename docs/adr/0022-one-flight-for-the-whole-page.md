# 0022 — Faire de toute la page un seul vol

- Statut : Accepté
- Date : 2026-09-26

## Contexte

Le parcours (ADR 0021) avait son langage : une ligne de vol, des escales qui s'allument, des
titres qui montent sur leur filigrane. Mais « À propos » avant lui, puis IA, Compétences et
Contact, gardaient l'ancien : un numéro et un filet, des cartes, une colonne collante propre
aux chapitres de compétences. William trouvait ces parties « déconnectées » du corps du site,
et demandait une page plus homogène.

## Décision

- **Une seule ligne de vol sous toute la page**, du premier section au contact
  (`FlightPath`, `components/layout`) : rail pointillé, traînée jusqu'à l'avion sur la ligne
  de lecture, atterrissage au contact. Elle remplace le rail propre au parcours.
- **Une seule colonne de repères**, collée à gauche sur grand écran : le numéro et le nom de
  la section, ou l'année et le libellé d'une escale du parcours, chacun glissant quand son
  repère franchit la ligne de lecture. Elle remplace le compteur d'années et la colonne des
  chapitres (`StickyChapters`, supprimé).
- **Le même en-tête partout** (`StopHeader`) : sections (h2) et escales (h3) ont un repère sur
  le rail, une branche, un titre qui monte lettre à lettre, un filigrane. Les pratiques IA et
  les chapitres de compétences deviennent des escales (`FlightLog`), comme les années.
- **Une géométrie commune** : `--rail-x` et `--content-x`, définis par la ligne de vol,
  placent le rail et le contenu de chaque section ; une escale imbriquée s'en décale de
  `--stop-inset`. Sans colonne de repères (petits écrans, pas d'animations liées au
  défilement, mouvement réduit), le rail reste près du bord.
- Le bandeau cinétique passe au-dessus du rail, sur le fond de la page : l'avion passe
  derrière, comme dans un nuage.

## Alternatives écartées

- **Garder les sections et ne changer que leurs en-têtes** : le rail se serait interrompu
  entre les sections, et le fil avec lui.
- **Un compteur roulant pour toute la page** : les numéros de section et les années ne forment
  pas une suite ; un glissement par repère donne le même mouvement sans le mentir.

## Conséquences

- Chaque repère est suivi par sa propre timeline, nommée d'après son ancre
  (`waypointTimeline`) : deux éléments ne doivent jamais partager une ancre. Les chapitres de
  compétences sont préfixés (`competences-…`), et un E2E vérifie l'unicité des `id`.
- Un E2E vérifie qu'un seul repère est visible à la fois, sur toute la page.
