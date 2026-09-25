import { SECTION_IDS } from '@/config/paths';
import { ProjectCard } from '@/features/projects/components/project-card';
import { type Project } from '@/features/projects/types/project';

type ProjectsSectionProps = { projects: readonly Project[] };

const HEADING_ID = `${SECTION_IDS.projects}-titre`;

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id={SECTION_IDS.projects}
      aria-labelledby={HEADING_ID}
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-gutter py-section"
    >
      <h2 id={HEADING_ID} className="text-h2 font-semibold">
        Projets
      </h2>
      <ul className="flex flex-col gap-6">
        {projects.map((project) => (
          <li key={project.id} className="@container">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
