"use server";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
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

  revalidateTag("/dashboard/projects");
  revalidateTag(`/dashboard/projects/${projectId}/edit`);
  revalidateTag(`/${session.user.portfolioSlug}`);
  return result;
}
