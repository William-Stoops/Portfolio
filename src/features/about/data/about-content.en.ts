import { SECTION_IDS } from '@/config/paths';
import { type AboutContent } from '@/features/about/types/about-content';

// Translation of about-content.fr.ts (ADR 0026): the same facts and figures, nothing added.
export const ABOUT_CONTENT = {
  id: SECTION_IDS.en.about,
  title: 'About',
  profile:
    'Software Engineer with 3 years of industry experience. I choose an architecture, I measure it, I ship it. I come from computation and performance, I build full-stack products in TypeScript, and I work every day with agents and LLMs.',
  axes: [
    {
      title: 'Computation & performance',
      description:
        'Implied volatility in C++ across the OPRA options universe, a news service migrated to Rust. Optimizations start from measurement.',
    },
    {
      title: 'Full-stack products',
      description:
        'In TypeScript, from the PostgreSQL schema to the React screens, NestJS back end included, shipped alone or leading a team.',
    },
    {
      title: 'AI, agents & LLMs',
      description:
        'Coding agents and MCP servers every day, OpenAI and Anthropic APIs with function calling and schema-constrained outputs, models trained at Korea University.',
    },
  ],
  metrics: [
    {
      value: '10 h → 5 min',
      spokenValue: 'from 10 hours to 5 minutes',
      label: 'Implied volatility computation cycle, after redesigning the data structure',
      // 5 minutes out of 10 hours.
      visual: { kind: 'reduction', remainingShare: 5 / 600 },
    },
    {
      value: '−99%',
      spokenValue: 'minus 99 percent',
      label: 'Latency on most requests to the news service migrated to Rust',
      visual: { kind: 'reduction', remainingShare: 0.01 },
    },
    { value: '3 years', label: 'Of industry experience', visual: { kind: 'steps', count: 3 } },
    {
      value: '1st',
      spokenValue: 'first',
      label: 'At the Epitech Summit competition with STAXX, pitched to 300 people',
      visual: { kind: 'podium' },
    },
  ],
  labels: { axes: 'Areas of expertise', figures: 'Key figures' },
} as const satisfies AboutContent;
