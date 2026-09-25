---
name: quality-gates
description: The portfolio's automated quality gates — Oxlint + ESLint split, naming and any/unknown bans, Prettier, Knip dead-code detection, TypeScript strictness, Husky/lint-staged/commitlint hooks, GitHub Actions pipeline, budgets, and the Definition of Done. Load BEFORE touching any tool config (eslint, oxlint, knip, tsconfig, vitest, playwright, husky, CI), BEFORE adding a dependency, and BEFORE declaring a task done or opening a PR.
---

# Quality Gates

Nothing is "done" because it works on the dev server. It is done when every gate below is
green **locally and in CI**, with zero warnings and zero suppressions.

## 1. Gate order

| Gate                             | Command                        | Local hook                     | CI job                          |
| -------------------------------- | ------------------------------ | ------------------------------ | ------------------------------- |
| Format                           | `pnpm format:check` (Prettier) | pre-commit (staged, `--write`) | `quality`                       |
| Lint (fast)                      | `oxlint`                       | pre-commit (staged)            | `quality`                       |
| Lint (typed, architecture)       | `eslint --max-warnings=0`      | pre-commit (staged)            | `quality`                       |
| Types                            | `pnpm typecheck` (`tsc -b`)    | pre-push                       | `quality`                       |
| Dead code                        | `pnpm knip`                    | pre-push                       | `quality`                       |
| Unit + component tests, coverage | `pnpm test:coverage`           | pre-push (`pnpm test`)         | `quality`                       |
| Build + bundle budget            | `pnpm build && pnpm size`      | —                              | `quality`                       |
| E2E + a11y + responsive          | `pnpm test:e2e`                | —                              | `e2e` (Playwright Docker image) |
| Lighthouse budgets               | `lhci autorun`                 | —                              | `lighthouse`                    |
| Commit message                   | `commitlint --edit`            | commit-msg                     | `pr-title` (PR title)           |

`pnpm verify` runs the local subset in the CI order. Run it before every push. Never
bypass hooks with `--no-verify`.

## 2. Linting: why two linters

- **Oxlint** (fast, native `jsx-a11y`, `react`, `unicorn`, `import`, `oxc`, `vitest`):
  correctness, the 36 `jsx-a11y` rules (all enabled explicitly), kebab-case filenames
  (`unicorn/filename-case`), import cycles, `no-default-export`, `no-explicit-any`.
- **ESLint 10 + typescript-eslint `strictTypeChecked` + `stylisticTypeChecked`**: what
  Oxlint cannot do yet — `naming-convention`, `no-restricted-syntax` (bans
  `TSUnknownKeyword`, type assertions, and every re-export = barrel files), `eslint-plugin-boundaries` (feature isolation),
  `eslint-plugin-react-hooks` 7 (React Compiler rules), `check-file` (kebab-case folders).
- `eslint-plugin-oxlint` is spread **last** (before `eslint-config-prettier`) so rules
  Oxlint already covers are turned off in ESLint — no double reporting.
- `eslint-plugin-jsx-a11y` is **not** installed (peerDeps stop at ESLint 9); Oxlint's
  native `jsx-a11y` replaces it.

Non-negotiable rules — the source of truth is `eslint.config.ts` and `.oxlintrc.json`;
this list only says what they guarantee:

- no `any` (Oxlint + ESLint), no explicit `unknown`, no `as` / `<T>` assertions except
  `as const`, no `!` (ESLint `no-restricted-syntax`, Oxlint `no-non-null-assertion`);
- no re-exports at all (`export * from`, `export { x } from`) = no barrel files;
- no `export default` (Oxlint `import/no-default-export`), except `*.config.ts`;
- no `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`;
- naming convention (see `typescript-standards`), module-level primitives and arrays in
  `UPPER_CASE` (type-aware);
- `boundaries/dependencies` (default `disallow`) + `boundaries/no-unknown-files`;
- kebab-case files (Oxlint) and folders (ESLint `check-file`);
- React Compiler rules (`eslint-plugin-react-hooks` 7 `recommended`).

Every rule was verified with deliberately broken probe files when it was introduced; a
new rule gets the same treatment (write a violating file, see it fail, delete it).

Overrides are allowed only for: tool config files that require `export default`
(`*.config.ts`), `no-await-in-loop` in `e2e/` (browser steps are sequential by nature),
and generated shadcn sources **before** they are adapted. There is **no** override that
re-allows `any`, `unknown` or assertions anywhere.

`eslint-disable` / `oxlint-disable` comments are forbidden. If a rule is wrong for a case,
change the rule in config with a comment explaining why, in its own commit.

## 3. Knip — only necessary code

Knip reports unused **files, exports, types, enum members, dependencies,
devDependencies**, and **unlisted** dependencies (imported but not declared). Its Vite
(entry derived from `index.html`), Vitest, Playwright, ESLint, Prettier, Husky,
lint-staged and commitlint plugins are auto-enabled from `package.json`. Config:
`knip.config.ts` — production pattern `src/**/*.{ts,tsx,css}!`, minus `src/testing/**`.

- CI and pre-push run `pnpm knip`; CI also runs `pnpm knip:production`
  (`--production --strict`): shipped code must only import `dependencies`. Consequence:
  **anything imported from `src/` (including CSS `@import "tailwindcss"`) is a
  `dependency`**, everything else a `devDependency`.
- Resolving a finding means **deleting** the code or the dependency. Adding an entry to
  `ignore*` needs a comment naming the consumer Knip cannot see.
- shadcn components are copied **one at a time, when a feature needs them** — never the
  whole catalogue — so Knip never has to ignore `components/ui/`.
- An export used only by its own test is dead: inline it or test through the public
  function.

## 3 bis. Dependencies and pnpm

- pnpm 12 (`packageManager`), `minimumReleaseAge` 24 h kept on: never add a
  `minimumReleaseAgeExclude`, pick the previous version instead.
- Build scripts are blocked by default; allow one only in `pnpm-workspace.yaml`
  `allowBuilds`, with a comment saying what the script does.
- Versions are pinned exactly; Renovate proposes updates (grouped, 3-day release age,
  TypeScript `<7`, `@babel/core` `<8`, `@types/node` on the Node LTS).
- Scripts never call `pnpm` from inside a tool (e.g. Playwright `webServer` runs
  `vite build && vite preview` directly): nested pnpm through corepack breaks on pnpm 12.

## 4. TypeScript

`tsconfig.app.json` hardens the `create-vite` template: `strict`,
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`,
`noImplicitReturns`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`,
`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`,
`paths: { "@/*": ["./src/*"] }` (no `baseUrl`, deprecated in TS 6). Tool configs and
`e2e/` are type-checked by `tsconfig.node.json` with `module: preserve` /
`moduleResolution: bundler`, because every config file is loaded by a bundler or loader
(Vite, jiti, Playwright), never by raw Node — this also gives CJS packages their correct
default-export types. TypeScript is pinned `~6.0.3` (see CLAUDE.md for why not 7).

**React Compiler is disabled under Vitest** (`vite.config.ts`): its memo-cache branches
would be reported as untested source branches. Compiled output is exercised by the E2E
suite against the production build and guarded by the compiler lint rules.

## 5. Formatting

Prettier 3.9: `singleQuote`, `trailingComma: "all"`, `printWidth: 100`,
`prettier-plugin-tailwindcss` with `tailwindStylesheet: "./src/styles/globals.css"` and
`tailwindFunctions: ["cn", "cva"]` so class order is deterministic.

## 6. Git hooks

- `.husky/pre-commit` → `pnpm exec lint-staged`
  (`lint-staged.config.ts` — `*.{ts,tsx}`: `oxlint --fix`, `eslint --fix`, `prettier`;
  `*.{json,md,css,html,yml,yaml}`: `prettier`)
- `.husky/commit-msg` → `pnpm exec commitlint --edit "$1"`
- `.husky/pre-push` → `pnpm typecheck && pnpm knip && pnpm test`
- `commitlint.config.ts`: `@commitlint/config-conventional` + `scope-enum` (list in
  `git-workflow`) + `scope-empty: never` + `body-max-line-length: 100`.

## 7. CI (GitHub Actions)

`.github/workflows/ci.yml`, triggered on PRs and pushes to `main`, `concurrency` cancels
superseded runs, `permissions: contents: read`, actions pinned by SHA (Renovate
`helpers:pinGitHubActionDigests`), Node from `.nvmrc` (24), pnpm from `packageManager`.

Jobs: `quality` → (`e2e` in the official Playwright Docker image ∥ `lighthouse` on
`dist/`), plus on PRs `pr-title` (commitlint on the title) and `commits` (commitlint on
every commit of the PR). PR data always goes through env vars — never interpolated into a
script, to avoid injection. Artefacts: `coverage`, `dist`, `playwright-report` (on
failure too), Lighthouse report. Branch protection on `main` requires all jobs.

Dependency updates: Renovate (`minimumReleaseAge: "3 days"`, grouped React / Vitest /
lint, TypeScript capped `<7`). pnpm's own `minimumReleaseAge` (24 h) stays on.

## 8. Budgets

| Budget                                               | Limit (initial, recalibrate by ADR only)                         |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Initial JS (gzip)                                    | 120 kB — `size-limit`                                            |
| CSS (gzip)                                           | 15 kB                                                            |
| Lighthouse performance / a11y / best practices / SEO | ≥ 0.95 / **1.0** / ≥ 0.95 / ≥ 0.95                               |
| LCP / CLS / TBT (Lighthouse, mobile)                 | ≤ 2.0 s / ≤ 0.05 / ≤ 150 ms                                      |
| Coverage (lines / functions / statements / branches) | 90 / 90 / 90 / 85 on `src/`, excluding `main.tsx` and `testing/` |

## 9. Adding a dependency

Before `pnpm add`: is it needed (can the platform or 20 lines do it)? Is it maintained
(release in the last 6 months)? Its gzip size (bundlephobia / `size-limit`)? Does it ship
types? Licence compatible? Record the answer in the PR "Décisions techniques" section; a
runtime dependency above 10 kB gzip needs an ADR. Knip will flag it if it ends up unused.

## 10. Definition of Done

- [ ] Tests written first, all green (unit, component, E2E, a11y, responsive)
- [ ] `pnpm verify` green locally; CI green
- [ ] Zero lint warnings, zero suppressions, zero `any` / `unknown` / assertions
- [ ] Knip clean (default and `--production --strict`)
- [ ] Budgets respected
- [ ] Manual checks listed in the PR (keyboard, screen reader spot-check, 320 px, mobile device)
- [ ] Docs updated: CLAUDE.md, skills or ADR when a convention or decision changed
- [ ] Atomic Conventional Commits, detailed PR (see `git-workflow`)
