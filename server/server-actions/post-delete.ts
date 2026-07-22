"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { authOptions } from "../auth-options";
import { revalidateHomeIfDefault } from "./revalidate-home";

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

  revalidatePath("/dashboard/posts");
  revalidatePath(`/dashboard/posts/${postId}/edit`);
  revalidatePath(`/${session.user.portfolioSlug}`);
  await revalidateHomeIfDefault(session.user.portfolioId);
  return result;
}
