import { CV_FILE, SITE_OWNER, SITE_ROLE, SITE_TAGLINE } from '@/config/site';
import { HERO_KEYWORDS } from '@/features/hero/data/hero-keywords';
import { type HeroContent } from '@/features/hero/types/hero-content';

// Source: docs/content/cv-source.md (identity, profile, IT-Finance, header keywords). The
// portrait is the one William gave on 2026-09-28.
export const HERO_CONTENT = {
  eyebrow: `${SITE_ROLE} · Paris`,
  ownerPrefix: `${SITE_OWNER} : `,
  headline: SITE_TAGLINE.fr,
  lead: 'Je viens du calcul et de la performance, je construis des produits full stack en TypeScript, et je travaille tous les jours avec des agents et des LLM.',
  actions: {
    contact: 'Me contacter',
    downloadCv: 'Télécharger le CV',
    cvDetails: CV_FILE.details.fr,
  },
  place: 'Basé à Paris · ouvert à Lille ou en full remote',
  proof: {
    context: 'IT-Finance · calcul de volatilité implicite',
    before: '10 h',
    after: '5 min',
    link: 'Voir le calcul',
  },
  keywordsLabel: 'Technologies',
  keywords: HERO_KEYWORDS,
  portraitAlt: 'Portrait de William Stoops, en veste sombre, dans la lumière du soleil',
} as const satisfies HeroContent;
