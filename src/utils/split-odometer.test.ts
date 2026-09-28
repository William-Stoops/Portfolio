import { describe, expect, it } from 'vitest';

import { splitOdometer } from '@/utils/split-odometer';

describe('splitOdometer', () => {
  it('keeps the digits every year shares still, and rolls the rest', () => {
    expect(splitOdometer([2021, 2022, 2023, 2024, 2025, 2026])).toEqual({
      fixed: '202',
      rolling: ['1', '2', '3', '4', '5', '6'],
    });
  });

  it('rolls more digits when the years cross a decade', () => {
    expect(splitOdometer([2019, 2020, 2021])).toEqual({ fixed: '20', rolling: ['19', '20', '21'] });
  });

  it('rolls the whole year when there is only one', () => {
    expect(splitOdometer([2021])).toEqual({ fixed: '202', rolling: ['1'] });
  });
});
