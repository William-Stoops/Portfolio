import { describe, expect, it } from 'vitest';

import { JOURNEY_STOPS } from '@/features/journey/data/journey-stops';
import { type JourneyStop } from '@/features/journey/types/journey-stop';

// The thread of the page, from docs/content/cv-source.md ("Chronologie"): William's years
// at Epitech, one stop a year, from 2021 to the promo 2026.
describe('journey stops', () => {
  it('follows the years at Epitech, one stop a year', () => {
    expect(JOURNEY_STOPS.map(({ year, label }) => `${String(year)} · ${label}`)).toEqual([
      '2021 · 1re année',
      '2022 · 2e année',
      '2023 · 3e année',
      '2024 · 4e année',
      '2025 · 5e année',
      '2026 · Promo 2026',
    ]);
  });

  it('names each stop by where it happens', () => {
    expect(JOURNEY_STOPS.map(({ title }) => title)).toEqual([
      'Epitech',
      'Strattt, puis GDS Élec',
      'STAXX commence, puis INTM',
      'Séoul',
      'Retour en France',
      'Aujourd’hui',
    ]);
  });

  it('tells the stops that have no card of their own, in William’s words', () => {
    expect(JOURNEY_STOPS.map(({ note }: JourneyStop) => note)).toEqual([
      'J’entre à Epitech pour un Master of Science, Expert en Technologies de l’Information : la promo 2026.',
      undefined,
      'Je commence STAXX, mon projet de fin d’études : je le développe en 3e, 4e et 5e année.',
      undefined,
      'De retour en France, je rejoins IT-Finance. Avec STAXX, nous passons sur NRJ Lille, puis nous remportons l’Epitech Summit.',
      'Promo 2026 d’Epitech, et Software Engineer chez IT-Finance, éditeur de ProRealTime.',
    ]);
  });

  it('gives each stop an anchor of its own', () => {
    expect(new Set(JOURNEY_STOPS.map(({ id }) => id)).size).toBe(JOURNEY_STOPS.length);
  });
});
