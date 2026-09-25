---
name: typescript-standards
description: TypeScript rules for the portfolio — naming conventions (kebab-case files, PascalCase components/types, SCREAMING_SNAKE_CASE constants, camelCase variables), the total ban on any/unknown/assertions and how to write code without them, Zod at every boundary, discriminated unions, readonly data, exhaustive switches, error handling. Load BEFORE writing any TypeScript, type, schema, constant or error handling.
---

# TypeScript Standards

TypeScript `~6.0.3`, `strict` + the hardened flags listed in `quality-gates` §4.

## Naming

| Element                                                       | Convention                       | Example                                                         |
| ------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| File, folder                                                  | kebab-case                       | `experience-card.tsx`, `use-theme.ts`, `contact-form-schema.ts` |
| React component, type, interface, type parameter              | PascalCase                       | `ExperienceCard`, `Experience`, `TItem`                         |
| Module-level constant (immutable value, config, lookup table) | SCREAMING_SNAKE_CASE             | `NAV_ITEMS`, `CV_FILE_URL`, `BREAKPOINTS`                       |
| Variable, function, parameter, prop, hook, object property    | camelCase                        | `activeSection`, `formatPeriod`, `useTheme`                     |
| Zod schema                                                    | camelCase + `Schema`             | `experienceSchema`                                              |
| Boolean                                                       | `is`/`has`/`should`/`can` prefix | `isCurrent`, `hasVideo`                                         |
| Event prop / handler                                          | `onX` / `handleX`                | `onSubmit`, `handleSubmit`                                      |

"Constant" means a **module-level `const` holding a fixed value** (primitive, frozen
object/array `as const`, config). A `const` inside a function is a variable → camelCase.
A module-level `const` holding a component (`const Foo = …`) or a function is PascalCase
/ camelCase respectively. Enforced by `@typescript-eslint/naming-convention`.

No TypeScript `enum` (not erasable syntax): use `as const` objects or string unions.

## `any` and `unknown` are banned — how to live without them

Neither may be **written** anywhere (lint: `no-explicit-any`, `no-restricted-syntax`
`TSUnknownKeyword`). No config override exists. How to handle the cases where they
usually appear:

| Situation                                       | Do this                                                                                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSON from `fetch`, `localStorage`, `JSON.parse` | Pass it straight to a Zod schema: `settingsSchema.parse(JSON.parse(raw))`. The inferred type flows from the schema; the untyped value never gets a name. |
| `import.meta.env`                               | Parsed once in `src/config/env.ts` by `envSchema`; the rest of the app imports `ENV`.                                                                    |
| URL / search params                             | Parsed by a Zod schema in the hook that reads them.                                                                                                      |
| `catch (error)`                                 | Don't annotate. Narrow: `if (error instanceof Error)`; otherwise rethrow or map to a typed `AppError`. Never swallow.                                    |
| Generic "any object"                            | `<T extends object>`, `Record<string, string>`, or a precise type.                                                                                       |
| Third-party type is too loose                   | Wrap it in `src/lib/` behind a precise signature validated by Zod.                                                                                       |
| Test doubles                                    | Build real typed fixtures (`satisfies Experience`), never cast.                                                                                          |

## No type assertions

`as X` is forbidden (lint), `as const` is allowed, `satisfies` is encouraged. Non-null
`!` is forbidden: with `noUncheckedIndexedAccess`, handle `undefined` explicitly
(`const first = items[0]; if (!first) return null;`). DOM lookups: narrow with
`instanceof HTMLElement`.

## Zod at the boundaries (Zod 4)

- **Shipped code imports `zod/mini`** (functional API: `z.enum(...)`, `schema.safeParse`),
  measured at ~10 kB brotli less than full `zod` for the theme hook. Full `zod` is only
  acceptable where a library requires it (e.g. a form resolver) and the size is measured
  in the PR. Prefer `safeParse` + explicit fallback over `z.catch(...)`: Oxlint's
  `promise/valid-params` mistakes `z.catch(schema, value)` for a `Promise.catch()` call.
- Schemas are the source of truth; types are `z.infer<typeof schema>` (or `z.input` /
  `z.output` when a transform makes them differ — typical for forms).
- Static content in `features/*/data/` is typed with `satisfies` against the inferred
  type **and** validated against the schema in a unit test, so a malformed CV entry fails
  CI, not the browser.
- Parse at the edge, trust inside: once parsed, internal functions take precise types and
  never re-validate.
- Error messages in schemas are French user-facing strings (they surface in forms).

## Modelling

- Data is `readonly` (`readonly Experience[]`, `Readonly<…>`); transforms return new
  values (`toSorted`, spread), never mutate.
- Discriminated unions for variants (`{ kind: 'video'; url: string } | { kind: 'none' }`)
  and `switch` with an exhaustiveness check:

  ```ts
  function assertNever(value: never): never {
    throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
  }
  ```

- Dates in data are ISO strings (`'2025-09'`) validated by schema; formatting goes
  through `Intl.DateTimeFormat('fr-FR', …)` in a util — no date library.
- Branded ids only if two id kinds could be confused; not by default.

## Functions and modules

- Named exports only. `function` declarations for components and top-level functions;
  arrow functions for callbacks.
- Explicit return types on exported functions of `utils/`, `lib/`, `hooks/` (public
  contracts); inferred elsewhere.
- Prefer `type` aliases; `interface` only when declaration merging is intended (never).
- Import types with `import { type X }` — **except** in files that Node scripts run directly
  (`scripts/` imports them): use `import type { X }`. Node's type stripping keeps an empty
  `import {} from '@/…'` for inline specifiers and cannot resolve the alias.

## Errors

- Expected failures (form submit, network) are values: return a discriminated result
  (`{ status: 'success' } | { status: 'error'; message: string }`) rather than throwing
  across components.
- Unexpected failures throw and are caught by the route `ErrorBoundary`.
- No empty `catch`, no `catch` that only logs.
