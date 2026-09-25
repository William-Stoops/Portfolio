import { Badge } from '@/components/ui/badge';
import { EmphasizedText } from '@/components/ui/emphasized-text';
import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { type Project } from '@/features/projects/types/project';
import { formatPeriod } from '@/utils/format-period';

type ProjectCardProps = { project: Project };

// Container query: text and video side by side once the card itself is wide enough.
export function ProjectCard({ project }: ProjectCardProps) {
  const headingId = `${project.id}-titre`;

  return (
    <article
      aria-labelledby={headingId}
      className="grid gap-8 rounded-lg border border-border bg-surface p-6 @4xl:grid-cols-2 @4xl:items-start"
    >
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h3 id={headingId} className="text-h3 font-semibold">
            {project.name}
          </h3>
          <p className="text-fg-muted">{project.tagline}</p>
          <p className="text-small text-fg-muted">{formatPeriod(project.period)}</p>
        </header>
        <p className="text-fg-muted">
          <EmphasizedText text={project.context} />
        </p>
        <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-accent-fg">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="max-w-prose text-fg-muted">
              <EmphasizedText text={highlight} />
            </li>
          ))}
        </ul>
        <ul aria-label="Technologies utilisées" className="flex flex-wrap gap-2">
          {project.stack.map((technology) => (
            <li key={technology}>
              <Badge>{technology}</Badge>
            </li>
          ))}
        </ul>
      </div>
      {project.video === undefined ? null : <YouTubeFacade video={project.video} />}
    </article>
  );
}
