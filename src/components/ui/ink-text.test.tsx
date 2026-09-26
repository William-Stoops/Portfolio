import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { InkText } from '@/components/ui/ink-text';

const TEXT = 'Je décide d’une architecture, je la mesure, je la livre.';

describe('InkText', () => {
  it('reads as one paragraph, whole for assistive tech', async () => {
    const screen = await render(<InkText text={TEXT} />);

    await expect.element(screen.getByText(TEXT)).toBeVisible();
  });

  it('sets the text word by word, so each word can be inked in as it is read', async () => {
    const screen = await render(<InkText text={TEXT} />);

    const words = [...screen.container.querySelectorAll('[data-word]')].map(
      (word) => word.textContent,
    );
    expect(words.join(' ')).toBe(TEXT);
  });

  it('writes a statement large and a body text at reading size', async () => {
    const statement = await render(<InkText text={TEXT} size="statement" />);
    expect(statement.container.querySelector('p')?.className).toContain('text-h3');

    const body = await render(<InkText text={TEXT} size="body" />);
    expect(body.container.querySelector('p')?.className).toContain('text-lead');
  });
});
