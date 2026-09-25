---
name: content-data
description: How the CV content becomes typed, validated data in the portfolio — single source docs/content/cv-source.md, per-feature data files validated by Zod schemas, French copy rules, facts that must never be invented, personal data rules (no phone on the site, downloadable CV), external links. Load BEFORE displaying, editing or adding any text, figure, date, link or asset about William.
---

# Content Data

## Single source of truth

`docs/content/cv-source.md` (transcription of the CV, 2026-09-25) is the **only** source
of content. Rules:

1. **Nothing that is not in the CV** appears on the site without William's explicit
   approval in the conversation. No invented metrics, clients, testimonials, years,
   technologies or "services". When the layout seems to need something the CV lacks,
   ask — don't fill.
2. Figures are quoted exactly: "de 10 heures à 5 minutes", "99 % de latence en moins",
   "des dizaines de milliers de traders", "des centaines de milliers d'utilisateurs",
   "1er au concours Epitech Summit", "300 personnes", "TOEIC 820", "61e mondiale (QS)".
3. Other personal projects (Busbar, STOQR…) are **out of scope** until William asks.

## From markdown to typed data

Each feature owns its content in `src/features/<f>/data/<name>.ts`:

```ts
// src/features/experience/data/experiences.ts
import { type Experience } from '@/features/experience/types/experience';

export const EXPERIENCES = [
  {
    id: 'it-finance-prorealtime',
    role: 'Software Engineer',
    company: 'IT-Finance, éditeur de ProRealTime',
    companyDescription: 'Éditeur de logiciel financier, environ 70 personnes.',
    period: { start: '2025-09', end: null },
    stack: ['C++', 'Rust', 'Python'],
    highlights: [/* … exact CV bullets … */],
  },
] as const satisfies readonly Experience[];
```

- `satisfies` gives compile-time checking; a unit test also runs
  `experiencesSchema.parse(EXPERIENCES)` so constraints types can't express (non-empty
  strings, valid ISO months, `https` URLs) fail CI.
- Constants holding content are SCREAMING_SNAKE_CASE, exported, and consumed only by
  their feature (and routes).
- Ids are kebab-case slugs, stable, used for keys, anchors and detail-page URLs.
- A test compares the data with `cv-source.md` expectations for the key facts (company
  names, periods, figures) so a typo in a figure is caught.

## Copy rules

- UI language: **French**, `lang="fr"`. Technical proper nouns stay as is (TypeScript,
  NestJS, OPRA). English phrases get `lang="en"` (e.g. "Software Engineer & AI Engineer"
  is a job title in English → wrap in `<span lang="en">`).
- First person, direct, same voice as the CV ("J'ai conçu…"). No marketing superlatives
  the CV doesn't use.
- Typography: French non-breaking spaces before `: ; ! ? %` and inside « » (use
  ` ` / ` ` in data), real apostrophes (’), en dash for ranges (2022 – 2024).
- Dates formatted by a util with `Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' })`
  → "sept. 2025"; ongoing roles display "Depuis sept. 2025".

## Personal data and assets

- **Phone number never rendered on the site.** It exists only inside the downloadable
  CV PDF (William accepted this on 2026-09-25).
- Contact: `william.stoops@epitech.eu`, LinkedIn
  `https://www.linkedin.com/in/william-stoops-a1029b233`. E-mail shown as a `mailto:`
  link with visible address.
- CV: `public/cv/william-stoops-cv-fr.pdf`, linked as "Télécharger le CV (PDF, 56 Ko)"
  with the `download` attribute; the size string is computed at build time or asserted by
  a test so it can't drift.
- STAXX pitch video: `https://www.youtube.com/watch?v=K_TsQ0Itoek&t=3741s` (starts at
  1:02:21). External link = new-tab semantics (`accessibility` §6), or a privacy-friendly
  facade (`react-performance` §4).
- Portrait photo: to be provided by William; until then the ring frames initials or a
  neutral monogram — never a stock photo or AI-generated face.
