import { type SiteFacts } from '@/features/behind-the-scenes/types/site-facts';

// Copied from the configuration that enforces each number, and read back from it by
// site-facts.test.ts: a budget or a threshold cannot change without the page saying so.
export const SITE_FACTS = {
  budgets: { initialJs: 125, css: 15 },
  lighthouse: {
    performance: 95,
    accessibility: 100,
    bestPractices: 95,
    seo: 95,
    largestContentfulPaintMs: 2000,
    cumulativeLayoutShift: 0.05,
    totalBlockingTimeMs: 150,
  },
  coverage: { lines: 90, branches: 85 },
  devices: 5,
  decisions: 34,
} as const satisfies SiteFacts;
