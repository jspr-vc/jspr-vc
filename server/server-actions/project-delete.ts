"use server";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { CacheTag } from "@/queries/tags";
import { authOptions } from "../auth-options";
import { invalidate } from "./invalidate";

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

  invalidate(
    CacheTag.Portfolio(session.user.portfolioId),
    CacheTag.Project(projectId),
  );
  return result;
}
