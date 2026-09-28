import {
  NRJ_EXPLANATION_PICTURE,
  NRJ_INTERVIEW_PICTURE,
  PITCH_PICTURE,
  SUMMIT_PICTURE,
} from '@/features/projects/data/staxx-pictures';
import { type Project, type ProjectLabels } from '@/features/projects/types/project';

// Translation of projects.fr.ts (ADR 0026): the same project, figures and moments.
export const PROJECTS = [
  {
    id: 'staxx',
    name: 'STAXX',
    tagline: 'Equipment ordering platform for the construction industry',
    period: { start: '2024' },
    context:
      'Epitech final-year project. **1st at the Epitech Summit competition**, pitched to 300 people.',
    stack: ['NestJS', 'PostgreSQL', 'React'],
    figures: [
      { value: '1st', label: 'at the Epitech Summit competition' },
      { value: '300', label: 'people at the pitch' },
      { value: '3', label: 'developers, two of whom I led' },
    ],
    highlights: [
      'I drove the project and **led the two other developers**: splitting the work, architecture decisions, technical consistency through to delivery. I built the entire back end.',
      'I designed the matching engine between the language of site crews and the catalogue: “20 Atlas clamps for 26 mm tube” finds the right item despite typos, through an alias dictionary that every user correction enriches.',
    ],
    pitch: {
      video: {
        youtubeId: 'K_TsQ0Itoek',
        startSeconds: 3741,
        title: 'STAXX pitch at the Epitech Summit competition',
      },
      poster: PITCH_PICTURE,
      label: 'The pitch',
      caption: 'In front of 300 people, on the Epitech Summit stage.',
    },
    photo: {
      picture: SUMMIT_PICTURE,
      alt: 'William Stoops, the first-place trophy in hand, surrounded by six people on the Epitech Summit stage',
      place: 'Epitech Summit',
      caption: 'First place, trophy in hand.',
    },
    press: {
      label: 'On the radio',
      outlet: 'NRJ Lille',
      summary: 'On NRJ Lille, NRJ’s regional radio station, to present STAXX.',
      photos: [
        {
          picture: NRJ_INTERVIEW_PICTURE,
          alt: 'William Stoops listens to a question, facing the NRJ microphone a journalist holds out',
        },
        {
          picture: NRJ_EXPLANATION_PICTURE,
          alt: 'William Stoops explains STAXX at the NRJ microphone, an Epitech Summit invitation on the table',
        },
      ],
    },
  },
] as const satisfies readonly Project[];

export const PROJECT_LABELS = {
  technologies: 'Technologies used',
  figures: (projectName) => `${projectName} in figures`,
} as const satisfies ProjectLabels;
