import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { AboutSection } from '@/features/about/components/about-section';
import { ABOUT_CONTENT as ABOUT_CONTENT_EN } from '@/features/about/data/about-content.en';
import { ABOUT_CONTENT } from '@/features/about/data/about-content.fr';
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

  it('sets the profile word by word, so each word can be inked in as it is read', async () => {
    const screen = await renderAbout();

    const profile = screen.getByText(ABOUT_CONTENT.profile).element();
    const words = Array.from(profile.querySelectorAll('[data-word]'), (word) => word.textContent);
    expect(words.join(' ')).toBe(ABOUT_CONTENT.profile);
  });

  it('lists the three axes with level-3 headings', async () => {
    const screen = await renderAbout();

    const axes = screen.getByRole('list', { name: 'Domaines d’expertise' });
    expect(
      axes
        .getByRole('heading', { level: 3 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual(ABOUT_CONTENT.axes.map(({ title }) => title));
  });

  it('holds no ledger of key figures: the page proves them where they happened', async () => {
    const screen = await renderAbout();

    expect(screen.getByRole('list', { name: 'Chiffres clés' }).elements()).toHaveLength(0);
    expect(screen.container.querySelector('[data-visual]')).toBeNull();
  });

  it('has no axe violations', async () => {
    const screen = await renderAbout();

    await expectNoAxeViolations(screen.container);
  });

  it('draws the English section from English content, under its English anchor', async () => {
    const screen = await render(<AboutSection content={ABOUT_CONTENT_EN} />);

    const region = screen.getByRole('region', { name: 'About' });
    await expect.element(region).toHaveAttribute('id', 'about');
    await expect.element(screen.getByRole('list', { name: 'Areas of expertise' })).toBeVisible();
  });
});
