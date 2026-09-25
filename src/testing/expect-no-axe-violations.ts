import axe from 'axe-core';
import { expect } from 'vitest';

// Runs in real Chromium (Vitest browser mode), so layout-dependent rules such as
// colour-contrast and target-size are meaningful here, unlike in jsdom.
export async function expectNoAxeViolations(container: HTMLElement): Promise<void> {
  const { violations } = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  });

  const report = violations.map(
    (violation) =>
      `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
  );

  expect(report).toEqual([]);
}
