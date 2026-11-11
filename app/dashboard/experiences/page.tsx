import { formatMonth } from "@/lib/format";
import { getExpsByPortfolioId } from "@/queries";
import { getCurrentUser } from "@/server/session";
import { PageHeader } from "../_page-header";
import { AddButton, EmptyList, Row, RowList, TagLine } from "../_row";

export default async function ExperienceDashboard() {
  const user = await getCurrentUser();
  const experiences = await getExpsByPortfolioId(user.portfolioId);

  return (
    <>
      <PageHeader title="Experience">
        <AddButton href="/dashboard/experiences/add" label="Add experience" />
      </PageHeader>
      {experiences.length === 0 ? (
        <EmptyList>
          No experience yet. Add the first job you want to show.
        </EmptyList>
      ) : (
        <RowList>
          {experiences.map((experience) => (
            <Row
              key={experience.id}
              href={`/dashboard/experiences/${experience.id}/edit`}
              meta={`${formatMonth(experience.startedAt)} → ${
                experience.endedAt ? formatMonth(experience.endedAt) : "now"
              }`}
              title={`${experience.jobTitle}, ${experience.companyName}`}
            >
              <TagLine tags={experience.stack.map((item) => item.tech.name)} />
            </Row>
          ))}
        </RowList>
      )}
    </>
  );
}
