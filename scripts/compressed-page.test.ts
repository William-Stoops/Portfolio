import { brotliDecompressSync, gunzipSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

import { acceptedEncoding, createPageCompressor } from './compressed-page.ts';

const HOME = Buffer.from('<!doctype html><title>Accueil</title>'.repeat(40));

describe('acceptedEncoding', () => {
  it('prefers brotli, then gzip, as the host does', () => {
    expect(acceptedEncoding('gzip, deflate, br, zstd')).toBe('br');
    expect(acceptedEncoding('gzip, deflate')).toBe('gzip');
  });

  it('sends the page raw to a client that accepts neither', () => {
    expect(acceptedEncoding('identity')).toBeUndefined();
    expect(acceptedEncoding('')).toBeUndefined();
  });
});

describe('createPageCompressor', () => {
  it('compresses a page in the encoding asked for', () => {
    const compress = createPageCompressor();

    expect(brotliDecompressSync(compress('fr.html', HOME, 'br'))).toEqual(HOME);
    expect(gunzipSync(compress('fr.html', HOME, 'gzip'))).toEqual(HOME);
  });

  it('compresses a page once, then serves the bytes it kept, as a cache does', () => {
    const compress = createPageCompressor();

    const first = compress('fr.html', HOME, 'br');

    expect(compress('fr.html', Buffer.from(HOME), 'br')).toBe(first);
  });

  it('compresses a page again once its file has changed', () => {
    const compress = createPageCompressor();
    const first = compress('fr.html', HOME, 'br');
    const rebuilt = Buffer.from('<!doctype html><title>Accueil, reconstruit</title>');

    const second = compress('fr.html', rebuilt, 'br');

    expect(second).not.toBe(first);
    expect(brotliDecompressSync(second)).toEqual(rebuilt);
  });
});
