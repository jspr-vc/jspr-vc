import { type InferModel, relations } from "drizzle-orm";
import { integer, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { profileTable } from "./_table";
import { projects } from "./project";
import { technologies } from "./technologies";

export const projectTech = profileTable(
  "project_technologies",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    techId: integer("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (schema) => ({
    id: primaryKey(schema.projectId, schema.techId),
  }),
);

export const projectTechRelations = relations(projectTech, ({ one }) => ({
  tech: one(technologies, {
    fields: [projectTech.techId],
    references: [technologies.id],
  }),
  project: one(projects, {
    fields: [projectTech.projectId],
    references: [projects.id],
  }),
}));

export type ProjectTech = InferModel<typeof projectTech>;
export type NewProjectTech = InferModel<typeof projectTech, "insert">;
