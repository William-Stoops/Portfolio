import { Badge } from '@/components/ui/badge';
import { EmphasizedText } from '@/components/ui/emphasized-text';
import { KeyFigures } from '@/components/ui/key-figures';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { type Project } from '@/features/projects/types/project';
import { formatPeriod } from '@/utils/format-period';

type ProjectCardProps = { project: Project };

// A case study rather than a card, told in the order it happened: the period as a small
// overline, the name set huge, the tagline, the project in three figures and in its own
// words, then the radio, the pitch and the win it brought. The pitch is the video, on the
// frame it opens on; the photo of the trophy answers it.
export function ProjectCard({ project }: ProjectCardProps) {
  const headingId = `${project.id}-titre`;

  return (
    <article aria-labelledby={headingId} className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="reveal text-small font-semibold tracking-[0.2em] text-fg-subtle uppercase">
          {formatPeriod(project.period)}
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
        label={`${project.name} en chiffres`}
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
        <ul aria-label="Technologies utilisées" className="flex reveal flex-wrap gap-2">
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

      {project.photo === undefined ? null : (
        // The win the pitch brought, across the whole study. The caption sits in a notch
        // cut into the photo, on the page's own background: its contrast never depends on
        // the picture.
        <figure className="relative reveal-expand">
          <div className="overflow-clip rounded-lg">
            <ResponsiveImage
              picture={project.photo.picture}
              alt={project.photo.alt}
              sizes="(min-width: 72rem) 67rem, 94vw"
              loading="lazy"
              // On a narrow frame, centred on William and the trophy rather than the group.
              className="block aspect-[4/5] w-full scroll-parallax object-cover object-[35%_20%] sm:aspect-[3/2] sm:object-[50%_20%] @4xl:aspect-video"
            />
          </div>
          <figcaption className="absolute start-0 bottom-0 flex flex-col gap-1 rounded-se-lg bg-canvas pe-6 pt-4 sm:pe-10 sm:pt-5">
            <span className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
              {project.photo.place}
            </span>
            <span className="font-display text-h3 font-semibold">{project.photo.caption}</span>
          </figcaption>
        </figure>
      )}
    </article>
  );
}
