import { describe, expect, it } from 'vitest';

import { odometerStrips } from '@/features/projects/utils/odometer';

describe('odometerStrips', () => {
  it('rolls each digit of the count from 0, the tens once per step of ten', () => {
    const [hundreds, tens, units] = odometerStrips(300, 10);

    expect(hundreds).toEqual({ place: 100, digits: ['0', '1', '2', '3'] });
    expect(tens?.place).toBe(10);
    expect(tens?.digits.join('')).toBe('0123456789012345678901234567890');
    // Counting in tens, the units never move.
    expect(units).toEqual({ place: 1, digits: ['0'] });
  });

  it('ends every strip on the digit of the count', () => {
    const strips = odometerStrips(270, 10);

    expect(strips.map(({ digits }) => digits.at(-1)).join('')).toBe('270');
  });

  it('rolls every digit when counting one by one', () => {
    const [tens, units] = odometerStrips(42, 1);

    expect(tens?.digits).toEqual(['0', '1', '2', '3', '4']);
    expect(units?.digits).toHaveLength(43);
    expect(units?.digits.at(-1)).toBe('2');
  });
});
