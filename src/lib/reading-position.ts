import * as z from 'zod/mini';

// Also read by the inline scripts of index.html, which restore the position before the
// first paint: keep the key, the shape and READING_BLOCKS in sync with them.
const STORAGE_KEY = 'locale-switch-position';

// What a reader reads, in page order: headings, paragraphs, list items that hold no other
// block, pictures and captions. Both locales render the same blocks in the same order
// (src/app/content/site-content.test.ts): only their text differs, so a block is found
// again in the other locale by its rank.
const READING_BLOCKS =
  'h1, h2, h3, h4, h5, h6, p, li:not(:has(li, p, h2, h3, h4)), dt, dd, img, figcaption';

const readingPositionSchema = z.object({
  destination: z.string(),
  // Rank of the block among the page's reading blocks.
  block: z.number().check(z.int(), z.nonnegative()),
  // The block's top on screen, in px.
  top: z.number(),
});

type ReadingPosition = z.infer<typeof readingPositionSchema>;

// The block being read, found again, and where it must stay on screen.
type ReadingAnchor = { element: Element; top: number };

// Where a reader reads: 40 % down what the header leaves visible. From the header's bottom:
// an open menu grows the header, and Safari (no scroll anchoring) pushes the page down.
export function readingLineY(): number {
  const headerBottom = Math.max(
    0,
    document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
  );
  return headerBottom + (window.innerHeight - headerBottom) * 0.4;
}

// Decoration is not read. The list is structural, whatever is rendered or visible right
// now (deferred sections, a closed dialog), so both locales rank their blocks the same.
function readingBlocks(main: Element): Element[] {
  return [...main.querySelectorAll(READING_BLOCKS)].filter(
    (element) => element.closest('[aria-hidden="true"]') === null,
  );
}

// A pinned scene keeps its blocks in place while the page scrolls: they cannot say where
// the reader is.
function isPinned(element: Element, main: Element): boolean {
  for (let current: Element | null = element; current !== null && current !== main;) {
    const { position } = getComputedStyle(current);
    if (position === 'sticky' || position === 'fixed') {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function readStoredPosition(): ReadingPosition | undefined {
  try {
    const result = readingPositionSchema.safeParse(
      JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null'),
    );
    return result.success ? result.data : undefined;
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof DOMException) {
      return undefined;
    }
    throw error;
  }
}

function forgetStoredPosition(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }
}

// Remembers the block being read (the first one reaching below the reading line) for the
// page at `destination`. False when it cannot be kept (blocked storage, nothing to read):
// the caller falls back to the section's anchor.
export function rememberReadingPosition(lineY: number, destination: string): boolean {
  const main = document.getElementById('main');
  if (main === null) {
    return false;
  }
  const blocks = readingBlocks(main);
  const block = blocks.findIndex(
    (element) => element.getBoundingClientRect().bottom > lineY && !isPinned(element, main),
  );
  const element = blocks[block];
  if (element === undefined) {
    return false;
  }
  const position: ReadingPosition = {
    destination,
    block,
    top: element.getBoundingClientRect().top,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      return false;
    }
    throw error;
  }
}

// Whether this page opens from the other language, with a place to restore: the router
// must then leave the scroll alone (see RootLayout's ScrollRestoration).
export function isArrivingAtReadingPosition(pathname: string): boolean {
  return readStoredPosition()?.destination === pathname;
}

// Scrolls so the block sits where it was on screen.
export function realignReadingPosition({ element, top }: ReadingAnchor): void {
  window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - top);
}

// Puts the remembered block back where it was on screen, once, and only on the page it was
// remembered for (a link opened in a new tab leaves the first tab alone). Returns it, so it
// can be realigned when late fonts change the heights above it.
export function restoreReadingPosition(pathname: string): ReadingAnchor | undefined {
  const position = readStoredPosition();
  forgetStoredPosition();
  const main = document.getElementById('main');
  if (position?.destination !== pathname || main === null) {
    return undefined;
  }
  const element = readingBlocks(main)[position.block];
  if (element === undefined) {
    return undefined;
  }
  const anchor = { element, top: position.top };
  realignReadingPosition(anchor);
  return anchor;
}
