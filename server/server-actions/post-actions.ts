"use server";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/db/client";
import { type Post, posts } from "@/db/schema";
import { type InsertPostSchema, insertPostSchema } from "@/lib/validators";
import { CacheTag } from "@/queries/tags";
import { authOptions } from "../auth-options";
import { invalidate } from "./invalidate";

export async function setPostStatus(
  formData: InsertPostSchema,
  status: Post["status"],
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  const post = insertPostSchema.extend({ id: z.number() }).parse(formData);

  const result = await db
    .update(posts)
    .set({
      ...post,
      status,
      publishedAt: status === "published" ? new Date() : null,
    })
    .where(
      and(eq(posts.id, post.id), eq(posts.authorId, session.user.portfolioId)),
    )
    .returning()
    .then((res) => res.at(0));

  if (!result) {
    throw new Error("Publish failed");
  }

  invalidate(
    CacheTag.Portfolio(session.user.portfolioId),
    CacheTag.Posts,
    CacheTag.Post(result.id),
  );

  return result;
}
