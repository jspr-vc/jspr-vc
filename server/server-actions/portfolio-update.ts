"use server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { portfolios } from "@/db/schema";
import {
  type UpdatePortfolioSchema,
  updatePortfolioSchema,
} from "@/lib/validators";
import { CacheTag } from "@/queries/tags";
import { authOptions } from "../auth-options";
import { invalidate } from "./invalidate";

export async function updatePortfolio(formData: UpdatePortfolioSchema) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }
  const data = await updatePortfolioSchema.parseAsync(formData);
  const updatedPortfolio = await db
    .update(portfolios)
    .set(data)
    .where(eq(portfolios.userId, session.user.id))
    .returning();

  invalidate(CacheTag.Portfolio(session.user.portfolioId), CacheTag.Portfolios);

  return updatedPortfolio;
}
