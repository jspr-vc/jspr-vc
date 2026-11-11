import { getAllTech } from "@/queries";
import { getCurrentUser } from "@/server/session";
import { PageHeader } from "../../_page-header";
import { ExperienceForm } from "../_form";

export default async function ExperienceAddPage() {
  const [user, technologies] = await Promise.all([
    getCurrentUser(),
    getAllTech(),
  ]);

  return (
    <>
      <PageHeader
        title="Add experience"
        back={{ href: "/dashboard/experiences", label: "experience" }}
      />
      <ExperienceForm
        technologies={technologies}
        portfolioId={user.portfolioId}
      />
    </>
  );
}
