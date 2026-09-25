# 0009 — Thèmes par `light-dark()` et palette de couleurs fermée

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Le site a deux thèmes : le sombre de la maquette, et un clair équivalent. Les deux doivent
respecter les contrastes validés (ADR 0005), sans flash au chargement, et sans qu'une
couleur non validée puisse apparaître au fil des PR. Le skill `design-system` prévoyait
un attribut `data-theme` posé par un script inline, et une variante `dark:`.

## Décision

- Chaque jeton de couleur est déclaré **une seule fois** avec `light-dark(<clair>, <sombre>)`,
  et `:root { color-scheme: light dark }` suit la préférence système. Il n'y a ni
  JavaScript ni variante `dark:` pour les couleurs.
- **Palette fermée** : `--color-*: initial` supprime toutes les couleurs par défaut de
  Tailwind. Les échelles de texte, de rayons, d'ombres, d'easing et d'animations sont
  aussi réinitialisées et redéfinies. Seuls nos jetons génèrent des utilitaires.
- Un test unitaire lit la feuille de style source. Il exige `light-dark()` sur chaque
  jeton et vérifie toutes les paires autorisées dans les deux thèmes. Un test E2E vérifie
  que le build de production résout les deux schémas vers les bonnes valeurs.
- Le futur bouton de thème posera `data-theme`, traduit en CSS par `color-scheme`, avec
  un script inline qui restaure le choix avant le premier rendu.

## Alternatives écartées

- **Script inline + `data-theme` dès maintenant.** Du JavaScript bloquant dans `<head>` et
  une variante `dark:` à répéter sur chaque couleur, pour un besoin (le choix manuel) qui
  n'existe pas encore.
- **Garder la palette Tailwind par défaut.** Rien n'empêcherait un `text-gray-400` non
  validé d'arriver en production. Le design system resterait une convention au lieu d'être
  une contrainte.

## Conséquences

- Aucun flash de thème, zéro coût JavaScript. Toute couleur hors palette échoue à la
  compilation (la classe ne produit aucun style).
- En production, Lightning CSS transpile `light-dark()` pour les navigateurs plus anciens.
  C'est couvert par `e2e/theme.spec.ts`.
- `html` et `body` portent tous deux le fond, parce que les contrôles de contraste basés sur
  WebKit ne lisent pas le fond de la racine.
