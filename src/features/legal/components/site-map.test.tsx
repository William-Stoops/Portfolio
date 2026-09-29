import { describe, expect, it } from 'vitest';

import { FOOTER_LINKS, NAV_ITEMS } from '@/config/navigation';
import { SiteMap } from '@/features/legal/components/site-map';
import { type Locale } from '@/i18n/locales';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

function renderSiteMap(locale: Locale = 'fr') {
  const home = locale === 'fr' ? { label: 'Accueil', path: '/fr' } : { label: 'Home', path: '/en' };
  return renderInRouter(
    <SiteMap home={home} sections={NAV_ITEMS[locale]} pages={FOOTER_LINKS[locale]} />,
    { locale },
  );
}

describe('SiteMap', () => {
  it('lists the home page with every section of the main navigation', async () => {
    const screen = await renderSiteMap();

    await expect
      .element(screen.getByRole('link', { name: 'Accueil' }))
      .toHaveAttribute('href', '/fr');
    for (const { label, href } of NAV_ITEMS.fr) {
      expect(
        screen.getByRole('link', { name: label, exact: true }).element().getAttribute('href'),
      ).toBe(href);
    }
  });

  it('lists every other page of the site', async () => {
    const screen = await renderSiteMap();

    for (const { label, path } of FOOTER_LINKS.fr) {
      expect(
        screen.getByRole('link', { name: label, exact: true }).element().getAttribute('href'),
      ).toBe(path);
    }
  });

  it('maps the English site with the English pages', async () => {
    const screen = await renderSiteMap('en');

    await expect.element(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en');
    await expect
      .element(screen.getByRole('link', { name: 'Legal notice' }))
      .toHaveAttribute('href', '/en/legal-notice');
  });

  it('has no axe violations', async () => {
    const screen = await renderSiteMap();

    await expectNoAxeViolations(screen.container);
  });
});
