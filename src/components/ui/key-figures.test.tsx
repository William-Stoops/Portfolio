import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { KeyFigures } from '@/components/ui/key-figures';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const FIGURES = [
  { value: '1er', label: 'au concours' },
  { value: '300', label: 'personnes' },
];

describe('KeyFigures', () => {
  it('is a named list, each figure read as its value then its label', async () => {
    const screen = await render(<KeyFigures label="En chiffres" figures={FIGURES} />);

    expect(
      screen
        .getByRole('list', { name: 'En chiffres' })
        .getByRole('listitem')
        .elements()
        .map((item) => item.textContent),
    ).toEqual(['1er au concours', '300 personnes']);
  });

  it('staggers its figures from a given index, with the given entrance', async () => {
    const screen = await render(
      <KeyFigures label="En chiffres" figures={FIGURES} entrance="reveal" firstIndex={3} />,
    );

    const items = screen.getByRole('listitem').elements();
    expect(items.map((item) => item.style.getPropertyValue('--i'))).toEqual(['3', '4']);
    expect(items.every((item) => item.classList.contains('reveal'))).toBe(true);
  });

  it('has no axe violations', async () => {
    const screen = await render(<KeyFigures label="En chiffres" figures={FIGURES} />);

    await expectNoAxeViolations(screen.container);
  });
});
