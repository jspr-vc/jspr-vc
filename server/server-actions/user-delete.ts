"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { authOptions } from "../auth-options";
import { revalidateHomeIfDefault } from "./revalidate-home";

export async function deleteUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  // Deletes are cascaded
  revalidatePath(`/${session.user.portfolioSlug}`);
  await revalidateHomeIfDefault(session.user.portfolioId);
  return await db
    .delete(users)
    .where(eq(users.id, session.user.id))
    .returning();
}
