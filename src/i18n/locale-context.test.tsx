import { type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { LocaleContext, useLocale, useLocalized } from '@/i18n/locale-context';

const GREETINGS = { fr: 'Bonjour', en: 'Hello' } as const;

function InEnglish({ children }: { children: ReactNode }) {
  return <LocaleContext value="en">{children}</LocaleContext>;
}

describe('useLocale', () => {
  it('is French, the default, outside any page context', async () => {
    const { result } = await renderHook(() => useLocale());

    expect(result.current).toBe('fr');
  });

  it('is the locale of the page it renders in', async () => {
    const { result } = await renderHook(() => useLocale(), { wrapper: InEnglish });

    expect(result.current).toBe('en');
  });
});

describe('useLocalized', () => {
  it('picks the page locale from a dictionary', async () => {
    const french = await renderHook(() => useLocalized(GREETINGS));
    const english = await renderHook(() => useLocalized(GREETINGS), { wrapper: InEnglish });

    expect(french.result.current).toBe('Bonjour');
    expect(english.result.current).toBe('Hello');
  });
});
