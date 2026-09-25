import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { TextAreaField, TextField } from '@/components/ui/form-field';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('TextField', () => {
  it('is labelled by its visible label', async () => {
    const screen = await render(<TextField id="nom" name="name" label="Nom" autoComplete="name" />);

    await expect
      .element(screen.getByRole('textbox', { name: 'Nom' }))
      .toHaveAttribute('autocomplete', 'name');
  });

  it('is valid and undescribed without error', async () => {
    const screen = await render(<TextField id="nom" name="name" label="Nom" />);

    const input = screen.getByRole('textbox', { name: 'Nom' });
    await expect.element(input).not.toHaveAttribute('aria-invalid');
    await expect.element(input).not.toHaveAttribute('aria-describedby');
  });

  it('flags an error and ties the message to the field', async () => {
    const screen = await render(
      <TextField id="nom" name="name" label="Nom" error="Erreur : saisissez votre nom." />,
    );

    const input = screen.getByRole('textbox', { name: 'Nom' });
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
    await expect.element(input).toHaveAccessibleDescription('Erreur : saisissez votre nom.');
  });

  it('has no axe violations, with or without error', async () => {
    const screen = await render(
      <>
        <TextField id="nom" name="name" label="Nom" />
        <TextField
          id="email"
          name="email"
          type="email"
          label="E-mail"
          error="Erreur : adresse invalide."
        />
      </>,
    );

    await expectNoAxeViolations(screen.container);
  });
});

describe('TextAreaField', () => {
  it('is a labelled multi-line field carrying its error', async () => {
    const screen = await render(
      <TextAreaField
        id="message"
        name="message"
        label="Message"
        error="Erreur : message trop court."
      />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Message' });
    await expect.element(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect.element(textarea).toHaveAccessibleDescription('Erreur : message trop court.');
    expect(textarea.element().tagName).toBe('TEXTAREA');
  });
});
