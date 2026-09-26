import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { StickyChapters } from '@/components/layout/sticky-chapters';
import { chapterHeadingId } from '@/utils/chapter-heading-id';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const CHAPTERS = [
  { id: 'langages', title: 'Langages', content: <p>Contenu A</p> },
  { id: 'formation', title: 'Formation', content: <p>Contenu B</p> },
];

describe('StickyChapters', () => {
  it('gives each chapter its level-3 heading, followed by its content', async () => {
    const screen = await render(<StickyChapters chapters={CHAPTERS} />);

    const headings = screen.getByRole('heading', { level: 3 }).elements();
    expect(headings.map((heading) => heading.textContent)).toEqual(['Langages', 'Formation']);
    expect(headings.map((heading) => heading.id)).toEqual([
      chapterHeadingId('langages'),
      chapterHeadingId('formation'),
    ]);
    await expect.element(screen.getByText('Contenu B')).toBeInTheDocument();
  });

  it('numbers the chapters in a sticky column hidden from assistive tech', async () => {
    const screen = await render(<StickyChapters chapters={CHAPTERS} />);

    const labels = [...screen.container.querySelectorAll('[data-chapter-label]')];
    expect(labels.map((label) => label.textContent)).toEqual([
      '01 / 02Langages',
      '02 / 02Formation',
    ]);
    for (const label of labels) {
      expect(label.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('has no axe violations', async () => {
    const screen = await render(<StickyChapters chapters={CHAPTERS} />);

    await expectNoAxeViolations(screen.container);
  });
});
