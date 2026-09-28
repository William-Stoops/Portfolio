import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { SkipLink } from '@/components/layout/skip-link';
import { LocaleContext } from '@/i18n/locale-context';

describe('SkipLink', () => {
  it('speaks the language of the page', async () => {
    const screen = await render(
      <LocaleContext value="en">
        <SkipLink />
      </LocaleContext>,
    );

    await expect
      .element(screen.getByRole('link', { name: 'Skip to main content' }))
      .toHaveAttribute('href', '#main');
  });

  it('targets the main landmark', async () => {
    const screen = await render(<SkipLink />);

    await expect
      .element(screen.getByRole('link', { name: 'Aller au contenu principal' }))
      .toHaveAttribute('href', '#main');
  });

  it('stays visually hidden until it receives keyboard focus', async () => {
    const screen = await render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Aller au contenu principal' }).element();

    expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await userEvent.tab();

    expect(link).toHaveFocus();
    expect(link.getBoundingClientRect().width).toBeGreaterThan(1);
  });

  it('moves keyboard focus to the main content when activated', async () => {
    const screen = await render(
      <>
        <SkipLink />
        <button type="button">Élément du header</button>
        <main id="main" tabIndex={-1}>
          Contenu
        </main>
      </>,
    );

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    await expect.element(screen.getByRole('main')).toHaveFocus();
  });
});
