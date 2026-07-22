import { IconArrowLeft } from "@tabler/icons-react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTech, getExp } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { ExperienceForm } from "../../_form";
import ExperienceEditDangerZone from "./_danger_zone";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExperienceEditPage(props: Props) {
  const params = await props.params;

  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }
  const portfolioId = session.user.portfolioId;
  const techPromise = getAllTech();
  const experiencePromise = getExp(Number.parseInt(id, 10));

  const [technologies, experience] = await Promise.all([
    techPromise,
    experiencePromise,
  ]);
  if (experience?.portfolioId !== portfolioId || !experience) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4 justify-between">
        <LinkButton variant="secondary" href="/dashboard/experiences">
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Go back to Experiences
        </LinkButton>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            experience={experience}
            technologies={technologies}
            portfolioId={portfolioId}
          />
        </CardContent>
      </Card>
      <ExperienceEditDangerZone experienceId={experience.id} />
    </div>
  );
}
