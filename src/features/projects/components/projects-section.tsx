import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { ProjectCard } from '@/features/projects/components/project-card';
import { type Project } from '@/features/projects/types/project';

type ProjectsSectionProps = { projects: readonly Project[] };

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <PageSection id={SECTION_IDS.projects} title="Projets">
      <ul className="flex flex-col gap-6">
        {projects.map((project) => (
          <li key={project.id} className="@container">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
