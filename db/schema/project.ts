import { type InferModel, relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { portfolios } from "./portfolio";
import { projectTech } from "./project-technologies";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  body: text("body").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  thumbnail: varchar("thumbnail", { length: 2048 }),
  link: varchar("link", { length: 2048 }),
  shortDescription: varchar("short_description", { length: 255 }),
  date: date("date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  portfolioId: integer("portfolio_id")
    .notNull()
    .references(() => portfolios.id, { onDelete: "cascade" }),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  portfolio: one(portfolios, {
    fields: [projects.portfolioId],
    references: [portfolios.id],
  }),
  stack: many(projectTech),
}));

export type Project = InferModel<typeof projects>;
export type NewProject = InferModel<typeof projects, "insert">;
