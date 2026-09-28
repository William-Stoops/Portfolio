import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import * as z from 'zod';

import { SITE_FACTS } from '@/features/behind-the-scenes/data/site-facts';

// The page states what the configuration enforces: each number is read back from the file
// that enforces it, so changing a budget or a threshold fails here until the page says it.
const ROOT = new URL('../../../../', import.meta.url);

function readRepositoryFile(path: string): string {
  return readFileSync(new URL(path, ROOT), 'utf8');
}

const sizeLimitSchema = z.array(z.object({ name: z.string(), limit: z.string() }));

const lighthouseSchema = z.object({
  ci: z.object({
    assert: z.object({
      assertions: z.record(
        z.string(),
        z.tuple([
          z.literal('error'),
          z.object({ minScore: z.number().optional(), maxNumericValue: z.number().optional() }),
        ]),
      ),
    }),
  }),
});

function sizeLimitOf(prefix: string): number {
  const budgets = sizeLimitSchema.parse(JSON.parse(readRepositoryFile('.size-limit.json')));
  const budget = budgets.find(({ name }) => name.startsWith(prefix));
  return Number.parseFloat(budget?.limit ?? 'NaN');
}

function lighthouseAssertion(name: string) {
  const { ci } = lighthouseSchema.parse(JSON.parse(readRepositoryFile('lighthouserc.json')));
  return ci.assert.assertions[name]?.[1] ?? {};
}

describe('SITE_FACTS', () => {
  it('states the budgets size-limit enforces', () => {
    expect(SITE_FACTS.budgets).toEqual({
      initialJs: sizeLimitOf('Initial JS'),
      css: sizeLimitOf('CSS'),
    });
  });

  it('states the thresholds Lighthouse CI enforces', () => {
    const score = (category: string) =>
      Math.round((lighthouseAssertion(`categories:${category}`).minScore ?? Number.NaN) * 100);

    expect(SITE_FACTS.lighthouse).toEqual({
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
      largestContentfulPaintMs: lighthouseAssertion('largest-contentful-paint').maxNumericValue,
      cumulativeLayoutShift: lighthouseAssertion('cumulative-layout-shift').maxNumericValue,
      totalBlockingTimeMs: lighthouseAssertion('total-blocking-time').maxNumericValue,
    });
  });

  it('states the coverage Vitest enforces', () => {
    const thresholds = /thresholds:\s*\{([^}]*)\}/.exec(
      readRepositoryFile('vitest.config.ts'),
    )?.[1];
    const threshold = (metric: string) =>
      Number(new RegExp(`${metric}:\\s*(\\d+)`).exec(thresholds ?? '')?.[1]);

    expect(SITE_FACTS.coverage).toEqual({
      lines: threshold('lines'),
      branches: threshold('branches'),
    });
  });

  it('counts the devices every end-to-end test runs on', () => {
    const projects = /projects:\s*\[([\s\S]*?)\n\s*\],/.exec(
      readRepositoryFile('playwright.config.ts'),
    )?.[1];

    expect(SITE_FACTS.devices).toBe(projects?.match(/\bname: '/g)?.length);
  });

  it('counts the architecture decision records', () => {
    const records = readdirSync(new URL('docs/adr/', ROOT)).filter((file) =>
      /^\d{4}-.+\.md$/.test(file),
    );

    expect(SITE_FACTS.decisions).toBe(records.length);
  });
});
