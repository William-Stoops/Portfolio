import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

describe('ThemeToggle', () => {
  it('groups the three theme choices under an accessible name', async () => {
    const screen = await render(<ThemeToggle />);

    const group = screen.getByRole('group', { name: 'Thème' });
    await expect.element(group).toBeVisible();
    expect(group.getByRole('button').elements()).toHaveLength(3);
  });

  it('marks the system choice as pressed by default', async () => {
    const screen = await render(<ThemeToggle />);

    await expect
      .element(screen.getByRole('button', { name: 'Thème du système' }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect
      .element(screen.getByRole('button', { name: 'Thème sombre' }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  it('applies the chosen theme and announces it', async () => {
    const screen = await render(<ThemeToggle />);

    await screen.getByRole('button', { name: 'Thème sombre' }).click();

    await expect
      .element(screen.getByRole('button', { name: 'Thème sombre' }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect.element(screen.getByRole('status')).toHaveTextContent('Thème sombre activé');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('is operable with the keyboard alone', async () => {
    const screen = await render(<ThemeToggle />);

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    await expect
      .element(screen.getByRole('button', { name: 'Thème clair' }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('offers touch targets of at least 44 by 44 px', async () => {
    const screen = await render(<ThemeToggle />);

    for (const button of screen.getByRole('button').elements()) {
      const { width, height } = button.getBoundingClientRect();
      expect(width).toBeGreaterThanOrEqual(44);
      expect(height).toBeGreaterThanOrEqual(44);
    }
  });

  it('has no axe violations', async () => {
    const screen = await render(<ThemeToggle />);

    await expectNoAxeViolations(screen.container);
  });
});
