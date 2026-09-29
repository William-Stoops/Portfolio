import { vi } from 'vitest';

// A media query whose answer the test decides, and can change later.
class TestMediaQueryList extends EventTarget implements MediaQueryList {
  readonly media: string;
  matches: boolean;
  onchange = null;

  constructor(media: string, matches: boolean) {
    super();
    this.media = media;
    this.matches = matches;
  }

  change(matches: boolean): void {
    this.matches = matches;
    this.dispatchEvent(new Event('change'));
  }

  addListener(): void {
    // Deprecated API, unused by the app.
  }

  removeListener(): void {
    // Deprecated API, unused by the app.
  }
}

// Answers one media query as the test says (a large screen, reduced motion…), the others
// as the test browser does. Restored by vi.restoreAllMocks().
export function emulateMediaQuery(query: string, matches: boolean): TestMediaQueryList {
  const emulated = new TestMediaQueryList(query, matches);
  const matchMedia = window.matchMedia.bind(window);
  vi.spyOn(window, 'matchMedia').mockImplementation((asked) =>
    asked === query ? emulated : matchMedia(asked),
  );
  return emulated;
}
