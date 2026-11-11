import { notFound } from "next/navigation";
import { getAllTech, getProject } from "@/queries";
import { deleteProject } from "@/server/server-actions/project-delete";
import { getCurrentUser } from "@/server/session";
import { DeleteZone } from "../../../_delete-zone";
import { PageHeader } from "../../../_page-header";
import { ProjectForm } from "../../_form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectEditPage(props: Props) {
  const [{ id }, user, technologies] = await Promise.all([
    props.params,
    getCurrentUser(),
    getAllTech(),
  ]);
  const projectId = Number.parseInt(id, 10);
  const project = Number.isNaN(projectId)
    ? undefined
    : await getProject(projectId);
  if (!project || project.portfolioId !== user.portfolioId) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader
          title="Edit project"
          back={{ href: "/dashboard/projects", label: "projects" }}
        />
        <ProjectForm
          project={project}
          technologies={technologies}
          portfolioId={user.portfolioId}
        />
      </div>
      <DeleteZone
        noun="project"
        consequence="It is removed from your portfolio. This cannot be undone."
        action={deleteProject.bind(null, project.id)}
        redirectTo="/dashboard/projects"
      />
    </div>
  );
}
