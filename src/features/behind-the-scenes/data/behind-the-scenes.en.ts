import { SITE_FACTS } from '@/features/behind-the-scenes/data/site-facts';
import { type BehindTheScenesContent } from '@/features/behind-the-scenes/types/behind-the-scenes-content';
import { NEW_TAB_HINT } from '@/i18n/common-messages';
import { INTL_LOCALES } from '@/i18n/locales';
import { formatNumber } from '@/utils/format-number';

function number(value: number): string {
  return formatNumber(value, 'en');
}

const SCORE = new Intl.NumberFormat(INTL_LOCALES.en, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

// Translates the French page (behind-the-scenes.fr.ts), without adding anything.
export const BEHIND_THE_SCENES = {
  title: 'Behind the scenes',
  description:
    'How William Stoops’s site is built: live measurements, the checks of its CI, its architecture decisions and its public code.',
  intro:
    'This site is part of my application as much as its content is. Its code, its tests and its decisions are public: here is how it is built, and what keeps it from getting worse.',
  repository: 'See the code on GitHub',
  newTab: NEW_TAB_HINT.en,
  vitals: {
    title: 'Measured just now, in your browser',
    intro:
      'These figures do not come from a lab: your browser measured them as it loaded this site.',
    labels: {
      firstContentfulPaint: 'First contentful paint',
      largestContentfulPaint: 'Largest contentful paint',
      cumulativeLayoutShift: 'Layout shift',
      javascriptBytes: 'JavaScript downloaded, compressed',
      requests: 'Files requested',
    },
    thresholds: {
      largestContentfulPaint: `CI threshold: ${number(SITE_FACTS.lighthouse.largestContentfulPaintMs)} ms`,
      cumulativeLayoutShift: `CI threshold: ${SCORE.format(SITE_FACTS.lighthouse.cumulativeLayoutShift)}`,
    },
    pending: 'Measuring',
    unsupported: 'Not measured by this browser',
    format: {
      milliseconds: (value) => `${number(Math.round(value))} ms`,
      score: (value) => SCORE.format(value),
      kilobytes: (bytes) => `${number(Math.round(bytes / 1000))} KB`,
      count: (value) => number(value),
    },
  },
  gates: {
    title: 'What the CI turns down',
    intro:
      'Every change goes through a pull request, and the CI blocks it if any of these checks fails.',
    items: [
      {
        title: 'A loose type',
        text: 'Strict TypeScript: no “any”, no “unknown”, no type assertion. Whatever comes from outside (address, storage, form) goes through a Zod schema.',
      },
      {
        title: 'A warning',
        text: 'Oxlint then type-aware ESLint, without a single warning. The feature architecture and the direction of imports are enforced by the lint.',
      },
      {
        title: 'Dead code',
        text: 'Knip on the whole repository, then on the shipped code alone: no unused file, export or dependency.',
      },
      {
        title: 'A regression',
        text: `Unit tests in Node, components in a real Chromium, Playwright journeys on ${number(SITE_FACTS.devices)} devices. At least ${number(SITE_FACTS.coverage.lines)}% of lines and ${number(SITE_FACTS.coverage.branches)}% of branches covered.`,
      },
      {
        title: 'An accessibility barrier',
        text: `axe on every page, in both themes (WCAG 2.2 AA), and a Lighthouse accessibility score of ${number(SITE_FACTS.lighthouse.accessibility)}.`,
      },
      {
        title: 'Extra weight',
        text: `Initial JavaScript under ${number(SITE_FACTS.budgets.initialJs)} KB and CSS under ${number(SITE_FACTS.budgets.css)} KB, compressed. Lighthouse: performance of at least ${number(SITE_FACTS.lighthouse.performance)}, largest paint under ${number(SITE_FACTS.lighthouse.largestContentfulPaintMs / 1000)} s, blocking under ${number(SITE_FACTS.lighthouse.totalBlockingTimeMs)} ms.`,
      },
    ],
  },
  decisions: {
    title: 'The decisions',
    text: `${number(SITE_FACTS.decisions)} architecture decisions, each with its context, its choice and the alternatives it turned down. Among them:`,
    highlights: [
      'prerender every page at build time, so the content shows without waiting for JavaScript;',
      'animate in native CSS, on the compositor, without a library;',
      'put the language in the address, one page per language;',
      'race the two computing cycles to scale, rather than fake a computation.',
    ],
    link: 'Read the decisions on GitHub (in French)',
  },
} as const satisfies BehindTheScenesContent;
