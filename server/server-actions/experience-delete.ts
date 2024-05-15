"use server";
import { db } from "@/db/client";
import { experiences } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "../auth-options";

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

  revalidateTag("/dashboard/experiences");
  revalidateTag(`/dashboard/experiences/${experienceId}/edit`);
  revalidateTag(`/${session.user.portfolioSlug}`);
  return result;
}
