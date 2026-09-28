import { formatTwoDigits } from '@/utils/format-two-digits';

type SkillListProps = {
  skills: readonly string[];
  // The heading that names the list (the chapter's title).
  labelledBy: string;
};

// The skills of one group set large, one per ruled line, rising into place as they
// scroll in. A line slides a little on hover and lights an accent dot: a quiet answer
// under the pointer, on text that is not a control.
export function SkillList({ skills, labelledBy }: SkillListProps) {
  return (
    <ul aria-labelledby={labelledBy} className="border-t border-border">
      {skills.map((skill, index) => (
        <li
          key={skill}
          style={{ '--i': index % 4 }}
          className="group flex reveal items-center justify-between gap-6 border-b border-border py-4"
        >
          <span className="font-display text-h3 font-semibold transition-[translate] duration-250 ease-out group-hover:translate-x-2">
            {skill}
          </span>
          {/* The line's number, and a dot lighting up on hover: decoration. */}
          <span aria-hidden="true" className="flex shrink-0 items-center gap-3">
            <span className="size-2 scale-0 rounded-full bg-accent transition-[scale] duration-250 ease-out group-hover:scale-100" />
            <span className="text-small text-fg-subtle tabular-nums transition-colors duration-250 group-hover:text-accent-fg">
              {formatTwoDigits(index + 1)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
