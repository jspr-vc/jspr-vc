import { env } from "@/env.mjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(env.POSTGRES_URL);
export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
