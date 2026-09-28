import { PAGE_PATHS, SECTION_IDS } from '@/config/paths';
import { CV_FILE, SITE_ROLE, SITE_TAGLINE } from '@/config/site';
import { HERO_TECHNOLOGIES } from '@/features/hero/data/hero-technologies';
import { type HeroContent } from '@/features/hero/types/hero-content';

// Source: docs/content/cv-source.md (identity, profile, header keywords).
export const HERO_CONTENT = {
  greeting: 'Bonjour',
  role: SITE_ROLE,
  tagline: SITE_TAGLINE.fr,
  contact: { label: 'Me contacter', href: `${PAGE_PATHS.fr.home}#${SECTION_IDS.fr.contact}` },
  cv: { label: 'Télécharger le CV', details: CV_FILE.details.fr, href: CV_FILE.href },
  technologies: HERO_TECHNOLOGIES,
  // "du calcul au produit": C++ and Rust for the computing work, TypeScript for the
  // full-stack products, as the CV's three roles show.
  highlights: [
    { value: '1er', label: 'au concours Epitech Summit' },
    { value: 'C++ · Rust · TS', label: 'du calcul au produit' },
    { value: 'Agents & LLM', label: 'au quotidien' },
  ],
  portraitAlt: 'William Stoops, souriant, sur scène',
  labels: {
    highlights: 'En bref',
    technologies: 'Technologies',
    stack: 'Stack',
    pauseBand: 'Mettre en pause le défilement',
    resumeBand: 'Reprendre le défilement',
  },
} as const satisfies HeroContent;
