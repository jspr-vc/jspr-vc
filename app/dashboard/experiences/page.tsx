import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";
import { getExpsByPortfolioId } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { IconCirclePlus } from "@tabler/icons-react";
import { format } from "date-fns/esm";
import { getServerSession } from "next-auth/next";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function ExperienceDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  const experiences = await getExpsByPortfolioId(session.user.portfolioId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {experiences.map((experience) => (
        <NextLink
          key={experience.id}
          href={`/dashboard/experiences/${experience.id}/edit`}
        >
          <Card className="min-h-[200px] flex flex-col h-full cursor-pointer border border-muted hover:border-muted-foreground/30 transition">
            <CardHeader>
              <CardTitle>{experience.companyName}</CardTitle>
              <CardDescription>{experience.jobTitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 flex-wrap items-center">
                  {experience.stack.map((tech, i) => (
                    <Badge variant="secondary" key={i}>
                      {tech.tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {format(experience.startedAt, "MMMM yyyy")} —{" "}
              {experience.endedAt
                ? format(experience.endedAt, "MMMM yyyy")
                : "Present"}
            </CardFooter>
          </Card>
        </NextLink>
      ))}

      <NextLink href="/dashboard/experiences/add">
        <Card className="min-h-[200px] h-full flex items-center justify-center border border-muted hover:border-muted-foreground/30 transition">
          <div className="flex items-center gap-2">
            <IconCirclePlus className="w-8 h-8" />
            <TypographyH3 className="inline">Add Experience</TypographyH3>
          </div>
        </Card>
      </NextLink>
    </div>
  );
}
