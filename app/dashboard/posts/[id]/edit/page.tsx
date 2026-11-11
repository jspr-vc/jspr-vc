import { notFound } from "next/navigation";
import { getPost } from "@/queries";
import { deletePost } from "@/server/server-actions";
import { getCurrentUser } from "@/server/session";
import { DeleteZone } from "../../../_delete-zone";
import { PageHeader } from "../../../_page-header";
import { PostForm } from "../../_form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostEditPage(props: Props) {
  const [{ id }, user] = await Promise.all([props.params, getCurrentUser()]);
  const postId = Number.parseInt(id, 10);
  const post = Number.isNaN(postId) ? undefined : await getPost(postId);
  if (!post || post.authorId !== user.portfolioId) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader
          title="Edit post"
          back={{ href: "/dashboard/posts", label: "posts" }}
        />
        <PostForm post={post} portfolioId={user.portfolioId} />
      </div>
      <DeleteZone
        noun="post"
        consequence="The post and its public page are removed. This cannot be undone."
        action={deletePost.bind(null, post.id)}
        redirectTo="/dashboard/posts"
      />
    </div>
  );
}
