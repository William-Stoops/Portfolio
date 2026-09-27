import { PAGE_PATHS, SECTION_IDS } from '@/config/paths';
import { CV_FILE, SITE_ROLE, SITE_TAGLINE } from '@/config/site';
import { HERO_TECHNOLOGIES } from '@/features/hero/data/hero-technologies';
import { type HeroContent } from '@/features/hero/types/hero-content';

// Translation of hero-content.fr.ts (ADR 0026): the same facts, nothing added.
export const HERO_CONTENT = {
  greeting: 'Hello',
  role: SITE_ROLE,
  tagline: SITE_TAGLINE.en,
  contact: { label: 'Get in touch', href: `${PAGE_PATHS.en.home}#${SECTION_IDS.en.contact}` },
  cv: { label: 'Download my CV', details: CV_FILE.details.en, href: CV_FILE.href },
  technologies: HERO_TECHNOLOGIES,
  highlights: [
    { value: '1st', label: 'at the Epitech Summit competition' },
    { value: 'C++ · Rust · TS', label: 'from computation to product' },
    { value: 'Agents & LLMs', label: 'every day' },
  ],
  portraitAlt: 'William Stoops, smiling, on stage',
  labels: {
    highlights: 'At a glance',
    technologies: 'Technologies',
    stack: 'Stack',
    pauseBand: 'Pause the scrolling',
    resumeBand: 'Resume the scrolling',
  },
} as const satisfies HeroContent;
