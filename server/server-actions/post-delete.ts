"use server";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "../auth-options";

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

  revalidateTag("/dashboard/posts");
  revalidateTag(`/dashboard/posts/${postId}/edit`);
  revalidateTag(`/${session.user.portfolioSlug}`);
  return result;
}
