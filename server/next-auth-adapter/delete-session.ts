import { eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/db/client";
import { sessions } from "@/db/schema";

export const deleteSession: Adapter["deleteSession"] = async (sessionToken) => {
  await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
};
