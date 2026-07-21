"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { portfolios } from "@/db/schema";
import {
  type UpdatePortfolioSchema,
  updatePortfolioSchema,
} from "@/lib/validators";
import { getFirstPortfolio } from "@/queries";
import { authOptions } from "../auth-options";

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

  revalidatePath(`/${session.user.portfolioSlug}`);

  // If the edited portfolio is the one rendered on "/", revalidate it too.
  const defaultPortfolio = await getFirstPortfolio();
  if (updatedPortfolio.some((p) => p.id === defaultPortfolio?.id)) {
    revalidatePath("/");
  }

  return updatedPortfolio;
}
