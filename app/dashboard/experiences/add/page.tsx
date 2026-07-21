import { IconArrowLeft } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTech } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { ExperienceForm } from "../_form";

export default async function ExperienceAddPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  const technologies = await getAllTech();

  return (
    <div className="flex flex-col gap-4">
      <LinkButton
        href="/dashboard/experiences"
        className="self-start"
        variant="secondary"
      >
        <IconArrowLeft className="w-4 h-4 mr-2" />
        Go back to Experiences
      </LinkButton>
      <Card>
        <CardHeader>
          <CardTitle>Add Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            technologies={technologies}
            portfolioId={session.user.portfolioId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
