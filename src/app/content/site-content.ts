import { type ReactNode } from 'react';

import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';
import { type BehindTheScenesContent } from '@/features/behind-the-scenes/types/behind-the-scenes-content';
import { type ContactContent } from '@/features/contact/types/contact-content';
import { type EducationEntry } from '@/features/education/types/education-entry';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { type Recommendation } from '@/features/experience/types/recommendation';
import { type VolatilityLabContent } from '@/features/experience/types/volatility-lab';
import { type Experience, type ExperienceLabels } from '@/features/experience/types/experience';
import { type HeroContent } from '@/features/hero/types/hero-content';
import { type JourneyContent } from '@/features/journey/types/journey-stop';
import { type KoreaContent } from '@/features/korea/types/korea-content';
import { type Project, type ProjectLabels } from '@/features/projects/types/project';
import { type SkillGroup } from '@/features/skills/types/skill-group';

type PageText = { title: string; description: string };

// Everything one locale shows (ADR 0026): one object per locale, each its own chunk, loaded
// before hydration. The type is the contract: a missing translation does not compile.
export type SiteContent = {
  home: { description: string };
  hero: HeroContent;
  journey: JourneyContent;
  // Told in the journey, most recent first: IT-Finance, INTM, Strattt then GDS Élec.
  experiences: {
    entries: readonly [Experience, Experience, Experience];
    labels: ExperienceLabels;
    // IT-Finance's lab: the implied volatility surface solved in the browser (ADR 0036),
    // and the cycle of ten hours brought to five minutes, raced to scale (ADR 0032).
    lab: VolatilityLabContent;
    race: CycleRaceContent;
    // What William's mentor at INTM Groupe wrote about him, under that role.
    recommendation: Recommendation;
  };
  korea: KoreaContent;
  projects: { entries: readonly [Project]; labels: ProjectLabels };
  aiPractice: AiPracticeContent;
  skills: {
    // Anchor and title of the section that holds the skills, then the education.
    id: string;
    title: string;
    groups: readonly SkillGroup[];
    education: { title: string; entries: readonly EducationEntry[] };
  };
  contact: ContactContent;
  // How the site is made, for the readers of its code (ADR 0033).
  behindTheScenes: BehindTheScenesContent;
  accessibility: PageText & { statement: ReactNode };
  legalNotice: PageText & { notice: ReactNode };
  siteMap: PageText & { homeLabel: string };
};
