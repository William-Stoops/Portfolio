---
name: react-components
description: How components and hooks are written in the portfolio — UI primitives vs feature components vs routes, render-only components with logic extracted into hooks, prop design (unions over booleans), React 19 idioms (ref as prop, <title>, Actions), composition, error boundaries and Suspense. Load BEFORE writing or modifying any .tsx component or custom hook.
---

# React Components & Hooks

## The three kinds of component

| Kind | Location | May | Must not |
| ---- | -------- | --- | -------- |
| **UI primitive** | `src/components/ui/` | Know tokens, variants (`cva`), headless primitives (Base UI) | Know any CV concept, fetch, read the router |
| **Feature component** | `src/features/<f>/components/` | Receive typed data via props, call its feature hook, compose UI primitives | Hold business logic inline, call `useEffect`, compute derived data in JSX |
| **Route** | `src/app/routes/` | Compose features, set `<title>`, own the page `h1` focus hook | Contain logic or markup beyond composition |

Layout components (`src/components/layout/`) are UI-level: they arrange slots and know
landmarks, never content.

## Components render, hooks decide

A feature component is a **pure function of its props and of the values its hook
returns**: same inputs → same output, no side effects during render. Anything that is
not "turn this data into markup" goes into a hook:

```tsx
// src/features/experience/hooks/use-experience-timeline.ts
export function useExperienceTimeline(experiences: readonly Experience[]) {
  const sortedExperiences = experiences.toSorted((a, b) => b.startDate.localeCompare(a.startDate));
  const currentExperience = sortedExperiences.find((experience) => experience.endDate === null);
  return { sortedExperiences, currentExperience };
}

// src/features/experience/components/experience-timeline.tsx
type ExperienceTimelineProps = { experiences: readonly Experience[] };

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const { sortedExperiences } = useExperienceTimeline(experiences);
  return (
    <ol className="flex flex-col gap-8">
      {sortedExperiences.map((experience) => (
        <li key={experience.id}>
          <ExperienceCard experience={experience} />
        </li>
      ))}
    </ol>
  );
}
```

- The hook is unit-tested with `renderHook` (or as a plain function when it uses no
  React API — then it belongs in `utils/`, not `hooks/`: **a hook must call a hook**).
- The component test only checks what is rendered for given data.
- Pure data transforms that don't need React live in `utils/` and are called by the hook.

## Props

- Type props with a `type <Component>Props = {…}` next to the component; export it only
  if another module needs it (Knip will tell).
- **Unions over booleans.** `variant: 'primary' | 'secondary' | 'ghost'`, not
  `isPrimary` + `isGhost`. Mutually exclusive props → discriminated union.
- Data props are `readonly` and typed from the feature's Zod-derived types.
- No prop drilling beyond two levels: compose with `children` / slots first; context
  only for truly cross-cutting values (theme).
- Event props are named `on<Event>` and passed through; handlers inside are
  `handle<Event>`.
- UI primitives accept `className` (merged with `cn()`) and spread the native props of
  their root element (`ComponentProps<'button'>`), so they stay composable.

## React 19 idioms (React 19.3, Compiler on)

- `ref` is a regular prop — no `forwardRef`.
- `<title>` / `<meta>` rendered in a route are hoisted to `<head>` — no helmet lib.
- Forms with side effects use Actions (`<form action>`, `useActionState`,
  `useFormStatus`) combined with React Hook Form for field validation (see
  `state-and-forms`).
- No `useMemo` / `useCallback` / `memo` by default: the React Compiler memoises. Keep one
  only as an escape hatch with a comment (e.g. stabilising a value used in an effect
  dependency after measurement).
- `useEffect` is for synchronising with something **outside React** (DOM API,
  `matchMedia`, focus). Deriving state from props in an effect is a bug — derive during
  render. Subscriptions to external stores use `useSyncExternalStore`.
- Keys are stable ids from data (`experience.id`), never array indices.

## Composition

- Prefer `children` and small compound components (`Card`, `CardHeader`, `CardBody`)
  over configuration props.
- Polymorphism via Base UI's `render` prop (shadcn on Base UI), not an `as` prop.
- Conditional rendering: early return for empty states; no nested ternaries in JSX.

## Errors and loading

- One root error boundary (React Router route `ErrorBoundary`) renders an accessible
  error page with an `h1` and a way back home.
- Lazy routes are wrapped by the router; no spinners for static content — the content is
  bundled, so the fallback should almost never show. If it does, it is a skeleton with
  `aria-busy`, never a layout shift.

## Checklist

- [ ] Right kind, right folder (see `feature-architecture`)
- [ ] Component is render-only; logic lives in a tested hook or util
- [ ] Props typed, unions over booleans, no `any` / `unknown`
- [ ] Semantic HTML first, ARIA only when HTML cannot express it (`accessibility`)
- [ ] Container queries for internal layout (`responsive-design`)
- [ ] Only design tokens for colour, spacing, type (`design-system`)
