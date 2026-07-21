import { eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { sessions } from "@/db/schema";

export const createSession: Adapter["createSession"] = async (payload) => {
  const res = await db.transaction(async (tx) => {
    await db.insert(sessions).values(payload);
    const data = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, payload.sessionToken),
    });
    if (!data) {
      tx.rollback();
      throw new Error("Failed to create session");
    }
    return data;
  });
  return res;
};
