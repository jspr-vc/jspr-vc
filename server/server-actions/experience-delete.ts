"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { experiences } from "@/db/schema";
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

  revalidatePath("/dashboard/experiences");
  revalidatePath(`/dashboard/experiences/${experienceId}/edit`);
  revalidatePath(`/${session.user.portfolioSlug}`);
  return result;
}
