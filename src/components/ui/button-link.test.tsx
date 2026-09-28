import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ButtonLink } from '@/components/ui/button-link';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('ButtonLink', () => {
  it('is a link carrying its destination and native attributes', async () => {
    const screen = await render(
      <ButtonLink variant="secondary" href="/cv.pdf" download>
        Télécharger le CV
      </ButtonLink>,
    );

    const link = screen.getByRole('link', { name: 'Télécharger le CV' });
    await expect.element(link).toHaveAttribute('href', '/cv.pdf');
    await expect.element(link).toHaveAttribute('download');
  });

  it('fills the primary variant with the accent and its readable foreground', async () => {
    const screen = await render(
      <ButtonLink variant="primary" href="mailto:contact@example.com">
        Me contacter
      </ButtonLink>,
    );

    const style = getComputedStyle(screen.getByRole('link').element());
    // Light scheme in the test browser: accent #1D4ED8, on-accent #FFFFFF (6.70:1).
    expect(style.backgroundColor).toBe('rgb(29, 78, 216)');
    expect(style.color).toBe('rgb(255, 255, 255)');
    expect(style.textDecorationLine).toBe('none');
  });

  it('outlines the secondary variant with the input border colour', async () => {
    const screen = await render(
      <ButtonLink variant="secondary" href="/cv.pdf">
        CV
      </ButtonLink>,
    );

    const style = getComputedStyle(screen.getByRole('link').element());
    expect(style.borderTopColor).toBe('rgb(118, 125, 143)');
  });

  it('offers a target at least 44 px high', async () => {
    const screen = await render(
      <ButtonLink variant="primary" href="mailto:contact@example.com">
        Me contacter
      </ButtonLink>,
    );

    expect(
      screen.getByRole('link').element().getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
  });

  it('has no axe violations in either variant', async () => {
    const screen = await render(
      <p>
        <ButtonLink variant="primary" href="mailto:contact@example.com">
          Me contacter
        </ButtonLink>
        <ButtonLink variant="secondary" href="/cv.pdf">
          Télécharger le CV
        </ButtonLink>
      </p>,
    );

    await expectNoAxeViolations(screen.container);
  });
});
