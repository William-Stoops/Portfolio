---
name: tdd-workflow
description: Test-Driven Development for the portfolio — red/green/refactor loop mapped to commits, the test layers (unit in Node, component in Vitest browser mode, E2E/a11y/responsive in Playwright), what each layer asserts, role-first queries, fixtures, naming, coverage, and anti-patterns. Load BEFORE writing any production code (the test comes first), and BEFORE writing or changing any test.
---

# TDD Workflow

**No production line without a failing test that demands it.**

## The loop

1. **Red** — write the smallest test describing the next behaviour. Run it, see it fail
   **for the right reason**: an assertion failure or a missing module the test is about
   to demand — never a typo or a broken setup. Say in the PR which failure you saw.
2. **Green** — write the minimum code to pass. Run the whole affected project.
3. **Refactor** — improve names, extract hooks/utils, remove duplication, with tests
   green at every step.
4. **Commit** the step (test + code together): hooks lint and type-check staged files,
   so every commit is green (see `git-workflow` §Atomic commits in TDD).

Outside-in for a feature: start with the E2E journey (red locally, not committed until
green), drive the components and hooks with inner loops, and the E2E turns green last.

## Layers

| Layer                   | Runner / env                                                     | Files                                                                | Asserts                                                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit**                | Vitest project `unit`, Node                                      | `*.test.ts` next to `utils/`, `schemas/`, `data/`, `config/`, `lib/` | Pure functions, schemas accept/reject, CV data validates against its schema, token contrast                                                                                              |
| **Hook**                | Vitest project `browser`                                         | `use-*.test.ts`                                                      | `renderHook` from `vitest-browser-react`: returned values for given inputs, reactions to events                                                                                          |
| **Component**           | Vitest project `browser` (real Chromium via Playwright provider) | `*.test.tsx`                                                         | Rendered semantics for given props: roles, accessible names, text, links, states; keyboard interactions with `userEvent`; axe (no violations); container-query layout via wrapper widths |
| **E2E journey**         | Playwright, 5 device projects                                    | `e2e/<journey>.spec.ts`                                              | Real user paths on the built app: navigate, read, download CV, open video, contact                                                                                                       |
| **A11y**                | Playwright + `@axe-core/playwright`                              | `e2e/a11y.spec.ts`                                                   | Every route × light/dark, tags incl. `wcag22aa`; skip link; route-change focus; focus visible/not obscured                                                                               |
| **Responsive / visual** | Playwright                                                       | `e2e/responsive.spec.ts`, `@visual` tag                              | Overflow sweep, landscape, print, screenshots at 375/768/1280/1920                                                                                                                       |

Why browser mode for components: jsdom has no layout, so container queries, focus
visibility, `matchMedia` and contrast cannot be tested there. Vitest 5 browser mode runs
the same tests in real Chromium.

## Writing good tests

- **Role-first queries**: `page.getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' })`.
  Then label, then text. `getByTestId` only for non-semantic layout wrappers — needing it
  for an interactive element reveals an a11y bug.
- Test **behaviour visible to the user**, not implementation: no assertions on class
  names, hook call counts, or internal state. Exception: a design-system primitive's
  variant may assert its computed style (real browser) when that _is_ the behaviour.
- Names read as specifications, in English:
  `it('announces the form error and focuses the email field')`.
- One behaviour per test; Arrange / Act / Assert separated by a blank line.
- Fixtures are typed with `satisfies <Type>` and built by small factories in
  `src/testing/factories/` — never casts, never `any`.
- CV content tests use the **real data** from `features/*/data/` (it is the product);
  logic tests use factories (to control edge cases).
- No snapshots of markup. ARIA snapshots (`toMatchAriaSnapshot`) are allowed for
  landmark/nav structure. Visual screenshots only in the `@visual` Playwright tag.
- Network: none at runtime today. If a form posts somewhere, MSW 2 handlers in
  `src/testing/msw/handlers.ts`, `onUnhandledRequest: 'error'`.
- Time: `vi.useFakeTimers()` + `vi.setSystemTime()` when a date matters ("depuis sept.
  2025" durations).

## Coverage

v8 provider, thresholds in `vitest.config.ts` (see `quality-gates` §8). Coverage is a
floor that catches forgotten branches, not a goal: a test written only to raise it is
deleted in review. `src/main.tsx` and `src/testing/` are excluded; nothing else.

## Anti-patterns (rejected in review)

- Writing the implementation, then the test.
- Tests that pass when the feature is removed (assert something real).
- `waitFor` with arbitrary timeouts; Playwright `waitForTimeout`. Use web-first
  assertions (`await expect(locator).toBeVisible()`).
- Mocking our own modules to test a component. Mock only the outside world.
- Skipped tests (`.skip`, `.only` — the latter fails CI via `forbidOnly`).
- E2E tests that duplicate component tests; E2E covers journeys and integration.
