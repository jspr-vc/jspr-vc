"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { authOptions } from "../auth-options";

export async function deleteProject(projectId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  const result = await db
    .delete(projects)
    .where(
      and(
        eq(projects.id, projectId),
        eq(projects.portfolioId, session.user.portfolioId),
      ),
    )
    .returning();

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}/edit`);
  revalidatePath(`/${session.user.portfolioSlug}`);
  return result;
}
