import { db } from "@/db/client";
import { verificationTokens } from "@/db/schema";
import type { Adapter } from "next-auth/adapters";

export const createVerificationToken: Adapter["createVerificationToken"] =
  async (token) => {
    const [data] = await db
      .insert(verificationTokens)
      .values(token)
      .returning();
    return data;
  };
