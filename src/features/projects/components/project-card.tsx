import { Badge } from '@/components/ui/badge';
import { EmphasizedText } from '@/components/ui/emphasized-text';
import { KeyFigures } from '@/components/ui/key-figures';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { SummitScene } from '@/features/projects/components/summit-scene';
import { type Project, type ProjectLabels } from '@/features/projects/types/project';
import { useLocale } from '@/i18n/locale-context';
import { formatPeriod } from '@/utils/format-period';

type ProjectCardProps = { project: Project; labels: ProjectLabels };

// A case study rather than a card, told in the order it happened: the period as a small
// overline, the name set huge, the tagline, the project in three figures and in its own
// words, then the radio, the pitch and the win it brought. The pitch is the video, on the
// frame it opens on; the win answers it as a scene, in the room of the Summit.
export function ProjectCard({ project, labels }: ProjectCardProps) {
  const headingId = `${project.id}-titre`;
  // The text comes from the props; only the dates are formatted in the page's language.
  const locale = useLocale();

  return (
    <article aria-labelledby={headingId} className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="reveal text-small font-semibold tracking-[0.2em] text-fg-subtle uppercase">
          {formatPeriod(project.period, locale)}
        </p>
        <h4
          id={headingId}
          className="reveal font-display text-[clamp(3.5rem,1rem+10vw,9rem)] leading-none font-bold tracking-tighter"
        >
          {project.name}
        </h4>
        <p className="max-w-2xl reveal text-lead text-fg-muted">{project.tagline}</p>
      </header>

      <KeyFigures
        label={labels.figures(project.name)}
        figures={project.figures}
        entrance="reveal"
      />

      <div className="flex max-w-3xl flex-col gap-5">
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
        <ul aria-label={labels.technologies} className="flex reveal flex-wrap gap-2">
          {project.stack.map((technology) => (
            <li key={technology}>
              <Badge>{technology}</Badge>
            </li>
          ))}
        </ul>
      </div>

      {project.press === undefined ? null : (
        // Two photos of the same moment, set apart in depth: the second rises faster than
        // the page. The caption closes the pair, under the smaller photo.
        <figure className="grid grid-cols-2 gap-4 @4xl:grid-cols-12 @4xl:gap-x-8 @4xl:gap-y-6">
          {project.press.photos.map(({ picture, alt }, index) => (
            <div
              key={picture.basePath}
              className={
                index === 0
                  ? 'reveal-expand self-start overflow-clip rounded-lg @4xl:col-span-7 @4xl:row-span-2'
                  : 'self-start overflow-clip rounded-lg @4xl:col-span-5 @4xl:mt-16 @4xl:scroll-float'
              }
            >
              <ResponsiveImage
                picture={picture}
                alt={alt}
                sizes={
                  index === 0 ? '(min-width: 72rem) 38rem, 46vw' : '(min-width: 72rem) 27rem, 46vw'
                }
                loading="lazy"
                className={`block w-full scroll-parallax object-cover ${index === 0 ? 'aspect-[4/5] object-[50%_15%]' : 'aspect-[4/5]'}`}
              />
            </div>
          ))}
          <figcaption className="col-span-2 flex reveal-slide flex-col gap-2 @4xl:col-span-5 @4xl:col-start-8 @4xl:self-end">
            <span className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
              {project.press.label} · {project.press.outlet}
            </span>
            <span className="text-lead">{project.press.summary}</span>
          </figcaption>
        </figure>
      )}

      {project.pitch === undefined ? null : (
        <figure className="flex flex-col gap-5">
          <figcaption className="flex reveal-slide flex-col gap-2">
            <span className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
              {project.pitch.label}
            </span>
            <span className="font-display text-h3 font-semibold text-balance">
              {project.pitch.caption}
            </span>
          </figcaption>
          <YouTubeFacade
            video={project.pitch.video}
            // The study's width: the whole content column once the page reaches its widest.
            poster={{ picture: project.pitch.poster, sizes: '(min-width: 72rem) 50rem, 94vw' }}
          />
        </figure>
      )}

      {/* The win the pitch brought, staged: the room, the spotlights, then the lights. */}
      {project.photo === undefined ? null : <SummitScene photo={project.photo} />}
    </article>
  );
}
