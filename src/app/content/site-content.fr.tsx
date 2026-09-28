import { type SiteContent } from '@/app/content/site-content';
import { SECTION_IDS } from '@/config/paths';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content.fr';
import { BEHIND_THE_SCENES } from '@/features/behind-the-scenes/data/behind-the-scenes.fr';
import { CONTACT_CONTENT } from '@/features/contact/data/contact-content.fr';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries.fr';
import { CYCLE_RACE } from '@/features/experience/data/cycle-race.fr';
import { EXPERIENCE_LABELS, EXPERIENCES } from '@/features/experience/data/experiences.fr';
import { INTM_RECOMMENDATION } from '@/features/experience/data/recommendation.fr';
import { VOLATILITY_LAB } from '@/features/experience/data/volatility-lab.fr';
import { HERO_CONTENT } from '@/features/hero/data/hero-content.fr';
import { JOURNEY_CONTENT } from '@/features/journey/data/journey-stops.fr';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.fr';
import { AccessibilityStatement } from '@/features/legal/components/accessibility-statement.fr';
import { LegalNotice } from '@/features/legal/components/legal-notice.fr';
import { PROJECT_LABELS, PROJECTS } from '@/features/projects/data/projects.fr';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups.fr';

// The French site: the CV's own language (docs/content/cv-source.md).
export const SITE_CONTENT: SiteContent = {
  home: {
    description:
      'William Stoops, Software Engineer & AI Engineer : systèmes de calcul en C++ et Rust, produits full stack en TypeScript, agents et LLM au quotidien.',
  },
  hero: HERO_CONTENT,
  journey: JOURNEY_CONTENT,
  experiences: {
    entries: EXPERIENCES,
    labels: EXPERIENCE_LABELS,
    lab: VOLATILITY_LAB,
    race: CYCLE_RACE,
    recommendation: INTM_RECOMMENDATION,
  },
  korea: KOREA_CONTENT,
  projects: { entries: PROJECTS, labels: PROJECT_LABELS },
  aiPractice: AI_PRACTICE_CONTENT,
  skills: {
    id: SECTION_IDS.fr.skills,
    title: 'Compétences et formation',
    groups: SKILL_GROUPS,
    education: { title: 'Formation', entries: EDUCATION_ENTRIES },
  },
  contact: CONTACT_CONTENT,
  behindTheScenes: BEHIND_THE_SCENES,
  accessibility: {
    title: 'Déclaration d’accessibilité',
    description:
      'Déclaration d’accessibilité du site de William Stoops : niveau visé, vérifications réalisées, contact.',
    statement: <AccessibilityStatement />,
  },
  legalNotice: {
    title: 'Mentions légales',
    description:
      'Mentions légales du site de William Stoops : éditeur, hébergement, données personnelles.',
    notice: <LegalNotice />,
  },
  siteMap: {
    title: 'Plan du site',
    description: 'Plan du site de William Stoops : toutes les pages et les sections de l’accueil.',
    homeLabel: 'Accueil',
  },
};
