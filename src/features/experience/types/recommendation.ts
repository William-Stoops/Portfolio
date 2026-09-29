// A recommendation someone wrote about William, quoted word for word.
export type Recommendation = {
  // A paragraph each, as written.
  paragraphs: readonly string[];
  author: string;
  // Who the author is, as he signs, and what he was to William.
  authorRole: string;
  relationship: string;
  // Where and when it was written.
  source: string;
  // On a translation, said, so the words are not taken for the author's own.
  translationNote?: string;
};
