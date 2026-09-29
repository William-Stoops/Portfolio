# 0005 — Viser WCAG 2.2 AA + RGAA 4.1.2 ; palette sombre contrainte par les contrastes

- Statut : Accepté ; valeurs de l'accent remplacées par 0025
- Date : 2026-09-25

## Contexte

Au 2026-09-25 :

- WCAG 2.2 est la recommandation en vigueur (ISO/IEC 40500:2025).
- Le RGAA 4.1.2 (aligné sur WCAG 2.1) reste le référentiel français. Le RGAA 5 est annoncé
  pour fin 2026.
- EN 301 549 v4.1.1 est publiée mais pas encore citée au JOUE.

Un portfolio n'est soumis à aucune obligation légale, mais il doit être exemplaire. La
maquette impose un fond `#1B1F2A` et un accent orange.

## Décision

- La cible est **WCAG 2.2 AA + RGAA 4.1.2**, plus les critères AAA peu coûteux : 2.4.13,
  2.5.5, 1.4.6 sur le texte courant, 2.3.3.
- Calcul à l'appui, sur `#1B1F2A` aucun orange ne peut à la fois servir de texte
  (≥ 4.5:1) et porter du texte blanc (≥ 4.5:1). En thème sombre, le bouton primaire est
  donc `#FF7A45` avec un texte `#12151C` (7.06:1). Les liens et le texte d'accent sont en
  `#FF8A5B` (7.08:1).
- Le focus est rendu par un `outline` de 3 px décalé de 2 px, jamais par `box-shadow` ou
  `ring`, qui disparaissent en mode contraste élevé.
- Le pied de page affiche « Accessibilité : partiellement conforme » et renvoie vers une
  déclaration d'accessibilité. On ne revendiquera « totalement conforme » qu'après une
  auto-évaluation documentée sur la grille RGAA.

## Alternatives écartées

- **Orange saturé avec texte blanc** (maquette littérale). Contraste de 2.59:1, en échec.
- **Deux oranges** (clair pour le texte, brûlé `#C2410C` pour les boutons). Faisable, mais
  cela affaiblit l'identité et crée une incohérence visuelle.

## Conséquences

- Les jetons de couleur sont fermés. Un test unitaire vérifie chaque paire, et axe tourne
  sur chaque route dans les deux thèmes.
- Signal de révision : publication du RGAA 5, ou citation d'EN 301 549 v4.
