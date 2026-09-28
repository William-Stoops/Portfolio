import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { JourneyNote } from '@/features/journey/components/journey-note';

const TEXT = 'Je commence STAXX, mon projet de fin d’études.';

describe('JourneyNote', () => {
  it('tells the stop in one paragraph, whole for assistive tech', async () => {
    const screen = await render(<JourneyNote text={TEXT} />);

    await expect.element(screen.getByText(TEXT)).toBeVisible();
  });

  it('sets the text word by word, so each word can be inked in as it is read', async () => {
    const screen = await render(<JourneyNote text={TEXT} />);

    const words = [...screen.container.querySelectorAll('[data-word]')].map(
      (word) => word.textContent,
    );
    expect(words.join(' ')).toBe(TEXT);
  });
});
