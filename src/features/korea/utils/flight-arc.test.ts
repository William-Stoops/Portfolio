import { describe, expect, it } from 'vitest';

import { FLIGHT_ARC } from '@/features/korea/utils/flight-arc';

describe('FLIGHT_ARC', () => {
  it('draws a circle arc from France to Seoul, bulging north', () => {
    expect(FLIGHT_ARC.path).toBe('M80 260A541 541 0 0 1 920 260');
  });

  it('hangs the plane on an arm turning around the circle centre, in container units', () => {
    // The SVG is 1000 units wide across the container: one unit is 0.1cqi.
    expect(FLIGHT_ARC.pivotTop).toBe('60.1cqi');
    // Centred on the arc, one radius above the pivot.
    expect(FLIGHT_ARC.planeTop).toBe('calc(-54.1cqi - 1.25rem)');
  });

  it('turns the arm by the angle that takes the plane from one end to the other', () => {
    expect(FLIGHT_ARC.halfAngle).toBe('50.9deg');
  });

  it('places the end labels under the two ends of the arc', () => {
    expect(FLIGHT_ARC.startLeft).toBe('8%');
    expect(FLIGHT_ARC.endLeft).toBe('92%');
    expect(FLIGHT_ARC.labelTop).toBe('calc(86.667% + 1rem)');
  });
});
