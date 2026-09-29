import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { HoldingPattern } from '@/components/ui/holding-pattern';

function orbitOf(container: Element): Element | null {
  return container.querySelector('[data-holding-orbit]');
}

describe('HoldingPattern', () => {
  it('circles a plane around what it holds, for the eyes only', async () => {
    const screen = await render(
      <HoldingPattern>
        <span>404</span>
      </HoldingPattern>,
    );

    const pattern = screen.container.firstElementChild;
    expect(pattern?.getAttribute('aria-hidden')).toBe('true');
    expect(pattern?.textContent).toBe('404');
    expect(orbitOf(screen.container)?.querySelector('svg')).not.toBeNull();
  });

  it('flies its turns once, and has landed on its wait before five seconds (WCAG 2.2.2)', async () => {
    const screen = await render(
      <HoldingPattern>
        <span>404</span>
      </HoldingPattern>,
    );

    const animations = orbitOf(screen.container)?.getAnimations() ?? [];
    const [holding] = animations;
    const timing = holding?.effect?.getComputedTiming();
    expect(animations).toHaveLength(1);
    expect(timing?.iterations).toBe(1);
    expect(typeof timing?.endTime === 'number' && timing.endTime <= 5000).toBe(true);
  });

  it('puts the plane back at the top of its circuit when it rests', async () => {
    const screen = await render(
      <HoldingPattern>
        <span>404</span>
      </HoldingPattern>,
    );
    const orbit = orbitOf(screen.container);

    for (const animation of orbit?.getAnimations() ?? []) {
      animation.finish();
    }

    // No turn left over: the plane waits where it started, nose to the right.
    expect(orbit === null ? '' : getComputedStyle(orbit).rotate).toMatch(/^(none|0deg|0turn)$/);
  });
});
