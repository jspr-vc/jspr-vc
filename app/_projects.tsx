import { MarkdownNoHeadings } from "@/components/ui/md";
import {
  TypographyH2,
  TypographyH4,
  TypographyP,
} from "@/components/ui/typography";
import type { GetPortfolioWithRelations } from "@/queries";
import NextImage from "next/image";
import { StackItem } from "./_stack-item";

interface Props {
  projects: GetPortfolioWithRelations["projects"];
}
export function ProjectList({ projects = [] }: Props) {
  return (
    <div id="projects" className="flex flex-col gap-4 scroll-m-8">
      <TypographyH2 className="border-none">Projects</TypographyH2>
      <div className="flex flex-col gap-16">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-col lg:flex-row gap-2">
            <div className="shrink-0 relative h-32 w-60 lg:h-16 lg:w-32 aspect-video rounded-lg overflow-hidden bg-card/30 shadow">
              <NextImage
                width={1280}
                height={720}
                className="object-contain h-32 w-60 lg:h-16 lg:w-32 aspect-video "
                src={project.thumbnail || ""}
                alt={project.name}
              />
            </div>
            <div className="flex flex-col gap-2">
              <TypographyH4 className="border-none">
                {project.name}
              </TypographyH4>
              {project.shortDescription && (
                <MarkdownNoHeadings
                  components={{
                    p: ({ node, ...props }) => (
                      <TypographyP className="mb-4" {...props} />
                    ),
                  }}
                  content={project.shortDescription}
                />
              )}

              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  {project.stack.map((projectTech) => (
                    <StackItem
                      key={`${projectTech.projectId}-${projectTech.techId}`}
                      tech={projectTech.tech}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
