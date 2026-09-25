---
name: state-and-forms
description: Where state lives in the portfolio (local, URL, context, persisted preference, and the criteria for ever adding Redux Toolkit), and how forms are built with React Hook Form + Zod 4 + React 19 Actions with accessible errors. Load BEFORE adding any state shared by more than one component, anything persisted, any URL parameter, or any form.
---

# State & Forms

## State placement — decide top-down, stop at the first match

1. **Derived?** Compute it during render. It is not state.
2. **Used by one component (or its children)?** `useState` / `useReducer` there.
3. **Must survive reload or be shareable by link?** URL: path param or search param,
   parsed with Zod in the hook that reads it (`useSearchParams`).
4. **Cross-cutting and rarely changing** (theme)? A dedicated context + provider in
   a provider added to `src/app/routes/root-layout.tsx`, one concern per context. (The
   theme needs none: it lives on `<html>` and is read with `useSyncExternalStore`.)
5. **User preference to persist** (theme choice)? `localStorage` through a small
   `useSyncExternalStore`-based hook in `src/hooks/`, value parsed with Zod, reads and
   writes wrapped in try/catch (storage can be unavailable).
6. **Complex client state shared by many distant components, with interacting
   updates?** → only then a store. See below.

### Redux Toolkit

Not installed at the start: nothing in a CV portfolio needs a global store, and adding
one "to show it" would be the opposite of the pragmatism Hymaïa values
([ADR 0004](../../../docs/adr/0004-state-management.md)). Introduce RTK (2.x) **only** if
at least two of these become true, via a new ADR:

- state read and written by ≥ 3 distant features,
- updates that must stay consistent across several slices,
- need for devtools time-travel / action log to debug,
- server cache with invalidation (then RTK Query, or TanStack Query if no other global state).

If introduced: `src/lib/store.ts`, typed hooks `useAppSelector = useSelector.withTypes<RootState>()`
and `useAppDispatch = useDispatch.withTypes<AppDispatch>()`, one slice per feature in
`features/<f>/store/`, memoised selectors with `createSelector`, components select the
smallest value.

## Forms

Stack: **React Hook Form 7 + `@hookform/resolvers` 5 (`zodResolver`) + Zod 4**, submitted
through a React 19 Action so pending state comes from `useFormStatus` /
`useActionState`.

```
features/contact/
  schemas/contact-form-schema.ts   # z.object({ name, email, message, website (honeypot) })
  hooks/use-contact-form.ts        # useForm + submit action + result state
  components/contact-form.tsx      # pure rendering of fields from the hook
  utils/send-contact-message.ts    # the only place that talks to the outside
```

- Schema = single source: `type ContactFormInput = z.input<typeof contactFormSchema>`,
  `type ContactFormValues = z.output<typeof contactFormSchema>`;
  `useForm<ContactFormInput, undefined, ContactFormValues>({ resolver: zodResolver(contactFormSchema) })`.
- Validation mode: `onTouched` then `onChange` after the first error (no red fields
  while typing the first time).
- Error messages are French, specific and actionable ("Erreur : saisissez une adresse
  e-mail valide, par exemple nom@domaine.fr").
- Accessibility (see `accessibility` §7): visible labels, `autoComplete`, `aria-invalid`,
  `aria-describedby` = hint + error ids, focus first invalid field on submit
  (`shouldFocusError`), result in a persistent `role="status"`.
- Anti-spam: honeypot field + server-side rate limit; no CAPTCHA.
- Submission result is a discriminated union
  (`{ status: 'idle' | 'success' } | { status: 'error'; message: string }`), never a thrown
  error crossing components.
- Where the message goes (third-party form endpoint vs serverless function) is an open
  question decided in the contact PR by ADR. Until then, contact = `mailto:` + LinkedIn.

## Tests

- Schema: unit tests for each accepted and rejected case.
- Hook: submit success, submit failure, pending state.
- Component: labels, error announcement and association, focus on first error, status
  message, keyboard-only completion.
- E2E: full contact journey on mobile and desktop; network mocked at the edge.
