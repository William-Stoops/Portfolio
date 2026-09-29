import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { FlightRoute } from '@/features/korea/components/flight-route';
import { KOREA_CONTENT as KOREA_CONTENT_EN } from '@/features/korea/data/korea-content.en';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.fr';

describe('FlightRoute', () => {
  for (const [language, route] of [
    ['French', KOREA_CONTENT.route],
    ['English', KOREA_CONTENT_EN.route],
  ] as const) {
    for (const direction of ['east', 'west'] as const) {
      it(`keeps each place's name inside the scene on a phone, flying ${direction} (${language})`, async () => {
        // The narrowest phone: 320 px, the journey's column some 260 px wide.
        await page.viewport(320, 700);
        const screen = await render(
          <div style={{ width: 260 }}>
            <FlightRoute route={route} direction={direction} />
          </div>,
        );

        const scene = screen.container
          .querySelector('[data-flight-route]')
          ?.getBoundingClientRect();
        const names = [...screen.container.querySelectorAll('[data-place]')].map((place) =>
          place.getBoundingClientRect(),
        );
        expect(names).toHaveLength(2);
        for (const name of names) {
          expect(name.left).toBeGreaterThanOrEqual((scene?.left ?? 0) - 16);
          expect(name.right).toBeLessThanOrEqual((scene?.right ?? 0) + 16);
        }
      });
    }
  }
});
