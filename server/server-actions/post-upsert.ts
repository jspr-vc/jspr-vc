"use server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { type InsertPostSchema, insertPostSchema } from "@/lib/validators";
import { authOptions } from "../auth-options";

export async function upsertPost(formData: InsertPostSchema) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  const post = await insertPostSchema.parseAsync(formData);
  post.updatedAt = new Date();

  const isSameAsSession = post.authorId === session.user.portfolioId;
  const isAdmin = session.user.role === "admin";
  const canUpdate = isSameAsSession || isAdmin;

  if (post.id && !canUpdate) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .insert(posts)
    .values(post)
    .onConflictDoUpdate({
      target: [posts.id],
      set: post,
    })
    .returning()
    .then((res) => res.at(0));

  if (!result) {
    throw new Error("Upsert failed");
  }

  revalidatePath("/dashboard/posts");
  revalidatePath(`/dashboard/posts/${result.id}/edit`);
  revalidatePath(`/posts/${result.slug}`);
  revalidatePath(`/${session.user.portfolioSlug}`);
  return result;
}
