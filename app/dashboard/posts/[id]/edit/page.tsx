import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPost } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { IconArrowLeft } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { PostForm } from "../../_form";
import PostEditDangerZone from "./_danger_zone";

interface Props {
  params: {
    id: string;
  };
}

export default async function PostEditPage({ params: { id } }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }
  const portfolioId = session.user.portfolioId;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4 justify-between">
        <LinkButton variant="secondary" href="/dashboard/posts">
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Go back to posts
        </LinkButton>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm post={post} portfolioId={portfolioId} />
        </CardContent>
      </Card>
      <PostEditDangerZone postId={post.id} />
    </div>
  );
}
