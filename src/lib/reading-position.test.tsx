import { afterEach, assert, describe, expect, it, vi } from 'vitest';

import {
  isArrivingAtReadingPosition,
  readingLineY,
  realignReadingPosition,
  rememberReadingPosition,
  restoreReadingPosition,
} from '@/lib/reading-position';

// Literal on purpose: the key is a contract with the inline scripts of index.html.
const STORAGE_KEY = 'locale-switch-position';

afterEach(() => {
  sessionStorage.clear();
  document.querySelectorAll('[data-test-fixture]').forEach((element) => {
    element.remove();
  });
  window.scrollTo(0, 0);
});

// A page as both locales render it: the same blocks, only their text (so their heights)
// differs.
function renderPage(blockHeights: readonly number[]): HTMLElement[] {
  const main = document.createElement('main');
  main.id = 'main';
  main.dataset['testFixture'] = '';
  const section = document.createElement('section');
  const blocks = blockHeights.map((height) => {
    const block = document.createElement('p');
    block.style.height = `${String(height)}px`;
    block.style.margin = '0';
    section.append(block);
    return block;
  });
  main.append(section);
  document.body.append(main);
  return blocks;
}

describe('reading position', () => {
  it('reopens the other language with the block being read where it was on screen', () => {
    const french = renderPage([900, 700, 700, 700]);
    window.scrollTo(0, 1000);
    const readBlock = french[1];
    const topBefore = readBlock?.getBoundingClientRect().top;

    expect(rememberReadingPosition(readingLineY(), '/en')).toBe(true);
    // The English page: the blocks above are shorter.
    document.getElementById('main')?.remove();
    const english = renderPage([600, 650, 700, 700]);
    window.scrollTo(0, 0);
    restoreReadingPosition('/en');

    expect(english[1]?.getBoundingClientRect().top).toBeCloseTo(topBefore ?? Number.NaN, 0);
  });

  it('applies a position only to the page it was taken for, and only once', () => {
    renderPage([900, 700, 700, 700]);
    window.scrollTo(0, 1000);
    rememberReadingPosition(readingLineY(), '/en');
    window.scrollTo(0, 0);

    restoreReadingPosition('/fr');

    expect(window.scrollY).toBe(0);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('keeps the block in place when the heights above it change', () => {
    const [above, read] = renderPage([900, 700]);
    window.scrollTo(0, 1000);
    rememberReadingPosition(readingLineY(), '/en');
    const anchor = restoreReadingPosition('/en');
    assert(above !== undefined && read !== undefined && anchor !== undefined);
    const topBefore = read.getBoundingClientRect().top;

    above.style.height = '960px';
    realignReadingPosition(anchor);

    expect(read.getBoundingClientRect().top).toBeCloseTo(topBefore, 0);
  });

  it('skips decoration and pinned scenes, which cannot say where the reader is', () => {
    const [first, second, third] = renderPage([900, 700, 700]);
    assert(first !== undefined && second !== undefined && third !== undefined);
    second.setAttribute('aria-hidden', 'true');
    window.scrollTo(0, 1000);
    const pinned = document.createElement('p');
    pinned.style.cssText = 'position: sticky; top: 0; height: 50px; margin: 0';
    first.after(pinned);

    rememberReadingPosition(readingLineY(), '/en');

    // Blocks read, in order: first, pinned, third. The pinned one is skipped.
    expect(sessionStorage.getItem(STORAGE_KEY)).toContain('"block":2');
  });

  it('ranks blocks the same whether they are displayed or not', () => {
    const [first, second] = renderPage([900, 700, 700]);
    assert(first !== undefined && second !== undefined);
    // Hidden in this state (a size, a deferred section): the ranks must not move.
    first.style.display = 'none';
    window.scrollTo(0, 100);

    rememberReadingPosition(readingLineY(), '/en');

    expect(sessionStorage.getItem(STORAGE_KEY)).toContain('"block":1');
  });

  it('tells the page it opens from the other language, until the place is restored', () => {
    renderPage([900, 700]);
    window.scrollTo(0, 1000);
    rememberReadingPosition(readingLineY(), '/en');

    expect(isArrivingAtReadingPosition('/fr')).toBe(false);
    expect(isArrivingAtReadingPosition('/en')).toBe(true);
    restoreReadingPosition('/en');
    expect(isArrivingAtReadingPosition('/en')).toBe(false);
  });

  it('ignores a stored value it did not write', () => {
    renderPage([900, 700]);
    sessionStorage.setItem(STORAGE_KEY, '{"block": "oops"}');

    restoreReadingPosition('/en');

    expect(window.scrollY).toBe(0);
  });

  it('says so when the position cannot be kept, so the link falls back to the section', () => {
    renderPage([900, 700]);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    expect(rememberReadingPosition(readingLineY(), '/en')).toBe(false);
  });
});

describe('readingLineY', () => {
  it('reads 40 % down what the header leaves visible', () => {
    const header = document.createElement('header');
    header.dataset['testFixture'] = '';
    header.style.cssText = 'position: fixed; inset: 0 0 auto; height: 100px';
    document.body.append(header);

    expect(readingLineY()).toBeCloseTo(100 + (window.innerHeight - 100) * 0.4, 0);
  });
});
