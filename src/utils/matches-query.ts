// A text's words as a search compares them: lower case, without accents, split wherever
// a reader would ("Écrire un e-mail" → "ecrire", "un", "e", "mail").
function wordsOf(text: string): string[] {
  return text
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 0);
}

// Whether every word typed starts one of the text's words: "comp" finds "Compétences",
// "sombre theme" finds "Thème sombre". An empty query finds everything.
export function matchesQuery(text: string, query: string): boolean {
  const words = wordsOf(text);
  return wordsOf(query).every((typed) => words.some((word) => word.startsWith(typed)));
}
