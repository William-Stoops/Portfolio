type StatementProps = {
  text: string;
  // statement: set large in the display face (a profile, a stop's note).
  // body: at reading size (a practice's text).
  size?: 'statement' | 'body';
};

const SIZE_CLASS_NAMES: Readonly<Record<NonNullable<StatementProps['size']>, string>> = {
  statement: 'font-display text-h3 font-medium text-fg',
  body: 'text-lead text-fg-muted',
};

// A paragraph that says one thing, set as it is: whole from the first paint, never
// revealed word by word (William found the inked-in text too much).
export function Statement({ text, size = 'statement' }: StatementProps) {
  return <p className={`max-w-3xl ${SIZE_CLASS_NAMES[size]}`}>{text}</p>;
}
