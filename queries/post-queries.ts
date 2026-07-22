import { and, eq, or } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db/client";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

export const getPostsByAuthorId = cache(async (authorId: number) => {
  return await db.query.posts.findMany({
    with: {
      author: {
        columns: {
          name: true,
          headline: true,
          slug: true,
        },
      },
    },
    where: (posts) => eq(posts.authorId, authorId),
  });
});

export const getPost = cache(async (slugOrId: string) => {
  return await db.query.posts.findFirst({
    with: {
      author: {
        columns: {
          name: true,
          headline: true,
          slug: true,
        },
      },
    },
    where: (posts) =>
      or(eq(posts.slug, slugOrId), eq(posts.id, Number.parseInt(slugOrId, 10))),
  });
});

export const getPublicPosts = cache(async () => {
  return await db.query.posts.findMany({
    with: {
      author: {
        columns: {
          name: true,
          headline: true,
          slug: true,
        },
      },
    },
    where: (posts) => eq(posts.status, "published"),
  });
});

export const getPublicPost = cache(async (slug: string) => {
  return await db.query.posts.findFirst({
    with: {
      author: {
        columns: {
          name: true,
          headline: true,
          slug: true,
        },
      },
    },
    where: (posts) => and(eq(posts.slug, slug), eq(posts.status, "published")),
  });
});

/* -------------------------------------------------------------------------------------------------
 * Preloads
 * -----------------------------------------------------------------------------------------------*/
export function preloadGetPostsByAuthorId(authorId: number) {
  void getPostsByAuthorId(authorId);
}

export function preloadGetPostBySlug(slug: string) {
  void getPost(slug);
}

export function preloadGetPublicPosts() {
  void getPublicPosts();
}

export function preloadGetPublicPost(slug: string) {
  void getPublicPost(slug);
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetPostsByAuthorId = Awaited<ReturnType<typeof getPostsByAuthorId>>;
export type GetPost = Awaited<ReturnType<typeof getPost>>;
export type GetPublicPost = Awaited<ReturnType<typeof getPublicPost>>;
export type GetPublicPosts = Awaited<ReturnType<typeof getPublicPosts>>;
