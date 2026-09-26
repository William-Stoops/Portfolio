import { JOURNEY_ANCHORS } from '@/config/paths';
import { type JourneyStop } from '@/features/journey/types/journey-stop';

// Source: docs/content/cv-source.md ("Chronologie", given by William on 2026-09-26). The
// cards of each year (roles, STAXX, Seoul) come from their own sections' data.
export const JOURNEY_STOPS = [
  {
    id: 'annee-2021',
    year: 2021,
    label: '1re année',
    title: 'Epitech',
    note: 'J’entre à Epitech pour un Master of Science, Expert en Technologies de l’Information : la promo 2026.',
  },
  { id: 'annee-2022', year: 2022, label: '2e année', title: 'Strattt, puis GDS Élec' },
  {
    id: 'annee-2023',
    year: 2023,
    label: '3e année',
    title: 'STAXX commence, puis INTM',
    note: 'Je commence STAXX, mon projet de fin d’études : je le développe en 3e, 4e et 5e année.',
  },
  { id: JOURNEY_ANCHORS.korea, year: 2024, label: '4e année', title: 'Séoul' },
  {
    id: 'annee-2025',
    year: 2025,
    label: '5e année',
    title: 'Retour en France',
    note: 'De retour en France, je rejoins IT-Finance. Avec STAXX, nous passons sur NRJ Lille, puis nous remportons l’Epitech Summit.',
  },
  {
    id: 'annee-2026',
    year: 2026,
    label: 'Promo 2026',
    title: 'Aujourd’hui',
    note: 'Promo 2026 d’Epitech, et Software Engineer chez IT-Finance, éditeur de ProRealTime.',
  },
] as const satisfies readonly JourneyStop[];
