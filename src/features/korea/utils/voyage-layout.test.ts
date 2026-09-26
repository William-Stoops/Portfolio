import { describe, expect, it } from 'vitest';

import { VOYAGE_LAYOUT } from '@/features/korea/utils/voyage-layout';

// On large screens the flight ends on the flag: the arc's landing point is the taegeuk's
// centre. Lengths are in the stage's container units, so the scene scales as one.
describe('VOYAGE_LAYOUT', () => {
  it('spans the route over most of the stage', () => {
    expect(VOYAGE_LAYOUT.routeWidth).toBe('90%');
  });

  it('centres the flag on the end of the arc', () => {
    // End of the arc: 92 % of a route 90 % wide; its base: 26 % of the route's width down.
    expect(VOYAGE_LAYOUT.flagWidth).toBe('32%');
    expect(VOYAGE_LAYOUT.flagLeft).toBe('66.8%');
    expect(VOYAGE_LAYOUT.flagTop).toBe('12.733cqi');
  });

  it('makes the scene as tall as its lowest part, the flag', () => {
    expect(VOYAGE_LAYOUT.sceneHeight).toBe('34.067cqi');
  });

  it('stops the dotted arc where it meets the flag, so no dots run over the field', () => {
    expect(VOYAGE_LAYOUT.arcToFlag).toBe('M80 260A541 541 0 0 1 785.5 141.5');
  });
});
