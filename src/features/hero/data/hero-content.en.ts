import { CV_FILE, SITE_OWNER, SITE_ROLE, SITE_TAGLINE } from '@/config/site';
import { HERO_KEYWORDS } from '@/features/hero/data/hero-keywords';
import { type HeroContent } from '@/features/hero/types/hero-content';

// Translation of hero-content.fr.ts (ADR 0026): the same facts, nothing added.
export const HERO_CONTENT = {
  eyebrow: `${SITE_ROLE} · Paris`,
  ownerPrefix: `${SITE_OWNER}: `,
  headline: SITE_TAGLINE.en,
  lead: 'I come from computing and performance, I build full stack products in TypeScript, and I work with agents and LLMs every day.',
  actions: {
    contact: 'Get in touch',
    downloadCv: 'Download my CV',
    cvDetails: CV_FILE.details.en,
  },
  proof: {
    context: 'IT-Finance · implied volatility computation',
    before: '10 h',
    after: '5 min',
    link: 'See the computation',
  },
  keywordsLabel: 'Technologies',
  keywords: HERO_KEYWORDS,
  portraitAlt: 'Portrait of William Stoops in a dark jacket, in the sunlight',
} as const satisfies HeroContent;
