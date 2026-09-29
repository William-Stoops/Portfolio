import { type ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useLanguageSwitch } from '@/hooks/use-language-switch';
import { LocaleContext } from '@/i18n/locale-context';
import { type Locale } from '@/i18n/locales';

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.querySelectorAll('[data-test-fixture]').forEach((element) => {
    element.remove();
  });
});

function inPage(path: string, locale: Locale) {
  return function Page({ children }: { children: ReactNode }) {
    const router = createMemoryRouter([{ path: '*', element: children }], {
      initialEntries: [path],
    });
    return (
      <LocaleContext value={locale}>
        <RouterProvider router={router} />
      </LocaleContext>
    );
  };
}

function addFixture<Tag extends keyof HTMLElementTagNameMap>(tag: Tag): HTMLElementTagNameMap[Tag] {
  const element = document.createElement(tag);
  element.dataset['testFixture'] = '';
  document.body.append(element);
  return element;
}

describe('useLanguageSwitch', () => {
  it('offers the other language, named in itself, for the same page', async () => {
    const { result } = await renderHook(() => useLanguageSwitch(), {
      wrapper: inPage('/fr/mentions-legales', 'fr'),
    });

    expect(result.current.map(({ locale, name, href }) => ({ locale, name, href }))).toEqual([
      { locale: 'en', name: 'English', href: '/en/legal-notice' },
    ]);
  });

  it('renders the link without the address’s section, as the prerendered page does', async () => {
    const { result } = await renderHook(() => useLanguageSwitch(), {
      wrapper: inPage('/en#journey', 'en'),
    });

    expect(result.current[0]?.href).toBe('/fr');
  });

  it('remembers the choice and the exact place being read, and drops the hash', async () => {
    const main = addFixture('main');
    main.id = 'main';
    const section = document.createElement('section');
    section.id = 'parcours';
    const paragraph = document.createElement('p');
    paragraph.style.height = '300vh';
    section.append(paragraph);
    main.append(section);
    section.scrollIntoView();
    const link = addFixture('a');
    const { result } = await renderHook(() => useLanguageSwitch(), {
      wrapper: inPage('/fr', 'fr'),
    });
    const [english] = result.current;
    link.href = english?.href ?? '';

    english?.select(link);

    expect(localStorage.getItem('locale-preference')).toBe('en');
    expect(new URL(link.href).pathname + new URL(link.href).hash).toBe('/en');
    expect(sessionStorage.getItem('locale-switch-position')).toContain('"destination":"/en"');
  });

  it('falls back to the section being read when the place cannot be kept', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const section = addFixture('section');
    section.id = 'parcours';
    section.style.height = '300vh';
    section.scrollIntoView();
    const link = addFixture('a');
    const { result } = await renderHook(() => useLanguageSwitch(), {
      wrapper: inPage('/fr', 'fr'),
    });
    const [english] = result.current;
    link.href = english?.href ?? '';

    english?.select(link);

    const destination = new URL(link.href);
    expect(`${destination.pathname}${destination.hash}`).toBe('/en#journey');
  });

  it('reads from under the header, which an open menu makes taller', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const header = addFixture('header');
    header.style.cssText = 'position: fixed; inset: 0 0 auto; height: 60vh';
    const section = addFixture('section');
    section.id = 'parcours';
    section.style.height = '300vh';
    section.scrollIntoView();
    // The section starts under the menu: halfway down the screen, above the reading line.
    window.scrollBy(0, -window.innerHeight * 0.5);
    const link = addFixture('a');
    const { result } = await renderHook(() => useLanguageSwitch(), {
      wrapper: inPage('/fr', 'fr'),
    });
    const [english] = result.current;
    link.href = english?.href ?? '';

    english?.select(link);

    expect(new URL(link.href).hash).toBe('#journey');
  });
});
