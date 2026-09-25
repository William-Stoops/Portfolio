import { type KnipConfig } from 'knip';

// `!` marks production code: `knip --production --strict` then checks the shipped graph
// alone, without tests and tooling (see docs/adr/0002).
// The Vite plugin already derives the entry from index.html; src/testing is test-only code.
// src/entry-server.tsx is loaded by scripts/prerender.ts through Vite's module runner, by
// URL string, which Knip cannot follow.
const config: KnipConfig = {
  entry: ['src/entry-server.tsx!'],
  project: ['src/**/*.{ts,tsx,css}!', '!src/testing/**!', 'e2e/**/*.ts', 'scripts/**/*.ts'],
  rules: {
    duplicates: 'error',
    types: 'error',
    enumMembers: 'error',
  },
};

export default config;
