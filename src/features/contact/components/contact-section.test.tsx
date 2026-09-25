import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { ContactSection } from '@/features/contact/components/contact-section';
import { CONTACT_CONTENT } from '@/features/contact/data/contact-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderSection(openMailto = vi.fn<(url: string) => void>()) {
  const screen = await render(<ContactSection content={CONTACT_CONTENT} openMailto={openMailto} />);
  return { screen, openMailto };
}

describe('ContactSection', () => {
  it('is a region reachable by the #contact anchor', async () => {
    const { screen } = await renderSection();

    await expect
      .element(screen.getByRole('region', { name: 'Contact' }))
      .toHaveAttribute('id', 'contact');
  });

  it('lists the direct ways to reach William', async () => {
    const { screen } = await renderSection();

    await expect
      .element(screen.getByRole('link', { name: 'william.stoops@epitech.eu' }))
      .toHaveAttribute('href', 'mailto:william.stoops@epitech.eu');
    await expect
      .element(screen.getByRole('link', { name: 'LinkedIn (nouvel onglet)' }))
      .toHaveAttribute('target', '_blank');
    await expect.element(screen.getByText('Paris, Lille ou full remote')).toBeVisible();
  });

  it('announces errors on the fields and focuses the first invalid one', async () => {
    const { screen, openMailto } = await renderSection();

    await screen.getByRole('button', { name: 'Préparer l’e-mail' }).click();

    const name = screen.getByRole('textbox', { name: 'Nom' });
    await expect.element(name).toHaveFocus();
    await expect.element(name).toHaveAccessibleDescription('Erreur : saisissez votre nom.');
    await expect
      .element(screen.getByRole('textbox', { name: 'E-mail' }))
      .toHaveAttribute('aria-invalid', 'true');
    expect(openMailto).not.toHaveBeenCalled();
  });

  it('opens the mail client with the prepared message and confirms it', async () => {
    const { screen, openMailto } = await renderSection();

    await screen.getByRole('textbox', { name: 'Nom' }).fill('Ada Lovelace');
    await screen.getByRole('textbox', { name: 'E-mail' }).fill('ada@example.com');
    await screen.getByRole('textbox', { name: 'Message' }).fill('Parlons de votre profil.');
    await screen.getByRole('button', { name: 'Préparer l’e-mail' }).click();

    expect(openMailto).toHaveBeenCalledOnce();
    expect(openMailto.mock.calls[0]?.[0]).toMatch(/^mailto:william\.stoops@epitech\.eu\?subject=/);
    await expect
      .element(screen.getByRole('status'))
      .toHaveTextContent(
        'Votre messagerie s’ouvre avec le message prêt à envoyer. Si rien ne s’ouvre, écrivez à william.stoops@epitech.eu.',
      );
  });

  it('can be completed with the keyboard alone', async () => {
    const { screen, openMailto } = await renderSection();
    screen.getByRole('textbox', { name: 'Nom' }).element().focus();

    await userEvent.keyboard('Ada Lovelace');
    await userEvent.tab();
    await userEvent.keyboard('ada@example.com');
    await userEvent.tab();
    await userEvent.keyboard('Parlons de votre profil.');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(openMailto).toHaveBeenCalledOnce();
  });

  it('has no axe violations, before and after a failed submission', async () => {
    const { screen } = await renderSection();
    await expectNoAxeViolations(screen.container);

    await screen.getByRole('button', { name: 'Préparer l’e-mail' }).click();

    await expectNoAxeViolations(screen.container);
  });
});
