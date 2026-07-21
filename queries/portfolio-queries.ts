import { desc, eq, or } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db/client";
import { portfolios } from "@/db/schema";
import { env } from "@/env";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

/*
 * Get portfolio by id or slug with all relations.
 */
export const getPortfolioWithRelations = cache(async (idOrSlug: string) => {
  const portfolio = await db.query.portfolios.findFirst({
    with: {
      user: true,
      experiences: {
        orderBy: (exps) => desc(exps.startedAt),
        with: { stack: { with: { tech: true } } },
      },
      projects: {
        orderBy: (projects) => desc(projects.date),
        with: { stack: { with: { tech: true } } },
      },
      posts: {
        where: (posts) => eq(posts.status, "published"),
        orderBy: (posts) => desc(posts.publishedAt),
      },
    },
    where: or(eq(portfolios.userId, idOrSlug), eq(portfolios.slug, idOrSlug)),
  });
  return portfolio;
});

/*
 * Get portfolio by id or slug.
 */
export const getPortfolio = cache(async (idOrSlug: string) => {
  const portfolio = await db.query.portfolios.findFirst({
    where: or(eq(portfolios.userId, idOrSlug), eq(portfolios.slug, idOrSlug)),
  });
  return portfolio;
});

/*
 * Get the default portfolio shown on the "/" route. Uses DEFAULT_PORTFOLIO_ID
 * when set, otherwise falls back to the first portfolio in the database
 * (most likely the owner of the project).
 */
export const getFirstPortfolio = cache(async () => {
  const portfolio = await db.query.portfolios.findFirst({
    where: env.DEFAULT_PORTFOLIO_ID
      ? eq(portfolios.id, env.DEFAULT_PORTFOLIO_ID)
      : undefined,
    with: {
      user: true,
      experiences: {
        orderBy: (exps) => desc(exps.startedAt),
        with: { stack: { with: { tech: true } } },
      },
      projects: {
        orderBy: (projects) => desc(projects.date),
        with: { stack: { with: { tech: true } } },
      },
      posts: {
        where: (posts) => eq(posts.status, "published"),
        orderBy: (posts) => desc(posts.publishedAt),
      },
    },
  });
  return portfolio;
});

export const getPortfolios = cache(async () => {
  const portfolioList = await db.query.portfolios.findMany({
    with: {
      user: true,
      experiences: {
        with: {
          stack: {
            with: {
              tech: true,
            },
          },
        },
      },
      projects: true,
    },
  });
  return portfolioList;
});

/* -------------------------------------------------------------------------------------------------
 * Preloads
 * -----------------------------------------------------------------------------------------------*/
export function preloadGetPortfolio(idOrSlug: string) {
  void getPortfolio(idOrSlug);
}

export function preloadGetFirstPortfolio(idOrSlug: string) {
  void getPortfolio(idOrSlug);
}

void getPortfolios();
export function preloadPortfolios() {}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetPortfolioWithRelations = NonNullable<
  Awaited<ReturnType<typeof getPortfolioWithRelations>>
>;
export type GetPortfolio = NonNullable<
  Awaited<ReturnType<typeof getPortfolio>>
>;
export type GetPortfolios = NonNullable<
  Awaited<ReturnType<typeof getPortfolios>>
>;
