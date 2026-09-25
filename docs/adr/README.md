# Architecture Decision Records

Format : [MADR](https://adr.github.io/madr/) allégé, en français. Un ADR est **immuable une
fois accepté** : on ne le réécrit pas, on le remplace par un nouvel ADR qui le déclare
« Remplacé par ADR XXXX ».

| #    | Titre                                                                                                    | Statut            |
| ---- | -------------------------------------------------------------------------------------------------------- | ----------------- |
| 0001 | [Architecture `features/` inspirée de bulletproof-react](0001-architecture-features.md)                  | Accepté           |
| 0002 | [Oxlint + ESLint, Prettier et Knip](0002-lint-format-dead-code.md)                                       | Accepté           |
| 0003 | [Stratégie de tests : Vitest browser mode + Playwright](0003-testing-strategy.md)                        | Accepté           |
| 0004 | [Pas de store global par défaut (Redux Toolkit sur critères)](0004-state-management.md)                  | Accepté           |
| 0005 | [Cible WCAG 2.2 AA + RGAA 4.1.2, palette contrainte](0005-accessibility-target.md)                       | Accepté           |
| 0006 | [Stratégie responsive : mobile-first, container queries, tokens fluides](0006-responsive-strategy.md)    | Accepté           |
| 0007 | [UI : Tailwind v4 + shadcn sur Base UI](0007-ui-kit.md)                                                  | Accepté           |
| 0008 | [TypeScript 6.0 strict, sans `any` ni `unknown`](0008-typescript-strictness.md)                          | Accepté           |
| 0009 | [Thèmes par `light-dark()` et palette de couleurs fermée](0009-theme-light-dark-closed-palette.md)       | Accepté           |
| 0010 | [Budget LCP temporaire à 2,5 s en attendant le pré-rendu](0010-temporary-lcp-budget-before-prerender.md) | Remplacé par 0011 |
| 0011 | [Pré-rendre les pages au build, en restant en mode data](0011-build-time-prerendering.md)                | Accepté           |
| 0012 | [Générer les images en fichiers statiques, hors du bundler](0012-static-generated-images.md)             | Accepté           |
| 0013 | [Mesurer Lighthouse en bridage réel, sur la médiane des passes](0013-lighthouse-devtools-throttling.md)  | Accepté           |

Modèle : copier [template.md](template.md).
