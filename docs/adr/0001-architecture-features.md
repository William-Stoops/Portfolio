# 0001 — Organiser le code par features, à la bulletproof-react

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Le portfolio doit démontrer une architecture front de niveau senior, lisible par un CTO en
quelques minutes, sans cérémonie disproportionnée pour une dizaine de sections. Les
contenus sont des concepts du CV (expériences, projets, compétences), pas des pages.

## Décision

- Arborescence `src/app` (composition, routes), `src/features/<concept>` (composants,
  hooks, données, schémas, types, utils du concept), et code partagé (`components/ui`,
  `components/layout`, `hooks`, `lib`, `config`, `styles`, `testing`, `types`, `utils`).
- Dépendances à sens unique `app → features → partagé`. Aucune feature n'importe une autre.
- Pas de barrel files. Imports directs vers le fichier qui définit le symbole.
- Règles imposées par `eslint-plugin-boundaries` et `oxc/no-barrel-file`.

## Alternatives écartées

- **Feature-Sliced Design v2.1.** Ses couches `entities` et `widgets`, et l'API publique
  obligatoire par slice, apportent beaucoup de structure pour peu de code. Le coût dépasse
  le bénéfice à cette taille.
- **Organisation par type** (`components/`, `hooks/`, `pages/` globaux). Elle disperse un
  même concept dans cinq dossiers, et les frontières ne sont pas vérifiables.
- **Barrel files par feature.** Ils nuisent au tree-shaking et au HMR de Vite, créent des
  cycles cachés et masquent le code mort à Knip.

## Conséquences

- On retrouve tout ce qui concerne un concept dans un seul dossier. Les frontières sont
  vérifiées par la CI.
- La composition entre features se fait explicitement dans les routes.
- Signal de révision : si plus de trois features ont besoin de se parler directement, on
  réévalue (couche `entities` à la FSD).
