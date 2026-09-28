import { describe, expect, it } from 'vitest';

import { chunkPreloads, parseViteManifest } from './chunk-preloads.ts';

const MANIFEST = parseViteManifest(
  JSON.stringify({
    'index.html': { file: 'assets/index-a.js', imports: ['_shared-b.js'] },
    '_shared-b.js': { file: 'assets/shared-b.js' },
    'src/app/content/site-content.en.tsx': {
      file: 'assets/site-content.en-c.js',
      imports: ['index.html', '_pictures-d.js'],
    },
    '_pictures-d.js': { file: 'assets/pictures-d.js', imports: ['_shared-b.js'] },
  }),
);

describe('chunkPreloads', () => {
  it('lists a dynamic chunk and what it imports, as absolute URLs', () => {
    expect(chunkPreloads(MANIFEST, 'src/app/content/site-content.en.tsx')).toEqual([
      '/assets/site-content.en-c.js',
      '/assets/pictures-d.js',
    ]);
  });

  it('leaves out what the entry already loads', () => {
    expect(chunkPreloads(MANIFEST, 'src/app/content/site-content.en.tsx')).not.toContain(
      '/assets/shared-b.js',
    );
  });

  it('fails loudly when the chunk is missing from the build', () => {
    expect(() => chunkPreloads(MANIFEST, 'src/app/content/site-content.de.tsx')).toThrow(
      /site-content\.de\.tsx/,
    );
  });
});

describe('parseViteManifest', () => {
  it('rejects a manifest that is not Vite’s', () => {
    expect(() => parseViteManifest('{"index.html": {"src": 1}}')).toThrow(/file/);
  });
});
