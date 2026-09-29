import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { useMenuDialog } from '@/hooks/use-menu-dialog';

function Harness() {
  const { isOpen, buttonRef, dialogRef, open, close, leave, handleClose } = useMenuDialog();
  // Stands for what takes the focus once the visitor leaves: the quick search's field.
  const fieldRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button ref={buttonRef} type="button" aria-expanded={isOpen} onClick={open}>
        Menu
      </button>
      <dialog ref={dialogRef} aria-label="Menu" onClose={handleClose}>
        <button type="button" onClick={close}>
          Close
        </button>
        <button
          type="button"
          onClick={() => {
            leave();
            fieldRef.current?.focus();
          }}
        >
          Elsewhere
        </button>
      </dialog>
      <input ref={fieldRef} aria-label="Search" />
    </>
  );
}

describe('useMenuDialog', () => {
  it('opens the menu as a modal dialog and says so on its button', async () => {
    const screen = await render(<Harness />);

    await screen.getByRole('button', { name: 'Menu' }).click();

    await expect.element(screen.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    expect(screen.getByRole('dialog').element().matches(':modal')).toBe(true);
    await expect
      .element(screen.getByRole('button', { name: 'Menu', expanded: true }))
      .toBeInTheDocument();
  });

  it('closes on Escape and gives the focus back to the button that opened it', async () => {
    const screen = await render(<Harness />);
    await screen.getByRole('button', { name: 'Menu' }).click();

    await userEvent.keyboard('{Escape}');

    await expect.element(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
    await expect
      .element(screen.getByRole('button', { name: 'Menu' }))
      .toHaveAttribute('aria-expanded', 'false');
  });

  it('gives the focus back when closed from inside', async () => {
    const screen = await render(<Harness />);
    await screen.getByRole('button', { name: 'Menu' }).click();

    await screen.getByRole('button', { name: 'Close' }).click();

    await expect.element(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
  });

  it('leaves the focus where the visitor went from the menu', async () => {
    const screen = await render(<Harness />);
    await screen.getByRole('button', { name: 'Menu' }).click();

    await screen.getByRole('button', { name: 'Elsewhere' }).click();

    // The dialog's close event comes after the click: wait for it before judging the focus.
    await expect
      .element(screen.getByRole('button', { name: 'Menu' }))
      .toHaveAttribute('aria-expanded', 'false');
    await expect.element(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
  });
});
