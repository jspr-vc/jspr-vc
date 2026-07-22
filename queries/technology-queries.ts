import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db/client";
import { technologies } from "@/db/schema";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/
export const getAllTech = cache(async () => {
  const results = await db.query.technologies.findMany();
  return results.reduce<Record<number, (typeof results)[number]>>(
    (acc, curr) => {
      Object.assign(acc, { [curr.id]: curr });
      return acc;
    },
    {},
  );
});

export const getTechnoloById = cache(async (id: number) => {
  const result = await db.query.technologies.findFirst({
    where: eq(technologies.id, id),
  });
  return result;
});

/* -------------------------------------------------------------------------------------------------
 * Preloads
 * -----------------------------------------------------------------------------------------------*/
export const preloadTechnologies = () => {
  void getAllTech();
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetAllTech = NonNullable<Awaited<ReturnType<typeof getAllTech>>>;
