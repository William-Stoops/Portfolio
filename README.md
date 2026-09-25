# Portfolio — William Stoops

Portfolio de **William Stoops**, Software Engineer & AI Engineer (TypeScript · Python ·
C++ · Rust).

> **État** : le cadrage est terminé (conventions, décisions d'architecture, skills
> d'agent). Le socle technique arrive dans la prochaine PR.

## Pourquoi ce dépôt vaut d'être lu

Le site est une vitrine, et le dépôt est une démonstration de méthode. On y trouve :

- une architecture `features/` aux frontières imposées par le lint ([ADR 0001](docs/adr/0001-architecture-features.md)) ;
- du TDD sur trois niveaux : unitaire, composants en vrai navigateur, E2E Playwright ([ADR 0003](docs/adr/0003-testing-strategy.md)) ;
- un typage total, sans `any`, `unknown` ni assertion ([ADR 0008](docs/adr/0008-typescript-strictness.md)) ;
- la cible WCAG 2.2 AA + RGAA 4.1.2, avec des contrastes calculés et testés ([ADR 0005](docs/adr/0005-accessibility-target.md)) ;
- un responsive pensé composant par composant avec les container queries ([ADR 0006](docs/adr/0006-responsive-strategy.md)) ;
- aucun code mort, grâce à Knip ([ADR 0002](docs/adr/0002-lint-format-dead-code.md)) ;
- des Conventional Commits, une PR détaillée par changement, et une CI qui bloque tout écart.

## Stack

React 19 (React Compiler) · Vite 8 · TypeScript 6 · Tailwind CSS 4 · shadcn/Base UI ·
React Router 8 · React Hook Form + Zod 4 · Motion · Vitest 5 · Playwright · Oxlint + ESLint
· Prettier · Knip · Husky + commitlint · GitHub Actions.

## Documentation

- [CLAUDE.md](CLAUDE.md) : contexte du projet, invariants, conventions, feuille de route
- [docs/adr/](docs/adr/) : décisions d'architecture
- [docs/content/cv-source.md](docs/content/cv-source.md) : source unique du contenu
- [.claude/skills/](.claude/skills/) : règles de travail détaillées par domaine
