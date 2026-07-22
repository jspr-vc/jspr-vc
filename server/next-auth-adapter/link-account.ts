import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { db } from "@/db/client";
import { accounts } from "@/db/schema";

export const linkAccount: NonNullable<Adapter["linkAccount"]> = async (
  rawAccount: AdapterAccount,
) => {
  await db.insert(accounts).values({ ...rawAccount });
};
