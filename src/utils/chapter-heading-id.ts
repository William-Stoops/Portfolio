// The id of a chapter's heading (StickyChapters), so its content can name itself after
// it. Prefixed: chapter ids such as "ia" also name home sections.
export function chapterHeadingId(chapterId: string): string {
  return `chapitre-${chapterId}-titre`;
}
