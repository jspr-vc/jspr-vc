import { eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { portfolios, users } from "@/db/schema";

export const updateUser: NonNullable<Adapter["updateUser"]> = async (
  payload,
) => {
  if (!payload.id) {
    throw new Error("No user id.");
  }

  const [user] = await db
    .update(users)
    .set(payload)
    .where(eq(users.id, payload.id))
    .returning();

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, payload.id),
  });

  if (!user || !portfolio) {
    throw new Error("unable to update user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified,
    portfolioId: portfolio.id,
    portfolioSlug: portfolio.slug,
  };
};
