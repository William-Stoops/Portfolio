type TextSegment = { text: string; isEmphasized: boolean };

// Minimal markup for CV highlights: **passage** marks what the CV sets in bold. Anything
// richer belongs in a real content format, not in this parser.
export function parseEmphasis(text: string): readonly TextSegment[] {
  const parts = text.split('**');
  if (parts.length % 2 === 0) {
    throw new Error(`Unbalanced ** emphasis markers in: ${text}`);
  }
  return parts
    .map((part, index) => ({ text: part, isEmphasized: index % 2 === 1 }))
    .filter(({ text: segment }) => segment !== '');
}
