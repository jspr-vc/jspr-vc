import type { InferModel } from "drizzle-orm";
import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { authTable } from "./_table";

// --- Next Auth Table ---
export const verificationTokens = authTable(
  "verificationTokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export type VerificationToken = InferModel<typeof verificationTokens>;
export type NewVerificationToken = InferModel<
  typeof verificationTokens,
  "insert"
>;
