import { brotliCompressSync, gzipSync } from 'node:zlib';

type ContentEncoding = 'br' | 'gzip';

// The encoding a request accepts, brotli first, as the host prefers it.
export function acceptedEncoding(acceptEncoding: string): ContentEncoding | undefined {
  if (/\bbr\b/.test(acceptEncoding)) {
    return 'br';
  }
  return /\bgzip\b/.test(acceptEncoding) ? 'gzip' : undefined;
}

// The prerendered pages as the host serves them: compressed once, then from its cache.
// Brotli at its best quality took the CI machine a quarter of a second for the home page:
// compressed on every request, it came back as time to the first byte on every run.
export function createPageCompressor(): (
  file: string,
  page: Buffer,
  encoding: ContentEncoding,
) => Buffer {
  const kept = new Map<string, { page: Buffer; compressed: Buffer }>();
  return (file, page, encoding) => {
    const key = `${encoding} ${file}`;
    const cached = kept.get(key);
    if (cached?.page.equals(page) === true) {
      return cached.compressed;
    }
    const compressed = encoding === 'br' ? brotliCompressSync(page) : gzipSync(page);
    kept.set(key, { page, compressed });
    return compressed;
  };
}
