import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { CommandPaletteTrigger } from '@/components/layout/command-palette-trigger';
import { closeCommandPalette } from '@/hooks/use-command-palette';
import { LocaleContext } from '@/i18n/locale-context';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

afterEach(() => {
  closeCommandPalette();
  vi.restoreAllMocks();
});

function emulatePlatform(userAgent: string): void {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent);
}

describe('CommandPaletteTrigger', () => {
  it('names the quick search and its shortcut on a Mac', async () => {
    emulatePlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) AppleWebKit/605.1.15');

    const screen = await render(<CommandPaletteTrigger />);

    await expect
      .element(screen.getByRole('button', { name: 'Recherche rapide (⌘K)' }))
      .toBeVisible();
  });

  it('names Ctrl K elsewhere, in the page’s language', async () => {
    emulatePlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    const screen = await render(
      <LocaleContext value="en">
        <CommandPaletteTrigger />
      </LocaleContext>,
    );

    await expect
      .element(screen.getByRole('button', { name: 'Quick search (Ctrl K)' }))
      .toBeVisible();
  });

  it('opens the quick search', async () => {
    const screen = await render(<CommandPaletteTrigger />);

    await screen.getByRole('button').click();

    await expect.element(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
    await expect.element(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('is a target a finger can hit, without accessibility violations', async () => {
    const screen = await render(<CommandPaletteTrigger />);

    const box = screen.getByRole('button').element().getBoundingClientRect();
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
    await expectNoAxeViolations(screen.container);
  });
});
