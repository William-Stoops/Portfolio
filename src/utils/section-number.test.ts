import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '@/config/paths';
import { LOCALES } from '@/i18n/locales';
import { formatSectionNumber } from '@/utils/section-number';

describe('formatSectionNumber', () => {
  it.each(LOCALES)('numbers the home sections in page order, on two digits (%s)', (locale) => {
    expect(Object.values(SECTION_IDS[locale]).map((id) => formatSectionNumber(id))).toEqual([
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
