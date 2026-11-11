import { desc, eq, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { portfolios } from "@/db/schema";
import { env } from "@/env";
import { CacheTag } from "./tags";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

/*
 * Get portfolio by user id or slug with all relations.
 */
export async function getPortfolioWithRelations(idOrSlug: string) {
  "use cache";
  cacheLife("hours");

  const portfolio = await db.query.portfolios.findFirst({
    with: {
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
  cacheTag(
    CacheTag.Portfolios,
    ...(portfolio ? [CacheTag.Portfolio(portfolio.id)] : []),
  );
  return portfolio;
}

/*
 * Get portfolio by user id or slug.
 */
export async function getPortfolio(idOrSlug: string) {
  "use cache";
  cacheLife("hours");

  const portfolio = await db.query.portfolios.findFirst({
    where: or(eq(portfolios.userId, idOrSlug), eq(portfolios.slug, idOrSlug)),
  });
  cacheTag(
    CacheTag.Portfolios,
    ...(portfolio ? [CacheTag.Portfolio(portfolio.id)] : []),
  );
  return portfolio;
}

/*
 * Get the default portfolio shown on the "/" route. Uses DEFAULT_PORTFOLIO_ID
 * when set, otherwise falls back to the first portfolio in the database
 * (most likely the owner of the project).
 */
export async function getFirstPortfolio() {
  "use cache";
  cacheLife("hours");

  const portfolio = await db.query.portfolios.findFirst({
    where: env.DEFAULT_PORTFOLIO_ID
      ? eq(portfolios.id, env.DEFAULT_PORTFOLIO_ID)
      : undefined,
    with: {
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
  cacheTag(
    CacheTag.Portfolios,
    ...(portfolio ? [CacheTag.Portfolio(portfolio.id)] : []),
  );
  return portfolio;
}

export async function getPortfolioSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Portfolios);

  return await db.query.portfolios.findMany({ columns: { slug: true } });
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetPortfolioWithRelations = NonNullable<
  Awaited<ReturnType<typeof getPortfolioWithRelations>>
>;
export type GetPortfolio = NonNullable<
  Awaited<ReturnType<typeof getPortfolio>>
>;
