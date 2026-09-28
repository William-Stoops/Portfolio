import { JOURNEY_ANCHORS, SECTION_IDS } from '@/config/paths';
import { type JourneyContent } from '@/features/journey/types/journey-stop';

// Translation of journey-stops.fr.ts (ADR 0026): the same years and events.
export const JOURNEY_CONTENT = {
  id: SECTION_IDS.en.experience,
  title: 'Journey',
  stops: [
    {
      id: 'year-2021',
      year: 2021,
      label: '1st year',
      title: 'Epitech',
      note: 'I join Epitech for a Master of Science, Expert in Information Technology: class of 2026.',
    },
    { id: 'year-2022', year: 2022, label: '2nd year', title: 'Strattt, then GDS Élec' },
    {
      id: 'year-2023',
      year: 2023,
      label: '3rd year',
      title: 'Launching STAXX, then INTM',
      note: 'I launch STAXX, my final-year project, which I carry through to my 5th year.',
    },
    {
      id: JOURNEY_ANCHORS.en.korea,
      year: 2024,
      label: '4th year',
      title: 'Seoul, Korea University',
    },
    {
      id: 'year-2025',
      year: 2025,
      label: '5th year',
      title: 'Back in France',
      note: 'Back in France, I join IT-Finance, publisher of ProRealTime. With the STAXX team, we go on NRJ Lille, then win the Epitech Summit.',
    },
    {
      id: 'year-2026',
      year: 2026,
      label: 'Class of 2026',
      title: 'Today',
      note: 'Epitech class of 2026. Software Engineer at IT-Finance, publisher of ProRealTime.',
    },
  ],
} as const satisfies JourneyContent;
