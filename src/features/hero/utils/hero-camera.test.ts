import { describe, expect, it } from 'vitest';

import { heroCamera } from '@/features/hero/utils/hero-camera';

const REST = { time: 0, parallax: 0, intro: 1, dive: 0 };

describe('heroCamera', () => {
  it('rests where the hero has always framed the surface', () => {
    expect(heroCamera('right', REST)).toEqual({
      eye: [0, 1.25, 4.3],
      target: [-1.6, 0.45, -0.5],
      fieldOfView: 0.8,
    });
    expect(heroCamera('centre', REST).target).toEqual([0, 0.2, -0.6]);
  });

  it('sways with time and leans with the pointer at rest', () => {
    expect(heroCamera('right', { ...REST, parallax: 1 }).eye[0]).toBeCloseTo(0.35);
    expect(heroCamera('right', { ...REST, time: 10 }).eye[0]).toBeCloseTo(0.5 * Math.sin(1.2));
  });

  it('flies in from high above and far behind the surface, then settles', () => {
    const start = heroCamera('right', { ...REST, intro: 0 });
    const halfway = heroCamera('right', { ...REST, intro: 0.5 });

    expect(start.eye[1]).toBeGreaterThan(3);
    expect(start.eye[2]).toBeGreaterThan(8);
    expect(halfway.eye[1]).toBeLessThan(start.eye[1]);
    expect(halfway.eye[1]).toBeGreaterThan(1.25);
    expect(halfway.eye[2]).toBeLessThan(start.eye[2]);
  });

  it('dives down among the waves as the hero scrolls away, the view widening', () => {
    const dived = heroCamera('right', { ...REST, dive: 1 });

    expect(dived.eye[1]).toBeLessThan(0.6);
    expect(dived.eye[2]).toBeLessThan(4.3);
    expect(dived.target[1]).toBeLessThan(0.45);
    expect(dived.fieldOfView).toBeGreaterThan(0.8);
  });
});
