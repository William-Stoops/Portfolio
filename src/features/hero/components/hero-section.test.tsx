import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { HeroSection } from '@/features/hero/components/hero-section';
import { HERO_CONTENT } from '@/features/hero/data/hero-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderHero() {
  return render(<HeroSection content={HERO_CONTENT} headingRef={createRef()} />);
}

describe('HeroSection', () => {
  it('greets the visitor and names William Stoops as the page heading', async () => {
    const screen = await renderHero();

    await expect.element(screen.getByText('Bonjour.')).toBeVisible();
    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'William Stoops' }))
      .toBeVisible();
  });

  it('exposes the heading to route focus management', async () => {
    const headingRef = createRef<HTMLHeadingElement>();
    const screen = await render(<HeroSection content={HERO_CONTENT} headingRef={headingRef} />);

    expect(headingRef.current).toBe(screen.getByRole('heading', { level: 1 }).element());
    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAttribute('tabindex', '-1');
  });

  it('marks the English job title and states the profile', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByText('Software Engineer & AI Engineer'))
      .toHaveAttribute('lang', 'en');
    await expect.element(screen.getByText(HERO_CONTENT.tagline)).toBeVisible();
  });

  it('offers to get in touch by e-mail', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByRole('link', { name: 'Me contacter' }))
      .toHaveAttribute('href', 'mailto:william.stoops@epitech.eu');
  });

  it('offers the CV as a download, stating format and weight', async () => {
    const screen = await renderHero();

    const link = screen.getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' });
    await expect.element(link).toHaveAttribute('href', '/cv/william-stoops-cv-fr.pdf');
    await expect.element(link).toHaveAttribute('download');
  });

  it('lists the core technologies', async () => {
    const screen = await renderHero();

    const list = screen.getByRole('list', { name: 'Technologies' });
    expect(list.getByRole('listitem').elements()).toHaveLength(HERO_CONTENT.technologies.length);
  });

  it('shows the portrait as a critical image', async () => {
    const screen = await renderHero();

    const portrait = screen.getByRole('img', { name: HERO_CONTENT.portraitAlt });
    await expect.element(portrait).toHaveAttribute('fetchpriority', 'high');
  });

  it('has no axe violations', async () => {
    const screen = await renderHero();

    await expectNoAxeViolations(screen.container);
  });
});
