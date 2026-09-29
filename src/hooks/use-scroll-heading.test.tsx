import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { useScrollHeading } from '@/hooks/use-scroll-heading';

// A page long enough to scroll, listening for the reader's heading.
function LongPage() {
  useScrollHeading();
  return <div style={{ height: '400vh' }} />;
}

function heading(): string | null {
  return document.documentElement.getAttribute('data-scroll-heading');
}

async function scrollTo(top: number): Promise<void> {
  window.scrollTo({ top, behavior: 'instant' });
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
});

describe('useScrollHeading', () => {
  it('marks the page while the reader scrolls back up, and clears it going down', async () => {
    await render(<LongPage />);

    await scrollTo(800);
    expect(heading()).toBeNull();

    await scrollTo(600);
    await expect.poll(heading).toBe('up');

    await scrollTo(900);
    await expect.poll(heading).toBeNull();
  });

  it('leaves nothing behind when the page goes', async () => {
    const screen = await render(<LongPage />);
    await scrollTo(800);
    await scrollTo(500);
    await expect.poll(heading).toBe('up');

    await screen.unmount();

    expect(heading()).toBeNull();
  });
});
