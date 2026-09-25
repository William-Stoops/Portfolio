---
name: responsive-design
description: Mobile-first responsive strategy for the portfolio — viewport breakpoints vs container queries, fluid type and spacing tokens, intrinsic grids, reading order, viewport units, safe areas, pointer/hover adaptation, responsive images, short/landscape screens, large screens, print, and the multi-viewport test matrix. Load BEFORE laying out a page or section, writing a grid, adding an image, choosing a breakpoint, or writing a layout test.
---

# Responsive Design

**One rule above the others: the layout adapts to the content, not to a device list.**
A breakpoint exists where the content breaks (a line gets too long, a card too narrow),
never "because iPad". Supported range: **320 px → 2560 px**, portrait and landscape, touch
and mouse, zoom up to 400 %.

## 1. Two levels of responsiveness

| Level | Tool | Decides | Example |
| ----- | ---- | ------- | ------- |
| **Macro** — the page | Viewport breakpoints (`md:`, `lg:`) | Page grid, header/nav mode, section columns | Hero switches from stacked to two columns at `lg` |
| **Micro** — the component | Container queries (`@container`, `@md:`) | Internal layout of a reusable block | An experience card goes horizontal when *its* slot is ≥ `@md`, wherever it is placed |

Components in `src/components/ui/` and `features/*/components/` **never use viewport
breakpoints for their internal layout** — only container queries. Viewport breakpoints are
reserved for page shells and section layouts (`components/layout/`, route files, section
wrappers). This is what lets the same card work in a 3-column grid on desktop and full
width on mobile without a prop.

```tsx
// Section decides the grid (macro); card adapts to its slot (micro)
<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-6">
  <li className="@container">
    <article className="flex flex-col gap-4 @md:flex-row">…</article>
  </li>
</ul>
```

## 2. Breakpoints

Tailwind v4 defaults, in **rem** so they follow the user's font size and zoom:

| Variant | Min width | Typical meaning here                                  |
| ------- | --------- | ----------------------------------------------------- |
| (base)  | 0         | Small phone, 320 px minimum — **design starts here**  |
| `sm`    | 40rem     | Large phone landscape / small tablet                  |
| `md`    | 48rem     | Tablet portrait — inline desktop nav appears          |
| `lg`    | 64rem     | Laptop — two-column hero and about                    |
| `xl`    | 80rem     | Desktop — content reaches max width                   |
| `2xl`   | 96rem     | Large desktop — only type/spacing caps, no new layout |

- **Mobile-first only**: base styles for the smallest screen, then `md:`, `lg:` add.
  `max-*:` variants are allowed only for a documented exception.
- No custom breakpoint without a line in this table and a reason.
- Container sizes: Tailwind defaults `@3xs` (16rem) → `@7xl` (80rem). Name containers
  (`@container/card`) only when nested containers make the nearest one ambiguous.

## 3. Fluid tokens instead of breakpoint staircases

Type and section spacing scale continuously with `clamp()`, defined once in
`src/styles/globals.css` `@theme` (values owned by `design-system`):

```css
@theme {
  --text-display: clamp(2.5rem, 1.5rem + 4vw, 4.5rem);   /* hero name */
  --text-h2:      clamp(1.75rem, 1.25rem + 2vw, 2.75rem);
  --text-body:    clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --spacing-section: clamp(4rem, 2.5rem + 6vw, 8rem);    /* vertical rhythm between sections */
  --spacing-gutter:  clamp(1rem, 0.5rem + 3vw, 2.5rem);  /* page side padding */
}
```

- **Every `clamp()` mixes `rem` and `vw`.** A pure-`vw` size does not grow with browser
  zoom and fails WCAG 1.4.4.
- `md:text-4xl lg:text-5xl xl:text-6xl` staircases are a smell — use the fluid token.
- Prose is capped at `max-w-[65ch]`; page content at `max-w-6xl` centred with
  `px-(--spacing-gutter)`. Nothing stretches edge to edge on a 2560 px screen except
  deliberate full-bleed backgrounds.

## 4. Intrinsic layouts first

Prefer layouts that need **no breakpoint at all**:

- Card lists: `grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))]` — the `min(100%, …)`
  prevents overflow at 320 px.
- Tag / tech lists: `flex flex-wrap gap-2` — never a fixed number of columns.
- Media + text: `flex flex-wrap` with `flex-[1_1_20rem]` children.
- Headings: `text-balance`; paragraphs: `text-pretty`; URLs and e-mails:
  `break-words` / `[overflow-wrap:anywhere]`; French long words: `hyphens-auto` (works
  because `<html lang="fr">`).

## 5. Reading order is DOM order

The visual order must match the DOM order (WCAG 1.3.2, 2.4.3). **No `order-*`, no
`flex-row-reverse`, no grid placement that reorders content** to fix a layout. If the
mobile and desktop orders genuinely differ (e.g. portrait above or below the hero text),
choose the DOM order that is right for reading and keyboard, then place the portrait with
grid areas that keep that order. Hiding and duplicating content per breakpoint
(`hidden md:block` + `md:hidden` twins) is forbidden — screen readers and tests see both.

## 6. Viewport units, safe areas, short screens

- Hero height: `min-h-svh` (small viewport height) — never `h-screen` / `100vh`, which
  jumps under mobile browser chrome. `dvh` only for overlays that must track the live
  viewport (mobile menu panel).
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  — never `maximum-scale` or `user-scalable=no`.
- With `viewport-fit=cover`, header and footer pad with `env(safe-area-inset-*)`
  (notch, home indicator), e.g. `pt-[max(1rem,env(safe-area-inset-top))]`.
- **Short screens** (phone landscape, 400 % zoom): under `@media (max-height: 30rem)`
  the header is `static` (not sticky) and the hero drops `min-h-svh`. Define this once as
  a custom variant `short:` in `globals.css`:
  `@custom-variant short (@media (max-height: 30rem));`

## 7. Adapt to the input, not the width

- Tailwind v4 `hover:` only applies on devices that can hover — rely on it, and never
  hide information or actions behind hover.
- `pointer-coarse:` increases hit areas and spacing between adjacent targets (≥ 44 px on
  touch, see `accessibility`). `pointer-fine:` may tighten them.
- Motion: parallax / hover effects are `pointer-fine:` + `motion-safe:` only.
- Never sniff user agents or infer "mobile" from a width to change behaviour.

## 8. Responsive images

- Every raster image goes through `vite-imagetools` and a `ResponsiveImage` UI component
  that renders `<picture>` with AVIF + WebP + fallback, a `srcset` of widths, and a
  **`sizes` attribute that matches the real layout** (e.g.
  `sizes="(min-width: 64rem) 28rem, 80vw"` for the hero portrait). A wrong `sizes` makes
  phones download desktop images.
- Explicit `width` / `height` (or `aspect-ratio`) on every image → zero CLS.
- Hero portrait = LCP: `fetchPriority="high"`, no `loading="lazy"`. Everything else:
  `loading="lazy" decoding="async"`.
- Art direction (a tighter crop on small screens) uses `<source media>` in `<picture>`,
  not two `<img>` toggled with CSS.
- Decorative shapes (the orange ring) are CSS/SVG, not images, so they scale for free.

## 9. JavaScript is the last resort

Responsive behaviour is CSS. JS reads the viewport only when the **component tree** must
differ (rare — e.g. mounting a heavy desktop-only animation). Then use `useMediaQuery`
(`src/hooks/use-media-query.ts`, `useSyncExternalStore` on `matchMedia`) with queries
imported from `src/config/breakpoints.ts`, which mirrors the CSS values — never a raw
`window.innerWidth` read, never a resize listener with `setState` on every pixel.

## 10. Print

The CTO may print the page. `print:` variants: hide nav, theme toggle, decorative
graphics; force light colours; show link URLs after link text
(`print:after:content-['_('attr(href)')']`); avoid page breaks inside cards
(`print:break-inside-avoid`). One Playwright test checks `emulateMedia({ media: 'print' })`.

## 11. Test matrix (mandatory per feature PR)

Playwright projects (defined once in `playwright.config.ts`):

| Project           | Device                     | Why                                   |
| ----------------- | -------------------------- | ------------------------------------- |
| `mobile-safari`   | iPhone 15 (393×852, touch) | Main mobile target, WebKit            |
| `mobile-chrome`   | Pixel 7 (412×915, touch)   | Android / Chromium                    |
| `tablet`          | iPad Mini portrait (768×1024) | The `md` boundary                  |
| `desktop`         | Chromium 1280×800          | Laptop, `lg`/`xl` layouts             |
| `desktop-wide`    | Chromium 1920×1080         | Max-width, large-screen caps          |

Plus, in `e2e/responsive.spec.ts`:

- **Overflow sweep**: for each route, widths `[320, 360, 375, 414, 600, 768, 900, 1024,
  1280, 1440, 1920, 2560]` → `scrollWidth <= clientWidth`.
- **Landscape phone** 844×390: header not sticky, hero content fully reachable.
- **Visual regression** (`@visual`, Chromium, Playwright Docker image for determinism):
  each section at 375, 768, 1280, 1920.
- **Print** snapshot of the home page.

Component tests (Vitest browser mode) cover container-query behaviour by rendering the
component in wrappers of different widths — not by resizing the viewport.

## Review checklist

- [ ] Designed at 320 px first; no horizontal scroll anywhere in the sweep
- [ ] Components use container queries internally; viewport breakpoints only in shells
- [ ] Fluid tokens used, no breakpoint staircases for type/spacing
- [ ] DOM order = visual order at every width; no duplicated content per breakpoint
- [ ] `svh` for full-height sections, safe areas padded, `short:` handled
- [ ] Images: correct `sizes`, dimensions set, LCP prioritised
- [ ] Touch targets ≥ 44 px on `pointer-coarse`; nothing hover-only
- [ ] Screenshots desktop + mobile attached to the PR
