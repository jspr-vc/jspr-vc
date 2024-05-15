import { PgEnumColumnBuilder, pgTableCreator } from "drizzle-orm/pg-core";

export const profileTable = pgTableCreator((name) => `profile_${name}`);
