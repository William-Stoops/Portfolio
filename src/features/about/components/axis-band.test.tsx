import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { AxisBand } from '@/features/about/components/axis-band';
import { ABOUT_CONTENT } from '@/features/about/data/about-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('AxisBand', () => {
  it('repeats the three axes in giant type, as decoration hidden from assistive tech', async () => {
    const screen = await render(<AxisBand axes={ABOUT_CONTENT.axes} />);

    const band = screen.container.firstElementChild;
    expect(band?.getAttribute('aria-hidden')).toBe('true');
    for (const { title } of ABOUT_CONTENT.axes) {
      expect(band?.textContent).toContain(title);
    }
  });

  it('has no axe violations', async () => {
    const screen = await render(<AxisBand axes={ABOUT_CONTENT.axes} />);

    await expectNoAxeViolations(screen.container);
  });
});
