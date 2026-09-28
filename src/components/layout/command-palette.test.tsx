import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';

import { CommandPaletteHost } from '@/components/layout/command-palette-host';
import { closeCommandPalette, openCommandPalette } from '@/hooks/use-command-palette';
import { type Locale } from '@/i18n/locales';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderRoutes } from '@/testing/render-with-router';

afterEach(() => {
  closeCommandPalette();
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

// A page with an opener and the palette's host, as the root layout has them.
function page(heading: string) {
  return (
    <>
      <h1>{heading}</h1>
      <button type="button">Ouvrir</button>
      <CommandPaletteHost />
    </>
  );
}

async function renderPage(locale: Locale = 'fr') {
  return renderRoutes(
    [
      { path: '/fr', element: page('Accueil') },
      { path: '/fr/coulisses', element: page('Les coulisses du site') },
      { path: '/en', element: page('Home') },
    ],
    { path: `/${locale}`, locale },
  );
}

function dialog(): HTMLDialogElement | null {
  return document.querySelector('dialog');
}

async function openPalette(): Promise<void> {
  openCommandPalette();
  await expect.poll(() => dialog()?.open).toBe(true);
}

// Every result, in the order the lists show them.
function resultNames(): string[] {
  return [...(dialog()?.querySelectorAll('li') ?? [])].map(({ textContent }) => textContent);
}

describe('CommandPalette', () => {
  it('opens as a modal dialog, its search field focused, every destination listed', async () => {
    const screen = await renderPage();

    await openPalette();

    await expect
      .element(
        screen.getByRole('searchbox', { name: 'Rechercher une section, une page ou une action' }),
      )
      .toHaveFocus();
    await expect
      .element(
        screen.getByRole('list', { name: 'Sections' }).getByRole('link', { name: 'Compétences' }),
      )
      .toHaveAttribute('href', '/fr#competences');
    await expect
      .element(screen.getByRole('list', { name: 'Pages' }).getByRole('link', { name: 'Coulisses' }))
      .toHaveAttribute('href', '/fr/coulisses');
    await expect
      .element(
        screen.getByRole('list', { name: 'Actions' }).getByRole('button', { name: 'Thème sombre' }),
      )
      .toBeVisible();
  });

  it('makes each result the element it is: a file to save, a new tab, another language', async () => {
    const screen = await renderPage();
    await openPalette();

    await expect
      .element(screen.getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' }))
      .toHaveAttribute('download', '');
    const linkedIn = screen.getByRole('link', { name: 'Ouvrir LinkedIn (nouvel onglet)' });
    await expect.element(linkedIn).toHaveAttribute('target', '_blank');
    await expect.element(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');
    const english = screen.getByRole('link', { name: 'English' });
    await expect.element(english).toHaveAttribute('hreflang', 'en');
    await expect.element(english).toHaveAttribute('lang', 'en');
  });

  it('narrows the lists to what is typed, whatever the accents', async () => {
    await renderPage();
    await openPalette();

    await userEvent.keyboard('compe');

    expect(resultNames()).toEqual(['Compétences']);
  });

  it('goes down from the field through the results with the arrows, and back up to it', async () => {
    const screen = await renderPage();
    await openPalette();
    await userEvent.keyboard('theme');

    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('button', { name: 'Thème clair' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('button', { name: 'Thème sombre' })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect.element(screen.getByRole('searchbox')).toHaveFocus();
  });

  it('follows the first result with Enter from the field, and closes', async () => {
    const screen = await renderPage();
    await openPalette();

    await userEvent.keyboard('coulisses{Enter}');

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Les coulisses du site' }))
      .toBeVisible();
    expect(dialog()).toBeNull();
  });

  it('runs an action: the dark theme', async () => {
    await renderPage();
    await openPalette();

    await userEvent.keyboard('sombre{Enter}');

    await expect.poll(() => document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(dialog()).toBeNull();
  });

  it('turns the sounds on and off, as the footer does', async () => {
    const screen = await renderPage();
    await openPalette();

    await userEvent.keyboard('sons');
    await expect.element(screen.getByRole('button', { name: 'Activer les sons' })).toBeVisible();
    await userEvent.keyboard('{Enter}');

    expect(localStorage.getItem('sound-preference')).toBe('on');
    await openPalette();
    await expect.element(screen.getByRole('button', { name: 'Couper les sons' })).toBeVisible();
  });

  it('says so when nothing matches', async () => {
    const screen = await renderPage();
    await openPalette();

    await userEvent.keyboard('zzz');

    expect(resultNames()).toEqual([]);
    await expect.element(screen.getByText('Aucun résultat pour « zzz »')).toBeVisible();
  });

  it('closes with Escape, and gives the focus back to what had it', async () => {
    const screen = await renderPage();
    const opener = screen.getByRole('button', { name: 'Ouvrir' });
    await opener.click();
    await openPalette();

    await userEvent.keyboard('{Escape}');

    await expect.poll(() => dialog()).toBeNull();
    await expect.element(opener).toHaveFocus();
  });

  it('closes alone with Escape: the page’s own Escape listeners never hear it', async () => {
    await renderPage();
    const heardByThePage: string[] = [];
    function listen(event: KeyboardEvent): void {
      heardByThePage.push(event.key);
    }
    document.addEventListener('keydown', listen);
    await openPalette();

    await userEvent.keyboard('{Escape}');

    await expect.poll(() => dialog()).toBeNull();
    document.removeEventListener('keydown', listen);
    expect(heardByThePage).not.toContain('Escape');
  });

  it('speaks English on the English page', async () => {
    const screen = await renderPage('en');
    await openPalette();

    await expect
      .element(screen.getByRole('searchbox', { name: 'Search for a section, a page or an action' }))
      .toHaveFocus();
    expect(resultNames()).toContain('Skills');
    expect(resultNames()).toContain('Français');
  });

  it('has no accessibility violations', async () => {
    await renderPage();
    await openPalette();

    const palette = dialog();
    expect(palette).not.toBeNull();
    if (palette !== null) {
      await expectNoAxeViolations(palette);
    }
  });
});
