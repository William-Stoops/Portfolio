import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { ReturnStage } from '@/features/korea/components/return-stage';
import { VoyageStage } from '@/features/korea/components/voyage-stage';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.fr';
import { facingRotation, HORIZON, projectOnGlobe } from '@/features/korea/utils/globe-geometry';
import { emulateMediaQuery } from '@/testing/emulate-media-query';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const PINNED_SCENE_QUERY =
  '(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 40rem)';

afterEach(() => {
  vi.restoreAllMocks();
});

function isDisplayed(element: Element | null): boolean {
  return element !== null && element.getBoundingClientRect().width > 0;
}

describe('FlightScene', () => {
  it('flies the flat arc until the globe runs', async () => {
    const screen = await render(<VoyageStage content={KOREA_CONTENT} />);
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(isDisplayed(screen.container.querySelector('[data-flight-route]'))).toBe(true);
    const globe = screen.container.querySelector('[data-flight-globe]');
    expect(isDisplayed(globe)).toBe(false);
    expect(globe?.getAttribute('aria-hidden')).toBe('true');
  });

  it('flies over the globe instead where the scene is pinned', async () => {
    emulateMediaQuery(PINNED_SCENE_QUERY, true);
    const screen = await render(<VoyageStage content={KOREA_CONTENT} />);

    await expect.poll(() => screen.container.querySelector('[data-globe]')).not.toBeNull();
    expect(isDisplayed(screen.container.querySelector('[data-flight-route]'))).toBe(false);
    const globe = screen.container.querySelector('[data-flight-globe]');
    expect(isDisplayed(globe)).toBe(true);
    expect(globe?.getAttribute('aria-hidden')).toBe('true');
  });

  it('names both ends of the flight on the globe, Seoul in Korean too', async () => {
    const screen = await render(<VoyageStage content={KOREA_CONTENT} />);

    const origin = screen.container.querySelector('[data-globe-place="origin"]');
    const destination = screen.container.querySelector('[data-globe-place="destination"]');
    expect(origin?.textContent).toBe('France');
    expect(destination?.textContent).toBe('서울Séoul');
    expect(destination?.querySelector('[lang="ko"]')?.textContent).toBe('서울');
  });

  it('flies home from Seoul to France', async () => {
    const screen = await render(<ReturnStage content={KOREA_CONTENT} />);

    expect(screen.container.querySelector('[data-globe-place="origin"]')?.textContent).toBe(
      '서울Séoul',
    );
    expect(screen.container.querySelector('[data-globe-place="destination"]')?.textContent).toBe(
      'France',
    );
  });

  it('draws the globe’s body at the size of the sphere the canvas projects', async () => {
    emulateMediaQuery(PINNED_SCENE_QUERY, true);
    const screen = await render(<VoyageStage content={KOREA_CONTENT} />);
    await expect.poll(() => screen.container.querySelector('[data-globe]')).not.toBeNull();

    const globe = screen.container.querySelector('[data-flight-globe]');
    const body = globe?.querySelector('[data-globe-body]');
    assert(globe !== null && body !== null && body !== undefined);
    // The outline the canvas projects: where a point on the horizon lands.
    const limb = projectOnGlobe(
      [Math.sqrt(1 - HORIZON ** 2), 0, HORIZON],
      facingRotation({ latitude: 0, longitude: 0 }),
    );
    expect(body.getBoundingClientRect().width / globe.getBoundingClientRect().width).toBeCloseTo(
      2 * (limb.x - 0.5),
      2,
    );
  });

  it('has no axe violations with the globe', async () => {
    emulateMediaQuery(PINNED_SCENE_QUERY, true);
    const screen = await render(<VoyageStage content={KOREA_CONTENT} />);
    await expect.poll(() => screen.container.querySelector('[data-globe]')).not.toBeNull();

    await expectNoAxeViolations(screen.container);
  });
});
