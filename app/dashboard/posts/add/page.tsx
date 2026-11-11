import { getCurrentUser } from "@/server/session";
import { PageHeader } from "../../_page-header";
import { PostForm } from "../_form";

export default async function PostAddPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHeader
        title="Write a post"
        back={{ href: "/dashboard/posts", label: "posts" }}
      />
      <PostForm portfolioId={user.portfolioId} />
    </>
  );
}
