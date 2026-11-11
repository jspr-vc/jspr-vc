import { notFound } from "next/navigation";
import { getAllTech, getExp } from "@/queries";
import { deleteExperience } from "@/server/server-actions";
import { getCurrentUser } from "@/server/session";
import { DeleteZone } from "../../../_delete-zone";
import { PageHeader } from "../../../_page-header";
import { ExperienceForm } from "../../_form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExperienceEditPage(props: Props) {
  const [{ id }, user, technologies] = await Promise.all([
    props.params,
    getCurrentUser(),
    getAllTech(),
  ]);
  const experienceId = Number.parseInt(id, 10);
  const experience = Number.isNaN(experienceId)
    ? undefined
    : await getExp(experienceId);
  if (!experience || experience.portfolioId !== user.portfolioId) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader
          title="Edit experience"
          back={{ href: "/dashboard/experiences", label: "experience" }}
        />
        <ExperienceForm
          experience={experience}
          technologies={technologies}
          portfolioId={user.portfolioId}
        />
      </div>
      <DeleteZone
        noun="experience"
        consequence="It is removed from your portfolio. This cannot be undone."
        action={deleteExperience.bind(null, experience.id)}
        redirectTo="/dashboard/experiences"
      />
    </div>
  );
}
