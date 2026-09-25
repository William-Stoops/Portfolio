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

Validated by computation (WCAG 2.x ratios, see `accessibility` §3). **No colour outside
this table.** Tokens are CSS custom properties exposed to Tailwind through `@theme inline`,
so utilities are `bg-bg`, `text-text-muted`, `bg-accent`, `outline-focus`…

### Dark theme (default rendering of the mockup)

| Token            | Hex       | Role                              | Key ratios                                 |
| ---------------- | --------- | --------------------------------- | ------------------------------------------ |
| `--bg`           | `#1B1F2A` | Page background                   | —                                          |
| `--surface`      | `#242938` | Cards, header on scroll           | —                                          |
| `--surface-2`    | `#2E3446` | Inputs, secondary buttons         | —                                          |
| `--text`         | `#E6E8EF` | Body text                         | 13.44 on bg (AAA)                          |
| `--text-muted`   | `#A9B0C2` | Secondary text                    | 7.58 on bg (AAA), 5.71 on surface-2        |
| `--text-subtle`  | `#8B93A7` | Metadata, placeholder             | 5.35 on bg — **never on surface-2** (4.03) |
| `--accent-text`  | `#FF8A5B` | Accent text, links (underlined)   | 7.08 on bg, 5.33 on surface-2              |
| `--accent`       | `#FF7A45` | Primary button fill, ring         | 6.36 vs bg (1.4.11 ✓)                      |
| `--on-accent`    | `#12151C` | Text on accent                    | 7.06 (AAA)                                 |
| `--accent-hover` | `#FF9466` | Primary button hover              | `#1B1F2A` on it: 7.59                      |
| `--focus`        | `#FF9466` | Focus outline (3 px, offset 2 px) | 7.59 on bg                                 |
| `--border`       | `#3A4052` | Decorative separators only        | 1.59 — never a control boundary            |
| `--border-input` | `#7D869C` | Input and control borders         | 4.52 on bg, 3.98 on surface                |
| `--error`        | `#FCA5A5` | Error text + icon                 | 8.67 on bg                                 |
| `--success`      | `#4ADE80` | Success text + icon               | 9.44 on bg                                 |
| `--accent-tint`  | `#3D2D2E` | Tinted badge background           | `#FFA07A` on it: 6.55                      |

**White text on any orange is forbidden in the dark theme** (max 2.59:1).

### Light theme

| Token                                | Hex                               | Notes                                                      |
| ------------------------------------ | --------------------------------- | ---------------------------------------------------------- |
| `--bg` / `--surface` / `--surface-2` | `#FAFAF7` / `#FFFFFF` / `#F1F2F5` |                                                            |
| `--text` / `--text-muted`            | `#1B1F2A` / `#5A6278`             | 15.74 / 5.82                                               |
| `--accent` = `--accent-text`         | `#B93E0B`                         | Text 5.35 on bg; white on it 5.59 → `--on-accent: #FFFFFF` |
| `--focus`                            | `#9A3412`                         | 6.99                                                       |
| `--border-input`                     | `#767D8F`                         | 3.94                                                       |

### Theming mechanics

- `data-theme="dark" | "light"` on `<html>`, set before first paint by an inline script
  in `index.html` (stored choice → `prefers-color-scheme` fallback). `color-scheme` set
  accordingly so native controls and scrollbars match.
- `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`
- Any colour with opacity, gradient or blur behind text must be recomputed and added to
  the contrast test.

## Typography

| Role               | Family (proposal, validated in the design-system PR) | Why                                                    |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------ |
| Display / headings | **Sora Variable** (`@fontsource-variable/sora`)      | Geometric like the mockup, more character than Poppins |
| Body / UI          | **Inter Variable** (`@fontsource-variable/inter`)    | Legibility at small sizes, tabular figures             |
| Metrics / code     | **JetBrains Mono Variable**                          | Numbers and technical labels                           |

- Self-hosted via Fontsource (no Google Fonts request), `font-display: swap`, Latin
  subset preloaded for the two faces used above the fold. Fallback stacks with
  `size-adjust`-matched system fonts to limit CLS.
- Fluid scale (`clamp()` with rem + vw — see `responsive-design` §3): `--text-display`,
  `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-small`, `--text-metric`.
- Body line-height 1.6, headings 1.1–1.2; prose max 65ch; `font-variant-numeric:
tabular-nums` on metrics.
- Heading level ≠ visual size: pick the semantic level, style with the token.

## Space, radius, elevation, layers

- Spacing: Tailwind's 0.25rem scale + fluid `--spacing-section` and `--spacing-gutter`.
  No arbitrary `px` values in class names.
- Radius: `--radius-sm` 0.375rem (badges), `--radius-md` 0.75rem (buttons, inputs),
  `--radius-lg` 1.25rem (cards), `--radius-full` (avatar ring, pills). Nothing else.
- Elevation on dark: surfaces get lighter (`surface` → `surface-2`), not shadowed. One
  shadow token for overlays only.
- z-index scale in `@theme`: `--z-header`, `--z-overlay`, `--z-skip-link` — no magic
  numbers.

## Motion

- Tokens: `--duration-fast` 150ms, `--duration-base` 250ms, `--duration-slow` 450ms;
  `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)`.
- Motion explains (a section entering, a menu opening); it never decorates in a loop.
  Entrance animations: opacity + ≤ 16px translate, once, `motion-safe` only.
- Library: Motion (`motion/react`) with `LazyMotion` + `m` + `domAnimation`, root
  `<MotionConfig reducedMotion="user">`. CSS transitions for hover/focus.

## UI primitives (shadcn on Base UI)

- `pnpm dlx shadcn@latest add <component>` **only when a feature needs it**, then adapt
  the copy in `src/components/ui/` in the same PR:
  1. rename to our conventions (kebab-case file, named exports, no `any`),
  2. replace colours with our tokens,
  3. replace `focus-visible:ring-*` by
     `focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus`,
  4. check target sizes (icon buttons `size-11`),
  5. write its tests (render, variants, keyboard, axe).
- Variants with `cva`, merged with `cn()` (`clsx` + `tailwind-merge`) from `src/lib/cn.ts`.
- Planned primitives: `button`, `link` (internal via React Router, external with new-tab
  semantics), `badge`, `card`, `section-heading`, `metric`, `responsive-image`,
  `visually-hidden`, `theme-toggle`, `separator`.

## Tests

- `src/styles/contrast.test.ts` parses the token values from `globals.css` and asserts
  every declared foreground/background pair meets its ratio (4.5 text, 3 UI). Adding a
  token means adding its pairs.
- Each primitive: variant rendering, accessible name, keyboard, axe.
- Visual regression of a `/design-system` story-like route? **No** — primitives are
  covered through the sections' screenshots; no dead demo route in production.
