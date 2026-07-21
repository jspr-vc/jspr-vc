import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db/client";
import { experiences } from "@/db/schema";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/

export const getExp = cache(async (id: number) => {
  const portfolio = await db.query.experiences.findFirst({
    with: {
      stack: {
        with: {
          tech: true,
        },
      },
    },
    where: eq(experiences.id, id),
  });
  return portfolio;
});

export async function getExpsByPortfolioId(portfolioId: number) {
  return await db.query.experiences.findMany({
    with: {
      stack: {
        with: {
          tech: true,
        },
      },
    },
    where: (experiences) => eq(experiences.portfolioId, portfolioId),
  });
}

/* -------------------------------------------------------------------------------------------------
 * Preloads
 * -----------------------------------------------------------------------------------------------*/

export function preloadGetExp(id: number) {
  void getExp(id);
}

export function preloadExpsByPortfolioId(portfolioId: number) {
  void getExpsByPortfolioId(portfolioId);
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetExpsByPortfolioId = Awaited<
  ReturnType<typeof getExpsByPortfolioId>
>;
export type GetExp = NonNullable<Awaited<ReturnType<typeof getExp>>>;
