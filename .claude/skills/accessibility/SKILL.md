---
name: accessibility
description: WCAG 2.2 AA + RGAA 4.1.2 rules for the portfolio SPA — landmarks, headings, skip link, focus management on route change, focus appearance, target size, contrast tokens, reduced motion, reflow, forms, dialogs, and the automated + manual test protocol. Load BEFORE creating or changing any rendered markup, interactive component, colour token, animation, form, or route, and BEFORE writing an a11y test.
---

# Accessibility

**Target: WCAG 2.2 AA + RGAA 4.1.2, plus the cheap AAA criteria** (2.4.13 focus
appearance, 2.5.5 target size 44 px, 1.4.6 on body text, 2.3.3 reduced motion).
State on 2026-09-25: RGAA 5 (WCAG 2.2-based) announced for end of 2026, not published;
EN 301 549 v4.1.1 published 2026-09-02, not yet cited in the OJEU; WCAG 3 is a Working
Draft — ignore it for conformance, only the WCAG 2 contrast ratio counts.

Accessibility is a **test-first acceptance criterion**, not a polish pass: every feature
PR ships its axe + keyboard tests (see `tdd-workflow`).

## 1. Document structure

- `index.html`: `<html lang="fr">`. English phrases (not proper nouns like React,
  TypeScript) get `lang="en"` (WCAG 3.1.2, RGAA 8.7).
- One `<title>` per route: `"<Page> – William Stoops"`. React 19 hoists a `<title>`
  rendered in a component — use that, no helmet library.
- Landmarks, in this order: `SkipLink` → `<header>` (contains
  `<nav aria-label="Navigation principale">`) → **one** `<main id="main" tabIndex={-1}>`
  → `<footer>` (contains `<nav aria-label="Pied de page">`). Two navs ⇒ two distinct labels.
- One `h1` per view, `h2` per section, `h3` per card. Never skip a level. Pick the heading
  level for the outline, then style it with tokens — never pick a level for its size.
- Sections: `<section aria-labelledby="<id-of-h2>">`. Lists of links/tags/skills are `<ul>`.
- `NavLink` sets `aria-current="page"`; do not re-implement it.
- Footer on every page: link `Accessibilité` to `/accessibilite` (the declaration). The
  site is not subject to article 47 of loi 2005-102, so it shows **no conformance status**:
  under the RGAA, "partiellement" or "totalement conforme" is a result of an audit, and none
  has been run. **Never claim a status or a rate without an audit grid in `docs/a11y/`**;
  once there is one, add the status to the link and the declaration together.
- Declaration (`src/features/legal/components/accessibility-statement.tsx`): lists what was
  verified and what remains (screen readers, 400 % zoom by hand). Update its list and its
  date when the checks change.

## 2. Focus

### Skip link (2.4.1, RGAA 12.7)

First focusable element, visible on focus, targets `#main`, moves focus (not just scroll).

### Route change (2.4.3, 4.1.3, RGAA 12.8)

React Router manages neither focus nor announcement. Each page calls
`usePageHeading()` (`src/hooks/use-page-heading.ts`) and puts the ref on its `h1` with
`tabIndex={-1}`. The hook:

- does nothing on the initial load — detected with React Router's `location.key ===
'default'`, not a module flag (a flag breaks under StrictMode and across tests),
- does nothing when the URL has a `#hash` (anchor wins),
- focuses the `h1` otherwise (`preventScroll` on `NavigationType.Pop`).

Prefer native elements over roles — Oxlint `prefer-tag-over-role` enforces it: a group of
controls is a `<fieldset>` + `<legend>` (visually hidden if needed), a status message is
an `<output aria-live="polite">` (the explicit `aria-live` because some screen readers
ignore `<output>`'s implicit one). Example: `src/components/layout/theme-toggle.tsx`.

Do not add a global route-announcer live region on top of this without testing with NVDA
and VoiceOver — double announcements are likely. Live regions (`role="status"`) are for
**status messages** only: "Message envoyé", "Thème sombre activé".

### Focus appearance (2.4.7, 2.4.11, 2.4.13 AAA)

- Use **`outline`, never `box-shadow`/`ring`** for focus: box-shadow disappears in Windows
  forced-colours mode. Global rule in `src/styles/base.css`:
  `outline: 3px solid var(--color-focus); outline-offset: 2px;`
- Every shadcn component copied into `src/components/ui/` has its
  `focus-visible:ring-*` classes **replaced** by
  `focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus`.
  shadcn's default `ring-ring/50` measures 2.5–2.9:1 — a failure.
- `outline-hidden` (transparent, survives forced colours), never `outline-none`, when a
  custom indicator replaces the outline.
- The offset is mandatory: focus `#FF9466` touching an `#FF7A45` button is 1.19:1.
- `html { scroll-padding-top }` ≥ sticky header height so a focused element is never hidden
  (2.4.11). Header becomes `position: static` under `@media (max-height: 30rem)`.

## 3. Colour and contrast (1.4.3, 1.4.6, 1.4.11, RGAA 3.x)

Hard constraint, proven by computation: on `#1B1F2A`, **no orange can both be readable
text (≥ 4.5:1) and carry white text (≥ 4.5:1)**. Therefore, in the dark theme, the
primary button is light orange with **dark** text. The validated tokens live in
`design-system`; never introduce a colour outside them.

| Pair (dark theme)                           | Ratio | Verdict       |
| ------------------------------------------- | ----- | ------------- |
| `fg` `#E6E8EF` on `canvas` `#1B1F2A`        | 13.44 | AAA           |
| `fg-muted` `#A9B0C2` on `canvas`            | 7.58  | AAA           |
| `accent-fg` `#FF8A5B` on `canvas`           | 7.08  | AAA           |
| `on-accent` `#12151C` on `accent` `#FF7A45` | 7.06  | AAA           |
| `focus` `#FF9466` on `canvas`               | 7.59  | ≥ 3:1 ✓       |
| `border-input` `#7D869C` on `surface`       | 3.98  | ≥ 3:1 ✓       |
| white on `#FF7A45`                          | 2.59  | **forbidden** |

- Any opacity (`/50`), gradient or `backdrop-blur` behind text ⇒ recompute on the
  composited colour, add the pair to the contrast unit test (`design-system` §tests).
- Links inside prose are **always underlined** (1.4.1). Errors = icon + "Erreur :" prefix
  - colour — the accent orange is too close to red to carry meaning alone.
- Both themes must pass: axe runs per route × `light`/`dark` in Playwright.

## 4. Sizing, zoom, spacing

- Targets ≥ 24×24 px (2.5.8 AA); icon buttons, burger and social links **44×44**
  (`size-11`, 2.5.5 AAA). Inline links in prose are exempt.
- Drag interactions (carousel) always have button equivalents (2.5.7).
- `rem` everywhere for type and spacing. Never `maximum-scale` / `user-scalable=no`.
- Reflow at 320 CSS px wide, no horizontal page scroll (1.4.10). No `100vw` widths, no
  `min-width` on cards; code blocks may scroll locally.
- Text spacing override must not clip (1.4.12): **no fixed `height` or `line-clamp` on
  text containers** — use `min-height`.
- Hover/focus content (tooltips) is dismissible with Escape, hoverable, persistent
  (1.4.13) — the Base UI Tooltip does it; never put essential info in a tooltip.

## 5. Motion and user preferences

- Root: `<MotionConfig reducedMotion="user">`; CSS animations behind `motion-safe:`.
  Global `@media (prefers-reduced-motion: reduce)` reset in `base.css`.
- Nothing auto-animates for more than 5 s without a visible pause control (2.2.2).
  Preferred: no autoplay at all (no logo marquee).
- Theme: `data-theme` on `<html>`, set by an inline script in `index.html` **before first
  paint** (no flash). Toggle = buttons with `aria-pressed` or a radiogroup, plus a
  `role="status"` confirmation.
- `forced-colors: active`: outlines and borders remain, SVG icons use `currentColor`.

## 6. Images, icons, links

- Informative image: `alt` says what is useful ("Capture du tableau de bord…"), never
  "image de". Decorative: `alt=""`. Inline SVG / Lucide icons: always
  `aria-hidden="true" focusable="false"` explicitly.
- Icon-only link/button: the accessible name is on the control (`aria-label`), and the
  name **starts with** the visible text when there is any (2.5.3).
- Link text is explicit out of context ("Voir la vidéo du pitch STAXX", not "Voir").
- New tab only for external resources and the CV: visible icon (`aria-hidden`) +
  `<span className="sr-only"> (nouvel onglet)</span>`, `rel="noopener noreferrer"`.
- CV download link states format and weight: "Télécharger le CV (PDF, 56 Ko)".

### Symbols read aloud

A figure such as "10 h → 5 min" or "−99 %" is read badly ("flèche droite", "tiret"). Show
the symbolic form with `aria-hidden="true"` and add a visually hidden spoken form ("de 10
heures à 5 minutes"). The data carries both (`value`, `spokenValue`); see
`src/features/about/components/about-section.tsx`.

### In-page navigation

Section links are plain fragment links (`/#a-propos`), not router links: the browser
scrolls to the section and moves the sequential focus starting point there, from any page.
`ScrollRestoration` is keyed by path + fragment (`getKey`), otherwise every freshly loaded
document shares the key `default` and the previous page's position undoes the jump.

## 7. Forms (1.3.5, 3.3.1–3.3.3, 3.3.8, RGAA 11.x)

- Visible `<label htmlFor>`; placeholder is never a label. Required marker `*` is
  `aria-hidden`, explained once in a hint referenced by the form.
- `autoComplete` on personal fields (`name`, `email`, `organization`).
- Invalid field: `aria-invalid="true"` + `aria-describedby` = hint id **and** error id.
  Error text: "Erreur : <what> — <how to fix>".
- On failed submit, focus the first invalid field (RHF `shouldFocusError`, default true).
- Submission result in a persistent `role="status"` region mounted from the start.
- No cognitive CAPTCHA (3.3.8): honeypot field + server-side rate limit.

## 8. Dialogs and menus

- Mobile menu: a **non-modal disclosure** (`aria-expanded`, `aria-controls`, Escape
  closes and returns focus, choosing a link closes it) — implemented by `useMobileMenu`
  and `SiteHeader` below 64rem (the width where the full header fits on one row); the panel holds the navigation and the theme choice. If a shadcn `Sheet` (Base UI Dialog) is used, its title is
  mandatory (visually hidden if not shown) — the primitive handles the focus trap, Escape
  and focus return; verify it in the keyboard E2E spec anyway.
- Custom modal: native `<dialog>.showModal()`; never hand-roll a focus trap. Give the
  focus back to the opener on close yourself (`useFullscreenDialog`): not every browser
  does, and none can while an element is fullscreen (Chrome makes the rest inert). Keep
  the first focus on a control of the page, not in a cross-origin iframe: keys pressed
  inside the iframe never reach the page, so Escape would no longer close the dialog.

## 9. Tests (all mandatory for a feature PR)

| Layer                | Tool                                                                                           | What                                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Lint                 | jsx-a11y rules (see `quality-gates`)                                                           | Static misuse (missing alt, label, invalid ARIA)                                                                         |
| Component (Vitest)   | `axe-core` via `expectNoAxeViolations()` helper in `src/testing/`                              | No violations; `color-contrast` disabled (no layout in jsdom)                                                            |
| Component (Vitest)   | Testing Library `getByRole` + `toHaveAccessibleName/Description`                               | Names, descriptions, `aria-invalid`, focus after submit                                                                  |
| E2E (Playwright)     | `@axe-core/playwright` with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` | Every route × light/dark × reduced motion. **`wcag22aa` is required — it is what enables `target-size`**                 |
| E2E (Playwright)     | Keyboard specs                                                                                 | Skip link, route-change focus on `h1`, menu Escape/focus return, focus visible and not obscured along the whole Tab path |
| E2E (Playwright)     | Layout specs                                                                                   | Reflow 320×256, text-spacing override, `forcedColors: "active"` screenshot                                               |
| Manual (per release) | NVDA + Firefox, VoiceOver + Safari (macOS & iOS), keyboard only, zoom 400 %, Voice Control     | Logged in `docs/a11y/test-log.md` (date, versions, page, result, criterion)                                              |

Keyboard E2E specs press **`Alt+Tab` on WebKit**: Safari only puts links in the Tab
order with Option+Tab (or a preference), so plain `Tab` would skip them and test nothing
real. Helper pattern: `e2e/keyboard.spec.ts` `pressTab()`.

Queries in tests are **role-first** (`getByRole('button', { name: 'Envoyer le message' })`).
A test that needs `getByTestId` to find an interactive element is revealing an a11y bug.

## 10. What automation cannot see — review checklist

Relevance of alt texts, link texts, headings and error messages; logical Tab and reading
order; real screen-reader announcements; contrast over images/gradients; usability at
400 %; language changes. The PR template's a11y section lists which of these were checked
by hand.
