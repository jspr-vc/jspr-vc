import type { InferModel } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/pg-core";
import { authTable } from "./_table";
import { users } from "./user";

export const sessions = authTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, "insert">;
