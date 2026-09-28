export type RgbChannels = readonly [number, number, number];

const RGB_PATTERN = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/;

// Computed colours come back as rgb()/rgba(): the WebGL scenes read their tints from the
// design tokens this way, so they follow the theme without duplicating any colour.
export function parseRgbColor(color: string): RgbChannels | null {
  const match = RGB_PATTERN.exec(color);
  if (match === null) {
    return null;
  }
  const [, red = '0', green = '0', blue = '0'] = match;
  return [Number(red) / 255, Number(green) / 255, Number(blue) / 255];
}
