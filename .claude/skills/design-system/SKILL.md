---
name: design-system
description: The portfolio's design system — visual direction from the reference mockup, validated colour tokens (dark + light, contrast-checked), typography and fluid scale, spacing, radius, elevation, motion tokens, Tailwind v4 @theme setup, shadcn (Base UI) adaptation rules, cva variants, and the anti-"AI slop" rules. Load BEFORE touching colours, fonts, spacing, radius, shadows, animations, globals.css, or any file in src/components/ui/.
---

# Design System

## Visual direction

The reference is [dennissnellenberg.com](https://dennissnellenberg.com), chosen by William
after a moodboard (ADR 0036): **take its language, never its pieces** (its font, visuals and
copy are its own).

- **The person first.** A dark hero where the portrait melts into the charcoal, the name set
  immense and light, sliding with the scroll (never on its own), a place pill and the role.
  Nothing a stranger would need explained: no chart, no event, no project name up there.
- **Airy white sections.** Hierarchy comes from type scale and space: very large light
  titles, regular text, hairlines. Few boxes.
- **One family, one accent.** Inter Tight for everything; one calm blue (ADR 0025) for
  what the reader can act on (buttons, links, focus). Colour otherwise comes from the
  photographs and from the data charts (viridis, inside the charts only).
- **Premium means restraint.** One interaction per idea: the name that slides, buttons
  that lean towards the pointer, the work preview that follows it, the footer's curve.
- Only CV content (`content-data`); never the reference's copy.

### Anti-"AI slop" rules

Rejected on the prototypes (ADR 0036): tile grids tinted in several hues, labels floating
over a photo, glowing cards, several accents sharing the page, a chart in the hero. Still
banned: purple/blue gradients, glassmorphism, glowing blobs, emoji as icons, sparkle
motifs, gradient text, 3-column icon-feature grids, fake testimonials or logos, stock
illustrations. Every element must have a reason tied to the content. Icons:
`lucide-react`, one stroke width (1.75), sized to the text.

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

| Token            | Light     | Dark      | Role                                                   |
| ---------------- | --------- | --------- | ------------------------------------------------------ |
| `canvas`         | `#FFFFFF` | `#141517` | Page background (html **and** body)                    |
| `surface`        | `#F4F4F2` | `#1C1D20` | Soft bands, cards; the hero and footer (`scheme-dark`) |
| `surface-raised` | `#EBEBE8` | `#26272B` | Inputs, secondary buttons                              |
| `fg`             | `#1C1D20` | `#F0F0EE` | Body text                                              |
| `fg-muted`       | `#5F6268` | `#A8ABB0` | Secondary text                                         |
| `fg-subtle`      | `#686B71` | `#8F9298` | Metadata — **never on `surface-raised`**               |
| `accent`         | `#3D5AF1` | `#4A63FA` | The one accent: button fills, round calls to action    |
| `accent-hover`   | `#2A44D6` | `#2A44D6` | Button hover                                           |
| `accent-fg`      | `#2F4CE0` | `#8FA3FF` | Accent text, links (underlined)                        |
| `accent-tint`    | `#E8ECFE` | `#23294D` | Text selection, tinted badge background                |
| `on-accent`      | `#FFFFFF` | `#FFFFFF` | Text on `accent` / `accent-hover`                      |
| `focus`          | `#2A44D6` | `#8FA3FF` | Focus outline (3 px, offset 2 px)                      |
| `border`         | `#E4E4E1` | `#2C2D31` | Hairlines, decorative only — never a control outline   |
| `border-input`   | `#7F8288` | `#75787E` | Input and control borders (≥ 3:1)                      |
| `error`          | `#B3261E` | `#FF8A80` | Error text + icon                                      |
| `success`        | `#1D7A3C` | `#6FD08C` | Success text + icon                                    |

**The accent fill carries white text in both themes** (5.34:1 light, 4.71:1 dark). On the
dark canvas it is not readable as text (3.88:1): text in the accent uses `accent-fg`.

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

One family (ADR 0036): **Inter Tight Variable** (`@fontsource-variable/inter-tight`), for
headings, text and figures. `--font-display` and `--font-sans` both point to it, so the
heading base style keeps working. Large titles take the light weight (300), text the
regular one (400), emphasis 500; figures add `tabular-nums`.

- Self-hosted via Fontsource (no third-party request), `font-display: swap`,
  `unicode-range` subsets so only the needed files download. Preloading and metric-matched
  fallbacks are added **only if Lighthouse shows font-driven LCP or CLS** (measure first).
  It did for CLS: `Inter Tight Fallback` (local Arial or Liberation Sans, sized to Inter
  Tight with `size-adjust` and the line overrides) stands in while the font loads.
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
- **Signatures** (ADR 0016, 0027): the hero's WebGL volatility surface (tinted from
  `text-accent` and `border-border-input` read on the canvas, masked under the text,
  ripples on click), the kinetic axis band, and the Korea globe (below). They carry the
  "wow"; keep the rest of the page calmer around them. A WebGL scene reads its tints from
  colour utilities set on its canvas (`text-*`, `border-*`, `decoration-*`), never from
  literal colours, and follows the theme through `onThemeChange`.
- **The opening** (ADR 0030): as the hero's surface first appears, the camera flies in
  from high and far while the relief rises, then lands in the hero's framing
  (`heroCamera`, `intro`); as the hero scrolls away the camera dives among the waves
  (`dive`) and the hero's content comes towards the reader (`hero-dive`, transforms only,
  view timeline without inset). Never fade the hero's texts for an effect: they are the
  page's first paint.
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
- **Section compositions**: STAXX is an editorial case study told in the order it
  happened (a large figure row from `KeyFigures`, the story, the radio, **the pitch**,
  then the photo of the win). The pitch video sits on its own first frame, full width,
  its title cut into the frame like the photos' captions (dropped on a small frame); it
  opens like a film as it arrives (`letterbox-bar`, `poster-settle` on the frame's
  `poster-timeline`) and grows into the player when pressed (`video-morph-frame`, typed
  View Transition `video-morph`, ADR 0024); a striped placeholder poster read as empty
  and was removed. Each experience period is set large beside the timeline and sticks while its card is read; skills and education are chapters (stops) of one section on the flight path; the contact section
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
- **The flight path is for the story only** (ADR 0023): the rail, the plane and the column
  of waypoints run along the Parcours section alone, from its title to "Aujourd'hui",
  where the plane lands. Sections that are not told in time (À propos, IA, Compétences,
  Contact) open like chapters off the rail (`StopHeader` without `onPath`: number in
  filigree, rising title) and set their chapters as ruled rows (`ChapterRows`: header left,
  content right). Three title sizes: a section, a stop of the journey, a chapter. Texts
  written as they are read share `InkText`. Every waypoint's timeline is named after its
  anchor: anchors must be unique.
- **The journey** (ADR 0021): the Parcours section tells the years at Epitech, one stop a
  year (`FlightLog`). The rail is dotted like the flights; behind a plane riding the
  reading line (40 % down the viewport) it turns into a solid trail, measured against the
  whole viewport (`view-timeline-inset: 0`). A stop lights up as the plane reaches it:
  marker fills, a branch draws out, the title rises letter by letter over its year in
  filigree (a pseudo-element, never page text). What a stop holds comes in from the rail
  (translate only). Two flights are staged, pinned, in mirror (`FlightScene`): the
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
  letter-spaced. Where the scene is pinned and WebGL2 runs, the flight crosses a **dotted
  globe** instead of the arc (ADR 0027): Natural Earth continents as dots in `fg-subtle`
  on a `surface` disc with a `border` hairline, the great-circle route dotted in
  `border-input` and lit in `accent` where flown, the places pinned as dots with their
  names on a `surface` chip. The globe takes one side, the departure words, the flag and
  the greeting face it; the plane and the places are HTML moved by script on the CSS
  timeline (`flight-timeline.ts` reads `motion.css`, a test holds them together). A pinned scene must be **worth its scroll**: a pinned photo gallery that
  panned a short strip over a long track felt like scrolling for nothing, and was removed.
- **Pinned scenes** share `scene-track` (260vh, the view timeline named by
  `--scene-timeline`, inset 0 so the story starts when the stage pins) and `scene-stage`
  (sticky, 100dvh); the `pinned:` variant gives their layout the same condition (motion
  allowed, ≥ 64rem wide, ≥ 40rem tall, scroll-driven animations). Every piece has a still,
  complete final state: pinned or not, the page reads the same without motion.
- **The Epitech Summit** (`features/projects`, ADR 0028) closes the STAXX study as a
  pinned scene on `--summit`: a seating plan of 300 dots (one per person, concentric rows
  around the stage, `border` empty, `accent` taken) fills ten by ten while a mechanical
  counter (`steps()` digit strips) ticks up to 300; two follow spots search the dark stage
  and meet on the winner, then the lights come up. A follow spot is a round window onto a
  silent copy of the photo that moves the other way (`--sign`): only the light moves, on
  the compositor. Spots sweep at face height, never over the bright screen behind: a
  bright disc there read as a glowing blob. The dark of the room is `bg-canvas scheme-dark`
  in both themes. Many dots = one SVG path per group (`M x y h0` with round caps), never
  one element per dot.
- **The departures board** (ADR 0029): the journey's rail shows the year on tiles split
  by a hinge and the label in small cells (`SplitFlap`, `flap-board`); a new stop's line
  takes over at once and turns from the previous line's characters (2024 → 2025 turns one
  digit). The stops' titles turn in letter by letter (`SplitFlapTitle`, `flap-title`) and
  stop before the reading line. Cells keep their character's width; the glyphs they turn
  through come from letters of the same kind and about the same width. Other headers keep
  their rising letters: the board belongs to the journey, a flight.
- **The cycle race** (ADR 0032), under the IT-Finance role: the CV's 10 h → 5 min as a
  scale model the visitor starts (an hour lasts 1.2 s). The old bar crawls, the new one is
  full at once and counts its cycles: never a bar refilling ten times a second, which
  would flash (WCAG 2.3.1). A result that appears later keeps its place from the start (an
  invisible copy under it), so nothing moves. With reduced motion, the result at once.
- **The not-found page is a diverted flight**: "Vol 404 · Dérouté" turns in on the board
  on its own (`flap-enter`, on the clock), the 404 sits on tiles, and the journey's plane
  flies two turns of a dotted holding pattern around it (`HoldingPattern`,
  `holding-orbit`) before waiting at the top. It plays once and rests within five
  seconds, so it needs no pause control (WCAG 2.2.2; `not-found.spec.ts` measures it).
  The way out is a board of destinations (`DestinationBoard`): home, the story, contact,
  the map. On a phone the pattern comes first, in view; the words keep the reading order.
- **Photos are always whole**: framed at their own ratio, never cropped by a frame or by a
  parallax zoom, and set where they tell something (the stadium beside Korea University),
  not in a separate gallery. They move as a whole (`reveal-expand`, `scroll-float`).
- **Nothing covers text being read**: stacked sticky cards cut the previous card's text
  mid-sentence (AI practice, photo deck) and read as bugs; they were removed. The labels
  beside the rail follow a **reading line** (`view-timeline-inset`), so only one shows at
  a time; seen through the whole viewport, two short chapters overlapped. E2E tests guard
  both (`ai-practice.spec.ts`, `flight-path.spec.ts`).
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
