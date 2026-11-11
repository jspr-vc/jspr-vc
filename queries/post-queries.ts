import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { CacheTag } from "./tags";

const author = {
  columns: { name: true, headline: true, slug: true },
} as const;

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

export async function getPostsByAuthorId(authorId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Portfolio(authorId));

  return await db.query.posts.findMany({
    with: { author },
    where: (posts) => eq(posts.authorId, authorId),
    orderBy: (posts) => desc(posts.createdAt),
  });
}

export async function getPost(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Post(id));

  return await db.query.posts.findFirst({
    with: { author },
    where: (posts) => eq(posts.id, id),
  });
}

export async function getPublicPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Posts);

  return await db.query.posts.findMany({
    with: { author },
    where: (posts) => eq(posts.status, "published"),
  });
}

export async function getPublicPost(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Posts, CacheTag.Post(slug));

  return await db.query.posts.findFirst({
    with: { author },
    where: (posts) => and(eq(posts.slug, slug), eq(posts.status, "published")),
  });
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetPostsByAuthorId = Awaited<ReturnType<typeof getPostsByAuthorId>>;
export type GetPost = Awaited<ReturnType<typeof getPost>>;
export type GetPublicPost = Awaited<ReturnType<typeof getPublicPost>>;
export type GetPublicPosts = Awaited<ReturnType<typeof getPublicPosts>>;
