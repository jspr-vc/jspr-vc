import { type InferModel, relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { portfolios } from "./portfolio";
import { uploads } from "./upload";

// --- Next Auth Table ---
export const userRole = pgEnum("user_role", ["admin", "default"]);
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(), // TODO: convert to unique column
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  role: userRole("role").default("default").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  portfolioId: integer("portfolio_id"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  portfolio: one(portfolios, {
    fields: [users.portfolioId],
    references: [portfolios.id],
  }),
  uploads: many(uploads),
}));

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
