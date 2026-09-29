// The digit strips of a mechanical counter going from 0 to `value` in steps of `step`:
// each column (keyed by its place value: 100, 10, 1) lists the digits it rolls through,
// the last one being the digit of `value`. A column finer than the step never moves.
export function odometerStrips(value: number, step: number): { place: number; digits: string[] }[] {
  const columns = String(value).length;
  return Array.from({ length: columns }, (_column, column) => {
    const place = 10 ** (columns - 1 - column);
    const digits =
      place < step
        ? [String(Math.floor(value / place) % 10)]
        : Array.from({ length: Math.floor(value / place) + 1 }, (_turn, turn) => String(turn % 10));
    return { place, digits };
  });
}
