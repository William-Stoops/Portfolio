import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { KineticBand } from '@/components/ui/kinetic-band';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const LINES = [
  { text: '고려대학교 — 서울 — ', lang: 'ko' },
  { text: 'Korea University — Séoul — ' },
] as const;

describe('KineticBand', () => {
  it('sets two giant lines, as decoration hidden from assistive tech', async () => {
    const screen = await render(<KineticBand lines={LINES} />);

    const band = screen.container.firstElementChild;
    expect(band?.getAttribute('aria-hidden')).toBe('true');
    const [first, second] = band?.querySelectorAll('p') ?? [];
    expect(first?.textContent).toBe(LINES[0].text);
    // The second line is a picture of its words, in filigree: not text of the page.
    expect(second?.textContent).toBe('');
    expect(second?.getAttribute('data-filigree')).toBe(LINES[1].text);
  });

  it('marks a line written in another language, so the right font draws it', async () => {
    const screen = await render(<KineticBand lines={LINES} />);

    const [korean, translation] = screen.container.querySelectorAll('p');
    expect(korean?.getAttribute('lang')).toBe('ko');
    expect(translation?.hasAttribute('lang')).toBe(false);
  });

  it('fills both lines: an outline of a variable font shows its overlapping contours', async () => {
    const screen = await render(<KineticBand lines={LINES} />);

    const [first, second] = screen.container.querySelectorAll('p');
    for (const style of [
      first === undefined ? undefined : getComputedStyle(first),
      second === undefined ? undefined : getComputedStyle(second, '::before'),
    ]) {
      expect(style?.getPropertyValue('-webkit-text-stroke-width')).toBe('0px');
      expect(style?.getPropertyValue('-webkit-text-fill-color')).toBe(style?.color);
    }
  });

  it('never makes the page scroll sideways', async () => {
    const screen = await render(<KineticBand lines={LINES} />);

    const band = screen.container.firstElementChild;
    expect(band === null ? '' : getComputedStyle(band).overflowX).toBe('clip');
  });

  it('has no axe violations', async () => {
    const screen = await render(<KineticBand lines={LINES} />);

    await expectNoAxeViolations(screen.container);
  });
});
