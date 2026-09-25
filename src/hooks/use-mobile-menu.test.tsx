import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render, renderHook } from 'vitest-browser-react';

import { useMobileMenu } from '@/hooks/use-mobile-menu';

function MenuHarness() {
  const { isOpen, toggle, close, buttonRef } = useMobileMenu();
  return (
    <div>
      <button ref={buttonRef} type="button" aria-expanded={isOpen} onClick={toggle}>
        Menu
      </button>
      {isOpen ? (
        <a href="#section" onClick={close}>
          Section
        </a>
      ) : null}
    </div>
  );
}

describe('useMobileMenu', () => {
  it('starts closed and toggles', async () => {
    const { result, act } = await renderHook(() => useMobileMenu());

    expect(result.current.isOpen).toBe(false);
    await act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    await act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('closes on Escape and gives focus back to the menu button', async () => {
    const screen = await render(<MenuHarness />);
    await screen.getByRole('button', { name: 'Menu' }).click();
    screen.getByRole('link', { name: 'Section' }).element().focus();

    await userEvent.keyboard('{Escape}');

    await expect
      .element(screen.getByRole('button', { name: 'Menu' }))
      .toHaveAttribute('aria-expanded', 'false');
    await expect.element(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
  });

  it('closes when a destination is chosen', async () => {
    const screen = await render(<MenuHarness />);
    await screen.getByRole('button', { name: 'Menu' }).click();

    await screen.getByRole('link', { name: 'Section' }).click();

    await expect
      .element(screen.getByRole('button', { name: 'Menu' }))
      .toHaveAttribute('aria-expanded', 'false');
  });
});
