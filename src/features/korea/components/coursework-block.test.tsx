import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { CourseworkBlock } from '@/features/korea/components/coursework-block';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.fr';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const { coursework } = KOREA_CONTENT;

async function renderBlock() {
  await page.viewport(1280, 900);
  return render(
    <div className="@container">
      <CourseworkBlock coursework={coursework} />
    </div>,
  );
}

describe('CourseworkBlock', () => {
  it('tells what the year taught, under its own heading', async () => {
    const screen = await renderBlock();

    await expect
      .element(screen.getByRole('heading', { level: 4, name: 'Ce que j’y ai appris' }))
      .toBeVisible();
    await expect.element(screen.getByText(coursework.lead)).toBeVisible();
    expect(
      screen
        .getByRole('heading', { level: 5 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual(['Les mathématiques', 'L’apprentissage', 'Les architectures']);
  });

  it('lists the linear algebra, on its textbook', async () => {
    const screen = await renderBlock();

    await expect.element(screen.getByText(coursework.mathematics.source)).toBeVisible();
    expect(
      screen
        .getByRole('list', { name: 'Algèbre linéaire' })
        .getByRole('listitem')
        .elements()
        .map((item) => item.textContent),
    ).toEqual(coursework.mathematics.topics);
  });

  it('explains each way of learning', async () => {
    const screen = await renderBlock();

    const terms = [...screen.container.querySelectorAll('dt')].map((term) => [
      term.textContent,
      term.nextElementSibling?.textContent,
    ]);
    expect(terms).toEqual(coursework.learning.topics.map(({ name, detail }) => [name, detail]));
  });

  it('orders the architectures from the perceptron to the Transformer', async () => {
    const screen = await renderBlock();

    const lineage = screen.getByRole('list', { name: 'Les architectures' }).element();
    expect(lineage.tagName).toBe('OL');
    expect([...lineage.querySelectorAll('li strong')].map((name) => name.textContent)).toEqual([
      'MLP',
      'CNN',
      'RNN',
      'LSTM',
      'Transformer',
    ]);
  });

  it('draws a network as decoration, and says the way forward and the way back', async () => {
    const screen = await renderBlock();

    const drawing = screen.container.querySelector('svg[data-network]');
    expect(drawing?.getAttribute('aria-hidden')).toBe('true');
    expect(drawing?.querySelectorAll('circle[data-neuron]')).toHaveLength(15);
    await expect.element(screen.getByText(coursework.propagation.forward)).toBeVisible();
    await expect.element(screen.getByText(coursework.propagation.backward)).toBeVisible();
  });

  it('says the two passes in words only, without equations', async () => {
    const screen = await renderBlock();

    expect(screen.container.querySelector('[data-equation]')).toBeNull();
    expect(screen.container.querySelector('figcaption')?.textContent).not.toContain('σ');
  });

  it('has no axe violations', async () => {
    const screen = await renderBlock();

    await expectNoAxeViolations(screen.container);
  });
});
