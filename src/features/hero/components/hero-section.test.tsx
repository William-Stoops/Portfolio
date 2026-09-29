import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { HeroSection } from '@/features/hero/components/hero-section';
import { HERO_CONTENT as HERO_CONTENT_EN } from '@/features/hero/data/hero-content.en';
import { HERO_CONTENT } from '@/features/hero/data/hero-content.fr';
import { type HeroContent } from '@/features/hero/types/hero-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderHero(content: HeroContent = HERO_CONTENT) {
  return render(
    <HeroSection
      content={content}
      headingRef={createRef()}
      contactHref="/fr#contact"
      proofHref="#it-finance-prorealtime"
    />,
  );
}

describe('HeroSection', () => {
  it('heads the page with the sentence of the CV, and says whose it is', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAccessibleName(`William Stoops : ${HERO_CONTENT.headline}`);
    await expect.element(screen.getByText(HERO_CONTENT.lead)).toBeVisible();
    await expect.element(screen.getByText(HERO_CONTENT.eyebrow)).toBeVisible();
  });

  it('exposes the heading to route focus management', async () => {
    const headingRef = createRef<HTMLHeadingElement>();
    const screen = await render(
      <HeroSection
        content={HERO_CONTENT}
        headingRef={headingRef}
        contactHref="/fr#contact"
        proofHref="#it-finance-prorealtime"
      />,
    );

    expect(headingRef.current).toBe(screen.getByRole('heading', { level: 1 }).element());
    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAttribute('tabindex', '-1');
  });

  it('offers to get in touch and to download the CV, with its format and weight', async () => {
    const screen = await renderHero();

    await expect
      .element(screen.getByRole('link', { name: 'Me contacter' }))
      .toHaveAttribute('href', '/fr#contact');
    const cv = screen.getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' });
    await expect.element(cv).toHaveAttribute('href', '/cv/william-stoops-cv-fr.pdf');
    await expect.element(cv).toHaveAttribute('download');
  });

  it('shows the photo large, first, as the image the page is judged on', async () => {
    await page.viewport(1280, 800);
    const screen = await renderHero();

    const photo = screen.getByRole('img', { name: HERO_CONTENT.portraitAlt });
    await expect.element(photo).toBeVisible();
    await expect.element(photo).toHaveAttribute('loading', 'eager');
    await expect.element(photo).toHaveAttribute('fetchpriority', 'high');
    expect(photo.element().getBoundingClientRect().height).toBeGreaterThan(450);
  });

  it('keeps the photo clear of any card but the proof', async () => {
    const screen = await renderHero();

    await expect.element(screen.getByText(/Basé à Paris/)).not.toBeInTheDocument();
  });

  it('leads to the IT-Finance rework with its figure', async () => {
    const screen = await renderHero();

    const proof = screen.getByRole('link', { name: /Voir le calcul/ });
    await expect.element(proof).toHaveAttribute('href', '#it-finance-prorealtime');
    expect(proof.element().textContent).toContain('10 h → 5 min');
  });

  it('lists the keywords of the CV', async () => {
    const screen = await renderHero();

    expect(
      screen
        .getByRole('list', { name: 'Technologies' })
        .getByRole('listitem')
        .elements()
        .map((item) => item.textContent),
    ).toEqual(HERO_CONTENT.keywords);
  });

  it('speaks English on the English page', async () => {
    const screen = await renderHero(HERO_CONTENT_EN);

    await expect
      .element(screen.getByRole('heading', { level: 1 }))
      .toHaveAccessibleName(`William Stoops: ${HERO_CONTENT_EN.headline}`);
    await expect.element(screen.getByRole('link', { name: 'Get in touch' })).toBeVisible();
    await expect
      .element(screen.getByRole('link', { name: 'Download my CV (PDF in French, 56 KB)' }))
      .toBeVisible();
    await expect.element(screen.getByRole('link', { name: /See the computation/ })).toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await renderHero();

    await expectNoAxeViolations(screen.container);
  });
});
