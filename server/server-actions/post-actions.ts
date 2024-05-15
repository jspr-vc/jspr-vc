"use server";
import { db } from "@/db/client";
import { type Post, posts } from "@/db/schema";
import { type InsertPostSchema, insertPostSchema } from "@/lib/validators";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { authOptions } from "../auth-options";

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

  revalidateTag("/dashboard/posts");
  revalidateTag(`/dashboard/posts/${post.id}/edit`);
  revalidateTag(`/posts/${result.slug}`);
  revalidateTag(`/${session.user.portfolioSlug}`);

  return result;
}
