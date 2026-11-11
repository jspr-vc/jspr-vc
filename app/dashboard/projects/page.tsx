import { formatMonth } from "@/lib/format";
import { getProjectsByPortfolioId } from "@/queries";
import { getCurrentUser } from "@/server/session";
import { PageHeader } from "../_page-header";
import { AddButton, EmptyList, Row, RowList, TagLine } from "../_row";

export default async function ProjectsDashboard() {
  const user = await getCurrentUser();
  const projects = await getProjectsByPortfolioId(user.portfolioId);

  return (
    <>
      <PageHeader title="Projects">
        <AddButton href="/dashboard/projects/add" label="Add project" />
      </PageHeader>
      {projects.length === 0 ? (
        <EmptyList>
          No projects yet. Add one to show it on your portfolio.
        </EmptyList>
      ) : (
        <RowList>
          {projects.map((project) => (
            <Row
              key={project.id}
              href={`/dashboard/projects/${project.id}/edit`}
              meta={formatMonth(project.date)}
              title={project.name}
            >
              <TagLine tags={project.stack.map((item) => item.tech.name)} />
            </Row>
          ))}
        </RowList>
      )}
    </>
  );
}
