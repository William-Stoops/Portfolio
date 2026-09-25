// Joins class names, skipping empty values. Deliberately not clsx + tailwind-merge: the
// closed palette and fixed variants leave no conflicting utilities to merge (measure first).
export function cn(...classNames: readonly (string | false | undefined)[]): string {
  return classNames
    .filter((className) => typeof className === 'string' && className !== '')
    .join(' ');
}
