import { IconArrowLeft } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/server/auth-options";
import { PostForm } from "../_form";

export default async function PostAddPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-4">
      <LinkButton
        href="/dashboard/posts"
        className="self-start"
        variant="secondary"
      >
        <IconArrowLeft className="w-4 h-4 mr-2" />
        Go back to Posts
      </LinkButton>
      <Card>
        <CardHeader>
          <CardTitle>Add Post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm portfolioId={session.user.portfolioId} />
        </CardContent>
      </Card>
    </div>
  );
}
