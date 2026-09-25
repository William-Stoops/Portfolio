import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/cn';

describe('cn', () => {
  it('joins class names with single spaces', () => {
    expect(cn('flex', 'gap-2')).toBe('flex gap-2');
  });

  it('skips false, undefined and empty values', () => {
    expect(cn('flex', false, undefined, '', 'gap-2')).toBe('flex gap-2');
  });
});
