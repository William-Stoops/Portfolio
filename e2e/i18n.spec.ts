import { expect, type Page, test } from '@playwright/test';

import { openSiteMenu } from './support/interactions.ts';

// Opens the header menu on a small screen, and clicks the link where it is, as a pointer
// does: Playwright's own click first scrolls a sticky header control "into view", which
// would move the page (and the place being read).
// The other language is in the menu: opened without scrolling to its button.
async function openMenuInPlace(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Menu' }).dispatchEvent('click');
}

async function followLink(page: Page, name: string): Promise<void> {
  await page.getByRole('link', { name }).dispatchEvent('click');
}

// Reads from the journey's first stop: its title just above the reading line, 40 % down
// what the header (and its open menu) leaves visible.
async function readFromEpitechTitle(page: Page): Promise<void> {
  await page.getByRole('heading', { level: 3, name: 'Epitech' }).evaluate((heading) => {
    const headerBottom = Math.max(
      0,
      document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
    );
    const readingLine = headerBottom + (window.innerHeight - headerBottom) * 0.4;
    window.scrollBy(0, heading.getBoundingClientRect().top - (readingLine - 10));
  });
}

// Where the journey's first stop title sits on screen.
function epitechTitleTop(page: Page): Promise<number> {
  return page
    .getByRole('heading', { level: 3, name: 'Epitech' })
    .evaluate((heading) => Math.round(heading.getBoundingClientRect().top));
}

// Every page of both locales, as the prerender writes them (ADR 0026).
const PAGES = [
  { path: '/fr', lang: 'fr', title: 'William Stoops – Software Engineer & AI Engineer' },
  { path: '/fr/coulisses', lang: 'fr', title: 'Les coulisses du site – William Stoops' },
  { path: '/fr/accessibilite', lang: 'fr', title: 'Déclaration d’accessibilité – William Stoops' },
  { path: '/fr/mentions-legales', lang: 'fr', title: 'Mentions légales – William Stoops' },
  { path: '/fr/plan-du-site', lang: 'fr', title: 'Plan du site – William Stoops' },
  { path: '/en', lang: 'en', title: 'William Stoops – Software Engineer & AI Engineer' },
  { path: '/en/behind-the-scenes', lang: 'en', title: 'Behind the scenes – William Stoops' },
  { path: '/en/accessibility', lang: 'en', title: 'Accessibility statement – William Stoops' },
  { path: '/en/legal-notice', lang: 'en', title: 'Legal notice – William Stoops' },
  { path: '/en/site-map', lang: 'en', title: 'Site map – William Stoops' },
] as const;

test.describe('the gateway at /', () => {
  test('opens the French site for a French browser', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('link', { name: 'Me contacter' })).toBeVisible();
  });

  test('follows a stored choice over the browser language, keeping the section', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('locale-preference', 'en');
    });

    await page.goto('/#parcours');

    await expect(page).toHaveURL(/\/en#journey$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('sends visitors without JavaScript to French, and offers both languages', async ({
    request,
  }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=/fr">');
    expect(html).toContain('<a href="/en" hreflang="en" lang="en">English</a>');
    expect(html).not.toContain('type="module"');
  });
});

test.describe('for an English browser', () => {
  test.use({ locale: 'en-US' });

  test('the gateway opens the English site', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Get in touch' })).toBeVisible();
  });

  test('an explicit French address stays French', async ({ page }) => {
    await page.goto('/fr/mentions-legales');

    await expect(page).toHaveURL(/\/fr\/mentions-legales$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeVisible();
  });
});

test.describe('prerendered locales', () => {
  for (const { path, lang, title } of PAGES) {
    test(`serves ${path} in its language, with its own content chunk`, async ({ request }) => {
      const response = await request.get(path);

      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain(`<html lang="${lang}">`);
      expect(html).toContain(`<title>${title.replace('&', '&amp;')}</title>`);
      expect(html.match(/<meta name="description"/g)).toHaveLength(1);
      const otherLang = lang === 'fr' ? 'en' : 'fr';
      expect(html).toMatch(new RegExp(`modulepreload[^>]*site-content\\.${lang}-`));
      expect(html).not.toMatch(new RegExp(`site-content\\.${otherLang}-`));
    });
  }

  test('answers an unknown address in the language of its locale, with a 404', async ({
    request,
  }) => {
    const english = await request.get('/en/nowhere');
    const outside = await request.get('/nulle-part');

    expect(english.status()).toBe(404);
    expect(await english.text()).toMatch(/<h1[^>]*>Page not found<\/h1>/);
    expect(outside.status()).toBe(404);
    expect(await outside.text()).toMatch(/<h1[^>]*>Page introuvable<\/h1>/);
  });
});

test.describe('the language switch', () => {
  test('opens English exactly where the reader was, remembers the choice, and leads back', async ({
    page,
  }) => {
    // An earlier visit leaves the router a saved scroll position for /en: it must not win.
    await page.goto('/en');
    await page.evaluate(() => {
      window.scrollTo(0, 600);
    });
    await page.goto('/fr#parcours');
    await expect
      .poll(() =>
        page.locator('#parcours').evaluate((section) => section.getBoundingClientRect().top),
      )
      .toBeLessThan(200);
    await openMenuInPlace(page);
    await readFromEpitechTitle(page);
    const before = await epitechTitleTop(page);

    await followLink(page, 'English');

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.waitForLoadState('networkidle');
    expect(Math.abs((await epitechTitleTop(page)) - before)).toBeLessThanOrEqual(3);
    expect(await page.evaluate(() => localStorage.getItem('locale-preference'))).toBe('en');

    await openMenuInPlace(page);
    await readFromEpitechTitle(page);
    const beforeReturn = await epitechTitleTop(page);
    await followLink(page, 'Français');

    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await page.waitForLoadState('networkidle');
    expect(Math.abs((await epitechTitleTop(page)) - beforeReturn)).toBeLessThanOrEqual(3);
  });

  test('leads from a page to the same page in the other language', async ({ page }) => {
    await page.goto('/fr/plan-du-site');
    await openSiteMenu(page);

    await page.getByRole('link', { name: 'English' }).click();

    await expect(page).toHaveURL(/\/en\/site-map$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Site map' })).toBeVisible();
  });
});
