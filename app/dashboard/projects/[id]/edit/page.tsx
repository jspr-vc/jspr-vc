import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTech, getProject } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { IconArrowLeft } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "../../_form";
import ProjectEditDangerZone from "./_danger_zone";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProjectEditPage({ params: { id } }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  const techPromise = getAllTech();
  const projectPromise = getProject(Number.parseInt(id));
  const portfolioId = session.user.portfolioId;

  const [technologies, project] = await Promise.all([
    techPromise,
    projectPromise,
  ]);
  if (project?.portfolioId !== portfolioId || !project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4 justify-between">
        <LinkButton variant="secondary" href="/dashboard/projects">
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Go back to Projects
        </LinkButton>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm
            project={project}
            technologies={technologies}
            portfolioId={portfolioId}
          />
        </CardContent>
      </Card>
      <ProjectEditDangerZone projectId={project.id} />
    </div>
  );
}
