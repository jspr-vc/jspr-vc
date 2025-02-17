import { type InferModel, relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { experiences } from "./experience";
import { technologies } from "./technologies";

/**
 * This is a join table for "experience" and "technologies" (Many to Many)
 */
export const experienceTech = pgTable(
  "experience_technologies",
  {
    experienceId: integer("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    techId: integer("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (schema) => ({
    id: primaryKey(schema.experienceId, schema.techId),
  }),
);

export const experienceTechRelations = relations(experienceTech, ({ one }) => ({
  tech: one(technologies, {
    fields: [experienceTech.techId],
    references: [technologies.id],
  }),
  experience: one(experiences, {
    fields: [experienceTech.experienceId],
    references: [experiences.id],
  }),
}));

export type ExperienceTech = InferModel<typeof experienceTech>;
export type NewExperienceTech = InferModel<typeof experienceTech, "insert">;
