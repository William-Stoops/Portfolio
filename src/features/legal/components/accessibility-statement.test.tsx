import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { AccessibilityStatement as AccessibilityStatementEn } from '@/features/legal/components/accessibility-statement.en';
import { AccessibilityStatement } from '@/features/legal/components/accessibility-statement.fr';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('AccessibilityStatement', () => {
  it('states the target without claiming a conformance rate no audit supports', async () => {
    const screen = await render(<AccessibilityStatement />);

    const text = screen.container.textContent;
    expect(text).toContain('WCAG 2.2');
    expect(text).toContain('aucun taux de conformité n’est revendiqué');
    expect(text).not.toMatch(/totalement conforme|partiellement conforme/);
  });

  it('follows the RGAA declaration outline', async () => {
    const screen = await render(<AccessibilityStatement />);

    expect(
      screen
        .getByRole('heading', { level: 2 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual([
      'État de conformité',
      'Vérifications réalisées',
      'Contenus non accessibles',
      'Établissement de cette déclaration',
      'Retour d’information et contact',
      'Voies de recours',
    ]);
  });

  it('says which manual tests are still to do', async () => {
    const screen = await render(<AccessibilityStatement />);

    expect(screen.container.textContent).toContain('NVDA');
    expect(screen.container.textContent).toContain('VoiceOver');
  });

  it('has no axe violations', async () => {
    const screen = await render(<AccessibilityStatement />);

    await expectNoAxeViolations(screen.container);
  });

  it('translates the statement, with the same outline and the same honesty', async () => {
    const screen = await render(<AccessibilityStatementEn />);

    expect(screen.container.textContent).toContain('no conformance rate is claimed');
    expect(
      screen
        .getByRole('heading', { level: 2 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual([
      'Conformance status',
      'Checks carried out',
      'Non-accessible content',
      'Preparation of this statement',
      'Feedback and contact',
      'Remedies',
    ]);
    await expect
      .element(screen.getByRole('link', { name: 'Défenseur des droits' }))
      .toHaveAttribute('lang', 'fr');
  });
});
