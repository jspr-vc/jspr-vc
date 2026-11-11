import NextImage from "next/image";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import type { GetPortfolioWithRelations } from "@/queries";
import { Stack } from "./_stack";
import { Tile } from "./_tile";

interface Props {
  projects: GetPortfolioWithRelations["projects"];
}

/*
 * One tile per project. An odd one out at the end takes the full row.
 */
export function ProjectTiles({ projects }: Props) {
  return (
    <>
      {projects.map((project, index) => {
        const alone =
          projects.length % 2 === 1 && index === projects.length - 1;
        return (
          <Tile
            key={project.id}
            aria-label={project.name}
            className={cn(
              "flex flex-col lg:col-span-3",
              alone &&
                "lg:col-span-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12",
            )}
          >
            {project.thumbnail && (
              <div
                className={cn(
                  "mb-8 aspect-video overflow-hidden rounded-xl bg-muted",
                  alone && "lg:mb-0",
                )}
              >
                <NextImage
                  width={960}
                  height={540}
                  sizes="(min-width: 1024px) 560px, 92vw"
                  className="size-full object-contain"
                  src={project.thumbnail}
                  alt=""
                />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-mono text-muted-foreground text-sm">
                {project.date.getFullYear()}
              </p>
              <h3 className="mt-2 font-mono font-semibold text-2xl tracking-mono-display sm:text-[1.75rem]">
                {project.link ? (
                  <a
                    href={project.link}
                    rel="noreferrer"
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-dot"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              {project.shortDescription && (
                <Markdown
                  content={project.shortDescription}
                  headings={false}
                  className="mt-3 max-w-[52ch]"
                />
              )}
              <div className="mt-auto pt-4">
                <Stack items={project.stack.map((item) => item.tech)} />
              </div>
            </div>
          </Tile>
        );
      })}
    </>
  );
}
