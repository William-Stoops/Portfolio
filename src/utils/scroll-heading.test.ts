import { describe, expect, it } from 'vitest';

import { nextScrollHeading } from '@/utils/scroll-heading';

describe('nextScrollHeading', () => {
  it('keeps heading down while the reader goes down, remembering how far they went', () => {
    expect(nextScrollHeading({ heading: 'down', farthest: 100 }, 400)).toEqual({
      heading: 'down',
      farthest: 400,
    });
  });

  it('ignores a short step back: a bounce or a hesitation does not turn the planes', () => {
    expect(nextScrollHeading({ heading: 'down', farthest: 400 }, 380)).toEqual({
      heading: 'down',
      farthest: 400,
    });
  });

  it('turns up once the reader has clearly gone back', () => {
    expect(nextScrollHeading({ heading: 'down', farthest: 400 }, 360)).toEqual({
      heading: 'up',
      farthest: 360,
    });
  });

  it('turns down again, the same way, once the reader goes on', () => {
    expect(nextScrollHeading({ heading: 'up', farthest: 360 }, 340)).toEqual({
      heading: 'up',
      farthest: 340,
    });
    expect(nextScrollHeading({ heading: 'up', farthest: 340 }, 360)).toEqual({
      heading: 'up',
      farthest: 340,
    });
    expect(nextScrollHeading({ heading: 'up', farthest: 340 }, 380)).toEqual({
      heading: 'down',
      farthest: 380,
    });
  });
});
