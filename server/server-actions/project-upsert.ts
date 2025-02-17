"use server";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { projectTech } from "@/db/schema/project-technologies";
import {
  type InsertProjectSchema,
  insertProjectSchema,
} from "@/lib/validators";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "../auth-options";

export async function upsertProject(formData: InsertProjectSchema) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthenticated");
  }

  const { stack, ...projectData } = insertProjectSchema.parse(formData);

  const isSameAsSession = projectData.portfolioId === session.user.portfolioId;
  const isAdmin = session.user.role === "admin";
  const canUpdate = isSameAsSession || isAdmin;

  if (projectData.id && !canUpdate) {
    throw new Error("Unauthorized");
  }

  const result = await db.transaction(async (tx) => {
    const slugTaken = await tx.query.projects.findFirst({
      where: eq(projects.slug, projectData.slug),
    });

    if (slugTaken && slugTaken.id !== projectData.id) {
      throw new Error("Slug already taken");
    }

    const [project] = await tx
      .insert(projects)
      .values(projectData)
      .onConflictDoUpdate({
        target: [projects.id],
        where: eq(projects.id, projectData.id ?? -1),
        set: projectData,
      })
      .returning();

    const stackInput = stack.map((techId) => ({
      projectId: project.id,
      techId: techId,
    }));

    await tx.delete(projectTech).where(eq(projectTech.projectId, project.id));

    if (stack.length) {
      await tx
        .insert(projectTech)
        .values(stackInput)
        .onConflictDoNothing({
          target: [projectTech.projectId, projectTech.techId],
        })
        .returning();
    }

    return await tx.query.projects.findFirst({
      where: eq(projects.id, project.id),
      with: {
        stack: {
          with: {
            tech: true,
          },
        },
      },
    });
  });

  revalidateTag("/dashboard/projects");
  revalidateTag(`/${session.user.portfolioSlug}`);
  return result;
}
