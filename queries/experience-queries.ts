import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { experiences } from "@/db/schema";
import { CacheTag } from "./tags";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

export async function getExp(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Experience(id));

  return await db.query.experiences.findFirst({
    with: { stack: { with: { tech: true } } },
    where: eq(experiences.id, id),
  });
}

export async function getExpsByPortfolioId(portfolioId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Portfolio(portfolioId));

  return await db.query.experiences.findMany({
    with: { stack: { with: { tech: true } } },
    where: (experiences) => eq(experiences.portfolioId, portfolioId),
    orderBy: (experiences, { desc }) => desc(experiences.startedAt),
  });
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetExpsByPortfolioId = Awaited<
  ReturnType<typeof getExpsByPortfolioId>
>;
export type GetExp = NonNullable<Awaited<ReturnType<typeof getExp>>>;
