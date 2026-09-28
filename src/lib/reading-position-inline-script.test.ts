import { describe, expect, it } from 'vitest';

import indexHtml from '../../index.html?raw';

// The inline scripts of index.html restore the reading position before the first paint,
// without the bundle: they must read what src/lib/reading-position.ts writes. Literals on
// purpose: they are the contract.
describe('reading position inline scripts', () => {
  it('read the key the language switch writes', () => {
    expect(indexHtml.match(/sessionStorage\.getItem\('locale-switch-position'\)/g)).toHaveLength(2);
  });

  it('rank the same reading blocks', () => {
    expect(indexHtml).toContain(
      "'h1, h2, h3, h4, h5, h6, p, li:not(:has(li, p, h2, h3, h4)), dt, dd, img, figcaption'",
    );
    expect(indexHtml).toContain(`element.closest('[aria-hidden="true"]') === null`);
  });
});
