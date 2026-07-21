import { and, eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { verificationTokens } from "@/db/schema";

export const useVerificationToken: Adapter["useVerificationToken"] = async (
  token,
) => {
  try {
    const deletedToken =
      (await db
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, token.identifier),
            eq(verificationTokens.token, token.token),
          ),
        )
        .then((res) => res[0])) ?? null;

    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, token.identifier),
          eq(verificationTokens.token, token.token),
        ),
      );

    return deletedToken;
  } catch (_err) {
    throw new Error("No verification token found.");
  }
};
