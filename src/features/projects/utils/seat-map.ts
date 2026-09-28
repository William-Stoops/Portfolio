// The room of the Epitech Summit as a seating plan: an amphitheatre facing the stage, one
// dot per person, the rows curving around the stage and widening away from it. Pure and
// deterministic: the prerendered page and the browser draw the same room.

type Seat = { x: number; y: number; row: number; rank: number };

export type SeatMap = { seats: readonly Seat[]; viewBox: string; radius: number };

const MAX_ROWS = 10;
// In the units of the view box: dots 10 apart along a row, rows 11 apart. Each row holds
// two more seats than the one before and spans the same angle, which these two spacings
// set (2 × 10 / 11 rad, about 104°): the room is a slice of a ring around the stage, as a
// theatre's seating plan draws it.
const SEAT_SPACING = 10;
const ROW_SPACING = 11;
const ROOM_ANGLE = (2 * SEAT_SPACING) / ROW_SPACING;
const SEAT_RADIUS = 3.2;
// How much the order people sit in owes to chance rather than to their row (the front
// fills first on average, not row by row).
const SCATTER = 1.4;
const SEED = 2025;

// Two more seats in each row than in the one before, the leftover ones at the back.
function seatsPerRow(count: number): number[] {
  const rows = Math.max(1, Math.min(MAX_ROWS, Math.floor(Math.sqrt(count))));
  const front = Math.floor((count - rows * (rows - 1)) / rows);
  const leftover = count - rows * front - rows * (rows - 1);
  return Array.from(
    { length: rows },
    (_, row) => front + 2 * row + (row >= rows - leftover ? 1 : 0),
  );
}

// mulberry32: a tiny seeded generator, so the order is the same on every render.
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function buildSeatMap(count: number): SeatMap {
  const rows = seatsPerRow(count);
  const placed = rows.flatMap((seats, row) => {
    // The row's distance from the stage, so its seats are SEAT_SPACING apart.
    const radius = ((seats - 1) * SEAT_SPACING) / ROOM_ANGLE;
    const step = seats > 1 ? ROOM_ANGLE / (seats - 1) : 0;
    return Array.from({ length: seats }, (_, index) => {
      const angle = (index - (seats - 1) / 2) * step;
      return { x: round(radius * Math.sin(angle)), y: round(radius * Math.cos(angle)), row };
    });
  });

  const random = seededRandom(SEED);
  const order = placed
    .map((seat, index) => ({ index, key: seat.row / rows.length + SCATTER * random() }))
    .toSorted((a, b) => a.key - b.key);
  const ranks = new Map(order.map(({ index }, rank) => [index, rank]));
  const seats = placed.map(({ x, y, row }, index) => ({
    x,
    y,
    row,
    rank: ranks.get(index) ?? index,
  }));

  const margin = SEAT_RADIUS + 1;
  const xs = seats.map(({ x }) => x);
  const ys = seats.map(({ y }) => y);
  const minX = round(Math.min(...xs) - margin);
  const minY = round(Math.min(...ys) - margin);
  const width = round(Math.max(...xs) + margin - minX);
  const height = round(Math.max(...ys) + margin - minY);
  return {
    seats,
    viewBox: `${String(minX)} ${String(minY)} ${String(width)} ${String(height)}`,
    radius: SEAT_RADIUS,
  };
}

// One path for many seats: each "M x y h0" draws a round dot with a round line cap. A few
// hundred seats stay a few kilobytes of markup, and a handful of elements to animate.
export function seatDots(seats: readonly Seat[]): string {
  return seats.map(({ x, y }) => `M${String(x)} ${String(y)}h0`).join('');
}

// The seats taken at each tick of the counter, in the order people sit: tick k holds the
// ranks from k × perTick. Each tick is one path, faded in at its turn.
export function seatsByTick({ seats }: SeatMap, perTick: number): { tick: number; path: string }[] {
  const ticks = Array.from({ length: Math.ceil(seats.length / perTick) }, (): Seat[] => []);
  for (const seat of seats) {
    ticks[Math.floor(seat.rank / perTick)]?.push(seat);
  }
  return ticks.map((tickSeats, tick) => ({ tick, path: seatDots(tickSeats) }));
}
