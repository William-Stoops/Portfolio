import { type SiteContent } from '@/app/content/site-content';
import { SECTION_IDS } from '@/config/paths';
import { ABOUT_CONTENT } from '@/features/about/data/about-content.en';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content.en';
import { CONTACT_CONTENT } from '@/features/contact/data/contact-content.en';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries.en';
import { EXPERIENCE_LABELS, EXPERIENCES } from '@/features/experience/data/experiences.en';
import { HERO_CONTENT } from '@/features/hero/data/hero-content.en';
import { JOURNEY_CONTENT } from '@/features/journey/data/journey-stops.en';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.en';
import { AccessibilityStatement } from '@/features/legal/components/accessibility-statement.en';
import { LegalNotice } from '@/features/legal/components/legal-notice.en';
import { PROJECT_LABELS, PROJECTS } from '@/features/projects/data/projects.en';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups.en';

// The English site: a translation of the French one, nothing added (ADR 0026).
export const SITE_CONTENT: SiteContent = {
  home: {
    description:
      'William Stoops, Software Engineer & AI Engineer: computation systems in C++ and Rust, full-stack products in TypeScript, agents and LLMs every day.',
  },
  hero: HERO_CONTENT,
  about: ABOUT_CONTENT,
  journey: JOURNEY_CONTENT,
  experiences: { entries: EXPERIENCES, labels: EXPERIENCE_LABELS },
  korea: KOREA_CONTENT,
  projects: { entries: PROJECTS, labels: PROJECT_LABELS },
  aiPractice: AI_PRACTICE_CONTENT,
  skills: {
    id: SECTION_IDS.en.skills,
    title: 'Skills and education',
    groups: SKILL_GROUPS,
    education: { title: 'Education', entries: EDUCATION_ENTRIES },
  },
  contact: CONTACT_CONTENT,
  accessibility: {
    title: 'Accessibility statement',
    description:
      'Accessibility statement of William Stoops’s website: target level, checks carried out, contact.',
    statement: <AccessibilityStatement />,
  },
  legalNotice: {
    title: 'Legal notice',
    description: 'Legal notice of William Stoops’s website: publisher, hosting, personal data.',
    notice: <LegalNotice />,
  },
  siteMap: {
    title: 'Site map',
    description: 'Site map of William Stoops’s website: every page and every home section.',
    homeLabel: 'Home',
  },
};
