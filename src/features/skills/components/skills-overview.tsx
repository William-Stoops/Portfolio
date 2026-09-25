import { Badge } from '@/components/ui/badge';
import { type SkillGroup } from '@/features/skills/types/skill-group';

type SkillsOverviewProps = { groups: readonly SkillGroup[] };

// A description list: each group name (term) with the list of its skills (definition).
export function SkillsOverview({ groups }: SkillsOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-h3 font-semibold">Compétences techniques</h3>
      <dl className="flex flex-col gap-5">
        {groups.map(({ name, skills }) => (
          <div key={name} className="flex flex-col gap-2">
            <dt className="text-small font-semibold text-fg">{name}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill}>
                    <Badge>{skill}</Badge>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
