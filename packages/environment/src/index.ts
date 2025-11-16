import { createEnv } from "@t3-oss/env-core";
import z from "zod";

// Skip validation during build time
const skipValidation = process.env.SKIP_ENV_VALIDATION === "true" || process.env.NODE_ENV === "test";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    POSTGRES_URL: z.string().optional(),
    SUPABASE_URL: z.string().optional(),
    SUPABASE_ANON_KEY: z.string().optional(),

    NEXTAUTH_SECRET: z.string().optional(),
    NEXTAUTH_URL: z.string().optional(),

    TWILIO_ACCOUNT_SID: z.string().min(10).optional(),
    TWILIO_ACCOUNT_TOKEN: z.string().min(10).optional(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_API_URL: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation,
});
