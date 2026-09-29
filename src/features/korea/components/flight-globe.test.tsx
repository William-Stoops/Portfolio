import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { FlightGlobe } from '@/features/korea/components/flight-globe';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.fr';

// A place's point and its name's box, the name hung under the point.
function placeBoxes(container: HTMLElement, end: 'origin' | 'destination') {
  const place = container.querySelector(`[data-globe-place="${end}"]`);
  const name = place?.lastElementChild;
  return { point: place?.getBoundingClientRect().left ?? 0, name: name?.getBoundingClientRect() };
}

describe('FlightGlobe', () => {
  for (const [direction, route, east, west] of [
    ['east', KOREA_CONTENT.route, 'destination', 'origin'],
    [
      'west',
      { origin: KOREA_CONTENT.route.destination, destination: KOREA_CONTENT.route.origin },
      'origin',
      'destination',
    ],
  ] as const) {
    it(`hangs each place's name toward the globe's middle, flying ${direction}`, async () => {
      const screen = await render(
        <div style={{ width: 400 }}>
          <FlightGlobe ref={createRef()} route={route} direction={direction} className="w-full" />
        </div>,
      );

      // Korea lies east: its name ends at its point; France's starts at its own.
      const eastern = placeBoxes(screen.container, east);
      expect(eastern.name?.right).toBeLessThanOrEqual(eastern.point + 13);
      expect(eastern.name?.left).toBeLessThan(eastern.point);
      const western = placeBoxes(screen.container, west);
      expect(western.name?.left).toBeGreaterThanOrEqual(western.point - 13);
    });
  }
});
