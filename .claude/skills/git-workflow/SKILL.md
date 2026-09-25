---
name: git-workflow
description: Branch naming, Conventional Commits, scopes, atomic commits and pull request format for the portfolio repo. Load BEFORE creating a branch, writing a commit message, staging changes, or opening / updating a pull request.
---

# Git Workflow

Every change reaches `main` through a pull request. `main` is always deployable.

## Branches

Format: `william/<type>/<subject>` — lowercase, kebab-case subject, 2–5 words.

| Type       | Use for                                               | Example                            |
| ---------- | ----------------------------------------------------- | ---------------------------------- |
| `feat`     | A user-visible capability                             | `william/feat/hero-section`        |
| `fix`      | A bug fix                                             | `william/fix/mobile-menu-focus`    |
| `refactor` | Behaviour-preserving restructuring                    | `william/refactor/projects-hooks`  |
| `perf`     | Measurable performance improvement                    | `william/perf/hero-image-avif`     |
| `test`     | Tests only                                            | `william/test/contact-form-e2e`    |
| `docs`     | Documentation, ADRs, CLAUDE.md, skills                | `william/docs/adr-state-management`|
| `style`    | Formatting only (no CSS changes — those are `feat`/`fix`) | `william/style/prettier-pass`  |
| `build`    | Build system, dependencies                            | `william/build/vite-8`             |
| `ci`       | GitHub Actions                                        | `william/ci/lighthouse-budget`     |
| `chore`    | Tooling that fits nothing above                       | `william/chore/husky-setup`        |

One branch = one intent. If the branch name needs "and", it is two branches.

Always branch from an up-to-date `main`:

```bash
git switch main && git pull --ff-only && git switch -c william/feat/hero-section
```

## Commits — Conventional Commits 1.0.0

```
<type>(<scope>): <subject>

<body: why, not what — wrap at 100>

<footer: BREAKING CHANGE: … | Refs: #12>
```

- `type`: same list as branches.
- `scope`: **required**, from the enum enforced by commitlint (`commitlint.config.ts`):
  - features: `hero`, `about`, `experience`, `projects`, `ai-practice`, `skills`,
    `education`, `contact`, `legal`
  - shared / cross-cutting: `app`, `ui`, `layout`, `design-system`, `a11y`, `responsive`,
    `perf`, `seo`, `content`
  - tooling: `test`, `e2e`, `deps`, `config`, `ci`, `docs`, `adr`, `agent`

  Adding a feature slice = adding its scope here and in commitlint in the same PR.
- `subject`: imperative, lowercase start, no trailing period, ≤ 72 chars total header.
- Breaking change: `feat(ui)!: rename Button intent prop` + `BREAKING CHANGE:` footer.

**Never** add `Co-Authored-By`, "Generated with", or any AI attribution line to a commit
or a PR. The project `.claude/settings.json` disables it; do not re-add it by hand.

### Atomic commits in TDD

A feature branch reads like the TDD loop that produced it:

```
test(contact): cover email validation errors
feat(contact): validate contact form with zod schema
refactor(contact): extract field error message component
```

A commit must build, lint and pass its own tests — except a `test:` commit that
intentionally adds a red test, which is immediately followed by its `feat:`/`fix:`.
Squash-merge is **not** used: the red → green → refactor history is part of what the
repository demonstrates. Use rebase-merge; keep commits clean before pushing
(`git commit --fixup` + `git rebase --autosquash main` is fine on your own branch).

### What never gets committed

`.env*` (except `.env.example`), `coverage/`, `playwright-report/`, `test-results/`,
`dist/`, screenshots from debugging sessions, personal documents (CV PDF goes through
`public/` only when explicitly requested).

## Pull requests

Title = the Conventional Commit header of the change (`feat(hero): add hero section`).
It is linted in CI like a commit.

Body (French — it is read by humans), template in `.github/pull_request_template.md`:

```markdown
## Contexte
Pourquoi ce changement existe. Lien vers l'issue / l'ADR.

## Changements
- Puces concrètes, regroupées par zone (feature, ui, config…)

## Décisions techniques
Choix non évidents et alternatives écartées (renvoyer vers un ADR si structurant).

## Tests
- Unitaires : …
- Composants / intégration : …
- E2E Playwright : …
- Accessibilité : axe (auto) + vérifs manuelles effectuées (clavier, lecteur d'écran)

## Captures
Desktop + mobile, avant / après si visuel.

## Checklist
- [ ] `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm build` / `pnpm test:e2e` verts
- [ ] Aucun `any` ni `unknown` explicite
- [ ] Conventions de nommage respectées (fichiers kebab-case, composants PascalCase…)
- [ ] Budget de performance respecté (taille des chunks, Lighthouse)
- [ ] Critères WCAG 2.2 AA concernés vérifiés
- [ ] CLAUDE.md / skills / ADR mis à jour si une convention change
```

Create it with `gh pr create --base main --title "<header>" --body-file <file>`.
Open as draft while CI is red. Never merge with a red check, never force-push `main`,
never enable auto-merge unless William asks.
