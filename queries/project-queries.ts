import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db/client";
import { projects } from "@/db/schema";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

export const getProject = cache(async (id: number) => {
  const result = await db.query.projects.findFirst({
    with: {
      stack: {
        with: {
          tech: true,
        },
      },
    },
    where: eq(projects.id, id),
  });
  return result;
});

export const getProjectsByPortfolioId = cache(async (portfolioId: number) => {
  const result = await db.query.projects.findMany({
    with: {
      stack: {
        with: {
          tech: true,
        },
      },
    },
    where: eq(projects.portfolioId, portfolioId),
  });
  return result;
});

/* -------------------------------------------------------------------------------------------------
 * Preloads
 * -----------------------------------------------------------------------------------------------*/
export function preloadGetProject(id: number) {
  void getProject(id);
}

export function preloadGetProjectsByPortfolioId(portfolioId: number) {
  void getProjectsByPortfolioId(portfolioId);
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetProject = NonNullable<Awaited<ReturnType<typeof getProject>>>;
export type GetProjectsByPortfolioId = NonNullable<
  Awaited<ReturnType<typeof getProjectsByPortfolioId>>
>;
