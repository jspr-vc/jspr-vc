import { getAllTech } from "@/queries";
import { getCurrentUser } from "@/server/session";
import { PageHeader } from "../../_page-header";
import { ProjectForm } from "../_form";

export default async function ProjectAddPage() {
  const [user, technologies] = await Promise.all([
    getCurrentUser(),
    getAllTech(),
  ]);

  return (
    <>
      <PageHeader
        title="Add project"
        back={{ href: "/dashboard/projects", label: "projects" }}
      />
      <ProjectForm technologies={technologies} portfolioId={user.portfolioId} />
    </>
  );
}
