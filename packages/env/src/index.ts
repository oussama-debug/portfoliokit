import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    API_DATABASE_USERNAME: z.string(),
    API_DATABASE_PASSWORD: z.string(),
    API_DATABASE_NAME: z.string(),
    API_DATABASE_HOST: z.string(),
    API_DATABASE_PORT: z.string().default("5432"),

    API_SECRET_KEY_BASE: z.string().min(32),

    TWILIO_ACCOUNT_SID: z.string().min(10),
    TWILIO_ACCOUNT_TOKEN: z.string().min(10),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
