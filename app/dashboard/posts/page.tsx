import { formatDay } from "@/lib/format";
import { getPostsByAuthorId } from "@/queries";
import { getCurrentUser } from "@/server/session";
import { PageHeader } from "../_page-header";
import { AddButton, EmptyList, Row, RowList } from "../_row";

export default async function PostDashboard() {
  const user = await getCurrentUser();
  const posts = await getPostsByAuthorId(user.portfolioId);

  return (
    <>
      <PageHeader title="Posts">
        <AddButton href="/dashboard/posts/add" label="Write a post" />
      </PageHeader>
      {posts.length === 0 ? (
        <EmptyList>
          No posts yet. Drafts stay private until you publish them.
        </EmptyList>
      ) : (
        <RowList>
          {posts.map((post) => (
            <Row
              key={post.id}
              href={`/dashboard/posts/${post.id}/edit`}
              meta={`${post.status}, ${formatDay(post.publishedAt ?? post.createdAt)}`}
              title={post.title}
            >
              {post.excerpt && (
                <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                  {post.excerpt}
                </p>
              )}
            </Row>
          ))}
        </RowList>
      )}
    </>
  );
}
