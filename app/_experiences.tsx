"use client";
import { MarkdownNoHeadings } from "@/components/ui/md";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@/components/ui/timeline";
import {
  TypographyH2,
  TypographyLead,
  TypographyP,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { GetPortfolioWithRelations } from "@/queries";
import { format } from "date-fns/esm";
import NextImage from "next/image";
import NextLink from "next/link";
import { StackItem } from "./_stack-item";

interface Props {
  experiences: GetPortfolioWithRelations["experiences"];
}

export function ExperienceList({ experiences = [] }: Props) {
  return (
    <div id="experience" className="flex flex-col gap-4 scroll-m-8">
      <TypographyH2 className="border-none">Experience</TypographyH2>
      <div className="flex flex-col gap-2">
        <Timeline>
          {experiences.map((exp, index) => (
            <TimelineItem key={exp.id}>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div
                  className={cn(
                    "-mt-1.5 mb-20 flex flex-col gap-2",
                    index === experiences.length - 1 && "mb-0",
                  )}
                >
                  <TypographyP>
                    {format(exp.startedAt, "MMMM yyyy")} —{" "}
                    {exp.endedAt ? format(exp.endedAt, "MMMM yyyy") : "Present"}
                  </TypographyP>
                  <div className="flex gap-4">
                    {exp.companyLogo && (
                      <NextImage
                        src={exp.companyLogo}
                        alt="logo"
                        className="object-contain"
                        height={45}
                        width={45}
                      />
                    )}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center flex-nowrap gap-1">
                        <NextLink href={exp.companyWebsite || "#"}>
                          <TypographyLead className="font-bold text-foreground leading-none">
                            {exp.companyName}
                          </TypographyLead>
                        </NextLink>
                      </div>
                      <TypographyP className="text-foreground/90 leading-none whitespace-pre">
                        {exp.jobTitle}
                      </TypographyP>
                    </div>
                  </div>
                  {exp.jobDescription && (
                    <MarkdownNoHeadings content={exp.jobDescription} />
                  )}
                  {exp.stack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      {exp.stack.map((expTech, i) => (
                        <StackItem key={i} tech={expTech.tech} />
                      ))}
                    </div>
                  )}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
