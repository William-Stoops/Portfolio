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
    expect([...(band?.querySelectorAll('p') ?? [])].map((line) => line.textContent)).toEqual(
      LINES.map(({ text }) => text),
    );
  });

  it('marks a line written in another language, so the right font draws it', async () => {
    const screen = await render(<KineticBand lines={LINES} />);

    const [korean, translation] = screen.container.querySelectorAll('p');
    expect(korean?.getAttribute('lang')).toBe('ko');
    expect(translation?.hasAttribute('lang')).toBe(false);
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
