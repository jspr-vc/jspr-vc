import "@/styles/github-markdown.css";
import { LinkButton } from "@/components/ui/button";
import { getPost } from "@/queries";
import { authOptions } from "@/server/auth-options";
import { IconEdit } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { PostPageContent } from "../../_post";

export const dynamic = "force-dynamic";
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PostPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    notFound();
  }
  const post = await getPost(params.id);
  if (!post || session.user.portfolioId !== post.authorId) {
    notFound();
  }

  return (
    <div className="h-full w-full relative">
      <PostPageContent post={post} />
      <div className="fixed flex gap-4 items-center p-4 bg-card/30 text-foreground rounded-md border border-muted shadow bottom-2 right-2">
        <div>This is a preview</div>
        <LinkButton
          href={`/dashboard/posts/${post.id}/edit`}
          variant="secondary"
          size="sm"
        >
          <IconEdit className="mr-2 w-4 h-4" />
          Edit
        </LinkButton>
      </div>
    </div>
  );
}
