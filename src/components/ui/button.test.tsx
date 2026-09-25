import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('is a button of the declared type sharing the primary link styles', async () => {
    const screen = await render(
      <Button type="submit" variant="primary">
        Préparer l’e-mail
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Préparer l’e-mail' });
    await expect.element(button).toHaveAttribute('type', 'submit');
    const style = getComputedStyle(button.element());
    expect(style.backgroundColor).toBe('rgb(185, 62, 11)');
    expect(button.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  });
});
