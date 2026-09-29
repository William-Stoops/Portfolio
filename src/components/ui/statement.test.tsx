import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Statement } from '@/components/ui/statement';

const TEXT = 'Je décide d’une architecture, je la mesure, je la livre.';

describe('Statement', () => {
  it('reads as one paragraph, whole, from the first paint: nothing is revealed later', async () => {
    const screen = await render(<Statement text={TEXT} />);

    const paragraph = screen.getByText(TEXT);
    await expect.element(paragraph).toBeVisible();
    expect(paragraph.element().children).toHaveLength(0);
  });

  it('writes a statement large and a body text at reading size', async () => {
    const statement = await render(<Statement text={TEXT} size="statement" />);
    expect(statement.container.querySelector('p')?.className).toContain('text-h3');

    const body = await render(<Statement text={TEXT} size="body" />);
    expect(body.container.querySelector('p')?.className).toContain('text-lead');
  });
});
