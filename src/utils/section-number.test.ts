import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '@/config/paths';
import { LOCALES } from '@/i18n/locales';
import { formatSectionNumber } from '@/utils/section-number';

describe('formatSectionNumber', () => {
  it.each(LOCALES)(
    'numbers the chapters after the journey in page order, on two digits (%s)',
    (locale) => {
      expect(Object.values(SECTION_IDS[locale]).map((id) => formatSectionNumber(id))).toEqual([
        undefined,
        '01',
        '02',
        '03',
      ]);
    },
  );

  it('gives no number to a section outside the home page', () => {
    expect(formatSectionNumber('exemple')).toBeUndefined();
  });
});
