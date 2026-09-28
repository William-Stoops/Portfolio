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
