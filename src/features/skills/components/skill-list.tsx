type SkillListProps = {
  skills: readonly string[];
  // The heading that names the list (the chapter's title).
  labelledBy: string;
};

// The skills of one group as one flowing line of words set large, separated by accent
// dots, each sliding into place as it arrives. A word lights up under the pointer: a quiet
// answer on text that is not a control.
export function SkillList({ skills, labelledBy }: SkillListProps) {
  return (
    <ul aria-labelledby={labelledBy} className="flex flex-wrap items-center gap-x-3 gap-y-3">
      {skills.map((skill, index) => (
        <li
          key={skill}
          style={{ '--i': index % 6 }}
          className="group flex reveal-slide items-center gap-3"
        >
          <span className="font-display text-h3 font-semibold transition-colors duration-250 group-hover:text-accent-fg">
            {skill}
          </span>
          {index < skills.length - 1 ? (
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
