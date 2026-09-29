import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { colorTokens } from './design-tokens.ts';

describe('colorTokens', () => {
  it('reads each colour token with its light and dark values', () => {
    expect(
      colorTokens(
        '--color-canvas: light-dark(#FAFAF7, #1b1f2a);\n--color-fg: light-dark(#1b1f2a, #e6e8ef);',
      ),
    ).toEqual({
      canvas: { light: '#fafaf7', dark: '#1b1f2a' },
      fg: { light: '#1b1f2a', dark: '#e6e8ef' },
    });
  });

  it('finds the tokens the social card draws with in the design system', () => {
    const tokens = colorTokens(
      readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8'),
    );

    for (const name of ['canvas', 'fg', 'fg-muted', 'fg-subtle', 'accent', 'accent-fg', 'border']) {
      expect(tokens[name]?.dark).toMatch(/^#[\da-f]{6}$/);
    }
  });
});
