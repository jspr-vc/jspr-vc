import { IconEdit } from "@tabler/icons-react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPost } from "@/queries";
import { getCurrentUser } from "@/server/session";
import { PostPageContent } from "../../_post";

type Props = {
  params: Promise<{ id: string }>;
};

export default function PostPreviewPage(props: Props) {
  return (
    <Suspense>
      <PostPreview params={props.params} />
    </Suspense>
  );
}

async function PostPreview({ params }: Props) {
  const [{ id }, user] = await Promise.all([params, getCurrentUser()]);
  const postId = Number.parseInt(id, 10);
  const post = Number.isNaN(postId) ? undefined : await getPost(postId);
  if (!post || user.portfolioId !== post.authorId) {
    notFound();
  }

  return (
    <>
      <PostPageContent post={post} />
      <div className="fixed right-4 bottom-4 flex items-center gap-4 rounded-xl border bg-popover py-2 pr-2 pl-4 font-mono text-sm shadow-lg">
        <span>Preview, not published</span>
        <NextLink
          href={`/dashboard/posts/${post.id}/edit`}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 font-sans font-medium text-primary-foreground"
        >
          <IconEdit className="size-4" />
          Edit
        </NextLink>
      </div>
    </>
  );
}
