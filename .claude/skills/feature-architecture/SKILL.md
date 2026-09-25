---
name: feature-architecture
description: The features/ architecture of the portfolio (bulletproof-react style) — where every kind of file goes, the one-way import rule app → features → shared, feature anatomy, no barrel files, path alias, file naming, and how the rules are enforced by lint. Load BEFORE creating any file or folder, moving code, adding an import across folders, or creating a new feature.
---

# Feature Architecture

Inspired by [bulletproof-react](https://github.com/alan2207/bulletproof-react), chosen over
Feature-Sliced Design because FSD's layers (entities, widgets, per-slice public APIs) are
ceremony for a site of this size. Decision: [ADR 0001](../../../docs/adr/0001-architecture-features.md).

## The dependency rule

```
app  ──►  features/*  ──►  shared (components, hooks, lib, config, types, utils, styles)
 │                               ▲
 └───────────────────────────────┘
```

- `app/` may import everything.
- `features/<x>/` may import **shared** and **its own files only**. Never another feature.
  If two features need the same thing, it moves to shared (if generic) or the composition
  happens in `app/` (if it is about arranging features together).
- Shared code never imports `features/` or `app/`.
- Enforced by `eslint-plugin-boundaries` (`boundaries/dependencies`, default `disallow`).
  A violation is an architecture question, never a lint suppression.

## Where does this file go?

| It is…                                                                               | It goes in                                        |
| ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| A route component (URL → page composition, `<title>`, `usePageHeading`)              | `src/app/routes/<route>.tsx`                      |
| Route table (`ROUTES`), root layout, error boundary, pages                           | `src/app/routes.tsx`, `src/app/routes/<page>.tsx` |
| Bootstrap: `createBrowserRouter(ROUTES)`, hydrate or render (excluded from coverage) | `src/main.tsx`                                    |
| Build-time HTML rendering of one route (typed by `src/types/prerender.ts`)           | `src/entry-server.tsx`                            |
| Build scripts and their config (prerender, pages list) — not shipped, `vite` allowed | `scripts/`                                        |
| A generic, content-agnostic UI primitive (Button, Badge, Card, Link)                 | `src/components/ui/<name>.tsx`                    |
| Page chrome (skip link, header, footer, section shell)                               | `src/components/layout/<name>.tsx`                |
| A component that knows about a CV concept (experience, project, skill)               | `src/features/<f>/components/<name>.tsx`          |
| Logic of that feature (state, derivations, effects)                                  | `src/features/<f>/hooks/use-<name>.ts`            |
| Typed content from the CV                                                            | `src/features/<f>/data/<name>.ts`                 |
| Zod schemas / derived types of that feature                                          | `src/features/<f>/schemas/`, `types/`             |
| Pure functions of that feature                                                       | `src/features/<f>/utils/<name>.ts`                |
| A hook useful to any feature (media query, page heading focus)                       | `src/hooks/use-<name>.ts`                         |
| Adapters to the outside world, `cn()`                                                | `src/lib/<name>.ts`                               |
| Env parsing, route paths, site metadata, breakpoints                                 | `src/config/<name>.ts`                            |
| Tailwind `@theme`, base styles                                                       | `src/styles/`                                     |
| Test setup, render helpers, axe helper                                               | `src/testing/`                                    |
| E2E specs                                                                            | `e2e/<journey>.spec.ts`                           |

A folder exists only when it has a file. Don't pre-create empty `types/` or `utils/`.

## Feature anatomy

Features are **CV concepts**, not pages: `hero`, `about`, `experience`, `projects`,
`ai-practice`, `skills`, `education`, `contact`, `legal`. Example:

```
src/features/experience/
  components/
    experience-timeline.tsx        # renders a list, pure
    experience-timeline.test.tsx
    experience-card.tsx
    experience-card.test.tsx
  hooks/
    use-experience-timeline.ts     # sorting, grouping, "current role" derivation
    use-experience-timeline.test.ts
  data/
    experiences.ts                 # CV content, validated by experiencesSchema at test time
  schemas/
    experience-schema.ts
  types/
    experience.ts                  # z.infer types
```

## No barrel files

No `index.ts` that re-exports. Import the file that defines the thing:
`import { ExperienceCard } from '@/features/experience/components/experience-card'`.
Barrels hurt tree-shaking and HMR in Vite, create hidden cycles, and hide dead code from
Knip. Enforced by an ESLint `no-restricted-syntax` rule that bans every re-export
(`export * from`, `export { x } from`). `oxc/no-barrel-file` was tried and rejected: it
counts transitive modules and lets small barrels through.

## Imports

- Alias `@/` → `src/`. Use it for every import outside the current folder, including
  across folders of the same feature; relative imports only between files of the same
  folder (`./x`), never `../`.
- Type-only imports use `import { type X }` (`consistent-type-imports`,
  `verbatimModuleSyntax`).
- No import cycles (`import/no-cycle`).

## Naming

- Files and folders: **kebab-case** (`experience-card.tsx`, `use-active-section.ts`),
  enforced by `unicorn/filename-case` (files) and `check-file/folder-naming-convention`.
- One exported component per `.tsx` file; the file name is the component name in
  kebab-case. Small private sub-components may live in the same file, unexported.
- Tests sit next to the code: `<file>.test.ts(x)`. E2E in `e2e/`.

## Creating a new feature — checklist

1. Add the scope to `commitlint.config.ts` `scope-enum` and to `git-workflow`.
2. Create the folder with the first failing test (see `tdd-workflow`), nothing else.
3. Data first: schema + typed data + the test that validates the data against the schema.
4. Hook(s) with their tests, then pure components with their tests.
5. Compose the feature in the route in `src/app/routes/`.
6. E2E journey + a11y + responsive specs.
