---
name: design-system
description: The portfolio's design system — visual direction from the reference mockup, validated colour tokens (dark + light, contrast-checked), typography and fluid scale, spacing, radius, elevation, motion tokens, Tailwind v4 @theme setup, shadcn (Base UI) adaptation rules, cva variants, and the anti-"AI slop" rules. Load BEFORE touching colours, fonts, spacing, radius, shadows, animations, globals.css, or any file in src/components/ui/.
---

# Design System

## Visual direction

From the reference mockup: **dark navy canvas, one warm coral-orange accent, a portrait
framed by an orange ring, geometric sans headings, generous negative space, clear
numeric highlights.** We keep that identity and make it ours:

- The accent is **rare and meaningful**: primary action, key figures, the ring, the
  active nav item. If everything is orange, nothing is.
- Content hierarchy comes from type scale and space, not from boxes and borders.
- Metrics from the CV (10 h → 5 min, −99 %) are the visual heroes of the About section,
  set in the mono face — they echo "systèmes de calcul".
- The mockup's placeholder content (fake stats, "Website Hosting" services) is **not**
  reproduced. Only CV content (`content-data`).

### Anti-"AI slop" rules

No purple/blue gradients, no glassmorphism by default, no glowing blobs, no emoji as
icons, no "✨"/sparkle motifs, no gradient text, no 3-column icon-feature grid with
lorem-like copy, no fake testimonials or logos, no stock illustrations, no centered
everything. Every decorative element must have a reason tied to the content (the ring
frames the person; the mono face frames the numbers). Icons: `lucide-react`, one stroke
width (1.75), sized to the text.

## Colour tokens

Source of truth: `src/styles/globals.css` `@theme`. **The palette is closed**: `--color-*:
initial` removes Tailwind's default colours, so `bg-red-500` simply does not exist. Each
token is declared once with `light-dark(<light>, <dark>)`; utilities are named after the
token (`bg-canvas`, `text-fg-muted`, `text-accent-fg`, `bg-accent`, `text-on-accent`,
`border-border-input`, `outline-focus`…).

`src/styles/color-tokens.test.ts` is the palette's contract: it parses every token from
the stylesheet source, requires `light-dark()` on all of them, and checks every allowed
foreground/background pair in both themes (4.5:1 text, 3:1 non-text). **Using a new pair
in the UI means adding it to that test first.**

| Token            | Light     | Dark      | Role                                                 |
| ---------------- | --------- | --------- | ---------------------------------------------------- |
| `canvas`         | `#FAFAF7` | `#1B1F2A` | Page background (html **and** body)                  |
| `surface`        | `#FFFFFF` | `#242938` | Cards, header on scroll                              |
| `surface-raised` | `#F1F2F5` | `#2E3446` | Inputs, secondary buttons                            |
| `fg`             | `#1B1F2A` | `#E6E8EF` | Body text                                            |
| `fg-muted`       | `#5A6278` | `#A9B0C2` | Secondary text                                       |
| `fg-subtle`      | `#687083` | `#8B93A7` | Metadata — **never on `surface-raised`**             |
| `accent`         | `#B93E0B` | `#FF7A45` | Primary button fill, portrait ring                   |
| `accent-hover`   | `#9A3412` | `#FF9466` | Primary button hover                                 |
| `accent-fg`      | `#B93E0B` | `#FF8A5B` | Accent text, links (underlined)                      |
| `accent-tint`    | `#FCEDE6` | `#3D2D2E` | Tinted badge background, text selection              |
| `on-accent`      | `#FFFFFF` | `#12151C` | Text on `accent` / `accent-hover`                    |
| `focus`          | `#9A3412` | `#FF9466` | Focus outline (3 px, offset 2 px)                    |
| `border`         | `#E2E4EA` | `#3A4052` | Decorative separators only — never a control outline |
| `border-input`   | `#767D8F` | `#7D869C` | Input and control borders (≥ 3:1)                    |
| `error`          | `#B91C1C` | `#FCA5A5` | Error text + icon                                    |
| `success`        | `#166534` | `#4ADE80` | Success text + icon                                  |

**Dark theme: text on orange is dark (`on-accent` `#12151C`), never white** (max 2.59:1).

### Theming mechanics

- `:root { color-scheme: light dark }` → `light-dark()` follows the system preference with
  **zero JavaScript and no flash**. No `dark:` variant is needed for colours.
- The manual toggle (app-shell PR) will set `data-theme` on `<html>` and a CSS rule will
  map it to `color-scheme: light | dark`; an inline script in `index.html` restores the
  stored choice before first paint.
- In production Lightning CSS transpiles `light-dark()` for older browsers (fallback
  variables keyed on `color-scheme`); `e2e/theme.spec.ts` checks both schemes resolve to
  the tokens on the real build.
- Any colour with opacity, gradient or blur behind text must be recomputed and added to
  the contrast test.

## Typography

| Role               | Family                                            | Status                              |
| ------------------ | ------------------------------------------------- | ----------------------------------- |
| Display / headings | **Sora Variable** (`@fontsource-variable/sora`)   | Installed                           |
| Body / UI          | **Inter Variable** (`@fontsource-variable/inter`) | Installed                           |
| Metrics / code     | **JetBrains Mono Variable**                       | Added with the first metric (about) |

- Self-hosted via Fontsource (no third-party request), `font-display: swap`,
  `unicode-range` subsets so only the needed files download. Preloading and metric-matched
  fallbacks are added **only if Lighthouse shows font-driven LCP or CLS** (measure first).
- Fluid scale in `@theme` (`--text-*: initial` then `display`, `h1`, `h2`, `h3`, `lead`,
  `body`, `small`, each with its `--line-height`): utilities `text-display`, `text-h2`,
  `text-lead`… Tailwind's default `text-sm`/`text-xl` do not exist.
- Base layer: headings in the display font with `text-wrap: balance`, paragraphs
  `text-wrap: pretty`, body line-height 1.6; prose max 65ch.
- Heading level ≠ visual size: pick the semantic level, style with the token.

## Space, radius, elevation, layers

- Spacing: Tailwind's 0.25rem scale + fluid `--spacing-section` and `--spacing-gutter`,
  exposed as utilities `py-section`, `px-gutter`. No arbitrary `px` values in class names.
- Radius (`--radius-*: initial`): `rounded-sm` 0.375rem (badges), `rounded-md` 0.75rem
  (buttons, inputs), `rounded-lg` 1.25rem (cards), `rounded-full` (portrait ring, pills).
- Elevation on dark: surfaces get lighter (`surface` → `surface-raised`), not shadowed.
  One shadow token, `shadow-overlay`, for overlays only (`--shadow-*: initial`).
- z-index: named tokens (`--z-header`, `--z-overlay`, `--z-skip-link`) are introduced with
  the app shell, the first code that stacks layers — no magic numbers.

## Motion

- Easing: `ease-out` = `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-*: initial`); durations use
  Tailwind's `duration-150` / `duration-250` / `duration-450` only. `--animate-*: initial`:
  no stock keyframe animation (spin, ping, bounce) is available.
- Motion explains (a section entering, a menu opening); it never decorates in a loop.
  Entrance animations: opacity + ≤ 16px translate, once, `motion-safe` only.
- The global `prefers-reduced-motion: reduce` reset lives in the base layer of
  `globals.css`. Motion (`motion/react`, `LazyMotion` + `m` + `domAnimation`, root
  `<MotionConfig reducedMotion="user">`) is installed with the first animated component.

## UI primitives (shadcn on Base UI)

**Primitives ship with the first feature that renders them**, never ahead of time: an
unused primitive is dead code for Knip (`--production`), and a primitive designed without
a real use case gets the wrong API.

- `pnpm dlx shadcn@latest add <component>` then adapt the copy in `src/components/ui/` in
  the same PR:
  1. rename to our conventions (kebab-case file, named exports, no `any`),
  2. replace colours with our tokens (the closed palette makes leftovers fail to compile
     into any style),
  3. remove `focus-visible:ring-*`: the global `:focus-visible` outline applies,
  4. check target sizes (icon buttons `size-11`),
  5. write its tests (render, variants, keyboard, axe).
- Variants with `cva`, merged with `cn()` (`clsx` + `tailwind-merge`) from `src/lib/cn.ts`
  — both added with the first primitive that needs them.
- Expected primitives and the PR that introduces them: `button` + `link` (hero),
  `badge` (hero tech list), `metric` (about), `card` (experience), `visually-hidden` and
  `theme-toggle` (app-shell), `responsive-image` (hero portrait).

## Tests

- `src/styles/color-tokens.test.ts` (unit, Node): palette contract, both themes. The
  unit project lets `?raw` CSS through the Vite pipeline (`css.include` in
  `vitest.config.ts`) — Vitest blanks CSS by default.
- `src/styles/base-styles.test.tsx` (browser): fonts really load, headings and body use
  their families, keyboard focus draws the 3 px outline, links are underlined.
- `src/testing/wcag-contrast.ts`: the WCAG ratio helper, test-only, itself unit-tested.
- `e2e/theme.spec.ts`: both colour schemes resolve to the tokens on the production build;
  `e2e/a11y.spec.ts` runs axe in both schemes on all device projects.
