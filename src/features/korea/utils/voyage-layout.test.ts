import { describe, expect, it } from 'vitest';

import { SCENE_LAYOUTS } from '@/features/korea/utils/voyage-layout';

// On large screens each flight ends on a flag: the arc's landing point is the flag's centre.
// Lengths are in the scene's container units, so the scene scales as one.
describe('SCENE_LAYOUTS', () => {
  it('spans the route over most of the scene, from the side the plane leaves', () => {
    expect(SCENE_LAYOUTS.east.routeLeft).toBe('0%');
    expect(SCENE_LAYOUTS.west.routeLeft).toBe('10%');
    expect(SCENE_LAYOUTS.east.routeWidth).toBe('90%');
  });

  it('centres the flag on the end of the arc: on the right flying east, on the left flying west', () => {
    expect(SCENE_LAYOUTS.east.flagWidth).toBe('32%');
    expect(SCENE_LAYOUTS.east.flagLeft).toBe('66.8%');
    expect(SCENE_LAYOUTS.west.flagLeft).toBe('1.2%');
    expect(SCENE_LAYOUTS.east.flagTop).toBe('12.733cqi');
    expect(SCENE_LAYOUTS.west.flagTop).toBe('12.733cqi');
  });

  it('makes the scene as tall as its lowest part, the flag', () => {
    expect(SCENE_LAYOUTS.east.sceneHeight).toBe('34.067cqi');
  });

  it('stops the dotted arc where it meets the flag, so no dots run over the field', () => {
    expect(SCENE_LAYOUTS.east.arcToFlag).toBe('M80 260A541 541 0 0 1 785.5 141.5');
    expect(SCENE_LAYOUTS.west.arcToFlag).toBe('M920 260A541 541 0 0 0 214.5 141.5');
  });
});
