import type { Config } from "drizzle-kit";

import { env } from "./env";

const isStudio = Boolean(process.env.DRIZZLE_STUDIO);

export default {
  schema: "./db/schema/*",
  out: "./db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: env.POSTGRES_HOST,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    ssl: !isStudio,
  },
} satisfies Config;
