import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '@/config/paths';
import { formatSectionNumber } from '@/utils/section-number';

describe('formatSectionNumber', () => {
  it('numbers the home sections in page order, on two digits', () => {
    expect(Object.values(SECTION_IDS).map((id) => formatSectionNumber(id))).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
    ]);
  });

  it('gives no number to a section outside the home page', () => {
    expect(formatSectionNumber('exemple')).toBeUndefined();
  });
});
