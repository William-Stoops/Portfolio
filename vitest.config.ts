import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      restoreMocks: true,
      unstubEnvs: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/testing/**', 'src/main.tsx'],
        reporter: ['text', 'html', 'lcov', 'json-summary'],
        thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            // Vitest blanks CSS modules by default; the colour-token contract test reads the
            // stylesheet source (`?raw`), so it must go through the Vite pipeline.
            css: { include: [/\.css(?:\?|$)/] },
            include: ['src/**/*.test.ts'],
            exclude: ['src/**/use-*.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            // Components and hooks run in real Chromium: jsdom has no layout engine,
            // so container queries, focus visibility and contrast cannot be tested there.
            name: 'browser',
            include: ['src/**/*.test.tsx', 'src/**/use-*.test.ts'],
            setupFiles: ['./src/testing/setup-browser.ts'],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }),
);
