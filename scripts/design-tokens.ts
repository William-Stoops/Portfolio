import * as z from 'zod/mini';

// The colour tokens of the design system, read from their one source (globals.css): each
// declared `--color-name: light-dark(#light, #dark)`. For what is drawn outside the page,
// such as the link preview card.
const TOKEN_PATTERN = /--color-([\w-]+):\s*light-dark\((#[\da-f]{6}),\s*(#[\da-f]{6})\);/gi;

const tokensSchema = z.record(z.string(), z.object({ light: z.string(), dark: z.string() }));

export function colorTokens(css: string): z.infer<typeof tokensSchema> {
  return tokensSchema.parse(
    Object.fromEntries(
      [...css.matchAll(TOKEN_PATTERN)].map(([, name = '', light = '', dark = '']) => [
        name,
        { light: light.toLowerCase(), dark: dark.toLowerCase() },
      ]),
    ),
  );
}
