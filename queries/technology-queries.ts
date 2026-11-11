import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/client";
import { CacheTag } from "./tags";

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -----------------------------------------------------------------------------------------------*/
export async function getAllTech() {
  "use cache";
  cacheLife("hours");
  cacheTag(CacheTag.Technologies);

  const results = await db.query.technologies.findMany();
  return results.reduce<Record<number, (typeof results)[number]>>(
    (acc, curr) => {
      Object.assign(acc, { [curr.id]: curr });
      return acc;
    },
    {},
  );
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
export type GetAllTech = NonNullable<Awaited<ReturnType<typeof getAllTech>>>;
