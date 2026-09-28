import { PageSection } from '@/components/layout/page-section';
import { InkText } from '@/components/ui/ink-text';
import { type AboutContent } from '@/features/about/types/about-content';

type AboutSectionProps = { content: AboutContent };

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <PageSection
      id={content.id}
      title={content.title}
      lead={
        // Inked in word by word as it is read (motion.css); the text itself stays whole
        // and at full contrast underneath.
        <InkText text={content.profile} />
      }
    >
      <ul aria-label={content.labels.axes} className="grid gap-10 md:grid-cols-3 md:gap-8">
        {content.axes.map(({ title, description }, index) => (
          <li key={title} style={{ '--i': index }} className="flex reveal-slide flex-col gap-4">
            {/* A hairline with the accent drawn on it, like each section's number. */}
            <span aria-hidden="true" className="block border-t border-border">
              <span className="-mt-px block h-0.5 w-12 reveal-grow-x bg-accent" />
            </span>
            <h3 className="text-h3 font-semibold">{title}</h3>
            <p className="text-fg-muted">{description}</p>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
