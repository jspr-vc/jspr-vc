"use server";
import { db } from "@/db/client";
import { technologies } from "@/db/schema";
import {
  type InsertTechnologiesSchema,
  insertTechnologiesSchema,
} from "@/lib/validators";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth-options";

export async function insertTechnology(formData: InsertTechnologiesSchema) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }
  const { id: _, ...data } =
    await insertTechnologiesSchema.parseAsync(formData);

  return await db.transaction(async (tx) => {
    const exists = await tx.query.technologies.findFirst({
      where: eq(technologies.slug, data.slug),
    });

    if (exists) {
      return exists;
    }

    const tech = await tx
      .insert(technologies)
      .values([
        {
          ...data,
          createdBy: session.user.id,
          updatedBy: session.user.id,
          updatedAt: new Date(),
          status: session.user.role === "admin" ? "approved" : "pending",
        },
      ])
      .returning()
      .then((res) => res.at(0));

    if (!tech) {
      throw new Error("Unable to create technology");
    }

    return tech;
  });
}

export type InsertTechnology = Awaited<ReturnType<typeof insertTechnology>>;
