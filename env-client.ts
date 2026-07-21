import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_NEXTAUTH_URL: z.string(),
    NEXT_PUBLIC_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
});
