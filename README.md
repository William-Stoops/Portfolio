# Portfolio — William Stoops

Portfolio de **William Stoops**, Software Engineer & AI Engineer (TypeScript · Python ·
C++ · Rust), en français et en anglais.

**En ligne : [william-stoops.pages.dev](https://william-stoops.pages.dev)** (Cloudflare
Pages, [ADR 0031](docs/adr/0031-deploy-on-cloudflare-pages.md)).

## Pourquoi ce dépôt vaut d'être lu

Le site est une vitrine, et le dépôt est une démonstration de méthode. On y trouve :

- une architecture `features/` aux frontières imposées par le lint ([ADR 0001](docs/adr/0001-architecture-features.md)) ;
- du TDD sur trois niveaux : unitaire, composants en vrai navigateur, E2E Playwright sur cinq appareils ([ADR 0003](docs/adr/0003-testing-strategy.md)) ;
- un typage total, sans `any`, `unknown` ni assertion ([ADR 0008](docs/adr/0008-typescript-strictness.md)) ;
- la cible WCAG 2.2 AA + RGAA 4.1.2, avec des contrastes calculés et testés ([ADR 0005](docs/adr/0005-accessibility-target.md)) ;
- un responsive pensé composant par composant avec les container queries ([ADR 0006](docs/adr/0006-responsive-strategy.md)) ;
- des pages pré-rendues, et des budgets de bundle et Lighthouse imposés en CI ([ADR 0011](docs/adr/0011-build-time-prerendering.md)) ;
- un mouvement en CSS natif, lié au défilement et exécuté par le compositeur ([ADR 0015](docs/adr/0015-expressive-motion-in-native-css.md)) ;
- du WebGL2 écrit à la main, sans bibliothèque : la surface de volatilité du hero et le globe du voyage à Séoul ([ADR 0016](docs/adr/0016-hero-webgl-surface.md), [ADR 0027](docs/adr/0027-korea-flight-over-a-globe.md)) ;
- aucun code mort, grâce à Knip ([ADR 0002](docs/adr/0002-lint-format-dead-code.md)) ;
- des Conventional Commits, une PR détaillée par changement, et une CI qui bloque tout écart.

## Stack

React 19 (React Compiler) · Vite 8 (Rolldown) · TypeScript 6 · Tailwind CSS 4 ·
shadcn/Base UI · React Router 8 · React Hook Form + Zod 4 · WebGL2 · Vitest 5 · Playwright ·
Oxlint + ESLint · Prettier · Knip · Husky + commitlint · GitHub Actions · Cloudflare Pages.

## Commandes

```bash
pnpm dev          # serveur de développement
pnpm verify       # format, lint, types, code mort, tests et couverture, build, budgets : la CI
pnpm test:e2e     # Playwright sur le build de production, cinq appareils
pnpm build        # build, pré-rendu des deux langues, passerelle, sitemap
```

Pour déployer à la main (avec un compte Cloudflare connecté à wrangler) :

```bash
pnpm build && pnpm dlx wrangler pages deploy dist --project-name william-stoops --branch main
```

Le workflow `Deploy` publie `main` après la CI, une fois `CLOUDFLARE_ACCOUNT_ID` (variable)
et `CLOUDFLARE_API_TOKEN` (secret) ajoutés au dépôt.

## Documentation

- [CLAUDE.md](CLAUDE.md) : contexte du projet, invariants, conventions, feuille de route
- [docs/adr/](docs/adr/) : décisions d'architecture
- [docs/content/cv-source.md](docs/content/cv-source.md) : source unique du contenu
- [.claude/skills/](.claude/skills/) : règles de travail détaillées par domaine
