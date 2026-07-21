import { and, eq } from "drizzle-orm";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { db } from "@/db/client";
import { accounts } from "@/db/schema";

export const unlinkAccount: NonNullable<Adapter["unlinkAccount"]> = async (
  payload: Pick<AdapterAccount, "provider" | "providerAccountId">,
) => {
  await db
    .delete(accounts)
    .where(
      and(
        eq(accounts.providerAccountId, payload.providerAccountId),
        eq(accounts.provider, payload.provider),
      ),
    );

  return undefined;
};
