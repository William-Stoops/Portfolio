import { Badge } from '@/components/ui/badge';
import { EmphasizedText } from '@/components/ui/emphasized-text';
import { KeyFigures } from '@/components/ui/key-figures';
import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { type Project } from '@/features/projects/types/project';
import { formatPeriod } from '@/utils/format-period';

type ProjectCardProps = { project: Project };

// A case study rather than a card: the period as a small overline, the name set huge, the
// tagline, the project in three figures, then the pitch video, large, beside the story.
// The container query (on the list item) puts video and story side by side once the
// study itself is wide enough.
export function ProjectCard({ project }: ProjectCardProps) {
  const headingId = `${project.id}-titre`;

  return (
    <article aria-labelledby={headingId} className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="reveal text-small font-semibold tracking-[0.2em] text-fg-subtle uppercase">
          {formatPeriod(project.period)}
        </p>
        <h3
          id={headingId}
          className="reveal font-display text-[clamp(3.5rem,1rem+10vw,9rem)] leading-none font-bold tracking-tighter"
        >
          {project.name}
        </h3>
        <p className="max-w-2xl reveal text-lead text-fg-muted">{project.tagline}</p>
      </header>

      <KeyFigures
        label={`${project.name} en chiffres`}
        figures={project.figures}
        entrance="reveal"
      />

      <div className="grid gap-10 @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] @4xl:items-start">
        {project.video === undefined ? null : (
          <div className="reveal">
            <YouTubeFacade
              video={project.video}
              // A building-site poster for a construction supplies platform.
              backdrop={<span className="block size-full hazard-stripes" />}
            />
          </div>
        )}
        <div className="flex flex-col gap-5">
          <p className="reveal text-fg-muted">
            <EmphasizedText text={project.context} />
          </p>
          <ul className="flex list-disc flex-col gap-3 ps-5 marker:text-accent-fg">
            {project.highlights.map((highlight, index) => (
              <li key={highlight} style={{ '--i': index }} className="reveal text-fg-muted">
                <EmphasizedText text={highlight} />
              </li>
            ))}
          </ul>
          <ul aria-label="Technologies utilisées" className="flex reveal flex-wrap gap-2">
            {project.stack.map((technology) => (
              <li key={technology}>
                <Badge>{technology}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
