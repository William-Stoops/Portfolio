# 0023 — Réserver la ligne de vol au récit

- Statut : Accepté
- Date : 2026-09-26
- Remplace en partie : 0022

## Contexte

L'ADR 0022 faisait de toute la page un seul vol : « À propos », IA, Compétences et Contact
avaient leurs repères sur le rail, comme les années du parcours. William l'a relevé : ces
sections ne sont pas temporelles, et une ligne de vol leur prête une chronologie qu'elles
n'ont pas. Il demandait aussi une page plus fluide et mieux hiérarchisée.

## Décision

- **La ligne de vol ne porte que le récit** : la section « Parcours », de son titre jusqu'à
  « Aujourd'hui », où l'avion se pose. Sa colonne de repères ne nomme que la section et les
  années.
- **Les autres sections s'ouvrent comme des chapitres, hors du rail** : numéro en filigrane,
  titre qui monte lettre à lettre (`StopHeader` sans `onPath`). Leur contenu prend toute la
  largeur.
- **Les chapitres d'une section hors du temps sont des rangées** (`ChapterRows`) : l'en-tête à
  gauche, le contenu à droite, des filets entre eux. Les pratiques IA et les compétences en
  font usage ; les compétences d'une famille se lisent en une ligne de mots.
- **Trois tailles de titre**, pour que le plan se lise d'un coup d'œil : section, escale du
  parcours, chapitre.
- **Le texte écrit à l'encre** devient une primitive (`InkText`) : le profil, les notes du
  parcours et les pratiques IA la partagent.
- **La navigation suit les cinq sections numérotées** ; Séoul et STAXX restent des ancres
  dans le parcours (`#coree`, `#projets`).

## Alternatives écartées

- **Garder un rail discret pour les sections non temporelles** : une ligne reste une ligne
  du temps ; le lecteur y chercherait des dates.
- **Des cartes pour les pratiques et les compétences** : un langage de plus, là où les filets
  et les rangées reprennent celui de l'« À propos » et du pied de page.

## Conséquences

- `FlightPath` n'enveloppe que la section « Parcours », dans le chunk du parcours.
- Tout nouveau contenu hors du temps rejoint une section en rangées, pas le rail.
