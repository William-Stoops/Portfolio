import { describe, expect, it } from 'vitest';

import { formatPageTitle } from '@/utils/format-page-title';

describe('formatPageTitle', () => {
  it('suffixes the page name with the site owner, separated by an en dash', () => {
    expect(formatPageTitle('Page introuvable')).toBe('Page introuvable – William Stoops');
  });
});
