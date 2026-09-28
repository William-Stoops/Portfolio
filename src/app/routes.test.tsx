import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { type SiteContent } from '@/app/content/site-content';
import { SiteContentContext } from '@/app/content/site-content-context';
import { SITE_CONTENT as SITE_CONTENT_EN } from '@/app/content/site-content.en';
import { SITE_CONTENT as SITE_CONTENT_FR } from '@/app/content/site-content.fr';
import { ROUTES } from '@/app/routes';
import { LocaleContext } from '@/i18n/locale-context';
import { type Locale, type Localized } from '@/i18n/locales';
import { localeFromPathname } from '@/i18n/locale-from-pathname';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const SITE_CONTENTS: Localized<SiteContent> = { fr: SITE_CONTENT_FR, en: SITE_CONTENT_EN };

// The page as main.tsx boots it: the locale of its path, that locale's content.
function renderSite(path: string) {
  const locale: Locale = localeFromPathname(path) ?? 'fr';
  const router = createMemoryRouter(ROUTES, { initialEntries: [path] });
  return render(
    <LocaleContext value={locale}>
      <SiteContentContext value={SITE_CONTENTS[locale]}>
        <RouterProvider router={router} />
      </SiteContentContext>
    </LocaleContext>,
  );
}

// The roles a stop of the journey tells, by their headings.
function rolesIn(stopId: string): (string | null)[] {
  return [...(document.getElementById(stopId)?.querySelectorAll('article h4') ?? [])].map(
    (heading) => heading.textContent,
  );
}

describe('application routes', () => {
  it('renders the page shell landmarks in reading order', async () => {
    const screen = await renderSite('/fr');

    const [banner, main, footer] = [
      screen.getByRole('banner').element(),
      screen.getByRole('main').element(),
      screen.getByRole('contentinfo').element(),
    ];
    expect(banner.compareDocumentPosition(main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(main.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('starts with the skip link as the first link of the page', async () => {
    const screen = await renderSite('/fr');

    await expect
      .element(screen.getByRole('link').first())
      .toHaveAccessibleName('Aller au contenu principal');
  });

  it('renders the home page with its title, its description and its heading', async () => {
    const screen = await renderSite('/fr');

    await expect
      .element(screen.getByRole('heading', { level: 1, name: /^William Stoops : Je décide/ }))
      .toBeVisible();
    await expect
      .poll(() => document.title)
      .toBe('William Stoops – Software Engineer & AI Engineer');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      SITE_CONTENT_FR.home.description,
    );
  });

  it('tells each role in its year: GDS Élec in 2022, then Strattt before INTM in 2023', async () => {
    await renderSite('/fr');

    await expect.poll(() => rolesIn('annee-2022')).toEqual(['Full Stack Engineer, GDS Élec']);
    expect(rolesIn('annee-2023')).toEqual([
      'Full Stack Engineer, Strattt',
      'Full Stack Engineer, INTM Groupe',
    ]);
  });

  it('renders the English home page from the English content', async () => {
    const screen = await renderSite('/en');

    await expect
      .element(screen.getByRole('heading', { level: 1, name: /^William Stoops: I choose/ }))
      .toBeVisible();
    await expect
      .element(screen.getByRole('region', { name: 'Journey' }))
      .toHaveAttribute('id', 'journey');
  });

  it('renders a not-found page for unknown URLs, in the locale of the address', async () => {
    const french = await renderSite('/fr/page-inexistante');

    await expect
      .element(french.getByRole('heading', { level: 1, name: 'Page introuvable' }))
      .toBeVisible();
    await expect.poll(() => document.title).toBe('Page introuvable – William Stoops');
    await french.unmount();

    const english = await renderSite('/en/nowhere');
    await expect
      .element(english.getByRole('heading', { level: 1, name: 'Page not found' }))
      .toBeVisible();
  });

  it('answers an address outside every locale with the French not-found page', async () => {
    const screen = await renderSite('/nulle-part');

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Page introuvable' }))
      .toBeVisible();
  });

  it('brings the visitor back home from the not-found page with focus on the heading', async () => {
    const screen = await renderSite('/fr/page-inexistante');

    await screen
      .getByRole('navigation', { name: 'Autres destinations' })
      .getByRole('link', { name: 'Accueil' })
      .click();

    await expect
      .element(screen.getByRole('heading', { level: 1, name: /^William Stoops : Je décide/ }))
      .toHaveFocus();
  });

  for (const { path, heading } of [
    { path: '/fr/coulisses', heading: 'Les coulisses du site' },
    { path: '/fr/mentions-legales', heading: 'Mentions légales' },
    { path: '/fr/plan-du-site', heading: 'Plan du site' },
    { path: '/en/behind-the-scenes', heading: 'Behind the scenes' },
    { path: '/en/legal-notice', heading: 'Legal notice' },
    { path: '/en/site-map', heading: 'Site map' },
  ]) {
    it(`renders ${path} with its heading and title`, async () => {
      const screen = await renderSite(path);

      await expect.element(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expect.poll(() => document.title).toBe(`${heading} – William Stoops`);
    });
  }

  for (const path of [
    '/fr',
    '/fr/page-inexistante',
    '/fr/coulisses',
    '/fr/mentions-legales',
    '/fr/plan-du-site',
    '/en',
    '/en/legal-notice',
  ]) {
    it(`has no axe violations on ${path}`, async () => {
      const screen = await renderSite(path);
      await expect.element(screen.getByRole('heading', { level: 1 })).toBeVisible();

      await expectNoAxeViolations(screen.container);
    });
  }
});
