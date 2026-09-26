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

    const role = screen.container.querySelector('[lang="en"]');
    expect(role?.querySelector('.sr-only')?.textContent).toBe('Software Engineer & AI Engineer');
    expect(role?.querySelector('[data-scramble]')?.getAttribute('aria-hidden')).toBe('true');
    await expect.element(screen.getByText(HERO_CONTENT.tagline)).toBeVisible();
  });

  it('leads to the contact section', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByRole('link', { name: 'Me contacter' }))
      .toHaveAttribute('href', '/#contact');
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

  it('lets the visitor pause the scrolling technology band (WCAG 2.2.2)', async () => {
    const screen = await renderHero();

    await screen.getByRole('button', { name: 'Mettre en pause le défilement' }).click();

    await expect
      .element(screen.getByRole('button', { name: 'Reprendre le défilement' }))
      .toBeVisible();
    expect(
      screen.getByRole('list', { name: 'Technologies' }).element().closest('[data-paused]'),
    ).not.toBeNull();
  });

  it('keeps the band copy that makes the loop seamless away from assistive tech', async () => {
    const screen = await renderHero();

    expect(screen.getByRole('list', { name: 'Technologies' }).elements()).toHaveLength(1);
    expect(screen.container.querySelectorAll('[data-marquee] ul')).toHaveLength(2);
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
