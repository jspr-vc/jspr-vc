import { and, eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { accounts, portfolios, users } from "@/db/schema";

export const getUserByAccount: Adapter["getUserByAccount"] = async (
  payload,
) => {
  const dbAccount = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.providerAccountId, payload.providerAccountId),
        eq(accounts.provider, payload.provider),
      ),
    )
    .leftJoin(users, eq(accounts.userId, users.id))
    .leftJoin(portfolios, eq(portfolios.userId, users.id))
    .then((data) => data.at(0));

  if (!dbAccount?.users || !dbAccount?.portfolios) {
    return null;
  }
  return {
    id: dbAccount.users.id,
    name: dbAccount.users.name,
    email: dbAccount.users.email,
    image: dbAccount.users.image,
    role: dbAccount.users.role,
    emailVerified: dbAccount.users.emailVerified,
    portfolioId: dbAccount.portfolios.id,
    portfolioSlug: dbAccount.portfolios.slug,
  };
};
