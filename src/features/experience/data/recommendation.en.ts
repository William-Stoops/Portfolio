import { type Recommendation } from '@/features/experience/types/recommendation';

// Translates the French recommendation (recommendation.fr.ts), and says so.
export const INTM_RECOMMENDATION = {
  paragraphs: [
    'I am happy to recommend William Stoops, who did an internship at INTM Group. I had the pleasure of working with him on React development assignments, and although I officially had a mentoring role, it was clear from the start that William already had a solid technical background and great autonomy.',
    'William stood out for his curiosity and his will to learn. He approached every challenge with enthusiasm and always sought to deepen his knowledge and skills. His autonomy and motivation were obvious, making our collaboration both productive and rewarding.',
    'I am convinced that William will keep excelling in his career, and I warmly recommend him to any team looking for a talented and motivated developer. His drive and thirst for learning are major assets for any project.',
  ],
  author: 'Paul Plancq',
  authorRole: 'Senior Consultant Craft at HoppR',
  relationship: 'William’s mentor at INTM Group',
  source: 'LinkedIn recommendation, 27 June 2025',
  translationNote: 'Translated from French',
} as const satisfies Recommendation;
