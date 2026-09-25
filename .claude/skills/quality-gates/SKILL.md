---
name: quality-gates
description: The portfolio's automated quality gates — Oxlint + ESLint split, naming and any/unknown bans, Prettier, Knip dead-code detection, TypeScript strictness, Husky/lint-staged/commitlint hooks, GitHub Actions pipeline, budgets, and the Definition of Done. Load BEFORE touching any tool config (eslint, oxlint, knip, tsconfig, vitest, playwright, husky, CI), BEFORE adding a dependency, and BEFORE declaring a task done or opening a PR.
---

# Quality Gates

Nothing is "done" because it works on the dev server. It is done when every gate below is
green **locally and in CI**, with zero warnings and zero suppressions.

## 1. Gate order

| Gate | Command | Local hook | CI job |
| ---- | ------- | ---------- | ------ |
| Format | `pnpm format:check` (Prettier) | pre-commit (staged, `--write`) | `quality` |
| Lint (fast) | `oxlint` | pre-commit (staged) | `quality` |
| Lint (typed, architecture) | `eslint --max-warnings=0` | pre-commit (staged) | `quality` |
| Types | `pnpm typecheck` (`tsc -b`) | pre-push | `quality` |
| Dead code | `pnpm knip` | pre-push | `quality` |
| Unit + component tests, coverage | `pnpm test:coverage` | pre-push (`pnpm test`) | `quality` |
| Build + bundle budget | `pnpm build && pnpm size` | — | `quality` |
| E2E + a11y + responsive | `pnpm test:e2e` | — | `e2e` (Playwright Docker image) |
| Lighthouse budgets | `lhci autorun` | — | `lighthouse` |
| Commit message | `commitlint --edit` | commit-msg | `pr-title` (PR title) |

`pnpm verify` runs the local subset in the CI order. Run it before every push. Never
bypass hooks with `--no-verify`.

## 2. Linting: why two linters

- **Oxlint** (fast, native `jsx-a11y`, `react`, `unicorn`, `import`, `oxc`, `vitest`):
  correctness, a11y, kebab-case filenames (`unicorn/filename-case`), barrel ban
  (`oxc/no-barrel-file`), import cycles, `no-explicit-any`.
- **ESLint 10 + typescript-eslint `strictTypeChecked` + `stylisticTypeChecked`**: what
  Oxlint cannot do yet — `naming-convention`, `no-restricted-syntax` (bans
  `TSUnknownKeyword`), `eslint-plugin-boundaries` (feature isolation),
  `eslint-plugin-react-hooks` 7 (React Compiler rules), `check-file` (kebab-case folders).
- `eslint-plugin-oxlint` is spread **last** (before `eslint-config-prettier`) so rules
  Oxlint already covers are turned off in ESLint — no double reporting.
- `eslint-plugin-jsx-a11y` is **not** installed (peerDeps stop at ESLint 9); Oxlint's
  native `jsx-a11y` replaces it.

Non-negotiable ESLint rules (see `typescript-standards` for the rationale):

```ts
'@typescript-eslint/no-explicit-any': 'error',
'no-restricted-syntax': ['error',
  { selector: 'TSUnknownKeyword', message: 'No explicit `unknown`: parse with Zod and use the inferred type.' },
  { selector: 'TSAsExpression:not([typeAnnotation.typeName.name="const"])', message: 'No type assertions: narrow or parse instead.' },
  { selector: 'ExportDefaultDeclaration', message: 'Named exports only.' }],
'@typescript-eslint/naming-convention': [/* see typescript-standards §naming */],
'@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
'@typescript-eslint/no-non-null-assertion': 'error',
'@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': true, 'ts-ignore': true, 'ts-nocheck': true }],
```

Overrides are allowed only for: tool config files that require `export default`
(`*.config.ts`), and generated shadcn sources **before** they are adapted (the adaptation
PR removes the override for that file). There is **no** override that re-allows `any` or
`unknown` anywhere.

`eslint-disable` comments are forbidden. If a rule is wrong for a case, change the rule
in config with a comment explaining why, in its own commit.

## 3. Knip — only necessary code

Knip reports unused **files, exports, types, enum members, dependencies,
devDependencies**, and **unlisted** dependencies (imported but not declared). Its Vite,
Vitest, Playwright, ESLint, Prettier, Husky, lint-staged and commitlint plugins are
auto-enabled from `package.json`.

`knip.config.ts`:

```ts
import type { KnipConfig } from 'knip';

// Entries: the app bootstrap and the E2E specs. `!` marks production code so that
// `knip --production` checks the shipped graph without tests and tooling.
const config: KnipConfig = {
  entry: ['src/main.tsx!', 'e2e/**/*.spec.ts'],
  project: ['src/**/*.{ts,tsx}!', 'e2e/**/*.ts'],
  ignoreExportsUsedInFile: false,
  rules: { duplicates: 'error', types: 'error', enumMembers: 'error' },
};

export default config;
```

- CI runs `pnpm knip` **and** `pnpm knip --production --strict` (shipped code must not
  depend on devDependencies, and must not keep exports only tests use).
- Resolving a finding means **deleting** the code or the dependency. Adding an entry to
  `ignore*` needs a comment naming the consumer Knip cannot see.
- shadcn components are copied **one at a time, when a feature needs them** — never the
  whole catalogue — so Knip never has to ignore `components/ui/`.
- An export used only by its own test is dead: inline it or test through the public
  function.

## 4. TypeScript

`tsconfig.app.json` hardens the `create-vite` template: `strict`,
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`,
`noImplicitReturns`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`,
`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`,
`paths: { "@/*": ["./src/*"] }` (no `baseUrl`, deprecated in TS 6). Tool configs and
`e2e/` are type-checked by `tsconfig.node.json`. TypeScript is pinned `~6.0.3` (see
CLAUDE.md for why not 7).

## 5. Formatting

Prettier 3.9: `singleQuote`, `trailingComma: "all"`, `printWidth: 100`,
`prettier-plugin-tailwindcss` with `tailwindStylesheet: "./src/styles/globals.css"` and
`tailwindFunctions: ["cn", "cva"]` so class order is deterministic.

## 6. Git hooks

- `.husky/pre-commit` → `pnpm exec lint-staged`
  (`*.{ts,tsx}`: `oxlint --fix`, `eslint --fix --max-warnings=0`, `prettier --write`;
  `*.{json,md,css,yml,yaml}`: `prettier --write`)
- `.husky/commit-msg` → `pnpm exec commitlint --edit "$1"`
- `.husky/pre-push` → `pnpm typecheck && pnpm knip && pnpm test`
- `commitlint.config.ts`: `@commitlint/config-conventional` + `scope-enum` (list in
  `git-workflow`) + `scope-empty: never` + `body-max-line-length: 100`.

## 7. CI (GitHub Actions)

`.github/workflows/ci.yml`, triggered on PRs and pushes to `main`, `concurrency` cancels
superseded runs, `permissions: contents: read`, actions pinned by SHA (Renovate
`helpers:pinGitHubActionDigests`), Node from `.nvmrc` (24), pnpm from `packageManager`.

Jobs: `quality` → (`e2e` ∥ `lighthouse`), plus `pr-title` (commitlint on the PR title,
passed through an env var — never interpolated into the script, to avoid injection).
Artefacts: `dist`, `playwright-report` (on failure too), coverage summary, Lighthouse
report. Branch protection on `main` requires all jobs.

Dependency updates: Renovate (`minimumReleaseAge: "3 days"`, grouped React / Vitest /
lint, TypeScript capped `<7`). pnpm's own `minimumReleaseAge` (24 h) stays on.

## 8. Budgets

| Budget | Limit (initial, recalibrate by ADR only) |
| ------ | ---------------------------------------- |
| Initial JS (gzip) | 120 kB — `size-limit` |
| CSS (gzip) | 15 kB |
| Lighthouse performance / a11y / best practices / SEO | ≥ 0.95 / **1.0** / ≥ 0.95 / ≥ 0.95 |
| LCP / CLS / TBT (Lighthouse, mobile) | ≤ 2.0 s / ≤ 0.05 / ≤ 150 ms |
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
