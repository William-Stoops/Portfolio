import { describe, expect, it } from 'vitest';

import { LanguageSwitch } from '@/components/layout/language-switch';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

describe('LanguageSwitch', () => {
  it('links to the same page in English, named in English, from a French page', async () => {
    const screen = await renderInRouter(<LanguageSwitch />, { path: '/fr/plan-du-site' });

    const link = screen.getByRole('link', { name: 'English' });
    await expect.element(link).toHaveAttribute('href', '/en/site-map');
    await expect.element(link).toHaveAttribute('hreflang', 'en');
    await expect.element(link).toHaveAttribute('lang', 'en');
  });

  it('links back to French from an English page', async () => {
    const screen = await renderInRouter(<LanguageSwitch />, { path: '/en', locale: 'en' });

    const link = screen.getByRole('link', { name: 'Français' });
    await expect.element(link).toHaveAttribute('href', '/fr');
    await expect.element(link).toHaveAttribute('lang', 'fr');
  });

  it('offers a touch target of at least 44 px high', async () => {
    const screen = await renderInRouter(<LanguageSwitch />, { path: '/fr' });

    const { height } = screen.getByRole('link').element().getBoundingClientRect();
    expect(height).toBeGreaterThanOrEqual(44);
  });

  it('has no axe violations', async () => {
    const screen = await renderInRouter(<LanguageSwitch />, { path: '/fr' });

    await expectNoAxeViolations(screen.container);
  });
});
