import { type KnipConfig } from 'knip';

// `!` marks production code: `knip --production --strict` then checks the shipped graph
// alone, without tests and tooling (see docs/adr/0002).
// The Vite plugin already derives the entry from index.html; src/testing is test-only code.
const config: KnipConfig = {
  project: ['src/**/*.{ts,tsx,css}!', '!src/testing/**!', 'e2e/**/*.ts'],
  rules: {
    duplicates: 'error',
    types: 'error',
    enumMembers: 'error',
  },
};

export default config;
