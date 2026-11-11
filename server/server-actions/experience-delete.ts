"use server";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { experiences } from "@/db/schema";
import { CacheTag } from "@/queries/tags";
import { authOptions } from "../auth-options";
import { invalidate } from "./invalidate";

export async function deleteExperience(experienceId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  const result = await db
    .delete(experiences)
    .where(
      and(
        eq(experiences.id, experienceId),
        eq(experiences.portfolioId, session.user.portfolioId),
      ),
    )
    .returning();

  invalidate(
    CacheTag.Portfolio(session.user.portfolioId),
    CacheTag.Experience(experienceId),
  );
  return result;
}
