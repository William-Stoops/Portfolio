import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ChapterRows } from '@/components/layout/chapter-rows';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const ROWS = [
  { id: 'agents', title: 'Agents et MCP', content: <p>Contenu A</p> },
  { id: 'langages', title: 'Langages', headingId: 'langages-titre', content: <p>Contenu B</p> },
];

describe('ChapterRows', () => {
  it('gives each chapter a level-3 heading, followed by its content', async () => {
    const screen = await render(<ChapterRows rows={ROWS} />);

    await expect
      .element(screen.getByRole('heading', { level: 3, name: 'Langages' }))
      .toHaveAttribute('id', 'langages-titre');
    await expect.element(screen.getByText('Contenu A')).toBeVisible();
    expect(screen.getByRole('listitem').elements()).toHaveLength(2);
  });

  it('numbers the chapters as decoration, off the flight path', async () => {
    const screen = await render(<ChapterRows rows={ROWS} />);

    const numbers = screen
      .getByRole('listitem')
      .elements()
      .map((row) => row.querySelector('header p[aria-hidden="true"]')?.textContent);
    expect(numbers).toEqual(['01', '02']);
    expect(screen.container.querySelector('[data-stop-marker]')).toBeNull();
  });

  it('has no axe violations', async () => {
    const screen = await render(<ChapterRows rows={ROWS} />);

    await expectNoAxeViolations(screen.container);
  });
});
