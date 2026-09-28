import { afterEach, describe, expect, it, vi } from 'vitest';

import { storeLocalePreference } from '@/i18n/locale-preference';

afterEach(() => {
  localStorage.clear();
});

describe('storeLocalePreference', () => {
  it('stores the choice under the key the gateway reads', () => {
    storeLocalePreference('en');

    // Literal on purpose: the key is a contract with scripts/locale-gateway.ts.
    expect(localStorage.getItem('locale-preference')).toBe('en');
  });

  it('lets blocked storage cost only the memory of the choice', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    expect(() => {
      storeLocalePreference('en');
    }).not.toThrow();
  });
});
