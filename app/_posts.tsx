import NextLink from "next/link";
import { formatMonth } from "@/lib/format";
import type { GetPortfolioWithRelations } from "@/queries";

interface Props {
  posts: GetPortfolioWithRelations["posts"];
}

export function PostList({ posts }: Props) {
  return (
    <ul className="mt-8 sm:mt-10">
      {posts.map((post) => (
        <li key={post.id} className="border-t">
          <NextLink
            href={`/posts/${post.slug}`}
            className="group -mx-3 grid gap-x-10 gap-y-2 rounded-xl px-3 py-7 transition-colors hover:bg-muted sm:-mx-5 sm:px-5 md:grid-cols-[13rem_minmax(0,1fr)]"
          >
            <p className="font-medium font-mono text-base text-soft md:pt-2">
              {post.publishedAt ? formatMonth(post.publishedAt) : ""}
            </p>
            <div className="min-w-0">
              <h3 className="font-semibold text-2xl leading-tight tracking-[-0.03em] sm:text-[1.75rem]">
                {post.title}
                <span
                  aria-hidden="true"
                  className="pebble ml-[0.12em] h-[0.18em] w-[0.2em] opacity-0 transition-opacity group-hover:opacity-100"
                />
              </h3>
              {post.excerpt && (
                <p className="mt-2 max-w-[66ch] text-soft">{post.excerpt}</p>
              )}
            </div>
          </NextLink>
        </li>
      ))}
    </ul>
  );
}
