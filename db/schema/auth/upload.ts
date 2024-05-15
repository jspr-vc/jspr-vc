import { type InferModel, relations } from "drizzle-orm";
import { bigint, serial, varchar } from "drizzle-orm/pg-core";
import { authTable } from "./_table";
import { users } from "./user";

export const uploads = authTable("uploads", {
  id: serial("id").primaryKey().notNull(),
  url: varchar("url").notNull(),
  name: varchar("name").notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  key: varchar("key").notNull().unique(),
  ownerId: varchar("owner_id").references(() => users.id),
});

export const uploadRelations = relations(uploads, ({ one }) => ({
  owner: one(users, {
    references: [users.id],
    fields: [uploads.ownerId],
  }),
}));

export type Uploads = InferModel<typeof uploads>;
export type NewUploads = InferModel<typeof uploads, "insert">;
