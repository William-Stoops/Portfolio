// The WebGL scene is a bonus for large screens with a precise pointer: phones keep the CSS
// hero (battery, heat, and the mobile Lighthouse budgets), and so does anyone who asks for
// reduced motion or saves data.
const REQUIRED_MEDIA_QUERIES = [
  '(prefers-reduced-motion: no-preference)',
  '(min-width: 64rem)',
  '(hover: hover) and (pointer: fine)',
] as const;

export function canRunHeroScene(matches: (query: string) => boolean, saveData: boolean): boolean {
  return !saveData && REQUIRED_MEDIA_QUERIES.every((query) => matches(query));
}

type RgbChannels = readonly [number, number, number];

const RGB_PATTERN = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/;

// Computed colours come back as rgb()/rgba(): the scene reads its tints from the design
// tokens this way, so it follows the theme without duplicating any colour.
export function parseRgbColor(color: string): RgbChannels | null {
  const match = RGB_PATTERN.exec(color);
  if (match === null) {
    return null;
  }
  const [, red = '0', green = '0', blue = '0'] = match;
  return [Number(red) / 255, Number(green) / 255, Number(blue) / 255];
}
