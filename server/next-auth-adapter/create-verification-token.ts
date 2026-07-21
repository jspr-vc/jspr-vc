import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { verificationTokens } from "@/db/schema";

export const createVerificationToken: Adapter["createVerificationToken"] =
  async (token) => {
    const [data] = await db
      .insert(verificationTokens)
      .values(token)
      .returning();
    return data;
  };
