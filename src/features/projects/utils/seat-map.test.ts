import { describe, expect, it } from 'vitest';

import { buildSeatMap, seatDots, seatsByTick } from '@/features/projects/utils/seat-map';

const ROOM = buildSeatMap(300);

function rowsOf(seats: typeof ROOM.seats) {
  const rows = new Map<number, (typeof ROOM.seats)[number][]>();
  for (const seat of seats) {
    rows.set(seat.row, [...(rows.get(seat.row) ?? []), seat]);
  }
  return [...rows.entries()].toSorted(([a], [b]) => a - b).map(([, row]) => row);
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

describe('buildSeatMap', () => {
  it('seats exactly the audience, in rows that widen away from the stage', () => {
    const rows = rowsOf(ROOM.seats);

    expect(ROOM.seats).toHaveLength(300);
    expect(rows.map((row) => row.length)).toEqual([21, 23, 25, 27, 29, 31, 33, 35, 37, 39]);
  });

  it('keeps the count for audiences that do not split evenly', () => {
    expect(buildSeatMap(305).seats).toHaveLength(305);
    expect(buildSeatMap(40).seats).toHaveLength(40);
  });

  it('curves every row around the stage, which stands above the room', () => {
    for (const row of rowsOf(ROOM.seats)) {
      const middle = row[Math.floor(row.length / 2)];
      const [first] = row;
      const last = row.at(-1);
      // A smile: the ends of a row rise towards the stage, the middle is the lowest.
      expect(middle?.y).toBeGreaterThan(first?.y ?? Number.POSITIVE_INFINITY);
      expect(middle?.y).toBeGreaterThan(last?.y ?? Number.POSITIVE_INFINITY);
      // Symmetric about the stage's axis.
      expect((first?.x ?? 0) + (last?.x ?? 0)).toBeCloseTo(2 * (middle?.x ?? 0));
    }
    const middles = rowsOf(ROOM.seats).map((row) => row[Math.floor(row.length / 2)]?.y ?? 0);
    expect(middles).toEqual(middles.toSorted((a, b) => a - b));
  });

  it('frames the whole room in its view box, dots included', () => {
    const [minX = 0, minY = 0, width = 0, height = 0] = ROOM.viewBox.split(' ').map(Number);

    for (const { x, y } of ROOM.seats) {
      expect(x - ROOM.radius).toBeGreaterThanOrEqual(minX);
      expect(y - ROOM.radius).toBeGreaterThanOrEqual(minY);
      expect(x + ROOM.radius).toBeLessThanOrEqual(minX + width);
      expect(y + ROOM.radius).toBeLessThanOrEqual(minY + height);
    }
  });

  it('fills the room in a scattered order, the front rows first on average', () => {
    const ranks = ROOM.seats.map(({ rank }) => rank);
    const rows = rowsOf(ROOM.seats);
    const frontRanks = rows[0]?.map(({ rank }) => rank) ?? [];
    const backRanks = rows.at(-1)?.map(({ rank }) => rank) ?? [];

    expect(ranks.toSorted((a, b) => a - b)).toEqual(ranks.map((_, index) => index));
    expect(mean(frontRanks)).toBeLessThan(mean(backRanks));
    // People do not sit row by row: someone at the back sits before someone at the front.
    expect(Math.min(...backRanks)).toBeLessThan(Math.max(...frontRanks));
  });

  it('draws the same room on the server and in the browser', () => {
    expect(buildSeatMap(300)).toEqual(ROOM);
  });
});

// The points a dotted path draws: one round dot per "M x y h0".
function pointsOf(path: string): string[] {
  return [...path.matchAll(/M(-?[\d.]+) (-?[\d.]+)h0/g)].map(([, x, y]) => `${x ?? ''} ${y ?? ''}`);
}

describe('seatDots', () => {
  it('draws one round dot per seat, in a single path', () => {
    const path = seatDots(ROOM.seats);

    expect(pointsOf(path)).toHaveLength(300);
    expect(pointsOf(path)[0]).toBe(`${String(ROOM.seats[0]?.x)} ${String(ROOM.seats[0]?.y)}`);
  });
});

describe('seatsByTick', () => {
  it('groups the seats by the tick of the counter they fill at, in order', () => {
    const ticks = seatsByTick(ROOM, 10);

    expect(ticks.map(({ tick }) => tick)).toEqual(ticks.map((_, index) => index));
    expect(ticks).toHaveLength(30);
    expect(ticks.every(({ path }) => pointsOf(path).length === 10)).toBe(true);
    const firstTick = ROOM.seats
      .filter(({ rank }) => rank < 10)
      .map(({ x, y }) => `${String(x)} ${String(y)}`);
    expect(pointsOf(ticks[0]?.path ?? '').toSorted()).toEqual(firstTick.toSorted());
  });

  it('keeps a last, smaller tick when the audience is not a multiple of the step', () => {
    const ticks = seatsByTick(buildSeatMap(305), 10);

    expect(ticks).toHaveLength(31);
    expect(pointsOf(ticks.at(-1)?.path ?? '')).toHaveLength(5);
  });
});
