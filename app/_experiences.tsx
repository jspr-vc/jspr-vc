import NextImage from "next/image";
import { Markdown } from "@/components/markdown";
import { formatMonth } from "@/lib/format";
import type { GetPortfolioWithRelations } from "@/queries";
import { Stack } from "./_stack";

interface Props {
  experiences: GetPortfolioWithRelations["experiences"];
}

export function ExperienceList({ experiences }: Props) {
  return (
    <ol className="mt-8 sm:mt-10">
      {experiences.map((exp) => (
        <li
          key={exp.id}
          className="grid gap-x-10 gap-y-3 border-t py-8 last:pb-0 sm:py-10 md:grid-cols-[13rem_minmax(0,1fr)]"
        >
          <p className="font-medium font-mono text-base text-soft md:pt-2">
            {formatMonth(exp.startedAt)}
            <span className="px-2 text-muted-foreground">→</span>
            {exp.endedAt ? (
              formatMonth(exp.endedAt)
            ) : (
              <span className="text-foreground">now</span>
            )}
          </p>
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              {exp.companyLogo && (
                <NextImage
                  src={exp.companyLogo}
                  alt=""
                  className="size-12 shrink-0 rounded-lg object-contain"
                  height={48}
                  width={48}
                />
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-2xl leading-tight tracking-[-0.03em] sm:text-[1.75rem]">
                  {exp.jobTitle}
                </h3>
                <p className="mt-1 text-lg text-soft">
                  {exp.companyWebsite ? (
                    <a
                      href={exp.companyWebsite}
                      className="link"
                      rel="noreferrer"
                    >
                      {exp.companyName}
                    </a>
                  ) : (
                    exp.companyName
                  )}
                </p>
              </div>
            </div>
            {exp.jobDescription && (
              <Markdown
                content={exp.jobDescription}
                headings={false}
                className="mt-5 max-w-[66ch]"
              />
            )}
            <Stack items={exp.stack.map((item) => item.tech)} />
          </div>
        </li>
      ))}
    </ol>
  );
}
