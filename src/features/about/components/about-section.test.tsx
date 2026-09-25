import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { AboutSection } from '@/features/about/components/about-section';
import { ABOUT_CONTENT } from '@/features/about/data/about-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderAbout() {
  return render(<AboutSection content={ABOUT_CONTENT} />);
}

describe('AboutSection', () => {
  it('is a region named by its heading and reachable by the #a-propos anchor', async () => {
    const screen = await renderAbout();

    const region = screen.getByRole('region', { name: 'À propos' });
    await expect.element(region).toHaveAttribute('id', 'a-propos');
    await expect.element(region.getByRole('heading', { level: 2, name: 'À propos' })).toBeVisible();
  });

  it('states the profile', async () => {
    const screen = await renderAbout();

    await expect.element(screen.getByText(ABOUT_CONTENT.profile)).toBeVisible();
  });

  it('lists the three axes with level-3 headings', async () => {
    const screen = await renderAbout();

    const axes = screen.getByRole('list', { name: 'Axes' });
    expect(
      axes
        .getByRole('heading', { level: 3 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual(ABOUT_CONTENT.axes.map(({ title }) => title));
  });

  it('lists the key figures, spoken in words when symbols would be misread', async () => {
    const screen = await renderAbout();

    const figures = screen.getByRole('list', { name: 'Chiffres clés' });
    const items = figures.getByRole('listitem').elements();
    expect(items).toHaveLength(ABOUT_CONTENT.metrics.length);
    expect(items[0]?.textContent).toMatch(/de 10 heures à 5 minutes/);
  });

  it('hides the symbolic form of a figure from assistive technologies when a spoken form exists', async () => {
    const screen = await renderAbout();

    const symbolic = screen.getByText('10 h → 5 min', { exact: true });
    await expect.element(symbolic).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations', async () => {
    const screen = await renderAbout();

    await expectNoAxeViolations(screen.container);
  });
});
