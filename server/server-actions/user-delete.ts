"use server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { CacheTag } from "@/queries/tags";
import { authOptions } from "../auth-options";
import { invalidate } from "./invalidate";

export async function deleteUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  // Deletes are cascaded
  const result = await db
    .delete(users)
    .where(eq(users.id, session.user.id))
    .returning();

  invalidate(
    CacheTag.Portfolio(session.user.portfolioId),
    CacheTag.Portfolios,
    CacheTag.Posts,
  );
  return result;
}
