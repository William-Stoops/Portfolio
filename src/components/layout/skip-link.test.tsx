import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { SkipLink } from '@/components/layout/skip-link';

describe('SkipLink', () => {
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
