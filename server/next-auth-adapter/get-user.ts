import { eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export const getUser: Adapter["getUser"] = async (userId) => {
  const data = await db.query.users.findFirst({
    with: { portfolio: true },
    where: eq(users.id, userId),
  });

  if (!data?.portfolio) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    image: data.image,
    role: data.role,
    emailVerified: data.emailVerified,
    portfolioId: data.portfolio.id,
    portfolioSlug: data.portfolio.slug,
  };
};
