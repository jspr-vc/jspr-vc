"use server";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { CacheTag } from "@/queries/tags";
import { authOptions } from "../auth-options";
import { invalidate } from "./invalidate";

export async function deletePost(postId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  const result = await db
    .delete(posts)
    .where(
      and(eq(posts.id, postId), eq(posts.authorId, session.user.portfolioId)),
    )
    .returning();

  invalidate(
    CacheTag.Portfolio(session.user.portfolioId),
    CacheTag.Posts,
    CacheTag.Post(postId),
  );
  return result;
}
