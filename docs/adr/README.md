# Architecture Decision Records

Format : [MADR](https://adr.github.io/madr/) allégé, en français. Un ADR est **immuable une
fois accepté** : on ne le réécrit pas, on le remplace par un nouvel ADR qui le déclare
« Remplacé par ADR XXXX ».

| #    | Titre                                                                                                        | Statut            |
| ---- | ------------------------------------------------------------------------------------------------------------ | ----------------- |
| 0001 | [Architecture `features/` inspirée de bulletproof-react](0001-architecture-features.md)                      | Accepté           |
| 0002 | [Oxlint + ESLint, Prettier et Knip](0002-lint-format-dead-code.md)                                           | Accepté           |
| 0003 | [Stratégie de tests : Vitest browser mode + Playwright](0003-testing-strategy.md)                            | Accepté           |
| 0004 | [Pas de store global par défaut (Redux Toolkit sur critères)](0004-state-management.md)                      | Accepté           |
| 0005 | [Cible WCAG 2.2 AA + RGAA 4.1.2, palette contrainte](0005-accessibility-target.md)                           | Accepté           |
| 0006 | [Stratégie responsive : mobile-first, container queries, tokens fluides](0006-responsive-strategy.md)        | Accepté           |
| 0007 | [UI : Tailwind v4 + shadcn sur Base UI](0007-ui-kit.md)                                                      | Accepté           |
| 0008 | [TypeScript 6.0 strict, sans `any` ni `unknown`](0008-typescript-strictness.md)                              | Accepté           |
| 0009 | [Thèmes par `light-dark()` et palette de couleurs fermée](0009-theme-light-dark-closed-palette.md)           | Accepté           |
| 0010 | [Budget LCP temporaire à 2,5 s en attendant le pré-rendu](0010-temporary-lcp-budget-before-prerender.md)     | Remplacé par 0011 |
| 0011 | [Pré-rendre les pages au build, en restant en mode data](0011-build-time-prerendering.md)                    | Accepté           |
| 0012 | [Générer les images en fichiers statiques, hors du bundler](0012-static-generated-images.md)                 | Accepté           |
| 0013 | [Mesurer Lighthouse en bridage réel, sur la médiane des passes](0013-lighthouse-devtools-throttling.md)      | Accepté           |
| 0014 | [Héberger sur Cloudflare Pages, avec un fichier HTML par page](0014-cloudflare-pages-one-html-per-route.md)  | Accepté           |
| 0015 | [Un mouvement expressif, en CSS natif](0015-expressive-motion-in-native-css.md)                              | Accepté           |
| 0016 | [Une surface de volatilité en WebGL2 brut derrière le hero](0016-hero-webgl-surface.md)                      | Accepté           |
| 0017 | [Relever le budget du JS initial à 125 kB](0017-initial-js-budget-125.md)                                    | Accepté           |
| 0018 | [Différer le rendu hors écran et découper l'hydratation](0018-defer-offscreen-render-and-split-hydration.md) | Accepté           |
| 0019 | [Ajouter les couleurs du drapeau coréen à la palette fermée](0019-korean-flag-colours.md)                    | Accepté           |
| 0020 | [Pré-rendre avec `prerender` et charger la section Corée à la demande](0020-prerender-lazy-sections.md)      | Accepté           |
| 0021 | [Raconter la page d'accueil comme un parcours](0021-home-page-as-a-journey.md)                               | Accepté           |
| 0022 | [Faire de toute la page un seul vol](0022-one-flight-for-the-whole-page.md)                                  | Accepté           |

Modèle : copier [template.md](template.md).
