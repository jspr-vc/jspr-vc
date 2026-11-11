import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { CacheTag } from "./tags";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

export async function getProject(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Project(id));

  return await db.query.projects.findFirst({
    with: { stack: { with: { tech: true } } },
    where: eq(projects.id, id),
  });
}

export async function getProjectsByPortfolioId(portfolioId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Portfolio(portfolioId));

  return await db.query.projects.findMany({
    with: { stack: { with: { tech: true } } },
    where: eq(projects.portfolioId, portfolioId),
    orderBy: (projects, { desc }) => desc(projects.date),
  });
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetProject = NonNullable<Awaited<ReturnType<typeof getProject>>>;
export type GetProjectsByPortfolioId = NonNullable<
  Awaited<ReturnType<typeof getProjectsByPortfolioId>>
>;
