import { afterEach, describe, expect, it, vi } from 'vitest';

import { isDataSaved } from '@/lib/save-data';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('isDataSaved', () => {
  it('says so when the visitor saves data', () => {
    vi.stubGlobal('navigator', { connection: { saveData: true } });

    expect(isDataSaved()).toBe(true);
  });

  it('says no when they do not, or when the browser cannot tell (Safari, Firefox)', () => {
    vi.stubGlobal('navigator', { connection: { saveData: false } });
    expect(isDataSaved()).toBe(false);

    vi.stubGlobal('navigator', {});
    expect(isDataSaved()).toBe(false);
  });
});
