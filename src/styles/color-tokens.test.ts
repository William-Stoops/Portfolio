import { describe, expect, it } from 'vitest';

import globalsCss from '@/styles/globals.css?raw';
import { contrastRatio } from '@/testing/wcag-contrast';

const TEXT_CONTRAST = 4.5;
const NON_TEXT_CONTRAST = 3;

const TOKEN_PATTERN = /--color-([\w-]+):\s*light-dark\((#[\da-f]{6}),\s*(#[\da-f]{6})\);/gi;

type Theme = 'light' | 'dark';
type ColorPair = { foreground: string; background: string; minimum: number };

// Every foreground/background combination the UI is allowed to use. Adding a token or a new
// combination means adding it here first: the test is the palette's contract.
const COLOR_PAIRS: readonly ColorPair[] = [
  ...['canvas', 'surface', 'surface-raised'].flatMap((background) =>
    ['fg', 'fg-muted', 'accent-fg'].map((foreground) => ({
      foreground,
      background,
      minimum: TEXT_CONTRAST,
    })),
  ),
  ...['canvas', 'surface'].flatMap((background) =>
    ['fg-subtle', 'error', 'success'].map((foreground) => ({
      foreground,
      background,
      minimum: TEXT_CONTRAST,
    })),
  ),
  { foreground: 'on-accent', background: 'accent', minimum: TEXT_CONTRAST },
  { foreground: 'on-accent', background: 'accent-hover', minimum: TEXT_CONTRAST },
  { foreground: 'accent-fg', background: 'accent-tint', minimum: TEXT_CONTRAST },
  { foreground: 'fg', background: 'accent-tint', minimum: TEXT_CONTRAST },
  // Pressed state of the theme toggle: accent border on a raised surface.
  { foreground: 'accent', background: 'surface-raised', minimum: NON_TEXT_CONTRAST },
  ...['canvas', 'surface'].flatMap((background) =>
    ['accent', 'border-input'].map((foreground) => ({
      foreground,
      background,
      minimum: NON_TEXT_CONTRAST,
    })),
  ),
  // Flags (ADR 0019, 0021): fixed colours, drawn on their own white field.
  ...['taegeuk-red', 'taegeuk-blue', 'taegeuk-ink', 'tricolore-blue', 'tricolore-red'].map(
    (foreground) => ({
      foreground,
      background: 'flag-field',
      minimum: NON_TEXT_CONTRAST,
    }),
  ),
  ...['canvas', 'surface', 'surface-raised'].map((background) => ({
    foreground: 'focus',
    background,
    minimum: NON_TEXT_CONTRAST,
  })),
];

function readColorTokens(css: string): ReadonlyMap<string, Readonly<Record<Theme, string>>> {
  return new Map(
    [...css.matchAll(TOKEN_PATTERN)].map(([, name = '', light = '', dark = '']) => [
      name,
      { light, dark },
    ]),
  );
}

const COLOR_TOKENS = readColorTokens(globalsCss);

function tokenValue(name: string, theme: Theme): string {
  const token = COLOR_TOKENS.get(name);
  if (!token) {
    throw new Error(`Missing colour token --color-${name}`);
  }
  return token[theme];
}

describe('colour tokens', () => {
  it('disables the default Tailwind palette so only project tokens exist', () => {
    expect(globalsCss).toMatch(/--color-\*:\s*initial;/);
  });

  it('defines every colour token for both themes with light-dark()', () => {
    const declaredColorTokens = [...globalsCss.matchAll(/--color-([\w-]+):/g)]
      .map(([, name]) => name)
      .filter((name) => name !== undefined);

    expect(declaredColorTokens.toSorted()).toEqual([...COLOR_TOKENS.keys()].toSorted());
    expect(COLOR_TOKENS.size).toBeGreaterThan(0);
  });

  for (const theme of ['light', 'dark'] as const) {
    describe(`${theme} theme`, () => {
      for (const { foreground, background, minimum } of COLOR_PAIRS) {
        it(`${foreground} on ${background} reaches ${String(minimum)}:1`, () => {
          const ratio = contrastRatio(tokenValue(foreground, theme), tokenValue(background, theme));

          expect(ratio).toBeGreaterThanOrEqual(minimum);
        });
      }
    });
  }
});
