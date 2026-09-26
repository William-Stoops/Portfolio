import { describe, expect, it } from 'vitest';

import { chapterHeadingId } from '@/utils/chapter-heading-id';

describe('chapterHeadingId', () => {
  it('prefixes the chapter id, so it never collides with a section id', () => {
    expect(chapterHeadingId('ia')).toBe('chapitre-ia-titre');
  });
});
