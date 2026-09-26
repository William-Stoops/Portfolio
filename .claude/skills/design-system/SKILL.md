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
  reading progress, the peaks of the hero surface, the dots between technologies. No
  large orange surfaces: a tilted orange tape and stickers on the portrait read as cheap
  and were removed. If everything is orange, nothing is.
- **Playful, not noisy** (ADR 0015): the page reacts — letters rise, the ring zooms in,
  figures are drawn, cards follow the pointer — but every effect is tied to the content
  and none competes with reading. Prefer **integrated, editorial** details (a horizon
  strip, text set on the ring, thin rules) over objects stuck on top of the layout.
- Content hierarchy comes from type scale and space, not from boxes and borders.
- Metrics from the CV (10 h → 5 min, −99 %) are the visual heroes of the About section,
  set in the mono face — they echo "systèmes de calcul".
- The mockup's placeholder content (fake stats, "Website Hosting" services) is **not**
  reproduced. Only CV content (`content-data`).

### Anti-"AI slop" rules

No purple/blue gradients, no glassmorphism by default, no glowing blobs (the pointer
spotlight lights a border, never a background), no emoji as
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
- Manual choice: `ThemeToggle` (header) → `useThemePreference` sets `data-theme` on
  `<html>` and persists it; `:root[data-theme=…]` maps it to `color-scheme`. The inline
  script in `index.html` restores the stored choice before first paint (same storage key,
  same values — the unit test uses the literal key to guard that contract). A future CSP
  must allow that script's hash.
- In production Lightning CSS transpiles `light-dark()` for older browsers (fallback
  variables keyed on `color-scheme`); `e2e/theme.spec.ts` checks both schemes resolve to
  the tokens on the real build.
- Colours live in `@theme inline`: each utility carries its `light-dark()` value, resolved
  on the element that uses it. A subtree can therefore take the other palette with
  `scheme-dark` / `scheme-light` (the video dialog is dark in both themes). Custom CSS
  reads a colour with `--theme(--color-…)`, **never `var(--color-…)`**: a variable is
  resolved once on `:root` and would ignore the subtree's scheme.
- Any colour with opacity, gradient or blur behind text must be recomputed and added to
  the contrast test.

## Typography

| Role               | Family                                            | Status                                                                                                                |
| ------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Display / headings | **Sora Variable** (`@fontsource-variable/sora`)   | Installed                                                                                                             |
| Body / UI          | **Inter Variable** (`@fontsource-variable/inter`) | Installed                                                                                                             |
| Metrics            | **Sora** with `tabular-nums` (`text-metric`)      | JetBrains Mono dropped: fonts are the main real load cost (ADR 0013), a third family for four numbers is not worth it |

- Self-hosted via Fontsource (no third-party request), `font-display: swap`,
  `unicode-range` subsets so only the needed files download. Preloading and metric-matched
  fallbacks are added **only if Lighthouse shows font-driven LCP or CLS** (measure first).
- Fluid scale in `@theme` (`--text-*: initial` then `display`, `h1`, `h2`, `h3`, `lead`,
  `body`, `small`, each with its `--line-height`): utilities `text-display`, `text-h2`,
  `text-lead`, `text-metric` (key figures, one step under `h2`, never wraps)… Tailwind's
  default `text-sm`/`text-xl` do not exist.
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
- **All motion is CSS, in `src/styles/motion.css`** (ADR 0015); no animation library.
  Use its utilities, do not write one-off keyframes in components:
  - on load, once: `enter-rise`, `enter-slide`, `enter-letter`, `enter-pop`, `enter-zoom`;
    **large texts above the fold take `enter-slide` (no fade)**: a text fading in from
    opacity 0 is not counted as painted until a later repaint, after hydration, and it
    pushed the home page's LCP to 2.5 s in CI (`motion.spec.ts` guards it);
  - scroll-driven: `reveal`, `reveal-grow-x/y`, `reveal-pop`, `reveal-shrink-x`
    (`--shrink-to`), `reveal-fill`, `rail-fill` (+ `rail-timeline`), `scroll-progress`,
    `scroll-settle`;
  - pointer: `pointer-tilt`, `pointer-magnet`, `pointer-spotlight`, on an element marked
    `data-pointer` (fed by `usePointerGlow`); the magnet goes on a wrapper, never on an
    element with its own `transition`;
  - `marquee-track` for the one loop, with its pause button;
  - `drift-left` / `drift-right` for the giant kinetic lines (`AxisBand`).
- **Signatures** (ADR 0016): the hero's WebGL volatility surface (tinted from
  `text-accent` and `border-border-input` read on the canvas, masked under the text,
  ripples on click) and the kinetic axis band. They carry the "wow"; keep the rest of the
  page calmer around them.
- **Hero composition**: the hero fills the first screen; the technology strip rests on
  its bottom edge like a horizon (solid canvas background, thin rules, grey text, accent
  dots, faded edges); the portrait has its accent ring and nothing else on it (stickers,
  a dot grid and a text ring around it were all tried and removed: the surface already
  gives the depth, more layers only clutter the photo). The facts once pinned on it now
  sit in the text column, under the calls to action: three highlights (strong value,
  grey caption) separated by thin rules, real text read by assistive tech.
- **Titles and sign-off**: section titles and the footer's giant name have letters that
  rise with the scroll (`reveal-letter`), behind a visually hidden copy.
- **About**: the profile is a statement **inked in word by word** as it is read
  (`ink-timeline` on the paragraph with `--n`, `reveal-ink` on each word with `--i`: a
  canvas-coloured veil in a pseudo-element lifts, the text underneath stays at full
  contrast). The axes are three columns under a hairline with the accent drawn on it,
  no icon discs (the kinetic band right after sets them large); the key figures are a
  **ledger** between hairlines (figure, what it measures, its drawing), not cards.
- **Section compositions**: STAXX is an editorial case study (a large figure row from
  `KeyFigures`, the pitch beside it); each experience period is set large beside the
  timeline and sticks while its card is read; skills and education are **sticky
  chapters** (`StickyChapters`: the chapter title stays while its content scrolls,
  named view timelines, a stacked fallback with real headings); the contact section
  closes the page on the same volatility surface, **settled** and centred (`HeroScene
variant="finale"`, loaded only when near).
- **Footer**: quiet and integrated. Hairline rules, grey links whose hover draws a
  hairline, the name in the display face at `h3` size with a round accent dot, and the
  full-width name in filigree one step above the canvas (`text-surface-raised`). A
  heavy solid giant wordmark, a square dot and a large tagline read as crude; a
  one-pixel outline showed the variable font's overlapping contours. Texts that may be
  on screen at load (the footer of a short page) take `reveal-slide`, never a fade, so
  axe never measures them half transparent.
- **Photos** (STAXX): a photo is a moment, not a decoration. The Summit win spans the
  whole case study, its frame opening up (`reveal-expand`) while the image drifts
  slower than the page (`scroll-parallax`, enlarged only while it drifts); its caption
  sits in a notch cut into the photo, on the canvas, so its contrast never depends on
  the picture. The NRJ Lille pair is set apart in depth (`scroll-float` on the smaller
  frame). Crops are chosen per container (`object-position`), centred on William.
  Sources live in `docs/content/images/`, derivatives come from `pnpm images`.
- **The journey** (ADR 0021): the home page tells the years at Epitech, one stop a year,
  along one flight path (`FlightLog`). The rail is dotted like the flights; behind a plane
  riding the reading line (40 % down, the same line as the sticky chapters) it turns into a
  solid trail, measured against the whole viewport (`view-timeline-inset: 0`). A stop lights
  up as the plane reaches it: marker fills, a branch draws out, the title rises letter by
  letter over its year in filigree (a pseudo-element, never page text). A sticky odometer
  rolls the year with additive animations, one per stop. What a stop holds comes in from
  the rail (translate only). Two flights are staged, pinned, in mirror (`FlightScene`): the
  voyage east to Seoul and the way home west to France, each landing on its flag; the
  rail's plane steps away during both. Durations that must feel the same whatever a stop's
  length use fixed ranges (`cover 0% cover 6rem`), not percentages.
- **Korea** (`features/korea`): the one section pinned as a scene. On a large, tall
  enough screen the voyage stage sticks while its track scrolls (`voyage-*`, one
  `--voyage` timeline): the plane flies the arc and lands on the taegeuk, the flag
  assembles (field unfurls, taegeuk turns and settles, trigrams come in from their
  corners), then 안녕하세요 rises. Everywhere else each piece runs on its own view, and
  without scroll-driven animations everything stands in its final place. The flag keeps
  its official colours (ADR 0019). Korean words carry `lang="ko"` and are never
  letter-spaced. A pinned scene must be **worth its scroll**: a pinned photo gallery that
  panned a short strip over a long track felt like scrolling for nothing, and was removed.
- **Photos are always whole**: framed at their own ratio, never cropped by a frame or by a
  parallax zoom, and set where they tell something (the stadium beside Korea University),
  not in a separate gallery. They move as a whole (`reveal-expand`, `scroll-float`).
- **Nothing covers text being read**: stacked sticky cards cut the previous card's text
  mid-sentence (AI practice, photo deck) and read as bugs; they were removed. Sticky
  chapter titles follow a **reading line** (`view-timeline-inset`), so only one shows at a
  time; seen through the whole viewport, two short chapters overlapped. E2E tests guard
  both (`ai-practice.spec.ts`, `sticky-chapters.spec.ts`).
- **Kinetic bands** are one primitive, `KineticBand` (`components/ui`): the axes band and
  the Korean band share it; a line in another language keeps its `lang`.
- **Desktop touches** (`src/lib/desktop-enhancements.ts`, loaded on idle for a precise
  pointer): a cursor ring that trails the pointer (the native cursor stays) and **gives
  way** over links and buttons, whose own hover answers; `[data-scramble]` texts decode
  themselves on hover (aria-hidden copies only). Never put anything over a control's
  text: an accent disc labelled "Télécharger" over the CV button read as very cheap.
- Stagger siblings with an inline `style={{ '--i': index }}` (typed by
  `src/types/css-custom-properties.d.ts`).
- Every utility sits behind `prefers-reduced-motion: no-preference`, scroll-driven ones
  behind `@supports`: without them the page is static and complete. **Never hide content
  until JavaScript reveals it.**
- **Animate only compositor properties: `opacity`, `translate`, `scale`, `rotate`.**
  Colour, `clip-path`, `stroke-*`, `background-*` run on the main thread every frame; 56
  of them broke the Total Blocking Time budget in CI. `e2e/motion.spec.ts` rejects them.
- Keyframes animate `translate` / `scale` / `rotate`, never `transform` (owned by the
  pointer effects). Only one loop on the page, and it has a pause control (WCAG 2.2.2).
- The global `prefers-reduced-motion: reduce` reset lives in the base layer of
  `globals.css`.

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
- Variants are a typed `Record<Variant, string>` of classes joined with `cn()`
  (`src/lib/cn.ts`, a 3-line join). `cva` / `tailwind-merge` are **not** installed: the
  closed palette and fixed variants leave no conflicting utilities to merge. Add them only
  when a primitive's variants multiply, with the size measured in the PR.
- Shipped primitives: `button-link` (a link styled as a button: calls to action navigate or
  download, so they stay `<a>`), `badge`, `responsive-image` (hero), `emphasized-text`
  (CV bold passages), `youtube-facade` (projects). `key-figures` (hero, STAXX).
  Still expected: `card` (experience), `visually-hidden`.

## Tests

- `src/styles/color-tokens.test.ts` (unit, Node): palette contract, both themes. The
  unit project lets `?raw` CSS through the Vite pipeline (`css.include` in
  `vitest.config.ts`) — Vitest blanks CSS by default.
- `src/styles/base-styles.test.tsx` (browser): fonts really load, headings and body use
  their families, keyboard focus draws the 3 px outline, links are underlined.
- `src/testing/wcag-contrast.ts`: the WCAG ratio helper, test-only, itself unit-tested.
- `e2e/theme.spec.ts`: both colour schemes resolve to the tokens on the production build;
  `e2e/a11y.spec.ts` runs axe in both schemes on all device projects.
