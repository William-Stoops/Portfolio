import { describe, expect, it } from 'vitest';

import { SITE_TAGLINE } from '@/config/site';

describe('SITE_TAGLINE', () => {
  it('keeps each short word with the word it introduces, so no line ends on one', () => {
    expect(SITE_TAGLINE).toEqual({
      fr: 'Je décide d’une architecture, je la mesure, je la livre.',
      en: 'I choose an architecture, I measure it, I ship it.',
    });
  });
});
