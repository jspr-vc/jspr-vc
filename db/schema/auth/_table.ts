import { pgTableCreator } from "drizzle-orm/pg-core";

export const authTable = pgTableCreator((name) => `auth_${name}`);
